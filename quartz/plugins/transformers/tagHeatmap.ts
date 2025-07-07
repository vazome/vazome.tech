import colormap from "colormap"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import { VFile } from "vfile"
import { QuartzTransformerPlugin } from "../types"

/**
 * TagHeatmap Transformer Plugin
 * 
 * Deduplication modes:
 * - 'hierarchical-split': 1/3 for parent categories, 2/3 for children/leaf tags (recommended)
 * - 'smart': Shows tags exactly as written in frontmatter (respects author intent)
 * - 'leaf-only': Only shows tags that have no children (most specific tags)
 * - 'none': Shows all hierarchical combinations (original behavior)
 * 
 * Animation effects:
 * - 'load-in': 3D rotations, scaling, and blur effects with staggered timing
 * - 'pop-in': Cells slide in from random edges (top, bottom, left, right) in random order
 * - 'showcase': Cycles through all colormap themes

 */

// Configuration interface for TagHeatmap options
interface TagHeatmapOptions {
  colormap?: 'viridis' | 'inferno' | 'magma' | 'plasma' | 'warm' | 'rainbow' | 'rainbow-soft' | 'hsv' | 'jet' | 'hot' | 'cool' | 'spring' | 'summer' | 'autumn' | 'winter' | 'blackbody' | 'bone' | 'copper' | 'greys' | 'bluered' | 'RdBu' | 'picnic' | 'earth' | 'ocean' | 'portland' | 'bathymetry' | 'cdom' | 'chlorophyll' | 'density' | 'freesurface-blue' | 'freesurface-red' | 'oxygen' | 'par' | 'phase' | 'salinity' | 'temperature' | 'turbidity' | 'velocity-blue' | 'velocity-green' | 'YIGnBu' | 'greens' | 'YIOrRd' | 'electric'
  maxTags?: number
  gridColumns?: number
  cellSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  deduplication?: 'none' | 'smart' | 'leaf-only' | 'hierarchical-split'
  animationEffect?: 'load-in' | 'pop-in' | 'showcase'
}

// Global tag counter - this will accumulate tags as files are processed
// We'll track both direct tag usage and hierarchical relationships
const globalTagCounts = new Map<string, number>()
const directTagUsage = new Map<string, number>() // Tags used exactly as written (not derived from hierarchy)
let debugLogs: string[] = []

/**
 * Helper function to write debug messages to a log file
 * This can be useful for troubleshooting the tag processing
 * when running the Quartz build process
 * 
 * DISABLED: Debug logging is currently turned off
 */
function writeDebugLog(message: string) {
  // No-op function (disabled logging)
  return;
}

