import { QuartzTransformerPlugin } from "../types"
import { Root } from "hast"
import { visit } from "unist-util-visit"

export interface Options {
  enableLightbox: boolean
}

const defaultOptions: Options = {
  enableLightbox: true,
}

export const ClickableImages: QuartzTransformerPlugin<Partial<Options>> = (userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "ClickableImages",
    htmlPlugins() {
      return [
        () => {
          return (tree: Root, _file) => {
            if (!opts.enableLightbox) return

            visit(tree, "element", (node: any, index, parent) => {
              if (node.tagName === "img" && parent && index !== undefined) {
                // Get the current img src which should already be resolved
                const originalSrc = node.properties?.src
                const originalAlt = node.properties?.alt || ""
                
                if (!originalSrc) return

                // Add lightbox classes and data attributes to the img
                node.properties.className = (node.properties.className || []).concat(["lightbox-image"])
                node.properties["data-src"] = originalSrc
                node.properties["data-alt"] = originalAlt
                node.properties.loading = "lazy"

                // Create a wrapper div
                const wrapper = {
                  type: "element",
                  tagName: "div",
                  properties: {
                    className: ["lightbox-wrapper"],
                    "data-lightbox": "true"
                  },
                  children: [node]
                }

                // Replace the img with the wrapper in the parent
                parent.children[index] = wrapper
              }
            })
          }
        },
      ]
    },
    externalResources() {
      if (!opts.enableLightbox) return {}

      return {
        js: [
          {
            loadTime: "afterDOMReady",
            contentType: "inline",
            script: `
              // Lightbox functionality
              function initLightbox() {
                // Remove existing modal if it exists
                const existingModal = document.querySelector('.lightbox-modal');
                if (existingModal) {
                  existingModal.remove();
                }

                // Create modal elements
                const modal = document.createElement('div');
                modal.className = 'lightbox-modal';
                
                const closeBtn = document.createElement('button');
                closeBtn.className = 'lightbox-close';
                closeBtn.innerHTML = '×';
                closeBtn.setAttribute('aria-label', 'Close lightbox');
                
                const img = document.createElement('img');
                img.style.display = 'none';
                
                modal.appendChild(closeBtn);
                modal.appendChild(img);
                document.body.appendChild(modal);

                // Function to open lightbox
                function openLightbox(imageSrc, imageAlt) {
                  img.src = imageSrc;
                  img.alt = imageAlt || '';
                  img.style.display = 'block';
                  modal.classList.add('active');
                  document.body.classList.add('lightbox-open');
                  
                  // Preload the image for smooth display
                  const preloadImg = new Image();
                  preloadImg.onload = () => {
                    img.src = imageSrc;
                  };
                  preloadImg.src = imageSrc;
                }

                // Function to close lightbox
                function closeLightbox() {
                  modal.classList.remove('active');
                  document.body.classList.remove('lightbox-open');
                  setTimeout(() => {
                    img.style.display = 'none';
                    img.src = '';
                  }, 300);
                }

                // Event listeners
                closeBtn.addEventListener('click', closeLightbox);
                
                modal.addEventListener('click', (e) => {
                  if (e.target === modal) {
                    closeLightbox();
                  }
                });

                // Keyboard support
                document.addEventListener('keydown', (e) => {
                  if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeLightbox();
                  }
                });

                // Add click handlers to all lightbox images
                const lightboxWrappers = document.querySelectorAll('.lightbox-wrapper');
                lightboxWrappers.forEach(wrapper => {
                  wrapper.addEventListener('click', (e) => {
                    e.preventDefault();
                    const img = wrapper.querySelector('.lightbox-image');
                    if (img) {
                      const src = img.getAttribute('data-src') || img.src;
                      const alt = img.getAttribute('data-alt') || img.alt;
                      openLightbox(src, alt);
                    }
                  });
                });

                // Clean up function
                if (window.addCleanup) {
                  window.addCleanup(() => {
                    if (modal && modal.parentNode) {
                      modal.parentNode.removeChild(modal);
                    }
                    document.body.classList.remove('lightbox-open');
                  });
                }
              }

              // Initialize on page load and navigation
              document.addEventListener('nav', initLightbox);
              
              // Initialize immediately if DOM is already ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initLightbox);
              } else {
                initLightbox();
              }
            `,
          },
        ],
      }
    },
  }
}
