---
title: "Test Notebook Embedding"
date: 2025-01-22
tags:
  - test
  - mlops
  - jupyter
---

# Testing Jupyter Notebook Embedding

This page demonstrates the automatic embedding of Jupyter notebooks from GitHub links.

## Sample Notebook from GitHub

Here's a link to the MLOps notebook we discussed:

[MLOps Training Notebook](https://github.com/vazome/mlops-zoomcamp-epam/blob/main/01-intro/03-training-ride-prediction.ipynb)

The plugin should automatically detect this `.ipynb` link and embed the notebook with all its outputs below this text.

## How it works

The NotebookEmbedding transformer:

1. **Detects notebook links** - Scans for links ending in `.ipynb` or GitHub notebook URLs
2. **Downloads notebooks** - Fetches the raw notebook content from GitHub
3. **Caches locally** - Stores downloaded notebooks in `.quartz-cache/notebooks/`
4. **Renders inline** - Converts notebook cells to HTML with proper styling
5. **Preserves outputs** - Shows code execution results, plots, and markdown content

## Features

- ✅ Automatic GitHub URL conversion to raw URLs
- ✅ Local caching to avoid repeated downloads
- ✅ Support for all cell types (markdown, code, outputs)
- ✅ Proper syntax highlighting for code cells
- ✅ Image output embedding (plots, charts)
- ✅ Error output formatting
- ✅ Dark/light theme support
- ✅ Responsive design

## Future enhancements

- Interactive cell execution
- Support for more notebook hosting platforms
- Cell-by-cell lazy loading
- Enhanced markdown rendering in cells