// Get cell size configuration
function getCellSizeConfig(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {
  const configs = {
    xs: { 
      baseSize: '40px',
      gap: '2px',
      fontSize: { base: '0.6rem', parent: '0.7rem', child: '0.55rem' },
      maxWidth: '400px'
    },
    sm: { 
      baseSize: '50px', 
      gap: '3px', 
      fontSize: { base: '0.7rem', parent: '0.8rem', child: '0.65rem' },
      maxWidth: '500px'
    },
    md: { 
      baseSize: '60px', 
      gap: '4px', 
      fontSize: { base: '0.75rem', parent: '0.9rem', child: '0.7rem' },
      maxWidth: '600px'
    },
    lg: { 
      baseSize: '75px', 
      gap: '5px', 
      fontSize: { base: '0.85rem', parent: '1rem', child: '0.8rem' },
      maxWidth: '750px'
    },
    xl: { 
      baseSize: '80px', 
      gap: '5px', 
      fontSize: { base: '0.9rem', parent: '1.05rem', child: '0.85rem' },
      maxWidth: '800px'
    }
  }
  return configs[size]
}

// We reuse the previous animation CSS logic
function getAnimationCSS(effect: 'load-in' | 'pop-in' | 'showcase') {
  if (effect === 'pop-in') {
    return `
/* Clean pop-in Effect - smooth scale from small to final size with accelerating easing */
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  100% {
    opacity: 1;
    transform: scale(var(--hover-scale, 1));
  }
}

@keyframes fadeInTitle {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes legendSlideIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes gradientCalibration {
  0% { opacity: 0; transform: scaleX(0); }
  100% { opacity: 1; transform: scaleX(1); }
}

.heatmap-cell {
  opacity: 1;
  --hover-scale: 1;
  transform: scale(var(--hover-scale));
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  animation: popIn 1.0s cubic-bezier(0.25, 0.1, 0.25, 1) both;
  will-change: transform, opacity, box-shadow;
}

.section-title {
  opacity: 0; animation: fadeInTitle 0.8s ease-out 0.2s forwards;
}

.heatmap-legend {
  opacity: 0; animation: legendSlideIn 1.0s ease-out both;
}

.legend-gradient {
  opacity: 0; transform: scaleX(0); transform-origin: left center;
  animation: gradientCalibration 1.0s ease-out both;
}

@media (prefers-reduced-motion: reduce) {
  .heatmap-cell { 
    animation: none; 
    opacity: 1; 
    transform: scale(1); 
    box-shadow: none; 
    border-radius: 3px; 
  }
  .section-title { animation: none; opacity: 1; transform: none; }
  .heatmap-legend { animation: none; opacity: 1; transform: none; }
  .legend-gradient { animation: none; opacity: 1; transform: scaleX(1); }
}`
  }

  if (effect === 'showcase') {
    return `
/* Showcase effect - cycles through all colormap themes with theme name display */
@keyframes fadeInScale {
  0% { opacity: 0; transform: scale(0.8) translateZ(0); }
  60% { opacity: 0.9; transform: scale(1.05) translateZ(0); }
  100% { opacity: 1; transform: scale(var(--hover-scale, 1)) translateZ(0); }
}

@keyframes fadeInTitle {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes legendSlideIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Theme name indicator animations */
@keyframes themeNameFade {
  0% { opacity: 0; transform: translateY(-5px) scale(0.95); }
  10% { opacity: 1; transform: translateY(0) scale(1); }
  90% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(5px) scale(0.95); }
}

/* Slower color cycling with longer pauses for analysis */
@keyframes cycleAllColormaps {
  0% { filter: hue-rotate(0deg) saturate(1) brightness(1); }
  12.5% { filter: hue-rotate(45deg) saturate(1.1) brightness(1.1); }
  25% { filter: hue-rotate(90deg) saturate(1.2) brightness(1.2); }
  37.5% { filter: hue-rotate(135deg) saturate(1.1) brightness(1.1); }
  50% { filter: hue-rotate(180deg) saturate(1) brightness(1); }
  62.5% { filter: hue-rotate(225deg) saturate(1.1) brightness(0.9); }
  75% { filter: hue-rotate(270deg) saturate(1.2) brightness(0.8); }
  87.5% { filter: hue-rotate(315deg) saturate(1.1) brightness(0.9); }
  100% { filter: hue-rotate(360deg) saturate(1) brightness(1); }
}

.heatmap-cell {
  opacity: 1;
  --slide-x: 0px;
  --slide-y: 0px;
  --hover-scale: 1;
  transform: translateX(var(--slide-x)) translateY(var(--slide-y)) scale(var(--hover-scale)) translateZ(0);
  animation: fadeInScale 0.5s ease-out forwards, cycleAllColormaps 12s ease-in-out infinite 1s;
  will-change: transform, opacity, filter;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.section-title {
  opacity: 0; animation: fadeInTitle 0.8s ease-out 0.2s forwards;
}

.heatmap-legend {
  opacity: 0; animation: legendSlideIn 0.8s ease-out 1s forwards;
}

.legend-gradient {
  opacity: 0; transform: scaleX(0) translateZ(0); transform-origin: left center;
  animation: cycleAllColormaps 12s ease-in-out infinite 1s, fadeInTitle 0.8s ease-out 0.5s forwards;
  will-change: transform, opacity, filter;
}

.showcase-theme-indicator {
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  margin: 20px auto 0 auto;
  width: fit-content;
  background: var(--bg);
  color: var(--dark);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 700;
  border: 2px solid var(--border);
  box-shadow: 0 4px 12px var(--shadow);
  z-index: 100;
  white-space: nowrap;
  text-align: center;
  letter-spacing: 0.5px;
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

[saved-theme="dark"] .showcase-theme-indicator {
  background: var(--darkgray);
  color: var(--light);
  border-color: var(--gray);
}

@media (prefers-reduced-motion: reduce) {
  .heatmap-cell {
    animation: fadeInScale 0.5s ease-out forwards; filter: none;
  }
  .section-title { animation: fadeInTitle 0.8s ease-out 0.2s forwards; }
  .heatmap-legend { animation: legendSlideIn 0.8s ease-out 1s forwards; }
  .legend-gradient {
    animation: fadeInTitle 0.8s ease-out 1s forwards; filter: none;
  }
  .showcase-theme-indicator {
    animation: none;
    opacity: 1;
  }
}`
  }

  // Default load-in - optimized without 3D transforms for better performance
  return `
/* load-in effect - smooth fade with subtle scaling */
@keyframes load-inFadeIn {
  0% { 
    opacity: 0; 
    transform: translateY(15px) scale(0.95);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(var(--hover-scale, 1));
  }
}

@keyframes fadeInTitle {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes legendSlideIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes gradientGlow {
  0% { 
    opacity: 0; 
    transform: scaleX(0); 
  }
  100% { 
    opacity: 1; 
    transform: scaleX(1);
  }
}

.heatmap-cell {
  opacity: 0;
  --hover-scale: 1;
  transform: translateY(15px) scale(0.95);
  animation: load-inFadeIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  will-change: transform, opacity;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.section-title {
  opacity: 0; 
  animation: fadeInTitle 0.8s ease-out 0.2s forwards;
}

.heatmap-legend {
  opacity: 0; 
  animation: legendSlideIn 0.8s ease-out 0.4s forwards;
}

.legend-gradient {
  opacity: 0; 
  transform: scaleX(0); 
  transform-origin: left center;
  animation: gradientGlow 0.8s ease-out 0.6s forwards;
  will-change: transform, opacity;
}

/* Simple hover for load-in theme */
.heatmap-cell:hover {
  --hover-scale: 1.05;
}

@media (prefers-reduced-motion: reduce) {
  .heatmap-cell { 
    animation: none; 
    opacity: 1; 
    transform: scale(1);
  }
  .section-title { animation: none; opacity: 1; transform: none; }
  .heatmap-legend { animation: none; opacity: 1; transform: none; }
  .legend-gradient { animation: none; opacity: 1; transform: scaleX(1); }
}`
}

// For the load-in effect, create a wave-like staggered delay
function getSlideInAnimationStyle(
  index: number,
  totalCells: number,
  effect: 'load-in' | 'pop-in' | 'showcase'
): string {
  if (effect === 'pop-in') {
    // All cells use the same animation with no delay - simultaneous pop-in
    const duration = '1.0s';
    const easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)'; // Slow start, fast finish
    
    return `animation: popIn ${duration} ${easing} both;`;
  }
  if (effect === 'showcase') {
    return `animation-delay: ${Math.min(index * 0.03, 1)}s;`;
  }
  // load-in effect - create a wave pattern with staggered delays
  const row = Math.floor(index / 8); // Assuming 8 columns
  const col = index % 8;
  const waveDelay = (row * 0.08) + (col * 0.04); // Create diagonal wave effect
  return `animation-delay: ${Math.min(waveDelay, 1.2)}s;`;
}

