import { QuartzTransformerPlugin } from "../types"
import { Root } from "hast"
import { visit } from "unist-util-visit"
import { Element } from "hast"
import path from "path"
import fs from "fs/promises"
import { marked } from "marked"
import { fromHtml } from "hast-util-from-html"

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
      const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source
      content = `<div class="notebook-markdown-cell">${markdownToHtml(source)}</div>`
    } else if (cell.cell_type === 'code') {
      const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source
      const codeBlock = `<pre><code class="language-python">${escapeHtml(source)}</code></pre>`
      
      let outputsHtml = ''
      if (cell.outputs && cell.outputs.length > 0) {
        outputsHtml = '<div class="notebook-outputs">'
        for (const output of cell.outputs) {
          outputsHtml += formatOutput(output)
        }
        outputsHtml += '</div>'
      }
      
      content = `<div class="notebook-code-cell">${codeBlock}${outputsHtml}</div>`
    }
    
    return `<div id="${cellId}" class="notebook-cell notebook-${cell.cell_type}-cell">${content}</div>`
  }

  // Simple markdown to HTML converter (basic implementation)
  const markdownToHtml = (markdown: string): string => {
    // Using `marked` library for better markdown rendering
    return marked(markdown) as string
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
      <div class="notebook-container">
        ${cells}
      </div>
      <style>
        .notebook-container {
          border: 1px solid var(--gray);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: var(--light);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        /* Dark mode styles */
        :root[saved-theme="dark"] .notebook-container {
            background-color: var(--dark);
            border-color: var(--dark-gray);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
        }

        .notebook-cell {
          margin-bottom: 1rem;
        }
        
        .notebook-cell:last-child {
            margin-bottom: 0;
        }

        .notebook-code-cell {
          /* No special styling, so it inherits from the theme */
          /* The <pre><code> block inside will be styled by Quartz's default styles */
        }
        
        .notebook-outputs {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--gray);
        }

        :root[saved-theme="dark"] .notebook-outputs {
            border-top-color: var(--dark-gray);
        }
        
        /* Gray boxes for outputs */
        .notebook-stream-output pre,
        .notebook-text-output pre {
          padding: 0.75rem;
          margin: 0;
          overflow-x: auto;
          border-radius: 4px;
          background-color: var(--lightgray);
          color: var(--dark);
        }

        .notebook-error-output pre {
          padding: 0.75rem;
          margin: 0;
          overflow-x: auto;
          border-radius: 4px;
          background-color: #ffe6e6;
          border: 1px solid #ff9999;
          color: #d73a49;
        }

        :root[saved-theme="dark"] .notebook-stream-output pre,
        :root[saved-theme="dark"] .notebook-text-output pre {
          background-color: #2a2a2a;
          border: 1px solid var(--dark-gray);
          color: var(--light);
        }

        :root[saved-theme="dark"] .notebook-error-output pre {
          background-color: #5a1d1d;
          border: 1px solid #a83c3c;
          color: #ffcccc;
        }

        .notebook-image-output img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0.5rem auto;
        }
        .notebook-markdown-cell {
          padding: 0.5rem;
        }
      </style>
    `
  }

  // Main transformer function
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
                          className: ["notebook-wrapper-container"],
                          "data-notebook-url": href
                        }

                        const notebookAst = fromHtml(notebookHtml, { fragment: true })
                        node.children = notebookAst.children as any
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
  }
}
