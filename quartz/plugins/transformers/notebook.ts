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
      // Use Quartz's default code block styling (no extra wrapper)
      const codeBlock = `<pre><code class="language-python">${escapeHtml(source)}</code></pre>`
      let outputsHtml = ''
      if (cell.outputs && cell.outputs.length > 0) {
        outputsHtml = '<div class="notebook-outputs">'
        for (const output of cell.outputs) {
          outputsHtml += formatOutput(output)
        }
        outputsHtml += '</div>'
      }
      // Only wrap outputs in the gray box, not the code input
      content = `${codeBlock}${outputsHtml}`
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
      <div class="jupyter-notebook-embedded">
        <div class="notebook-header">Jupyter Notebook</div>
        <div class="notebook-cells">
          ${cells}
        </div>
      </div>
      <style>
.jupyter-notebook-embedded {
  border: 2px solid var(--secondary);
  border-radius: 12px;
  margin: 1.5rem 0;
  background: var(--light);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.notebook-header {
  background: var(--secondary);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray);
  font-weight: 700;
  color: var(--lightgray);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notebook-header::before {
  content: "📓";
  font-size: 1.2em;
}

.notebook-cells {
  padding: 0;
}

.notebook-cell {
  border-bottom: 1px solid var(--lightgray);
  padding: 1rem 1.5rem;
}

.notebook-cell:last-child {
  border-bottom: none;
}

.notebook-markdown-cell {
  background: var(--light);
  line-height: 1.6;
}

.notebook-markdown-cell h1,
.notebook-markdown-cell h2,
.notebook-markdown-cell h3,
.notebook-markdown-cell h4 {
  margin: 0.5rem 0;
  color: var(--dark);
}

.notebook-markdown-cell p {
  margin: 0.5rem 0;
}

.notebook-markdown-cell code {
  background: var(--lightgray);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

.notebook-markdown-cell ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.notebook-code-cell {
  background: var(--lightgray);
  border-left: 4px solid var(--secondary);
}

.notebook-input pre {
  background: var(--darkgray);
  border: 1px solid var(--gray);
  border-radius: 6px;
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.9em;
  color: var(--light);
}

.notebook-input pre code {
  background: transparent;
  color: inherit;
}

.notebook-outputs {
  margin-top: 0.75rem;
}

.notebook-text-output pre {
  background: var(--light);
  border: 1px solid var(--gray);
  border-radius: 6px;
  padding: 1rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.9em;
  color: var(--dark);
}

.notebook-image-output {
  text-align: center;
  padding: 1rem;
  background: var(--light);
}

.notebook-image-output img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.notebook-error-output pre {
  background: #fdf2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 1rem;
  margin: 0;
  color: #dc2626;
  font-size: 0.9em;
}

.notebook-stream-output pre {
  background: var(--lightgray);
  border: 1px solid var(--gray);
  border-radius: 6px;
  padding: 1rem;
  margin: 0;
  color: var(--dark);
  font-size: 0.9em;
}

.notebook-link-unavailable {
  color: var(--gray) !important;
  text-decoration: line-through;
}

.notebook-link-unavailable::after {
  content: " (notebook unavailable)";
  font-size: 0.8em;
  color: var(--gray);
}

@media (prefers-color-scheme: dark) {
  .jupyter-notebook-embedded {
    background: var(--darkgray);
    border-color: var(--secondary);
  }
  
  .notebook-header {
    background: var(--secondary);
    color: var(--light);
  }
  
  .notebook-code-cell {
    background: var(--dark);
  }
  
  .notebook-input pre {
    background: #0d1117;
    border-color: var(--gray);
    color: #f0f6fc;
  }
  
  .notebook-text-output pre,
  .notebook-stream-output pre {
    background: var(--darkgray);
    border-color: var(--gray);
    color: var(--light);
  }
  
  .notebook-markdown-cell {
    background: var(--darkgray);
    color: var(--light);
  }
  
  .notebook-markdown-cell h1,
  .notebook-markdown-cell h2,
  .notebook-markdown-cell h3,
  .notebook-markdown-cell h4 {
    color: var(--light);
  }
  
  .notebook-markdown-cell code {
    background: var(--dark);
    color: var(--light);
  }
  
  .notebook-image-output {
    background: var(--darkgray);
  }
  
  .notebook-error-output pre {
    background: #2d1b1b;
    border-color: #991b1b;
    color: #fca5a5;
  }
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