export const TagHeatmap: QuartzTransformerPlugin<TagHeatmapOptions> = (opts?: TagHeatmapOptions) => {
  // Merge user options with defaults
  const options: Required<TagHeatmapOptions> = {
    colormap: opts?.colormap ?? 'magma',
    maxTags: opts?.maxTags ?? 40,
    gridColumns: opts?.gridColumns ?? 8,
    cellSize: opts?.cellSize ?? 'sm',
    title: opts?.title ?? '',
    deduplication: opts?.deduplication ?? 'hierarchical-split',
    animationEffect: opts?.animationEffect ?? 'load-in'
  }

  return {
    name: "TagHeatmap",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file: VFile) => {
            writeDebugLog(`TagHeatmap: Processing file - slug: ${file?.data?.slug || 'unknown'}, path: ${file?.path || 'unknown path'}`)
            try {
              if (!tree || typeof tree !== 'object' || !tree.children || !Array.isArray(tree.children)) {
                writeDebugLog(`TagHeatmap: Invalid tree structure for ${file?.data?.slug || 'unknown file'}`)
                return
              }

              // First, collect tags from this file
              if (file?.data?.frontmatter?.tags) {
                let tags = file.data.frontmatter.tags
                
                if (typeof tags === 'string') {
                  tags = [tags]
                } else if (Array.isArray(tags)) {
                  tags = tags.filter(tag => tag && typeof tag === 'string')
                } else {
                  tags = []
                }

                writeDebugLog(`TagHeatmap: Found tags in ${file.data.slug || 'unknown file'}: ${JSON.stringify(tags)}`)
                
                for (const tag of tags) {
                  directTagUsage.set(tag, (directTagUsage.get(tag) || 0) + 1)
                  
                  const parts = tag.split("/")
                  for (let i = 0; i < parts.length; i++) {
                    const currentTag = parts.slice(0, i + 1).join("/")
                    globalTagCounts.set(currentTag, (globalTagCounts.get(currentTag) || 0) + 1)
                  }
                }
                writeDebugLog(`TagHeatmap: Direct tag usage: ${JSON.stringify([...directTagUsage.entries()])}`)
                writeDebugLog(`TagHeatmap: Global tag counts: ${JSON.stringify([...globalTagCounts.entries()])}`)
              }
              
              visit(tree, "code", (node, index, parent) => {
                try {
                  if (!parent || typeof index !== "number") return
                  if (node.lang === "tag-heatmap") {
                    writeDebugLog(`TagHeatmap: Processing tag-heatmap block in ${file?.data?.slug || 'unknown file'}. Current tag count: ${globalTagCounts.size}`)
                    
                    if (globalTagCounts.size === 0) {
                      writeDebugLog(`TagHeatmap: No tags found yet, rendering placeholder`)
                      const htmlNode = {
                        type: "html" as const,
                        value: `<div class="tag-heatmap-grid"><p>No tags found yet. Processing...</p></div>`,
                      }
                      parent.children.splice(index, 1, htmlNode)
                      return
                    }

                    // Apply deduplication strategy
                    let tagsToDisplay: Map<string, number>
                    let parentTags: Map<string, number> = new Map()
                    let childAndLeafTags: Map<string, number> = new Map()
                    
                    if (options.deduplication === 'hierarchical-split') {
                      const allTags = [...directTagUsage.keys()]
                      for (const [tag, count] of directTagUsage.entries()) {
                        const isTopLevel = !tag.includes('/')
                        const hasChildren = allTags.some(otherTag => 
                          otherTag !== tag && otherTag.startsWith(tag + '/')
                        )
                        
                        if (isTopLevel && hasChildren) {
                          const hierarchicalCount = globalTagCounts.get(tag) || count
                          parentTags.set(tag, hierarchicalCount)
                        } else {
                          const hierarchicalCount = globalTagCounts.get(tag) || count
                          childAndLeafTags.set(tag, hierarchicalCount)
                        }
                      }
                      
                      tagsToDisplay = new Map([...parentTags.entries(), ...childAndLeafTags.entries()])
                      writeDebugLog(`TagHeatmap: Hierarchical split - parents: ${JSON.stringify([...parentTags.entries()])}, children/leaf: ${JSON.stringify([...childAndLeafTags.entries()])}`)
                      
                    } else if (options.deduplication === 'smart') {
                      tagsToDisplay = new Map()
                      for (const [tag, count] of directTagUsage.entries()) {
                        tagsToDisplay.set(tag, count)
                      }
                      writeDebugLog(`TagHeatmap: Smart deduplication - direct tags: ${JSON.stringify([...tagsToDisplay.entries()])}`)
                      
                    } else if (options.deduplication === 'leaf-only') {
                      tagsToDisplay = new Map()
                      const allTags = [...globalTagCounts.keys()]
                      
                      for (const [tag, count] of globalTagCounts.entries()) {
                        const hasChildren = allTags.some(otherTag => 
                          otherTag !== tag && otherTag.startsWith(tag + '/')
                        )
                        if (!hasChildren) {
                          tagsToDisplay.set(tag, count)
                        }
                      }
                      writeDebugLog(`TagHeatmap: Leaf-only deduplication: ${JSON.stringify([...tagsToDisplay.entries()])}`)
                      
                    } else {
                      tagsToDisplay = new Map(globalTagCounts)
                      writeDebugLog(`TagHeatmap: No deduplication: ${JSON.stringify([...tagsToDisplay.entries()])}`)
                    }

                    const sortedTags = [...tagsToDisplay.entries()].sort((a, b) => b[1] - a[1])

                    if (tagsToDisplay.size === 0) {
                      return
                    }

                    const chosenColormap = options.colormap
                    const colors = colormap({
                      colormap: chosenColormap,
                      nshades: 256,
                      format: 'hex',
                      alpha: 1
                    })

                    const allCounts = [...tagsToDisplay.values()]
                    const maxCount = Math.max(...allCounts)
                    const minCount = Math.min(...allCounts)

                    // For hierarchical-split, we can break out parent vs. child if needed
                    if (options.deduplication === 'hierarchical-split') {
                      const keysList = [...tagsToDisplay.keys()]
                      for (const [tg, ct] of tagsToDisplay.entries()) {
                        const isTopLevel = !tg.includes('/')
                        const hasChildren = keysList.some(o => o !== tg && o.startsWith(tg + '/'))
                        if (isTopLevel && hasChildren) {
                          parentTags.set(tg, ct)
                        } else {
                          childAndLeafTags.set(tg, ct)
                        }
                      }
                    }

                    // Color mapping
                    const getColorForCount = (count: number, min: number, max: number): string => {
                      if (max === min) return colors[0]
                      const norm = (count - min) / (max - min)
                      const idx = Math.floor(norm * (colors.length - 1))
                      return colors[idx]
                    }

                    function getTextColor(hexColor: string): string {
                      const r = parseInt(hexColor.slice(1, 3), 16)
                      const g = parseInt(hexColor.slice(3, 5), 16)
                      const b = parseInt(hexColor.slice(5, 7), 16)
                      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                      return luminance < 0.6 ? '#ffffff' : '#1a1a1a'
                    }

                    const gridCols = options.gridColumns
                    let heatmapContent = ""

                    if (options.deduplication === 'hierarchical-split') {
                      const sortedParents = [...parentTags.entries()].sort((a, b) => b[1] - a[1])
                      const sortedChildLeaf = [...childAndLeafTags.entries()].sort((a, b) => b[1] - a[1])

                      const parentMax = Math.max(...sortedParents.map(([_t, c]) => c), 0)
                      const parentMin = Math.min(...sortedParents.map(([_t, c]) => c), parentMax)
                      const childMax = Math.max(...sortedChildLeaf.map(([_t, c]) => c), 0)
                      const childMin = Math.min(...sortedChildLeaf.map(([_t, c]) => c), childMax)

                      // We only display up to 1/3 of maxTags for parents, 2/3 for child tags
                      const parentSlice = sortedParents.slice(0, Math.floor(options.maxTags / 3))
                      const childSlice = sortedChildLeaf.slice(0, Math.floor(options.maxTags * 2 / 3))

                      const parentCells = parentSlice.map(([tg, ct], idx) => {
                        const bg = getColorForCount(ct, parentMin, parentMax)
                        const txt = getTextColor(bg)
                        const animStyle = getSlideInAnimationStyle(idx, parentSlice.length, options.animationEffect)
                        return `<div class="heatmap-cell parent-cell" style="background-color: ${bg}; color: ${txt}; border-color: ${bg}; ${animStyle}" title="${tg}: ${ct} posts">
                          <a href="./tags/${tg}" style="color: ${txt} !important;">${tg}</a>
                        </div>`
                      }).join('')

                      const childCells = childSlice.map(([tg, ct], idx) => {
                        const bg = getColorForCount(ct, childMin, childMax)
                        const txt = getTextColor(bg)
                        const offsetIdx = idx + parentSlice.length
                        const animStyle = getSlideInAnimationStyle(offsetIdx, childSlice.length, options.animationEffect)
                        return `<div class="heatmap-cell child-leaf-cell" style="background-color: ${bg}; color: ${txt}; border-color: ${bg}; ${animStyle}" title="${tg}: ${ct} posts">
                          <a href="./tags/${tg}" style="color: ${txt} !important;">${tg}</a>
                        </div>`
                      }).join('')

                      heatmapContent = `

                        <div class="heatmap-split-layout">
                          <div class="parent-section">
                            <div class="section-title">Parent Categories</div>
                            <div class="parent-grid">${parentCells}</div>
                          </div>
                          <div class="child-leaf-section">
                            <div class="section-title">Sub Categories</div>
                            <div class="child-leaf-grid">${childCells}</div>
                          </div>
                        </div>`
                    } else {
                      // Just take top N tags
                      const displayTags = sortedTags.slice(0, options.maxTags)
                      const heatmapCells = displayTags.map(([tg, ct], idx) => {
                        const bg = getColorForCount(ct, minCount, maxCount)
                        const txt = getTextColor(bg)
                        const animStyle = getSlideInAnimationStyle(idx, displayTags.length, options.animationEffect)
                        return `<div class="heatmap-cell" style="background-color: ${bg}; color: ${txt}; border-color: ${bg}; ${animStyle}" title="${tg}: ${ct} posts">
                          <a href="./tags/${tg}" style="color: ${txt} !important;">${tg}</a>
                        </div>`
                      }).join('')
                      heatmapContent = `<div class="heatmap-grid">${heatmapCells}</div>`
                    }

                    // Build gradient for legend
                    const gradientStops = []
                    for (let i = 0; i <= 20; i++) {
                      const norm = i / 20
                      const colorIdx = Math.floor(norm * (colors.length - 1))
                      const pct = (norm * 100).toFixed(1)
                      gradientStops.push(`${colors[colorIdx]} ${pct}%`)
                    }
                    const gradientCSS = `linear-gradient(to right, ${gradientStops.join(', ')})`

                    // Apply style
                    const cellConfig = getCellSizeConfig(options.cellSize)
                    const styleBlock = `
<style>
.heatmap-container {
  margin: 2rem 0; padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px; background-color: var(--bg);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
.heatmap-title {
  font-size: 1.2rem; font-weight: bold;
  margin-bottom: 1rem; text-align: center;
  color: var(--dark); transition: color 0.3s ease;
}
.heatmap-split-layout {
  display: flex; gap: 1rem; max-width: 800px; margin: 0 auto;
}
.parent-section { flex: 1; min-width: 0; }
.child-leaf-section { flex: 2; min-width: 0; }
.section-title {
  font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;
  color: var(--darkgray); text-align: center;
}
.parent-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: ${cellConfig.gap}; justify-content: center;
  max-width: calc(2 * calc(${cellConfig.baseSize} * 1.5) + ${cellConfig.gap});
  margin: 0 auto;
}
.child-leaf-grid {
  display: grid; grid-template-columns: repeat(${Math.floor(gridCols * 2/3)}, 1fr);
  gap: ${cellConfig.gap}; justify-content: center;
  max-width: calc(${Math.floor(gridCols * 2/3)} * ${cellConfig.baseSize} + ${Math.floor(gridCols * 2/3) - 1} * ${cellConfig.gap});
  margin: 0 auto;
}
.heatmap-grid {
  display: grid; grid-template-columns: repeat(${gridCols}, 1fr);
  gap: ${cellConfig.gap}; max-width: ${cellConfig.maxWidth};
  margin: 0 auto; justify-content: center;
}
${getAnimationCSS(options.animationEffect)}
.heatmap-cell {
  aspect-ratio: 1; min-height: ${cellConfig.baseSize}; max-height: ${cellConfig.baseSize};
  border-radius: 3px; display: flex; align-items: center; justify-content: center;
  font-size: ${cellConfig.fontSize.base}; font-weight: 500;
  text-align: center; padding: 4px;
  border: 1px solid; position: relative; container-type: inline-size;
}
.parent-cell {
  font-size: ${cellConfig.fontSize.parent}; font-weight: 700; line-height: 1.1;
  min-height: calc(${cellConfig.baseSize} * 1.5);
  max-height: calc(${cellConfig.baseSize} * 1.5);
}
.child-leaf-cell {
  font-size: ${cellConfig.fontSize.child}; font-weight: 600; line-height: 1.2;
}
.heatmap-cell a {
  text-decoration: none !important;
  color: inherit !important; word-break: break-word; line-height: 1.2;
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%; font-weight: 600 !important; opacity: 1 !important;
  background: transparent !important; position: relative; z-index: 1;
  transition: color 0.2s ease;
}
.heatmap-cell a:hover { color: inherit !important; text-decoration: none !important; opacity: 1 !important; }
.heatmap-cell:hover {
  --hover-scale: 1.05; z-index: 10; box-shadow: 0 4px 12px var(--shadow);
  filter: blur(0) !important; position: relative;
}
[saved-theme="dark"] .heatmap-cell:hover {
  box-shadow: 0 4px 16px rgba(255,255,255,0.1);
}
[saved-theme="dark"] .section-title {
  color: var(--lightgray);
}
.heatmap-legend {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  font-size: 0.8rem; color: var(--gray); margin-top: 1rem;
  transition: color 0.3s ease;
}
.legend-gradient {
  width: 200px; height: 16px; border-radius: 8px;
  border: 1px solid var(--lightgray); transition: border-color 0.3s ease;
  position: relative; overflow: hidden; display: flex; align-items: center;
  background: ${gradientCSS};
}
[saved-theme="dark"] .legend-gradient { border-color: var(--gray); }
.legend-text {
  margin: 0; font-weight: 600; font-size: 0.9rem; color: var(--dark);
  transition: color 0.3s ease; display: flex; align-items: center; line-height: 1;
}
[saved-theme="dark"] .legend-text { color: var(--light); }
.heatmap-cell:focus-within {
  outline: 2px solid var(--secondary); outline-offset: 2px;
}
.heatmap-cell a:focus { outline: none; }
@media (max-width: 768px) {
  .heatmap-split-layout { flex-direction: column; }
  .parent-grid { grid-template-columns: repeat(3, 1fr); }
  .child-leaf-grid { grid-template-columns: repeat(4, 1fr); }
}
</style>`

                    const heatmapHTML = `
                      ${styleBlock}
                      <div class="heatmap-container" style="position: relative;">
                        ${options.animationEffect === 'showcase' ? '<div class="showcase-theme-indicator" id="showcase-theme-indicator">Base Colormap</div>' : ''}
                        ${options.title ? `<div class="heatmap-title">${options.title}</div>` : ''}
                        ${heatmapContent}
                        <div class="heatmap-legend">
                          <span class="legend-text">Less</span>
                          <div class="legend-gradient"></div>
                          <span class="legend-text">More</span>
                        </div>
                      </div>
                      ${options.animationEffect === 'showcase' ? `
                      <script>
                        (function() {
                          const themeNames = [
                            'Base ${chosenColormap}', 'Warm Shift', 'Vibrant Boost', 'Cool Tone', 
                            'Neutral', 'Deep Contrast', 'Moody Dark', 'Balanced'
                          ];
                          const indicator = document.getElementById('showcase-theme-indicator');
                          if (indicator) {
                            let currentIndex = 0;
                            
                            // Set initial theme name immediately
                            indicator.textContent = themeNames[currentIndex];
                            
                            setInterval(() => {
                              // Animate out current text
                              indicator.style.opacity = '0';
                              indicator.style.transform = 'translateY(-10px) scale(0.9)';
                              
                              setTimeout(() => {
                                // Change text while invisible
                                currentIndex = (currentIndex + 1) % themeNames.length;
                                indicator.textContent = themeNames[currentIndex];
                                
                                // Reset position for animation in
                                indicator.style.transform = 'translateY(10px) scale(0.9)';
                                
                                // Force reflow
                                indicator.offsetHeight;
                                
                                // Animate in new text
                                indicator.style.opacity = '1';
                                indicator.style.transform = 'translateY(0) scale(1)';
                              }, 200); // Text swap during fade
                            }, 1500); // 1.5 second intervals to match CSS animation
                          }
                        })();
                      </script>` : ''}
                    `
                    const htmlNode = { type: "html" as const, value: heatmapHTML }
                    parent.children.splice(index, 1, htmlNode)
                  }
                } catch (err) {
                  writeDebugLog(`TagHeatmap: Error processing tag-heatmap node in ${file?.data?.slug || 'unknown file'}: ${err}`)
                }
              })
            } catch (err) {
              writeDebugLog(`TagHeatmap: Error processing file ${file?.data?.slug || 'unknown'}: ${err}`)
            }
          }
        },
      ]
    },
  }
}