import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root } from "mdast"
import { VFile } from "vfile"
import * as fs from "fs"
import colormap from "colormap"

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
 * - 'cosmic': 3D rotations, scaling, and blur effects with staggered timing
 * - 'slide-in': Cells slide in from random edges (top, bottom, left, right) in random order
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
  animationEffect?: 'cosmic' | 'slide-in' | 'showcase'
}

// Global tag counter - this will accumulate tags as files are processed
// We'll track both direct tag usage and hierarchical relationships
const globalTagCounts = new Map<string, number>()
const directTagUsage = new Map<string, number>() // Tags used exactly as written (not derived from hierarchy)
let debugLogs: string[] = []

function writeDebugLog(message: string) {
  debugLogs.push(message)
  try {
    fs.writeFileSync("tagHeatmap-debug.log", debugLogs.join('\n'))
  } catch (err) {
    // Ignore file write errors
  }
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

// Get animation CSS based on the selected effect
function getAnimationCSS(effect: 'cosmic' | 'slide-in' | 'showcase') {
  if (effect === 'slide-in') {
    return `
/* Slide-in animations from random directions using CSS variables for composability */
@keyframes slideInFromTop {
  0% {
    opacity: 0;
    --slide-x: 0px;
    --slide-y: -50px;
    --anim-scale: 0.8;
    --anim-rotate: -2deg;
    filter: blur(2px);
  }
  60% {
    opacity: 0.9;
    --slide-x: 0px;
    --slide-y: 5px;
    --anim-scale: 1.05;
    --anim-rotate: 1deg;
    filter: blur(0.5px);
  }
  100% {
    opacity: 1;
    --slide-x: 0px;
    --slide-y: 0px;
    --anim-scale: 1;
    --anim-rotate: 0deg;
    filter: blur(0);
  }
}

@keyframes slideInFromBottom {
  0% {
    opacity: 0;
    --slide-x: 0px;
    --slide-y: 50px;
    --anim-scale: 0.8;
    --anim-rotate: 2deg;
    filter: blur(2px);
  }
  60% {
    opacity: 0.9;
    --slide-x: 0px;
    --slide-y: -5px;
    --anim-scale: 1.05;
    --anim-rotate: -1deg;
    filter: blur(0.5px);
  }
  100% {
    opacity: 1;
    --slide-x: 0px;
    --slide-y: 0px;
    --anim-scale: 1;
    --anim-rotate: 0deg;
    filter: blur(0);
  }
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    --slide-x: -50px;
    --slide-y: 0px;
    --anim-scale: 0.8;
    --anim-rotate: -3deg;
    filter: blur(2px);
  }
  60% {
    opacity: 0.9;
    --slide-x: 5px;
    --slide-y: 0px;
    --anim-scale: 1.05;
    --anim-rotate: 1.5deg;
    filter: blur(0.5px);
  }
  100% {
    opacity: 1;
    --slide-x: 0px;
    --slide-y: 0px;
    --anim-scale: 1;
    --anim-rotate: 0deg;
    filter: blur(0);
  }
}

@keyframes slideInFromRight {
  0% {
    opacity: 0;
    --slide-x: 50px;
    --slide-y: 0px;
    --anim-scale: 0.8;
    --anim-rotate: 3deg;
    filter: blur(2px);
  }
  60% {
    opacity: 0.9;
    --slide-x: -5px;
    --slide-y: 0px;
    --anim-scale: 1.05;
    --anim-rotate: -1.5deg;
    filter: blur(0.5px);
  }
  100% {
    opacity: 1;
    --slide-x: 0px;
    --slide-y: 0px;
    --anim-scale: 1;
    --anim-rotate: 0deg;
    filter: blur(0);
  }
}

@keyframes fadeInTitle {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes legendSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientCalibration {
  0% {
    opacity: 0;
    transform: scaleX(0);
    filter: hue-rotate(0deg) brightness(0.5);
  }
  25% {
    opacity: 0.7;
    transform: scaleX(0.3);
    filter: hue-rotate(90deg) brightness(1.2);
  }
  50% {
    opacity: 0.9;
    transform: scaleX(0.7);
    filter: hue-rotate(180deg) brightness(1.5);
  }
  75% {
    opacity: 0.95;
    transform: scaleX(0.9);
    filter: hue-rotate(270deg) brightness(1.2);
  }
  100% {
    opacity: 1;
    transform: scaleX(1);
    filter: hue-rotate(360deg) brightness(1);
  }
}

.heatmap-cell {
  /* Initial state for slide-in animation */
  opacity: 0;
  /* CSS variables for composable transforms */
  --slide-x: 0px;
  --slide-y: 0px;
  --hover-scale: 1;
  --anim-scale: 1;
  --anim-rotate: 0deg;
  /* Composable transform using CSS variables */
  transform: translateX(var(--slide-x)) translateY(var(--slide-y)) scale(calc(var(--hover-scale) * var(--anim-scale))) rotate(var(--anim-rotate));
  /* Animation will be applied via inline style with random direction */
}

.section-title {
  opacity: 0;
  animation: fadeInTitle 0.8s ease-out 0.2s forwards;
}

.heatmap-legend {
  opacity: 0;
  animation: legendSlideIn 0.8s ease-out 1s forwards;
}

.legend-gradient {
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left center;
  animation: gradientCalibration 1.2s ease-out 1.3s forwards;
}

/* Disable all animations for reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .heatmap-cell {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .section-title {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .heatmap-legend {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .legend-gradient {
    animation: none;
    opacity: 1;
    transform: scaleX(1);
  }
}`
  }

  if (effect === 'showcase') {
    return `
/* Showcase effect - cycles through all colormap themes */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8) translateZ(0);
  }
  60% {
    opacity: 0.9;
    transform: scale(1.05) translateZ(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateZ(0);
  }
}

@keyframes fadeInTitle {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes legendSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* This can remain a hue rotation approach or be replaced by a more advanced JavaScript cycling. 
   For simplicity, we keep a rotation so there's visible color shifting effect. */
@keyframes cycleAllColormaps {
  0% {
    filter: hue-rotate(0deg) saturate(1) brightness(1);
  }
  100% {
    filter: hue-rotate(360deg) saturate(1) brightness(1);
  }
}

.heatmap-cell {
  opacity: 0;
  --slide-x: 0px;
  --slide-y: 0px;
  --hover-scale: 1;
  transform: translateX(var(--slide-x)) translateY(var(--slide-y)) scale(var(--hover-scale)) translateZ(0);
  animation: fadeInScale 0.5s ease-out forwards, cycleAllColormaps 6s linear infinite 1s;
  will-change: transform, opacity, filter;
}

.section-title {
  opacity: 0;
  animation: fadeInTitle 0.8s ease-out 0.2s forwards;
}

.heatmap-legend {
  opacity: 0;
  animation: legendSlideIn 0.8s ease-out 1s forwards;
}

.legend-gradient {
  opacity: 0;
  transform: scaleX(0) translateZ(0);
  transform-origin: left center;
  animation: cycleAllColormaps 6s linear infinite 1s, fadeInTitle 0.8s ease-out 0.5s forwards;
  will-change: transform, opacity, filter;
}

/* Disable animations for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .heatmap-cell {
    animation: fadeInScale 0.5s ease-out forwards;
    filter: none;
  }
  
  .section-title {
    animation: fadeInTitle 0.8s ease-out 0.2s forwards;
  }
  
  .heatmap-legend {
    animation: legendSlideIn 0.8s ease-out 1s forwards;
  }
  
  .legend-gradient {
    animation: fadeInTitle 0.8s ease-out 1s forwards;
    filter: none;
  }
}`
  }

  // Default: cosmic effect
  return `
/* Optimized cosmic loading animations - GPU accelerated, no bloat */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8) translateZ(0);
  }
  60% {
    opacity: 0.9;
    transform: scale(1.05) translateZ(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateZ(0);
  }
}

@keyframes fadeInTitle {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes legendSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientCalibration {
  0% {
    opacity: 0;
    transform: scaleX(0);
    filter: hue-rotate(0deg) brightness(0.5);
  }
  25% {
    opacity: 0.7;
    transform: scaleX(0.3);
    filter: hue-rotate(90deg) brightness(1.2);
  }
  50% {
    opacity: 0.9;
    transform: scaleX(0.7);
    filter: hue-rotate(180deg) brightness(1.5);
  }
  75% {
    opacity: 0.95;
    transform: scaleX(0.9);
    filter: hue-rotate(270deg) brightness(1.2);
  }
  100% {
    opacity: 1;
    transform: scaleX(1);
    filter: hue-rotate(360deg) brightness(1);
  }
}

.heatmap-cell {
  opacity: 0;
  --slide-x: 0px;
  --slide-y: 0px;
  --hover-scale: 1;
  transform: translateX(var(--slide-x)) translateY(var(--slide-y)) scale(var(--hover-scale)) translateZ(0);
  animation: fadeInScale 0.5s ease-out forwards;
  will-change: transform, opacity;
}

.section-title {
  opacity: 0;
  animation: fadeInTitle 0.8s ease-out 0.2s forwards;
}

.heatmap-legend {
  opacity: 0;
  animation: legendSlideIn 0.8s ease-out 1s forwards;
}

.legend-gradient {
  opacity: 0;
  transform: scaleX(0) translateZ(0);
  transform-origin: left center;
  animation: gradientCalibration 0.8s ease-out 1s forwards;
  will-change: transform, opacity;
}

/* Disable all animations for reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .heatmap-cell {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .section-title {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .heatmap-legend {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .legend-gradient {
    animation: none;
    opacity: 1;
    transform: scaleX(1);
  }
}`
}

// Helper function to get animation style for slide-in effect
function getSlideInAnimationStyle(
  index: number,
  totalCells: number,
  effect: 'cosmic' | 'slide-in' | 'showcase'
): string {
  if (effect === 'slide-in') {
    const directions = ['slideInFromTop', 'slideInFromBottom', 'slideInFromLeft', 'slideInFromRight']
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    const randomOrder = Math.floor(Math.random() * totalCells)
    const baseDelay = randomOrder * 0.03
    const randomOffset = Math.random() * 0.08
    const totalDelay = baseDelay + randomOffset
    return `animation: ${randomDirection} 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${totalDelay}s forwards;`
  }

  if (effect === 'showcase') {
    return `animation-delay: ${Math.min(index * 0.03, 1)}s;`
  }

  // Default cosmic effect
  return `animation-delay: ${Math.min(index * 0.05, 1.5)}s;`
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
    animationEffect: opts?.animationEffect ?? 'cosmic'
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

                    let chosenColormap = options.colormap
                    // For "showcase", we could randomize or do more advanced logic,
                    // but here we simply proceed with the user-supplied colormap as is.
                    // (Animation visually cycles colors in CSS.)
                    
                    const colors = colormap({
                      colormap: chosenColormap,
                      nshades: 256,
                      format: 'hex',
                      alpha: 1
                    })

                    const allCounts = [...tagsToDisplay.values()]
                    const maxCount = Math.max(...allCounts)
                    const minCount = Math.min(...allCounts)

                    let parentMaxCount = maxCount
                    let parentMinCount = minCount
                    let childMaxCount = maxCount 
                    let childMinCount = minCount

                    if (
                      options.deduplication === 'hierarchical-split' &&
                      parentTags.size > 0 &&
                      childAndLeafTags.size > 0
                    ) {
                      const parentCounts = [...parentTags.values()]
                      const childCounts = [...childAndLeafTags.values()]
                      
                      parentMaxCount = Math.max(...parentCounts)
                      parentMinCount = Math.min(...parentCounts)
                      childMaxCount = Math.max(...childCounts)
                      childMinCount = Math.min(...childCounts)
                    }

                    const getColorForParent = (count: number): string => {
                      if (parentMaxCount === parentMinCount) {
                        return colors[0]
                      }
                      const normalizedValue = (count - parentMinCount) / (parentMaxCount - parentMinCount)
                      const colorIndex = Math.floor(normalizedValue * (colors.length - 1))
                      return colors[colorIndex]
                    }

                    const getColorForChild = (count: number): string => {
                      if (childMaxCount === childMinCount) {
                        return colors[0]
                      }
                      const normalizedValue = (count - childMinCount) / (childMaxCount - childMinCount)
                      const colorIndex = Math.floor(normalizedValue * (colors.length - 1))
                      return colors[colorIndex]
                    }

                    const getColorForCount = (count: number): string => {
                      if (maxCount === minCount) {
                        return colors[0]
                      }
                      const normalizedValue = (count - minCount) / (maxCount - minCount)
                      const colorIndex = Math.floor(normalizedValue * (colors.length - 1))
                      return colors[colorIndex]
                    }

                    const getTextColor = (hexColor: string): string => {
                      const r = parseInt(hexColor.slice(1, 3), 16)
                      const g = parseInt(hexColor.slice(3, 5), 16)
                      const b = parseInt(hexColor.slice(5, 7), 16)
                      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                      return luminance < 0.6 ? '#ffffff' : '#1a1a1a'
                    }

                    const gridCols = options.gridColumns
                    let heatmapContent: string
                    
                    if (options.deduplication === 'hierarchical-split') {
                      const sortedParents = [...parentTags.entries()].sort((a, b) => b[1] - a[1])
                      const sortedChildrenLeaf = [...childAndLeafTags.entries()].sort((a, b) => b[1] - a[1])
                      
                      const totalParentCells = sortedParents.length
                      const parentCells = sortedParents.map(([tag, count], idx) => {
                        const backgroundColor = getColorForParent(count)
                        const textColor = getTextColor(backgroundColor)
                        const escapedTag = tag.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                        const tagUrl = `./tags/${tag}`
                        const animationStyle = getSlideInAnimationStyle(
                          idx,
                          totalParentCells,
                          options.animationEffect
                        )
                        
                        return `<div class="heatmap-cell parent-cell" style="background-color: ${backgroundColor}; color: ${textColor}; border-color: ${backgroundColor}; ${animationStyle}" title="${escapedTag}: ${count} posts">
                          <a href="${tagUrl}" style="color: ${textColor} !important;">${tag}</a>
                        </div>`
                      }).join('')
                      
                      const childLeafSlice = sortedChildrenLeaf.slice(0, Math.floor(options.maxTags * 2/3))
                      const totalChildCells = childLeafSlice.length
                      const childLeafCells = childLeafSlice.map(([tag, count], idx) => {
                        const backgroundColor = getColorForChild(count)
                        const textColor = getTextColor(backgroundColor)
                        const escapedTag = tag.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                        const tagUrl = `./tags/${tag}`
                        // offset idx by totalParentCells so delays are continuous
                        const animationStyle = getSlideInAnimationStyle(
                          idx + totalParentCells,
                          totalChildCells,
                          options.animationEffect
                        )
                        
                        return `<div class="heatmap-cell child-leaf-cell" style="background-color: ${backgroundColor}; color: ${textColor}; border-color: ${backgroundColor}; ${animationStyle}" title="${escapedTag}: ${count} posts">
                          <a href="${tagUrl}" style="color: ${textColor} !important;">${tag}</a>
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
                            <div class="child-leaf-grid">${childLeafCells}</div>
                          </div>
                        </div>`
                        
                    } else {
                      const displayTags = sortedTags.slice(0, options.maxTags)
                      
                      const heatmapCells = displayTags.map(([tag, count], idx) => {
                        const backgroundColor = getColorForCount(count)
                        const textColor = getTextColor(backgroundColor)
                        const escapedTag = tag.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
                        const tagUrl = `./tags/${tag}`
                        const animationStyle = getSlideInAnimationStyle(
                          idx,
                          displayTags.length,
                          options.animationEffect
                        )
                        
                        return `<div class="heatmap-cell" style="background-color: ${backgroundColor}; color: ${textColor}; border-color: ${backgroundColor}; ${animationStyle}" title="${escapedTag}: ${count} posts">
                          <a href="${tagUrl}" style="color: ${textColor} !important;">${tag}</a>
                        </div>`
                      }).join('')
                      
                      heatmapContent = `<div class="heatmap-grid">${heatmapCells}</div>`
                    }

                    const gradientStops = []
                    for (let i = 0; i <= 20; i++) {
                      const normalizedValue = i / 20
                      const colorIndex = Math.floor(normalizedValue * (colors.length - 1))
                      const percentage = (i / 20 * 100).toFixed(1)
                      gradientStops.push(`${colors[colorIndex]} ${percentage}%`)
                    }
                    
                    const gradientCSS = `linear-gradient(to right, ${gradientStops.join(', ')})`

                    const cellConfig = getCellSizeConfig(options.cellSize)
                    const cssStyles = `
<style>
.heatmap-container {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background-color: var(--bg);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.heatmap-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--dark);
  transition: color 0.3s ease;
}

/* Split layout styles */
.heatmap-split-layout {
  display: flex;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.parent-section {
  flex: 1;
  min-width: 0;
}

.child-leaf-section {
  flex: 2;
  min-width: 0;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--darkgray);
  text-align: center;
}

.parent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${cellConfig.gap};
  justify-content: center;
  max-width: calc(2 * calc(${cellConfig.baseSize} * 1.5) + ${cellConfig.gap});
  margin: 0 auto;
}

.child-leaf-grid {
  display: grid;
  grid-template-columns: repeat(${Math.floor(gridCols * 2/3)}, 1fr);
  gap: ${cellConfig.gap};
  justify-content: center;
  max-width: calc(${Math.floor(gridCols * 2/3)} * ${cellConfig.baseSize} + ${Math.floor(gridCols * 2/3) - 1} * ${cellConfig.gap});
  margin: 0 auto;
}

/* Standard grid layout */
.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(${gridCols}, 1fr);
  gap: ${cellConfig.gap};
  max-width: ${cellConfig.maxWidth};
  margin: 0 auto;
  justify-content: center;
}

/* Animations */
${getAnimationCSS(options.animationEffect)}

.heatmap-cell {
  aspect-ratio: 1;
  min-height: ${cellConfig.baseSize};
  max-height: ${cellConfig.baseSize};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${cellConfig.fontSize.base};
  font-weight: 500;
  text-align: center;
  padding: 4px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  border: 1px solid;
  position: relative;
  container-type: inline-size;
}

.parent-cell {
  font-size: ${cellConfig.fontSize.parent};
  font-weight: 700;
  line-height: 1.1;
  min-height: calc(${cellConfig.baseSize} * 1.5);
  max-height: calc(${cellConfig.baseSize} * 1.5);
}

.child-leaf-cell {
  font-size: ${cellConfig.fontSize.child};
  font-weight: 600;
  line-height: 1.2;
  min-height: ${cellConfig.baseSize};
  max-height: ${cellConfig.baseSize};
}

/* Container-based responsive sizing */
.parent-section .heatmap-cell {
  container-type: inline-size;
}

.child-leaf-section .heatmap-cell {
  container-type: inline-size;
}

.heatmap-cell a {
  text-decoration: none !important;
  color: inherit !important;
  word-break: break-word;
  line-height: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-weight: 600 !important;
  opacity: 1 !important;
  background: transparent !important;
  position: relative;
  z-index: 1;
  transition: color 0.2s ease;
}

.heatmap-cell a:hover {
  color: inherit !important;
  text-decoration: none !important;
  opacity: 1 !important;
}

.heatmap-cell:hover {
  --hover-scale: 1.05;
  z-index: 10;
  box-shadow: 0 4px 12px var(--shadow);
  position: relative;
  filter: blur(0) !important;
}

/* Dark mode specific styles */
[saved-theme="dark"] .heatmap-cell:hover {
  box-shadow: 0 4px 16px rgba(255,255,255,0.1);
}

[saved-theme="dark"] .section-title {
  color: var(--lightgray);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--gray);
  margin-top: 1rem;
  transition: color 0.3s ease;
}

.legend-gradient {
  width: 200px;
  height: 16px;
  border-radius: 8px;
  border: 1px solid var(--lightgray);
  transition: border-color 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

[saved-theme="dark"] .legend-gradient {
  border-color: var(--gray);
}

.legend-text {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--dark);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  line-height: 1;
}

[saved-theme="dark"] .legend-text {
  color: var(--light);
}

.heatmap-cell:focus-within {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

.heatmap-cell a:focus {
  outline: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .heatmap-split-layout {
    flex-direction: column;
  }
  
  .parent-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .child-leaf-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>`

                    const htmlNode = {
                      type: "html" as const,
                      value: `${cssStyles}
                        <div class="heatmap-container">
                          ${options.title ? `<div class="heatmap-title">${options.title}</div>` : ''}
                          ${heatmapContent}
                          <div class="heatmap-legend">
                            <span class="legend-text">Less</span>
                            <div class="legend-gradient" style="background: ${gradientCSS};"></div>
                            <span class="legend-text">More</span>
                          </div>
                        </div>`
                    }
                    parent.children.splice(index, 1, htmlNode)
                    writeDebugLog(`TagHeatmap: Rendered heatmap with ${sortedTags.length} tags`)
                  }
                } catch (err) {
                  writeDebugLog(`TagHeatmap: Error processing code block: ${err}`)
                }
              })
            } catch (err) {
              writeDebugLog(`TagHeatmap: Error processing tree: ${err}`)
            }
          }
        },
      ]
    },
  }
}