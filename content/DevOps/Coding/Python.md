---
tags:
  - code/python
created: 2025-06-30T06:50:04+04:00
modified: 2025-07-01T08:12:17+04:00
---
[Socratica Python Programming Tutorials (Computer Science) - YouTube](https://youtube.com/playlist?list=PLi01XoE8jYohWFPpC17Z-wWhPOSuh8Er-&si=p7a0tHr2EgeA8uef)
# Basics
Use `dir()` to look up what we can use on an object:
``` python
example = set()
dir(example)
#[... '_and_', '_class_', '_contains_', '_delattr_', '_dir_', '_doc_' ...  'issuperset', 'pop', 'remove', 'symmetric_difference', 'symmetric_difference_update', 'union', 'update'...]
```

## Some data classes
- **Lists** - stores duplicates, mutable.
	- Also, `collections.deque` similar to a list but optimized for adding/removing from both ends.
	``` python
	my_list = [1, 2, 2, 3]
	print(my_list)  # Output: [1, 2, 2, 3]
	```
- **Sets** - don't store duplicates, no order, mutable.
	- Also, frozenset add immutability `my_frozenset = frozenset([1, 2, 2, 3])`
``` python
	my_set = {1, 2, 2, 3}
	print(my_set)  # Output: {1, 2, 3}
```
- **Tuples** - stores duplicates, immutable
	- Also, `collections.namedtuple` - Like a tuple, but with named fields for better readability `Point = namedtuple("Point", ["x", "y"])`
``` python
	my_tuple = (1, 2, 2, 3)
	print(my_tuple)  # Output: (1, 2, 2, 3)
```
- **Dictionaries** - stores duplicates, mutable, key/value.
	- Also, `collections.defaultdict` - provides a default value for missing keys.
``` python
	my_dict = {"a": 1, "b": 2, "a": 3}
	print(my_dict)  # Output: {'a': 3, 'b': 2}
```

## Variable scopes
When a variable is encountered, Python searches for it in the following order of scopes ([LEGB](https://realpython.com/python-scope-legb-rule/)):
- **Local**: defined within a function
	- ![[Pasted image 20250530003132.png|130]]
- **Enclosing**: function inside a function.
	- ![[Pasted image 20250530003146.png|130]]
- **Global**: outside of function or defined by keyword `global` 
	- ![[Pasted image 20250530003215.png|130]]
- **Built-in**: which contains all keywords, functions, exceptions and attributes, which are built-in.![[Pasted image 20250530004002.png]]
## Text and number formatting
``` python
x = float(input("what is x")) # 999
y = float(input("what is y")) # 1
z = round(x+y)
print(f"{z:,}") # Outputs: 1,000 formatted number

x = 2
y = 3
z = (x / y)
print(f"{z:.f2}") # Outputs: 0.67 formatted number
```

## List Comprehension vs Generator Expression
**Generator Expression (without brackets):**
``` python
#The expression
domain.lower() in repo_field for domain in domains
```
**List Comprehension (with brackets):**
```python
[domain.lower() in repo_field for domain in domains]
```
So while they look similar, the one without the brackets is lazy evaluation and produces a generator rather than a full list (better memory efficiency since it generates values on demand)

##
## Fibonacci Sequence in Python
>  Fibonacci sequence is a sequence in which each element is the sum of the two elements that precede it, starting from 0 and 1:  `0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...`

# Package management

## pip (barebones)

**[What is Python's site-packages directory? - Stack Overflow](https://stackoverflow.com/a/31384640/10897030)**
[python - What does pip install . (dot) mean? - Stack Overflow](https://stackoverflow.com/a/60185613/10897030)
## UV (better than pip and else)

Combines package management, environment management and locking via `uv lock` and `uv sync --lock`

### Lock file, what?
Tl;dr:  `uv sync` would sync with `pyproject.toml` to install packages and create/relock `uv.lock file`. While `uv sync --lock` would make sure that if new package update/tree changed in pip repo it would preserve existing state, not installing updates.

UV has ability to record all package dependencies and versions into a lock file, making deployments consistent. For example, you developed locally and now pushing container image, you can instruct UV in docker file to import `uv.lock` too so that it's identical.

What is `no-install-project`?:

```bash
`uv sync --no-install-project`
```

The `uv` tool will do the following:
- Reads your `pyproject.toml` (specifically the `[project.dependencies]` section)
- **Installs those dependencies directly** using its own resolver and downloader, **without calling `pip install .`**
- It uses **uv's native Rust-based backend**, which is **faster and lower-level than pip**
# Linting and code checker

## Ruff

