import { QuartzTransformerPlugin } from "../types"
import { Root } from "hast"
import { visit } from "unist-util-visit"
import { Element } from "hast"
import path from "path"
import fs from "fs/promises"

interface Options {
  /** Cache directory for downloaded notebooks */
  cacheDir: string
  /** Whether to download notebooks from GitHub */
  downloadFromGitHub: boolean
  /** Timeout for notebook downloads in ms */
  downloadTimeout: number
}

const defaultOptions: Options = {
  cacheDir: ".quartz-cache/notebooks",
  downloadFromGitHub: true,
  downloadTimeout: 10000,
}

interface NotebookCell {
  cell_type: string
  source: string[]
  outputs?: any[]
  execution_count?: number | null
  metadata?: any
}

interface NotebookData {
  cells: NotebookCell[]
  metadata?: any
  nbformat?: number
  nbformat_minor?: number
}

export const NotebookEmbedding: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  // Ensure cache directory exists
  const ensureCacheDir = async () => {
    try {
      await fs.mkdir(opts.cacheDir, { recursive: true })
    } catch (error) {
      console.warn(`Failed to create cache directory: ${error}`)
    }
  }

  // Download notebook from GitHub raw URL
  const downloadNotebook = async (url: string): Promise<NotebookData | null> => {
    try {
      // Convert GitHub URL to raw URL if needed
      let rawUrl = url
      if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
        rawUrl = url
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/')
      }

      const response = await fetch(rawUrl, {
        signal: AbortSignal.timeout(opts.downloadTimeout)
      })
      
      if (!response.ok) {
        console.warn(`Failed to download notebook from ${rawUrl}: ${response.status}`)
        return null
      }

      const text = await response.text()
      return JSON.parse(text) as NotebookData
    } catch (error) {
      console.warn(`Error downloading notebook from ${url}:`, error)
      return null
    }
  }

  // Cache notebook locally
  const cacheNotebook = async (url: string, data: NotebookData): Promise<void> => {
    try {
      const urlHash = Buffer.from(url).toString('base64').replace(/[/+=]/g, '_')
      const cachePath = path.join(opts.cacheDir, `${urlHash}.json`)
      await fs.writeFile(cachePath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.warn(`Failed to cache notebook: ${error}`)
    }
  }

  // Load cached notebook
  const loadCachedNotebook = async (url: string): Promise<NotebookData | null> => {
    try {
      const urlHash = Buffer.from(url).toString('base64').replace(/[/+=]/g, '_')
      const cachePath = path.join(opts.cacheDir, `${urlHash}.json`)
      const data = await fs.readFile(cachePath, 'utf-8')
      return JSON.parse(data) as NotebookData
    } catch (error) {
      return null
    }
  }

  // Convert notebook cell to HTML
  const cellToHtml = (cell: NotebookCell, index: number): string => {
    const cellId = `notebook-cell-${index}`
    let content = ''
    
    if (cell.cell_type === 'markdown') {
      // Simple markdown to HTML conversion
      const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source
      content = `<div class="notebook-markdown-cell">${markdownToHtml(source)}</div>`
    } else if (cell.cell_type === 'code') {
      const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source
      content = `
        <div class="notebook-code-cell">
          <div class="notebook-input">
            <pre><code class="language-python">${escapeHtml(source)}</code></pre>
          </div>
      `
      
      // Add outputs if they exist
      if (cell.outputs && cell.outputs.length > 0) {
        content += '<div class="notebook-outputs">'
        for (const output of cell.outputs) {
          content += formatOutput(output)
        }
        content += '</div>'
      }
      
      content += '</div>'
    }
    
    return `<div id="${cellId}" class="notebook-cell notebook-${cell.cell_type}-cell">${content}</div>`
  }

  // Simple markdown to HTML converter (basic implementation)
  const markdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
  }

  // Format notebook output
  const formatOutput = (output: any): string => {
    if (output.output_type === 'stream') {
      const text = Array.isArray(output.text) ? output.text.join('') : output.text
      return `<div class="notebook-stream-output"><pre>${escapeHtml(text)}</pre></div>`
    } else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
      if (output.data) {
        let content = ''
        
        // Handle text/plain
        if (output.data['text/plain']) {
          const text = Array.isArray(output.data['text/plain']) 
            ? output.data['text/plain'].join('') 
            : output.data['text/plain']
          content += `<div class="notebook-text-output"><pre>${escapeHtml(text)}</pre></div>`
        }
        
        // Handle image/png
        if (output.data['image/png']) {
          content += `<div class="notebook-image-output"><img src="data:image/png;base64,${output.data['image/png']}" alt="Plot output" /></div>`
        }
        
        // Handle text/html
        if (output.data['text/html']) {
          const html = Array.isArray(output.data['text/html']) 
            ? output.data['text/html'].join('') 
            : output.data['text/html']
          content += `<div class="notebook-html-output">${html}</div>`
        }
        
        return content
      }
    } else if (output.output_type === 'error') {
      const traceback = output.traceback ? output.traceback.join('\n') : ''
      return `<div class="notebook-error-output"><pre>${escapeHtml(traceback)}</pre></div>`
    }
    
    return ''
  }

  // Escape HTML
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  // Convert notebook to HTML
  const notebookToHtml = (notebook: NotebookData): string => {
    const cells = notebook.cells.map((cell, index) => cellToHtml(cell, index)).join('\n')
    
    return `
      <div class="jupyter-notebook-embedded">
        <div class="notebook-header">
          <span class="notebook-title">Jupyter Notebook</span>
        </div>
        <div class="notebook-cells">
          ${cells}
        </div>
      </div>
    `
  }

  return {
    name: "NotebookEmbedding",
    htmlPlugins() {
      return [
        () => {
          return async (tree: Root, _file) => {
            await ensureCacheDir()
            
            const promises: Promise<void>[] = []
            
            visit(tree, "element", (node: Element) => {
              if (node.tagName === "a" && node.properties?.href) {
                const href = node.properties.href as string
                
                // Check if this is a notebook link
                if (href.endsWith('.ipynb') || (href.includes('github.com') && href.includes('.ipynb'))) {
                  const promise = (async () => {
                    try {
                      // Try to load from cache first
                      let notebook = await loadCachedNotebook(href)
                      
                      // If not cached and download is enabled, try to download
                      if (!notebook && opts.downloadFromGitHub) {
                        notebook = await downloadNotebook(href)
                        if (notebook) {
                          await cacheNotebook(href, notebook)
                        }
                      }
                      
                      // If we have notebook data, embed it
                      if (notebook) {
                        const notebookHtml = notebookToHtml(notebook)
                        
                        // Replace the link with embedded notebook
                        node.tagName = "div"
                        node.properties = {
                          className: ["notebook-container"],
                          "data-notebook-url": href
                        }
                        node.children = [{
                          type: "element",
                          tagName: "div",
                          properties: { 
                            className: ["notebook-placeholder"],
                            "data-notebook-html": notebookHtml
                          },
                          children: [{
                            type: "text",
                            value: "Loading notebook..."
                          }]
                        } as any]
                      } else {
                        // Keep original link but add a class to indicate it's a notebook
                        if (Array.isArray(node.properties.className)) {
                          node.properties.className.push("notebook-link-unavailable")
                        } else {
                          node.properties.className = ["notebook-link-unavailable"]
                        }
                      }
                    } catch (error) {
                      console.warn(`Error processing notebook link ${href}:`, error)
                    }
                  })()
                  
                  promises.push(promise)
                }
              }
            })
            
            // Wait for all notebook processing to complete
            await Promise.all(promises)
          }
        }
      ]
    },
    externalResources() {
      return {
        css: [
          {
            content: `.jupyter-notebook-embedded{border:1px solid #e1e5e9;border-radius:8px;margin:1rem 0;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.1)}.notebook-header{background:#f8f9fa;padding:0.75rem 1rem;border-bottom:1px solid #e1e5e9;border-radius:8px 8px 0 0;font-weight:600;color:#586069}.notebook-cells{padding:0}.notebook-cell{border-bottom:1px solid #f0f0f0;padding:0.75rem 1rem}.notebook-cell:last-child{border-bottom:none}.notebook-code-cell{background:#f8f9fa}.notebook-input pre{background:#f6f8fa;border:1px solid #e1e5e9;border-radius:4px;padding:0.75rem;margin:0;overflow-x:auto;font-size:0.9em}.notebook-outputs{margin-top:0.5rem}.notebook-text-output pre{background:#fff;border:1px solid #e1e5e9;border-radius:4px;padding:0.75rem;margin:0;overflow-x:auto;font-size:0.9em}.notebook-image-output{text-align:center;padding:0.5rem}.notebook-image-output img{max-width:100%;height:auto;border-radius:4px}.notebook-error-output pre{background:#ffe6e6;border:1px solid #ff9999;border-radius:4px;padding:0.75rem;margin:0;color:#d73a49;font-size:0.9em}.notebook-markdown-cell{background:#fff}.notebook-link-unavailable{color:#586069!important;text-decoration:line-through}.notebook-link-unavailable::after{content:" (notebook unavailable)";font-size:0.8em;color:#999}@media (prefers-color-scheme:dark){.jupyter-notebook-embedded{background:#1a1a1a;border-color:#444}.notebook-header{background:#2a2a2a;border-color:#444;color:#ccc}.notebook-code-cell{background:#2a2a2a}.notebook-input pre,.notebook-text-output pre{background:#1e1e1e;border-color:#444;color:#e1e4e8}.notebook-markdown-cell{background:#1a1a1a;color:#e1e4e8}}`
          },
        ],
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: `
              document.addEventListener('DOMContentLoaded', function() {
                const placeholders = document.querySelectorAll('.notebook-placeholder');
                placeholders.forEach(function(placeholder) {
                  const notebookHtml = placeholder.getAttribute('data-notebook-html');
                  if (notebookHtml) {
                    placeholder.innerHTML = notebookHtml;
                    placeholder.classList.remove('notebook-placeholder');
                    placeholder.classList.add('notebook-embedded-content');
                  }
                });
              });
            `
          }
        ]
      }
    },
  }
}
