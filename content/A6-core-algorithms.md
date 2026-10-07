# 06 — Algorithms & Data Structures

> Big-O, data structures, patterns thường gặp interview + áp dụng thực tế trong FE/RN.

---

## Mục lục

1. [Big-O Notation](#bigo)
2. [Data Structures cơ bản](#ds)
3. [Sorting Algorithms](#sort)
4. [Searching](#search)
5. [Recursion & Backtracking](#recursion)
6. [Common Patterns (LeetCode-style)](#patterns)
7. [Cây / Trees](#trees)
8. [Đồ thị / Graphs](#graphs)
9. [Dynamic Programming](#dp)
10. [Bài tập áp dụng cho FE](#fe-applied)

---

<a id="bigo"></a>
## 1. Big-O Notation

Đo độ phức tạp **worst-case** theo input size n.

| O | Tên | Ví dụ |
|---|---|---|
| O(1) | constant | array[i], obj[key], Map.get |
| O(log n) | logarithmic | binary search, balanced BST |
| O(n) | linear | for loop, find |
| O(n log n) | linearithmic | merge sort, quick sort avg |
| O(n²) | quadratic | nested loop, bubble sort |
| O(n³) | cubic | 3 nested loop |
| O(2ⁿ) | exponential | fibonacci recursion naive |
| O(n!) | factorial | permutation, TSP brute |

**Space complexity** đo tương tự nhưng cho memory.

**Quy tắc nhanh:**
- Constants bỏ qua: O(2n) → O(n)
- Lấy hạng lớn nhất: O(n² + n) → O(n²)
- Tham số khác nhau: O(a + b) không = O(n)

---

<a id="ds"></a>
## 2. Data Structures cơ bản

### Array
- Access O(1), search O(n), insert/delete giữa O(n)
- JS array là dynamic, có thể sparse

### Object / Hash Map
- Get/Set/Delete avg O(1), worst O(n) (collision)
- Trong JS: `Object` (key string/symbol) hoặc `Map` (key bất kỳ — preferred)

### Set
- has/add/delete O(1) avg
- Use case: dedupe, set operation

### Stack (LIFO)
```js
const stack = []
stack.push(1); stack.pop()
// Use: undo, parentheses matching, DFS, call stack
```

### Queue (FIFO)
```js
const q = []
q.push(1); q.shift()       // shift O(n) - slow
// Better: Deque pattern (head index) hoặc linked list
```
Use: BFS, task scheduling.

### Linked List
```js
class Node {
  constructor(val, next = null) { this.val = val; this.next = next }
}
```
Singly, doubly, circular.
- Insert/delete đầu: O(1)
- Search: O(n)
- Use: LRU cache, undo history. JS hiếm dùng (array đủ tốt).

### Heap (Priority Queue)
- Min/Max heap, get min/max O(log n)
- Use: Dijkstra, task priority, top-K
- JS: dùng `js-priority-queue` hoặc tự code

### Trie (prefix tree)
- Insert/search word O(m) (m = độ dài)
- Use: autocomplete, dictionary

### Disjoint Set (Union-Find)
- find/union ~O(α(n)) (near constant)
- Use: connected components, Kruskal

---

<a id="sort"></a>
## 3. Sorting Algorithms

| Algo | Best | Avg | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | n | n² | n² | 1 | ✅ |
| Selection | n² | n² | n² | 1 | ❌ |
| Insertion | n | n² | n² | 1 | ✅ |
| Merge | n log n | n log n | n log n | n | ✅ |
| Quick | n log n | n log n | n² | log n | ❌ |
| Heap | n log n | n log n | n log n | 1 | ❌ |
| Counting | n+k | n+k | n+k | n+k | ✅ |
| Radix | nk | nk | nk | n+k | ✅ |

**JS native `.sort()`:** spec V8 hiện dùng **Timsort** (stable, hybrid merge + insertion). O(n log n).

```js
arr.sort((a, b) => a - b)              // số: tăng dần
arr.sort((a, b) => b - a)              // số: giảm dần
arr.sort((a, b) => a.name.localeCompare(b.name))  // string i18n
```

**Quicksort tự code:**
```js
function quickSort(arr) {
  if (arr.length <= 1) return arr
  const pivot = arr[Math.floor(arr.length / 2)]
  const left = arr.filter((x, i) => x < pivot)
  const mid = arr.filter(x => x === pivot)
  const right = arr.filter(x => x > pivot)
  return [...quickSort(left), ...mid, ...quickSort(right)]
}
```

---

<a id="search"></a>
## 4. Searching

### Linear search — O(n)
```js
function linear(arr, target) {
  for (let i = 0; i < arr.length; i++) if (arr[i] === target) return i
  return -1
}
```

### Binary search — O(log n), yêu cầu sorted
```js
function binary(arr, target) {
  let lo = 0, hi = arr.length - 1
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (arr[mid] === target) return mid
    if (arr[mid] < target) lo = mid + 1
    else hi = mid - 1
  }
  return -1
}
```

> 💡 Binary search nâng cao: tìm leftmost/rightmost, tìm trên range answer (binary search on answer).

---

<a id="recursion"></a>
## 5. Recursion & Backtracking

**Recursion = base case + recursive case + giảm dần đến base.**

```js
// Factorial
const fact = n => n <= 1 ? 1 : n * fact(n - 1)

// Fibonacci (naive — O(2^n) ❌)
const fib = n => n < 2 ? n : fib(n-1) + fib(n-2)

// Fibonacci memoization — O(n)
const fibMemo = (n, m = {}) => {
  if (n in m) return m[n]
  if (n < 2) return n
  return m[n] = fibMemo(n-1, m) + fibMemo(n-2, m)
}

// Fibonacci iterative — O(n) time, O(1) space ⭐
function fibIter(n) {
  let a = 0, b = 1
  for (let i = 0; i < n; i++) [a, b] = [b, a + b]
  return a
}
```

**Backtracking** — DFS có quay lui khi gặp dead-end. Common: permutations, combinations, sudoku, N-queens, word search.

```js
// Permutations
function permute(nums) {
  const res = []
  function bt(path, remaining) {
    if (!remaining.length) { res.push([...path]); return }
    for (let i = 0; i < remaining.length; i++) {
      path.push(remaining[i])
      bt(path, [...remaining.slice(0, i), ...remaining.slice(i+1)])
      path.pop()    // ← backtrack
    }
  }
  bt([], nums)
  return res
}
```

---

<a id="patterns"></a>
## 6. Common Patterns (LeetCode-style)

### Two Pointers
```js
// Đảo chuỗi
function reverse(s) {
  s = s.split('')
  let l = 0, r = s.length - 1
  while (l < r) { [s[l], s[r]] = [s[r], s[l]]; l++; r-- }
  return s.join('')
}

// Two-sum sorted
function twoSum(arr, target) {
  let l = 0, r = arr.length - 1
  while (l < r) {
    const sum = arr[l] + arr[r]
    if (sum === target) return [l, r]
    if (sum < target) l++; else r--
  }
}
```

### Sliding Window
```js
// Max sum subarray độ dài k
function maxSum(arr, k) {
  let sum = 0
  for (let i = 0; i < k; i++) sum += arr[i]
  let max = sum
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k]
    if (sum > max) max = sum
  }
  return max
}

// Longest substring no repeat
function lengthOfLongestSubstring(s) {
  const seen = new Map()
  let max = 0, start = 0
  for (let i = 0; i < s.length; i++) {
    if (seen.has(s[i]) && seen.get(s[i]) >= start) start = seen.get(s[i]) + 1
    seen.set(s[i], i)
    max = Math.max(max, i - start + 1)
  }
  return max
}
```

### Hash Map cho lookup
```js
// Two-sum
function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (map.has(need)) return [map.get(need), i]
    map.set(nums[i], i)
  }
}

// Group anagram
function group(strs) {
  const m = new Map()
  for (const s of strs) {
    const key = [...s].sort().join('')
    if (!m.has(key)) m.set(key, [])
    m.get(key).push(s)
  }
  return [...m.values()]
}
```

### Prefix Sum
```js
// Range sum truy vấn nhiều lần
const prefix = [0]
for (const x of arr) prefix.push(prefix.at(-1) + x)
const rangeSum = (l, r) => prefix[r+1] - prefix[l]
```

### Fast & Slow Pointer (cycle detection)
```js
function hasCycle(head) {
  let slow = head, fast = head
  while (fast?.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}
```

### Merge Intervals
```js
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0])
  const res = [intervals[0]]
  for (let i = 1; i < intervals.length; i++) {
    const last = res.at(-1)
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1])
    else res.push(intervals[i])
  }
  return res
}
```

---

<a id="trees"></a>
## 7. Trees

### Binary Tree
```js
class Node {
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right
  }
}
```

### Traversal
```js
// DFS
function inorder(node, res = []) {
  if (!node) return res
  inorder(node.left, res); res.push(node.val); inorder(node.right, res)
  return res
}
// preorder: root, left, right
// postorder: left, right, root

// BFS (level order) - dùng queue
function bfs(root) {
  if (!root) return []
  const q = [root], res = []
  while (q.length) {
    const node = q.shift()
    res.push(node.val)
    if (node.left)  q.push(node.left)
    if (node.right) q.push(node.right)
  }
  return res
}
```

### BST (Binary Search Tree)
- Property: left < node < right
- Search/insert/delete: O(log n) avg, O(n) skewed
- Self-balancing: AVL, Red-Black (JS Map dùng RB tree internal V8)

---

<a id="graphs"></a>
## 8. Graphs

### Representation
```js
// Adjacency list (preferred)
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A'],
  D: ['B']
}
```

### BFS
```js
function bfs(start) {
  const visited = new Set([start])
  const q = [start]
  while (q.length) {
    const node = q.shift()
    for (const n of graph[node]) {
      if (!visited.has(n)) { visited.add(n); q.push(n) }
    }
  }
  return visited
}
```

### DFS (recursive)
```js
function dfs(node, visited = new Set()) {
  if (visited.has(node)) return
  visited.add(node)
  for (const n of graph[node]) dfs(n, visited)
  return visited
}
```

### Shortest path
- **BFS** — unweighted
- **Dijkstra** — non-negative weighted (heap)
- **Bellman-Ford** — có negative weight
- **A*** — heuristic search

---

<a id="dp"></a>
## 9. Dynamic Programming

**Khi nào DP?** Optimal substructure + overlapping subproblems.

### Top-down (memoization)
```js
function climb(n, memo = {}) {
  if (n in memo) return memo[n]
  if (n <= 2) return n
  return memo[n] = climb(n-1, memo) + climb(n-2, memo)
}
```

### Bottom-up (tabulation)
```js
function climb(n) {
  if (n <= 2) return n
  const dp = [0, 1, 2]
  for (let i = 3; i <= n; i++) dp[i] = dp[i-1] + dp[i-2]
  return dp[n]
}
```

### Classic problems
- Knapsack (0/1, unbounded)
- Coin change (min coins, ways)
- Longest Common Subsequence (LCS)
- Longest Increasing Subsequence (LIS)
- Edit Distance (Levenshtein)
- House Robber, Jump Game
- Matrix path (Unique Paths, Min Path Sum)

---

<a id="fe-applied"></a>
## 10. Áp dụng thực tế cho FE/RN

### Debounce search input
```js
function useDebouncedValue(val, ms = 300) {
  const [v, setV] = useState(val)
  useEffect(() => {
    const t = setTimeout(() => setV(val), ms)
    return () => clearTimeout(t)
  }, [val, ms])
  return v
}
```

### LRU Cache cho image / API response
```js
class LRU {
  constructor(max = 100) { this.max = max; this.map = new Map() }
  get(k) {
    if (!this.map.has(k)) return null
    const v = this.map.get(k)
    this.map.delete(k); this.map.set(k, v)   // refresh
    return v
  }
  set(k, v) {
    if (this.map.has(k)) this.map.delete(k)
    else if (this.map.size >= this.max) this.map.delete(this.map.keys().next().value)
    this.map.set(k, v)
  }
}
```

### Build tree từ flat list (categories, comments)
```js
function buildTree(items, parentField = 'parentId') {
  const map = new Map(items.map(i => [i.id, { ...i, children: [] }]))
  const roots = []
  for (const node of map.values()) {
    if (node[parentField]) map.get(node[parentField])?.children.push(node)
    else roots.push(node)
  }
  return roots
}
```

### Flatten tree
```js
function flatten(nodes, depth = 0, res = []) {
  for (const n of nodes) {
    res.push({ ...n, depth })
    if (n.children?.length) flatten(n.children, depth + 1, res)
  }
  return res
}
```

### Diff arrays (added, removed, common)
```js
function diff(prev, next, key = 'id') {
  const prevMap = new Map(prev.map(x => [x[key], x]))
  const nextMap = new Map(next.map(x => [x[key], x]))
  const added = next.filter(x => !prevMap.has(x[key]))
  const removed = prev.filter(x => !nextMap.has(x[key]))
  const common = next.filter(x => prevMap.has(x[key]))
  return { added, removed, common }
}
```

### Throttle scroll handler
```js
function throttle(fn, ms = 100) {
  let last = 0, t
  return (...a) => {
    const now = Date.now()
    const remain = ms - (now - last)
    if (remain <= 0) { last = now; fn(...a) }
    else { clearTimeout(t); t = setTimeout(() => { last = Date.now(); fn(...a) }, remain) }
  }
}
```

### Virtual list (concept)
- Tính `startIndex = floor(scrollTop / itemHeight)`
- Render chỉ `[startIndex, startIndex + visibleCount + buffer]`
- Spacer div trên/dưới để giữ scroll height

---

## References
- [BigOCheatSheet](https://www.bigocheatsheet.com)
- [NeetCode Roadmap](https://neetcode.io/roadmap)
- [Grokking Algorithms — Aditya Bhargava]
- [Cracking the Coding Interview — Gayle McDowell]
- [Visualgo — algo visualization](https://visualgo.net)
