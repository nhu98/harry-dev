# 08 — Interview Questions (Tổ chức lại từ Questions.odt)

> Tổng hợp & sắp xếp lại bộ câu hỏi phỏng vấn từ file `Questions.odt` — phân nhóm theo chủ đề, có câu trả lời ngắn + ví dụ code + liên kết đến các file A1–07 để đào sâu.
>
> **Mẹo ôn:** Đọc từng nhóm, tự trả lời ra giấy trước khi xem đáp án. Đánh dấu ⭐ câu nào còn yếu để quay lại.

---

## Mục lục

- [Phần A — JavaScript Core](#a-javascript-core)
- [Phần B — Browser & DOM](#b-browser-dom)
- [Phần C — React & State Management](#c-react)
- [Phần D — Build Tools, Bundling & Performance](#d-build-perf)
- [Phần E — Security FE](#e-security)
- [Phần F — Testing](#f-testing)
- [Phần G — Git, Deploy, CI/CD](#g-git-deploy)
- [Phần H — TypeScript & Styling](#h-ts-style)
- [Phần I — Micro-frontend](#i-mfe)
- [Phần J — CSS & Accessibility](#j-css-a11y)
- [Phần K — React Native (Mobile)](#k-rn)
- [Phần L — Coding Challenges](#l-coding)
- [Phần M — Code Output Quiz (7 snippets)](#m-quiz)
- [Phần N — General English Questions](#n-en)
- [Phần O — Câu hỏi NÊN HỎI lại nhà tuyển dụng](#o-ask-back)
- [Phần P — CSS Styles (Advanced)](#p-css-advanced)
- [Phần Q — Performance (Advanced)](#q-perf-advanced)
- [Phần R — Caching (Advanced)](#r-caching-advanced)
- [Phần S — Security (Advanced)](#s-security-advanced)
- [Phần T — Testing (Advanced)](#t-testing-advanced)
- [Phần U — System Design FE/Mobile](#u-system-design)
- [Phần V — React 19 (Latest 2024-2025)](#v-react-19)
- [Phần W — Next.js 15 App Router (Latest)](#w-nextjs-15)
- [Phần X — React Native Latest (New Arch, Expo SDK 52+, Expo Router v4)](#x-rn-latest)
- [Phần Y — React Core Deep Dive (Hooks & Concepts)](#y-react-core)

---

<a id="a-javascript-core"></a>
## Phần A — JavaScript Core

### A1. Phân biệt `var`, `let`, `const`

| | scope | hoisted | re-assign | re-declare | TDZ |
|---|---|---|---|---|---|
| `var` | function | yes (init `undefined`) | ✅ | ✅ | ❌ |
| `let` | block | yes (not init) | ✅ | ❌ | ✅ |
| `const` | block | yes (not init) | ❌ | ❌ | ✅ |

**Lưu ý:** `const` chỉ đảm bảo binding immutable, KHÔNG đảm bảo object immutable (`const o={}; o.x=1` vẫn được). Muốn freeze: `Object.freeze(o)`.

📖 Đào sâu: [01 — Day 19, Advanced JS §5](./A1-core-javascript.md#advanced-js)

---

### A2. Closure là gì?

**Closure** là function "ghi nhớ" scope nơi nó được khai báo, ngay cả khi gọi ở scope khác.

```js
function counter() {
  let count = 0
  return () => ++count
}
const c = counter()
c(); c(); c()  // 3
```

**Ứng dụng:** data privacy, currying, module pattern, memoization, event handler.

📖 Đào sâu: [01 — Day 19](./A1-core-javascript.md#day-19)

---

### A3. `this` & context

5 quy tắc binding:
1. **Global**: `this = globalThis` (browser: `window`, Node: `global`)
2. **Method call** `obj.fn()` → `this = obj`
3. **`new` call** → `this = instance mới`
4. **Explicit** `fn.call(ctx)` / `apply` / `bind`
5. **Arrow function** → `this` LEXICAL (kế thừa scope cha, không bind được)

```js
const obj = {
  name: 'Harry',
  reg() { return this.name },        // 'Harry'
  arrow: () => this.name              // window.name (undefined trong strict)
}
```

---

### A4. Event Loop

Single-thread JS xử lý task qua **Call Stack** + **Web APIs** + 2 queue:
- **Microtask queue**: `Promise.then`, `queueMicrotask`, `MutationObserver`
- **Macrotask queue**: `setTimeout`, `setInterval`, I/O, UI event

**Thứ tự mỗi tick:** chạy hết microtask → 1 macrotask → render → lặp.

```js
console.log(1)
setTimeout(() => console.log(2), 0)
Promise.resolve().then(() => console.log(3))
console.log(4)
// Output: 1, 4, 3, 2
```

---

### A5. Promise — các state & method

**States:** `pending` → `fulfilled` hoặc `rejected` (sealed sau đó).

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('ok'), 1000)
})

Promise.all([p1, p2])         // fail-fast, trả array kết quả
Promise.allSettled([p1, p2])  // chờ hết, trả {status, value/reason}
Promise.race([p1, p2])        // cái nào xong/fail trước thắng
Promise.any([p1, p2])         // cái nào fulfill trước thắng
```

---

### A6. So sánh Promise vs async/await

| | Promise (.then) | async/await |
|---|---|---|
| Cú pháp | chain `.then().catch()` | giống synchronous |
| Error | `.catch()` | `try/catch` |
| Debug | stack trace khó đọc | dễ hơn (giống sync) |
| Sequential | dễ nhầm nested | tự nhiên |
| Parallel | `Promise.all` | `await Promise.all([])` |
| Bản chất | đối tượng | sugar trên Promise |

```js
// Promise chain
fetch(url).then(r => r.json()).then(d => use(d)).catch(handleErr)

// Async/await
async function load() {
  try {
    const r = await fetch(url)
    const d = await r.json()
    use(d)
  } catch (e) { handleErr(e) }
}
```

⚠️ **Pitfall:** quên `await` trong loop → chạy parallel ngoài ý muốn; ngược lại `for + await` tuần tự khi không cần → chậm.

---

### A7. Code: chuyển async/await ↔ promise

**Async/await:**
```js
async function getUser(id) {
  const res = await fetch(`/users/${id}`)
  if (!res.ok) throw new Error('not found')
  return res.json()
}
```

**Tương đương Promise:**
```js
function getUser(id) {
  return fetch(`/users/${id}`).then(res => {
    if (!res.ok) throw new Error('not found')
    return res.json()
  })
}
```

---

### A8. Các dạng function asynchronous trong JS

1. **Callback** — function truyền vào để gọi sau (legacy, dễ callback hell)
   ```js
   fs.readFile('a.txt', (err, data) => {})
   ```
2. **Promise** — chainable
3. **async/await** — sugar
4. **Generator** + co/redux-saga — yield async value
   ```js
   function* gen() { const r = yield fetch(url) }
   ```
5. **Observable** (RxJS) — stream nhiều giá trị theo thời gian
6. **EventEmitter / EventTarget** — pub-sub

---

### A9. Phân biệt `==` vs `===`

- `==` **loose** — coerce kiểu trước khi so sánh (`1 == '1'` → true)
- `===` **strict** — so sánh cả type + value, không coerce
- ✅ **Luôn dùng `===`** trừ khi cố ý check null/undefined: `x == null` (true cho cả 2)

```js
0 == false      // true
'' == 0         // true
null == undefined  // true
NaN === NaN     // false → dùng Number.isNaN()
```

---

### A10. Phân biệt `null` vs `undefined`

- `undefined`: biến chưa được gán, function không return, param thiếu
- `null`: gán có chủ ý — "không có giá trị"
- `typeof undefined === 'undefined'`, `typeof null === 'object'` (bug lịch sử)
- `null == undefined` → true, `null === undefined` → false

---

### A11. Toán tử `??` vs `||`

- `||` — short-circuit khi **falsy** (`0`, `''`, `null`, `undefined`, `NaN`, `false`)
- `??` — short-circuit **chỉ khi null/undefined** (giữ được `0`, `''`)

```js
const port = userInput || 3000    // userInput = 0 → trả 3000 ❌
const port = userInput ?? 3000    // userInput = 0 → trả 0 ✅
```

📖 Đào sâu: [01 — Day 3, Day 4](./A1-core-javascript.md#day-3)

---

### A12. Optional chaining `?.`

```js
user?.profile?.avatar          // undefined nếu user/profile null
arr?.[0]
fn?.(arg)
```
Kết hợp `?? ` cho default an toàn.

---

### A13. Cách handle error log trên async function

```js
// 1. try/catch
async function load() {
  try { await api() } catch (e) { logger.error(e) }
}

// 2. .catch
load().catch(e => logger.error(e))

// 3. Global handler
window.addEventListener('unhandledrejection', e => logger.error(e.reason))
// Node: process.on('unhandledRejection', ...)

// 4. Wrapper
const safe = fn => (...a) => fn(...a).catch(e => logger.error(e))
```

> 💡 Best practice: log với context (userId, requestId, stack), không log token/PII.

---

<a id="b-browser-dom"></a>
## Phần B — Browser & DOM

### B1. Browser hoạt động như thế nào?

**Quy trình render 1 trang web:**
1. **Network**: DNS → TCP → TLS → HTTP request → response
2. **Parse HTML** → **DOM tree**
3. **Parse CSS** → **CSSOM tree**
4. **DOM + CSSOM** → **Render tree** (chỉ phần visible)
5. **Layout** (reflow): tính toán vị trí, kích thước
6. **Paint**: vẽ pixel
7. **Composite**: gộp layer (GPU)

**Critical Rendering Path** — tối ưu = giảm thời gian từ bước 1 đến pixel hiển thị.

**Process model của Chrome:** multi-process — Browser process, Renderer process (mỗi tab), GPU, Network, Utility.

---

### B2. DOM Event

**Event phase:**
1. **Capturing** — từ window → target
2. **Target** — tại element
3. **Bubbling** — target → window (default)

```js
el.addEventListener('click', fn)            // bubble phase
el.addEventListener('click', fn, true)      // capture phase
el.addEventListener('click', fn, { once: true, passive: true })
```

---

### B3. Event Bubbling là gì?

Event bắn ở element con sẽ "nổi" lên dần các parent. Dùng để **event delegation** — gắn 1 listener trên parent, xử lý hết children → tiết kiệm memory.

```js
list.addEventListener('click', e => {
  const item = e.target.closest('.item')
  if (item) handle(item.dataset.id)
})

// Chặn bubble
e.stopPropagation()
e.stopImmediatePropagation()  // cũng stop các listener khác cùng element
e.preventDefault()             // chặn default action (form submit, link nav)
```

---

### B4. HTML rendering — render-blocking gì?

- **HTML parse** bị **block bởi CSS** trong `<head>` (CSSOM build trước)
- **Script `<script>`** block parse → dùng `defer` / `async` / `type="module"`
- `<link rel="preload">` để load asset critical sớm

```html
<link rel="stylesheet" href="critical.css">       <!-- block render -->
<link rel="preload" href="hero.webp" as="image">
<script src="app.js" defer></script>              <!-- ko block -->
```

---

### B5. So sánh `localStorage` vs `sessionStorage` vs `Cookie`

| | localStorage | sessionStorage | Cookie |
|---|---|---|---|
| Size | ~5–10MB | ~5–10MB | ~4KB |
| Persist | đến khi xóa | đến khi tab đóng | có expiry |
| Gửi mỗi request | ❌ | ❌ | ✅ (auto) |
| API | sync | sync | sync, parse string |
| Use | UI prefs | wizard state | auth session, CSRF token |

**Khi nào dùng gì:**
- Login JWT → **httpOnly cookie** (XSS ko đọc được) > localStorage
- Theme, language → localStorage
- Form draft trong 1 phiên → sessionStorage

📖 Đào sâu: [01 — Day 17](./A1-core-javascript.md#day-17), [04 — Security](./B2-web-performance-security.md#authn)

---

### B6. Web Component là gì?

Standard browser API để tạo custom HTML element tái sử dụng, không cần framework:
- **Custom Elements** — `class extends HTMLElement`, `customElements.define()`
- **Shadow DOM** — encapsulate style + markup (không leak CSS)
- **HTML Templates** — `<template>`, `<slot>`

```js
class MyButton extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `<style>button{color:red}</style><button><slot/></button>`
  }
}
customElements.define('my-button', MyButton)
// <my-button>Click</my-button>
```

**Lib:** Lit, Stencil, FAST. Hữu ích cho design system cross-framework.

---

<a id="c-react"></a>
## Phần C — React & State Management

### C1. Class Component vs Functional Component

| | Class | Functional + Hooks |
|---|---|---|
| Syntax | `class extends React.Component` | function |
| State | `this.state` / `setState` | `useState` |
| Lifecycle | `componentDidMount` ... | `useEffect` |
| Code reuse | HOC, Render props | Custom hooks ⭐ |
| `this` | có (binding rườm rà) | không |
| Tree-shake | kém hơn | tốt hơn |
| Modern React | legacy support | ✅ default |

⭐ **2026:** chỉ dùng functional + hooks. Class chỉ gặp khi maintain code cũ.

---

### C2. Cơ chế so sánh props cũ/mới (Reconciliation)

- React dùng **Virtual DOM diffing**.
- Mỗi render → tạo VDOM mới → so với cây cũ.
- **Same type element** → update props, recurse children.
- **Different type** → unmount cũ, mount mới.
- **List**: dùng `key` để track item. Key đúng → reorder rẻ; key sai (index) → re-render thừa.
- `React.memo(Component)` so sánh props bằng **shallow equal** (===) — nếu equal thì skip render.

```jsx
const Row = React.memo(({ user }) => <div>{user.name}</div>)
// Nếu prop `user` là object mới mỗi render → memo ko hiệu quả → cần useMemo
```

---

### C3. React Profiler

Tool đo render time của component.

```jsx
import { Profiler } from 'react'
<Profiler id="Feed" onRender={(id, phase, actualDuration) => log({id,phase,actualDuration})}>
  <Feed />
</Profiler>
```
Hoặc dùng **React DevTools → Profiler tab** (UI flame chart).

---

### C4. React Hooks — tất cả

| Hook | Mục đích |
|---|---|
| `useState` | local state |
| `useEffect` | side effect sau commit |
| `useLayoutEffect` | side effect đồng bộ trước paint |
| `useRef` | giữ reference / mutable value không trigger render |
| `useMemo` | memo value tính toán đắt |
| `useCallback` | memo function reference |
| `useContext` | đọc context |
| `useReducer` | state phức tạp kiểu Redux |
| `useImperativeHandle` | expose ref methods từ child |
| `useId` | unique id (a11y) |
| `useTransition` | đánh dấu update non-urgent |
| `useDeferredValue` | defer giá trị cho concurrent render |
| `useSyncExternalStore` | subscribe store ngoài React |

📖 Chi tiết: [03 — Hooks](./A3-core-react.md#hooks)

---

### C5. React Lifecycle (functional với useEffect)

```jsx
useEffect(() => {
  // componentDidMount + componentDidUpdate
  return () => {
    // componentWillUnmount + cleanup trước update
  }
}, [deps])
```

| Lifecycle (class) | Hooks equivalent |
|---|---|
| `componentDidMount` | `useEffect(fn, [])` |
| `componentDidUpdate` | `useEffect(fn, [deps])` |
| `componentWillUnmount` | `return () => {}` trong useEffect |
| `getDerivedStateFromProps` | đặt logic trong render hoặc useMemo |
| `shouldComponentUpdate` | `React.memo` + custom equal |
| `componentDidCatch` | `ErrorBoundary` (vẫn dùng class) |

---

### C6. Custom Hooks — bạn đã viết hooks nào?

Custom hook = function bắt đầu bằng `use*`, dùng built-in hook bên trong, tách logic tái sử dụng.

```jsx
function useDebounce(value, ms = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then(r => r.json())
      .then(data => !cancelled && setState({data, loading:false, error:null}))
      .catch(error => !cancelled && setState({data:null, loading:false, error}))
    return () => { cancelled = true }
  }, [url])
  return state
}
```

Hook hay dùng: `useDebounce`, `usePrevious`, `useToggle`, `useLocalStorage`, `useOnlineStatus`, `useClickOutside`, `useMediaQuery`.

---

### C7. Context API

```jsx
const ThemeContext = createContext('light')

function App() {
  const [theme, setTheme] = useState('dark')
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <Page />
    </ThemeContext.Provider>
  )
}

function Button() {
  const { theme } = useContext(ThemeContext)
  return <button className={theme}>...</button>
}
```

⚠️ **Pitfall:** mỗi lần value đổi → toàn bộ consumer re-render. **Tách context** theo concern (Theme, Auth, Locale riêng) hoặc dùng selector library.

---

### C8. Redux & Code Splitting Reducer

**Redux flow:** `Component → dispatch(action) → middleware → reducer → store → re-render`.

**Modern Redux** = **Redux Toolkit (RTK)**:
```js
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counter = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    inc: s => { s.value++ }   // Immer cho phép "mutate"
  }
})
const store = configureStore({ reducer: { counter: counter.reducer } })
```

**Code splitting reducer (lazy slice):**
```js
// store.js
const store = configureStore({ reducer: staticReducers })
store.asyncReducers = {}
store.injectReducer = (key, reducer) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(combineReducers({ ...staticReducers, ...store.asyncReducers }))
}

// Trong feature module
import('./featureSlice').then(({ reducer }) => store.injectReducer('feature', reducer))
```

**Redux detect change ở đâu để KHÔNG ảnh hưởng toàn store?**
- Redux dùng **`===` shallow** trên slice → reducer phải **trả state object MỚI** khi đổi (immutable). Nếu bạn mutate trực tiếp → React không re-render.
- `useSelector(state => state.user.name)` chỉ trigger re-render khi return value đổi (===).
- RTK + Immer cho phép viết code "mutate" mà ngầm tạo object mới.

📖 Đào sâu: [02 — State](./A2-core-architecture-patterns.md#state), [03 — State mgmt](./A3-core-react.md#state-mgmt)

---

### C9. State Management — chọn cái nào?

| Tool | Use case |
|---|---|
| `useState` + lift | local |
| `Context` | theme, auth (thấp tần suất đổi) |
| **Zustand** ⭐ | global vừa, ít boilerplate |
| **Jotai** | atomic state |
| **Redux Toolkit** | enterprise, devtools, middleware mạnh |
| **TanStack Query** ⭐ | server cache (luôn nên có nếu app fetch) |
| **MobX** | reactive OOP |
| **XState** | flow phức tạp, state machine |

Combo 2026: **Zustand + TanStack Query** (đa số) hoặc **RTK + RTK Query** (enterprise).

---

### C10. Render Conditional

```jsx
{loading && <Spinner />}
{user ? <Profile /> : <Login />}
{count > 0 && <Badge n={count} />}
{items.length === 0 ? <Empty /> : items.map(...)}
```

⚠️ `{count && <Badge/>}` — nếu `count = 0` sẽ render `0` (số 0 là valid React node). Dùng `count > 0 && ...` hoặc `!!count && ...`.

---

### C11. Gửi 1 function từ màn A qua màn B (React Navigation)

3 cách:
1. **Param** (không khuyến nghị — serialization warning, lose ref khi deep link)
   ```jsx
   navigation.navigate('B', { onDone: () => {} })
   ```
2. **Navigation event** (recommended) — emit từ B, listen ở A
   ```jsx
   navigation.navigate('B')
   // B
   navigation.getParent()?.emit({ type: 'done', data: ... })
   ```
3. **Global state / Context / Zustand** — B dispatch, A select state
   ```jsx
   useStore.setState({ resultFromB: data })
   ```
4. **Callback qua ref / EventEmitter** (RN: `DeviceEventEmitter`)

> Recommended: 2 hoặc 3 (clean, scalable, deep-link safe).

---

### C12. Làm sao để KHÔNG goBack từ Home về Login (React Navigation)

```jsx
// Sau khi login thành công → reset stack
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }]
})

// Hoặc cấu trúc: Auth navigator ↔ App navigator switch tùy isAuthenticated
{isAuthenticated ? <AppStack /> : <AuthStack />}

// Hoặc disable gesture + header back
<Stack.Screen name="Home" options={{ gestureEnabled: false, headerLeft: () => null }} />
```

Recommended: cấu trúc 2 navigator switch — cleanest.

---

### C13. React Router (web)

```jsx
// v6+
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/users/:id" element={<UserDetail />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

const { id } = useParams()
const nav = useNavigate()
nav('/users/1', { replace: true, state: {...} })
```

**Data router** (v6.4+): `createBrowserRouter`, `loader`, `action`, `useLoaderData` — fetch song song trước render.

---

<a id="d-build-perf"></a>
## Phần D — Build Tools, Bundling & Performance

### D1. Webpack config cần những gì?

```js
module.exports = {
  mode: 'production',                // dev | production
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true
  },
  resolve: { extensions: ['.js','.jsx','.ts','.tsx'], alias: { '@': '/src' } },
  module: {
    rules: [
      { test: /\.[jt]sx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg)$/, type: 'asset' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html' }),
    new MiniCssExtractPlugin(),
    new DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') })
  ],
  optimization: {
    splitChunks: { chunks: 'all' },
    runtimeChunk: 'single',
    minimize: true
  },
  devServer: { port: 3000, hot: true, historyApiFallback: true }
}
```

**Modern alternative:** **Vite** (esbuild + Rollup) cho dev nhanh + bundle Rollup.

---

### D2. Chunk là gì? Khi nào cần split? Dựa vào gì?

**Chunk** = file JS được tách ra từ bundle gốc → tải song song / lazy.

**Khi nào split:**
- Route khác nhau (mỗi page 1 chunk)
- Vendor (3rd-party) tách riêng → cache lâu
- Component nặng (chart, editor) chỉ load khi cần
- Polyfill conditional

**Dựa vào:**
- `import()` dynamic → tự động chunk
- `React.lazy(() => import('./Page'))`
- Webpack `splitChunks` config (cacheGroups: vendors, common)

```js
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: { test: /node_modules/, name: 'vendor', chunks: 'all' },
      common: { minChunks: 2, name: 'common', chunks: 'all', priority: 10 }
    }
  }
}
```

---

### D3. Cách monitor bundle

- **webpack-bundle-analyzer** — visual treemap
- **source-map-explorer** — phân tích source map
- **Vite**: `rollup-plugin-visualizer`
- **RN**: `npx react-native-bundle-visualizer`
- **size-limit** / **bundlewatch** — fail CI nếu vượt threshold
- **statoscope** — diff bundle giữa các build

```json
"size-limit": [
  { "path": "dist/*.js", "limit": "200 KB" }
]
```

---

### D4. Tree Shaking

Loại bỏ code không dùng (dead code elimination) lúc build, dựa trên **ESM static imports**.

**Điều kiện:**
- Code phải dùng `import/export` (ESM), không `require`
- `package.json`: `"sideEffects": false` (hoặc liệt kê file có side effect như `.css`)
- Bundler bật minify (Terser/swc)

```js
// ✅ tree-shakeable
import { debounce } from 'lodash-es'

// ❌ import cả lib
import _ from 'lodash'
```

---

### D5. Lazy Load

**Web:**
```jsx
const Heavy = lazy(() => import('./Heavy'))
<Suspense fallback={<Spinner/>}><Heavy /></Suspense>

// Image
<img src="..." loading="lazy" decoding="async" />

// Route-based với React Router
<Route path="/settings" element={<lazy>Settings</lazy>} />
```

**RN:**
- `React.lazy` + Suspense (RN 0.65+)
- Inline `require()` cho native module heavy
- Navigation: screen mounted khi navigate (lazy by default)

---

### D6. Loader vs Plugin (webpack) khác nhau như thế nào?

| | Loader | Plugin |
|---|---|---|
| Mục đích | **transform 1 file** (CSS → JS, JSX → JS) | **mở rộng quy trình build** (extract, inject, optimize) |
| Cấu hình | `module.rules` | `plugins: [...]` |
| Scope | per-file | whole build lifecycle |
| Ví dụ | `babel-loader`, `css-loader`, `ts-loader` | `HtmlWebpackPlugin`, `MiniCssExtractPlugin`, `DefinePlugin` |
| Chạy khi | file match test | hook vào event của compiler |

---

### D7. CDN & Caching

**CDN** (CloudFront, Cloudflare, Fastly): cache asset ở edge gần user → giảm latency.

**Strategy:**
- Asset có hash (`app.abc123.js`) → `Cache-Control: public, max-age=31536000, immutable`
- HTML → `Cache-Control: no-cache` (revalidate mỗi lần)
- Versioning qua filename hash (auto khi build)

**Cache layer:**
1. Browser cache
2. Service Worker (PWA, offline)
3. CDN edge
4. Reverse proxy (Varnish)
5. App cache (Redis)
6. DB cache

📖 Đào sâu: [04 — Caching](./B2-web-performance-security.md#caching)

---

### D8. Tại sao đã uglify (minify) code, browser vẫn xem được?

JavaScript chạy trong browser **bắt buộc** ở dạng plain text — engine cần đọc & compile. Uglify chỉ làm:
- Đổi tên biến `userName` → `a`
- Bỏ whitespace, comment
- Inline function nhỏ

→ **Không phải encryption.** Có thể beautify ngược (`prettier`, devtools "Pretty print {}").

**Muốn bảo vệ logic:**
- Đẩy logic lên backend (chỉ expose API)
- **Obfuscation** mạnh (`javascript-obfuscator`) — chậm, không phải bullet-proof
- WASM compile từ Rust/C++ — khó reverse hơn nhưng vẫn dump được
- Source map: KHÔNG upload `.map` production hoặc đặt sau auth (Sentry private)

---

### D9. Cải thiện scroll performance — các cách

1. **Virtualize list dài** — `react-window` / `react-virtual` / `FlashList` (RN)
2. **`will-change: transform`** cho element animate (kích GPU layer)
3. **`transform: translate3d(0,0,0)`** thay vì `top/left` (compositor-only, không reflow)
4. **Passive listener**: `addEventListener('scroll', fn, { passive: true })`
5. **Throttle / debounce** scroll handler
6. **`content-visibility: auto`** (CSS) — skip render off-screen
7. **Avoid layout thrashing** — đọc layout xong rồi mới write
8. **Đơn giản hóa DOM** — bớt nested, bớt CSS phức tạp
9. **Lazy image** + đúng `width/height` để tránh CLS
10. **`requestAnimationFrame`** cho animation custom

---

### D10. Layout vs Paint vs Composite

3 phase render frame của browser:
1. **Layout (Reflow)** — tính toán vị trí, kích thước (đổi `width`, `top`, font-size... trigger)
2. **Paint** — vẽ pixel của element (đổi `color`, `background`, `box-shadow` trigger)
3. **Composite** — gộp layer trên GPU (đổi `transform`, `opacity` chỉ trigger composite)

→ Animation chỉ `transform` + `opacity` = mượt 60fps. Đổi `top`/`width` = chậm.

---

<a id="e-security"></a>
## Phần E — Security FE

### E1. Các lỗi security FE phổ biến & cách phòng

| Lỗi | Mô tả | Phòng |
|---|---|---|
| **XSS** | Inject script vào page | Escape output, CSP, không innerHTML user data |
| **CSRF** | Site lạ submit form thay user | SameSite cookie, CSRF token, kiểm Origin |
| **Clickjacking** | Iframe lừa click | `X-Frame-Options: DENY` / `frame-ancestors 'none'` |
| **Open Redirect** | Redirect tới URL độc | Whitelist domain |
| **Sensitive data leak** | Token trong URL, console.log | Header, không log |
| **Insecure storage** | JWT trong localStorage | httpOnly cookie |
| **Mixed content** | HTTPS page load HTTP asset | Force HTTPS, upgrade-insecure-requests CSP |
| **Vulnerable deps** | npm package CVE | `npm audit`, Dependabot |

📖 Đào sâu: [04 — Security](./B2-web-performance-security.md#owasp)

---

### E2. Làm sao để textbox chống XSS?

**Nguyên tắc:** Trust no input. Sanitize ở cả client + server.

**Client (React):**
- JSX **auto escape** text — `<div>{userInput}</div>` an toàn
- ❌ TRÁNH `dangerouslySetInnerHTML` với user data
- Nếu cần render HTML (rich text): sanitize bằng **DOMPurify**
  ```js
  import DOMPurify from 'dompurify'
  <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(html)}} />
  ```
- Validate input pattern (regex, length, charset) trước khi submit
- Schema validation: **Zod** / **Yup**
  ```ts
  const Schema = z.string().min(1).max(200).regex(/^[a-z0-9\s]+$/i)
  ```

**Server (luôn validate lại):**
- Whitelist > Blacklist
- Sanitize HTML server-side (sanitize-html lib)
- Output escape theo context (HTML, attribute, JS, URL)

**Headers:**
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-xxx'`
- `X-Content-Type-Options: nosniff`

---

### E3. JWT — session hay cookies để lưu?

Câu hỏi gốc: *"Login function với JWT — dùng session hay cookies?"*

**Trả lời an toàn nhất:** **httpOnly Secure SameSite cookie**.

| | localStorage | httpOnly Cookie |
|---|---|---|
| XSS đọc được? | ✅ (NGUY HIỂM) | ❌ |
| Tự gửi mỗi request | ❌ (phải set header thủ công) | ✅ |
| CSRF risk | ❌ | ✅ → cần SameSite + CSRF token |
| Cross-domain API | dễ hơn | cần CORS với credentials |

```
Set-Cookie: token=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900
```

**Refresh token rotation:** access ngắn (15p) + refresh dài hơn (7d) trong httpOnly cookie, mỗi lần refresh → cấp cặp mới, invalidate cũ.

📖 [04 — JWT](./B2-web-performance-security.md#jwt)

---

### E4. Session vs Cookie — khác nhau?

- **Cookie**: cơ chế lưu **dữ liệu nhỏ ở client**, gửi kèm request (tự động). Có thể chứa bất cứ gì.
- **Session**: khái niệm **phiên user trên server**. Server tạo session ID, gửi ID đó về client (thường qua cookie). Data session lưu ở server (memory, Redis, DB).

→ Cookie là vận chuyển, session là dữ liệu. Hai thứ khác nhau, thường kết hợp ("session cookie" = cookie chứa session ID).

---

<a id="f-testing"></a>
## Phần F — Testing

### F1. Dùng gì để viết Unit Test?

**Stack 2026:**
- **Jest** (default RN/Next/CRA) hoặc **Vitest** (Vite, nhanh hơn)
- **React Testing Library** (web) / **@testing-library/react-native** (RN)
- **MSW** — mock API ở network layer
- **jest-axe** — a11y
- E2E: **Playwright** (web), **Maestro** (RN ⭐)

```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('add to cart', async () => {
  const user = userEvent.setup()
  render(<Product />)
  await user.click(screen.getByRole('button', { name: /add/i }))
  expect(screen.getByText(/in cart/i)).toBeInTheDocument()
})
```

📖 Đào sâu: [05 — Testing](./A5-core-testing.md)

---

### F2. Truy xuất element trong snapshot

**Snapshot test:**
```ts
const { container } = render(<App />)
expect(container).toMatchSnapshot()
```

**Truy element trong snapshot (rendered tree):**
```ts
// Bằng RTL queries
screen.getByRole('button', { name: 'Submit' })
screen.getByTestId('user-card')
screen.findByText(/loading.../)

// Hoặc direct DOM
container.querySelector('.btn-primary')
within(container).getByRole('list')
```

Snapshot inline (dễ review trong PR):
```ts
expect(node).toMatchInlineSnapshot(`<div>Hi</div>`)
```

---

### F3. Test custom hooks

```ts
import { renderHook, act } from '@testing-library/react'

test('useCounter', () => {
  const { result } = renderHook(() => useCounter(5))
  expect(result.current.count).toBe(5)
  act(() => result.current.inc())
  expect(result.current.count).toBe(6)
})

// Async
test('useFetch', async () => {
  const { result } = renderHook(() => useFetch('/api/x'))
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.data).toEqual({...})
})

// Với provider
renderHook(() => useTheme(), { wrapper: ThemeProvider })
```

---

### F4. Các cách mock modules

```ts
// 1. Auto mock
jest.mock('axios')
import axios from 'axios'
;(axios.get as jest.Mock).mockResolvedValue({ data: {...} })

// 2. Factory
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1 })
}))

// 3. Partial mock
jest.mock('./service', () => ({
  ...jest.requireActual('./service'),
  expensiveFn: jest.fn().mockReturnValue(1)
}))

// 4. Manual mock — __mocks__/axios.ts
// File next to module, auto picked

// 5. MSW — network level (recommended cho API)
const server = setupServer(
  http.get('/api/users', () => HttpResponse.json([...]))
)

// 6. Mock module trong RN
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
```

---

### F5. `jest.fn` vs `jest.spyOn` vs `jest.mock`

| | Dùng khi | Restore |
|---|---|---|
| `jest.fn()` | Tạo function mock **đứng riêng** (callback, prop) | tự, scoped |
| `jest.spyOn(obj, 'method')` | Theo dõi/thay method có sẵn **trên object cụ thể** — vẫn gọi real implementation mặc định | `.mockRestore()` để khôi phục |
| `jest.mock('module')` | Replace **toàn module** | reset bằng `jest.resetModules()` |

```ts
// jest.fn
const cb = jest.fn()
arr.forEach(cb)
expect(cb).toHaveBeenCalledTimes(3)

// jest.spyOn — verify call nhưng giữ behavior thật
const spy = jest.spyOn(console, 'log').mockImplementation()
foo()
expect(spy).toHaveBeenCalledWith('hi')
spy.mockRestore()

// jest.mock — replace toàn module
jest.mock('./db')
import { save } from './db'  // → mock
```

---

<a id="g-git-deploy"></a>
## Phần G — Git, Deploy, CI/CD

### G1. Git Flow — merge, deploy, branch

**Models:**
- **GitFlow** (nặng): `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`
- **GitHub Flow** ⭐ (recommended): `main` + short-lived `feature/*`, PR merge
- **Trunk-Based**: thẳng `main`, dùng **feature flag** để giấu code chưa ready

**Merge strategies:**
- **Merge commit** — giữ history đầy đủ, có merge commit
- **Squash merge** ⭐ — gộp PR thành 1 commit (clean history)
- **Rebase + merge** — linear history, mất context PR

---

### G2. `git revert` vs `git reset` vs `git cherry-pick`

```bash
# Revert — tạo commit MỚI undo commit cũ (an toàn cho branch public)
git revert <sha>

# Reset — xóa commit khỏi history (dùng cho local branch chưa push)
git reset --soft <sha>   # giữ thay đổi staged
git reset --mixed <sha>  # giữ thay đổi unstaged (default)
git reset --hard <sha>   # XÓA HẲN ⚠️

# Cherry-pick — copy 1 commit từ branch khác
git cherry-pick <sha>
git cherry-pick <sha1>..<sha3>  # range

# Hotfix flow: cherry-pick fix từ develop → main
```

---

### G3. Feature Flag trong Git

Feature flag = **toggle bật/tắt feature runtime**, không phụ thuộc branch.

**Why:** ship code chưa ready (vào main) mà chưa expose user → trunk-based dev, A/B test, kill switch.

```ts
// Đơn giản
const FLAGS = { newCheckout: process.env.FLAG_NEW_CHECKOUT === '1' }
{FLAGS.newCheckout ? <NewCheckout/> : <OldCheckout/>}

// Production: LaunchDarkly, GrowthBook, Unleash, ConfigCat, Statsig
const { value: showNew } = useFlag('new-checkout')
```

Pattern:
- Đặt tên rõ (`enableXyz`)
- Cleanup flag sau khi rollout 100% (debt sớm dọn)
- Gắn metric theo dõi

---

### G4. Deploy CDN, Caching như nào?

**Deploy static:**
1. Build → `dist/` với asset hash (`app.abc123.js`)
2. Upload lên S3 / object storage
3. Invalidate CDN cache nếu cần (`aws cloudfront create-invalidation`)
4. Serve qua CloudFront / Cloudflare / Fastly

**Cache strategy:**
```
# Asset (có hash)
Cache-Control: public, max-age=31536000, immutable

# HTML
Cache-Control: no-cache, must-revalidate

# API GET (read-mostly)
Cache-Control: public, max-age=60, stale-while-revalidate=300
```

**Purge:** thường KHÔNG cần khi dùng hash filename — file mới = URL mới = miss cache.

---

### G5. Mô tả 1 release cycle của bạn

**Template trả lời:**
> "Team mình theo **2-week sprint**. Mỗi sprint plan → dev → PR review → merge `develop` → auto deploy **staging** → QA test → cuối sprint cut **release branch** → smoke test → deploy **prod** sau giờ thấp traffic. Hotfix đi qua nhánh `hotfix/*` thẳng từ main, cherry-pick vào develop. Mọi PR phải pass: lint, typecheck, test, bundle size check. CI dùng GitHub Actions, deploy qua Vercel/EAS. Có monitoring Sentry + Datadog, rollback nhanh qua re-deploy build trước."

Điều chỉnh theo project thực tế của bạn.

---

### G6. CI/CD

**Pipeline chuẩn:**
1. Install deps (cached)
2. Lint (ESLint)
3. Typecheck (`tsc --noEmit`)
4. Test (unit + integration) — fail nếu coverage < threshold
5. Build
6. Bundle size check (`size-limit`)
7. E2E (preview deploy hoặc test build)
8. Deploy staging tự động
9. Deploy prod sau approval (gated)

**Tools:**
- CI: GitHub Actions, GitLab CI, CircleCI, Bitrise (mobile), EAS (Expo)
- Deploy: Vercel, Netlify, Cloudflare Pages, Fly.io, Railway, AWS
- Mobile: EAS Build + EAS Submit + EAS Update (OTA)

---

<a id="h-ts-style"></a>
## Phần H — TypeScript & Styling

### H1. Bạn đã dùng TypeScript chưa?

Đáp án mẫu — nói về:
- Bật `strict: true`, dùng `noUncheckedIndexedAccess`
- Type props component, return type của hook
- **Discriminated union** cho state (`{status:'idle'} | {status:'loading'} | {status:'success', data}`)
- **Utility types**: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters`
- Generic component / hook
- **Zod** để parse runtime + infer type: `z.infer<typeof Schema>`
- API codegen từ OpenAPI / GraphQL (`graphql-codegen`)

```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function useAsync<T>(fn: () => Promise<T>): AsyncState<T> { ... }
```

---

### H2. Styled-component đã dùng chưa?

```jsx
import styled from 'styled-components'
const Button = styled.button`
  background: ${p => p.primary ? 'blue' : 'gray'};
  color: white;
  padding: 8px 16px;
`
<Button primary>Click</Button>
```

**Pros:** CSS-in-JS, scoped, dynamic theming.
**Cons:** runtime cost, bundle nặng, không tối ưu cho Server Components.

**Modern alternatives:**
- **Tailwind CSS** ⭐ (utility-first, zero runtime)
- **CSS Modules** (build-time scoped class)
- **Vanilla Extract** (TS, zero runtime)
- **Linaria** (CSS-in-JS but extracted at build)

---

### H3. Cách làm Theme color (như Antd)

**Pattern:**
1. **Design tokens** — biến nguyên tử
   ```ts
   const tokens = {
     color: { primary: '#1677ff', text: '#000', bg: '#fff' },
     spacing: { sm: 8, md: 16 },
     radius: { sm: 4, md: 8 }
   }
   ```
2. **Theme object** light/dark
   ```ts
   const light = { ...tokens, bg: '#fff', text: '#111' }
   const dark = { ...tokens, bg: '#111', text: '#fff' }
   ```
3. **Provider** + Context
   ```tsx
   <ThemeProvider value={isDark ? dark : light}>...
   const theme = useTheme()
   ```
4. **Apply** qua CSS variables (web) hoặc style object (RN)
   ```css
   :root { --color-bg: #fff; --color-text: #111; }
   [data-theme="dark"] { --color-bg: #111; --color-text: #fff; }
   ```
5. **Components** đọc token:
   ```jsx
   <View style={{ backgroundColor: theme.bg }} />
   ```

**Antd cụ thể**: `ConfigProvider` với `theme.token` + `algorithm: theme.darkAlgorithm`.

📖 [02 — Design System](./A2-core-architecture-patterns.md#design-system)

---

<a id="i-mfe"></a>
## Phần I — Micro-frontend

### I1. Micro-frontend là gì?

Áp dụng tư tưởng microservices vào FE: chia 1 app lớn thành nhiều app/module nhỏ, mỗi đội sở hữu 1 phần độc lập.

**Khi nên dùng:** team rất lớn, tech stack khác nhau, deploy độc lập. **Khi KHÔNG:** team nhỏ, app vừa — overhead không đáng.

---

### I2. Cách tổ chức micro-frontend

3 cách chính:

| Cách | Mô tả | Pros | Cons |
|---|---|---|---|
| **Build-time** (npm package) | Mỗi MFE publish package, host bundle | Đơn giản, perf tốt | Coupling deploy |
| **Runtime via iframe** | Mỗi MFE = 1 iframe | Cách ly mạnh nhất | UX kém, communication khó |
| **Module Federation** ⭐ | Webpack 5 share runtime, MFE expose module | Loose coupling, share deps | Setup phức tạp, version skew |

**Tools/Framework:**
- **Module Federation** (Webpack 5, Vite plugin)
- **single-spa** — orchestrator
- **Bit** — component-driven
- **qiankun**, **piral**
- Server-side composition (Edge Side Includes)

```js
// Webpack Module Federation
new ModuleFederationPlugin({
  name: 'host',
  remotes: { catalog: 'catalog@http://cdn.com/catalog/remoteEntry.js' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
})
```

---

### I3. Authorization trong micro-frontend

**Vấn đề:** mỗi MFE cần biết user là ai, quyền gì.

**Patterns:**
1. **Shared auth shell** — host xử lý login, lưu token, expose qua context/event
2. **Token in cookie** (httpOnly) — mọi MFE same-origin tự gửi
3. **BFF (Backend-for-Frontend)** — server gateway, MFE chỉ gọi tương đối
4. **Distribute identity** qua custom event / shared state
5. **JWT verify ở mỗi MFE** — tự decode, không trust client

**Recommended:** Auth shell + BFF + cookie httpOnly + RBAC enforce phía API.

---

### I4. Nhược điểm iframe trong MFE

- **Routing đứt**: URL của iframe không sync với host
- **Communication khó**: chỉ qua `postMessage`, async, không type-safe
- **Style/font/lib trùng lặp** — tải lại trong mỗi iframe
- **A11y kém**: screen reader bối rối
- **SEO/SSR khó**
- **CORS** nếu khác origin
- **UX**: scroll riêng, mất context navigation
- **Auth**: không share session dễ dàng
- **Performance**: mỗi iframe = full browsing context, nặng

→ Iframe chỉ phù hợp khi cần **isolation tuyệt đối** (vd: embed 3rd-party untrusted).

---

### I5. Communication giữa các MFE

1. **Shared state** — Redux global / Zustand / event bus
   ```js
   window.__BUS__ = createBus()
   bus.emit('cart:updated', items)
   bus.on('cart:updated', fn)
   ```
2. **Custom Event** (DOM)
   ```js
   window.dispatchEvent(new CustomEvent('user:logout', { detail: {...} }))
   window.addEventListener('user:logout', e => ...)
   ```
3. **URL/Query params** — shareable, refresh-safe
4. **`postMessage`** (iframe / worker)
5. **BroadcastChannel** — cross-tab
6. **Module Federation shared module** — singleton instance
7. **Backend** làm middleman (write to API, refetch)

---

### I6. Logging/tracking trong MFE — riêng hay chung?

**Recommendation: CHUNG** (shared platform).

**Lý do:**
- 1 user journey trải nhiều MFE — cần correlate trace
- Lưu trữ + alert tập trung
- Schema chung (event name, props) → analyze dễ

**Implementation:**
- 1 shared lib `@shared/analytics` (chung) — wrap Sentry, Amplitude, Datadog
- Inject `correlationId`, `userId`, `mfeName` vào mọi event
- Sampling consistent qua header
- Distributed tracing: W3C Trace Context (`traceparent` header)

**Riêng**: chỉ khi quy định pháp lý/dữ liệu khác nhau (vd: HIPAA module phải tách).

---

<a id="j-css-a11y"></a>
## Phần J — CSS & Accessibility

### J1. CSS Flexbox — `flex-grow`, `flex-shrink`, `flex-basis`

```css
.item { flex: 1 1 200px; /* grow shrink basis */ }
```

- **`flex-grow`** (default 0) — chia phần KHÔNG GIAN THỪA. `grow:2` chiếm gấp đôi `grow:1`.
- **`flex-shrink`** (default 1) — chia phần CO LẠI khi thiếu chỗ. `shrink:0` → ko co.
- **`flex-basis`** (default auto) — kích thước cơ sở trước khi grow/shrink. `auto` = content size, `0` = bắt đầu từ 0.

```
.container { display: flex }
.a { flex: 1 }     /* 1 1 0% — chia đều */
.b { flex: 2 }     /* gấp đôi a */
.c { flex: 0 0 100px }  /* fixed 100px */
```

**Common patterns:**
```css
/* Center */
display: flex; align-items: center; justify-content: center;
/* Space between */
justify-content: space-between;
/* Equal columns */
.col { flex: 1 }
/* Hold sidebar 200px + main flex */
.sidebar { flex: 0 0 200px }
.main { flex: 1 }
```

---

### J2. CSS Specificity

Mức ưu tiên (cao → thấp):
1. `!important` (override hết — tránh dùng)
2. Inline style `style="..."`
3. ID selector `#id` (100)
4. Class / attribute / pseudo-class `.cls, [attr], :hover` (10)
5. Element / pseudo-element `div, ::before` (1)
6. `*` universal (0)

**Tính điểm**: `a, b, c` (id, class, element)
- `#nav .item a` = 1, 1, 1 = 111
- `.btn.primary` = 0, 2, 0 = 20
- `div p` = 0, 0, 2 = 2

→ Style higher specificity thắng. Cùng specificity → cái nào sau thắng.

**Best practice:** dùng class, tránh ID + `!important`. Methodology: BEM, Tailwind, CSS Modules → giảm specificity war.

---

### J3. Accessibility (A11y) — checklist

1. **Semantic HTML**: `<nav>`, `<main>`, `<button>` thay `<div onclick>`
2. **Alt text** cho image, `aria-label` cho icon button
3. **Keyboard navigation**: `tab` qua mọi interactive, focus visible
4. **Color contrast** ≥ 4.5:1 (WCAG AA)
5. **Form labels**: `<label htmlFor>` hoặc `aria-labelledby`
6. **ARIA roles** khi cần (modal: `role="dialog"`, `aria-modal="true"`)
7. **Touch target** ≥ 44×44px (mobile)
8. **Heading order** đúng (h1 → h2 → h3)
9. **Skip link** "Skip to main content"
10. **Reduced motion**: `prefers-reduced-motion`
11. **Screen reader test**: VoiceOver (iOS/Mac), TalkBack (Android), NVDA (Windows)
12. **Tools**: axe DevTools, Lighthouse a11y, jest-axe trong test

**RN:**
```jsx
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Add to cart"
  accessibilityHint="Adds the item to your shopping cart"
>...</Pressable>
```

📖 [05 — A11y testing](./A5-core-testing.md#perf-a11y)

---

### J4. HTML vs XHTML

| | HTML | XHTML |
|---|---|---|
| Standard | SGML-based, lenient | XML-based, strict |
| Tag case | case-insensitive | lowercase REQUIRED |
| Self-close | `<br>` OK | `<br />` REQUIRED |
| Attribute | có thể không quote | phải quote `"value"` |
| Errors | browser cố parse | strict — 1 lỗi = white screen |
| MIME | `text/html` | `application/xhtml+xml` |
| Current | **HTML5** dominant | nearly extinct |

---

<a id="k-rn"></a>
## Phần K — React Native (Mobile)

### K1. `useMemo` / `useCallback` / Hooks

📖 Chi tiết: [03 — Hooks](./A3-core-react.md#hooks)

**Quick recap:**
- `useMemo(fn, deps)` — cache **value** (kết quả tính toán đắt)
- `useCallback(fn, deps)` — cache **function reference**
- ⚠️ Đừng dùng tràn lan: overhead memo có thể lớn hơn lợi ích. Chỉ dùng khi:
  - Tính toán thực sự đắt
  - Pass xuống component đã `React.memo`

---

### K2. Call API trong RN — phương thức nào?

- **`fetch`** (built-in)
- **`axios`** — interceptor, transform, cancel
- **TanStack Query** ⭐ — cache, refetch, dedupe, infinite, optimistic
- **Apollo Client** — GraphQL
- **tRPC client** — type-safe end-to-end
- **RTK Query** — nếu đã dùng Redux Toolkit

**Recommend:** axios/ky làm transport + TanStack Query làm data layer.

```ts
const api = axios.create({ baseURL: API_URL, timeout: 10000 })
api.interceptors.request.use(c => {
  c.headers.Authorization = `Bearer ${getToken()}`
  return c
})
api.interceptors.response.use(r => r, async err => {
  if (err.response?.status === 401) await refreshToken()
  return Promise.reject(err)
})
```

---

### K3. Validation library

- **Zod** ⭐ — TS-first, infer type
- **Yup** — phổ biến với Formik
- **Joi** — Node-leaning
- **Valibot** — nhẹ, modular, tree-shake tốt
- **ArkType** — TS DSL

```ts
import { z } from 'zod'
const Login = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
type LoginForm = z.infer<typeof Login>
```

Kết hợp **React Hook Form** + `zodResolver`.

---

### K4. React New Architecture (RN 0.76+)

- **JSI** (JavaScript Interface): thay bridge, gọi native sync, không serialize JSON → nhanh hơn
- **TurboModules**: native module load lazy
- **Fabric**: render layer mới, đồng bộ với React 18 concurrent (Suspense, transitions work tốt)
- **Hermes**: JS engine (default mới)
- **Codegen**: tự gen native specs từ TS

Bật: `newArchEnabled=true` trong `gradle.properties` / `Podfile`. RN 0.76+ bật mặc định.

---

### K5. Cách giảm size file build

**Android (APK/AAB):**
- Bật **Hermes** (default)
- **Proguard/R8**: minify Java/Kotlin (`enableProguardInReleaseBuilds=true`)
- **ABI splits**: chỉ ship arch user cần (`enableSeparateBuildPerCPUArchitecture=true`)
- Build **AAB** thay APK → Play Store deliver theo device
- Loại bỏ unused locale (`resConfigs "en", "vi"`)
- Nén PNG, dùng WebP cho ảnh
- Inline require, code-split màn không cần ngay

**iOS:**
- Bật **Hermes** + Bitcode (Apple deprecate)
- App Thinning + on-demand resources
- Slice symbol (strip dSYM)

**JS bundle:**
- Tree-shake (ESM, sideEffects)
- Tránh import lib lớn (moment → date-fns)
- Lazy load màn ít dùng
- Asset CDN, không bundle vào app

---

### K6. Config build Android/iOS, Firebase, Notification, Font

**Android (gradle):**
- `android/app/build.gradle`: applicationId, versionCode, versionName, signingConfigs
- `ProGuard rules`: `proguard-rules.pro`
- `AndroidManifest.xml`: permissions, intent filters
- `google-services.json` cho Firebase

**iOS (Xcode/Podfile):**
- `Info.plist`: bundle ID, version, privacy strings (Camera, Location...)
- `Podfile`: deployment target, use_frameworks
- `GoogleService-Info.plist`
- Capabilities: Push, Background Modes, App Groups, Sign in with Apple

**Firebase:**
```bash
npm i @react-native-firebase/app @react-native-firebase/messaging
# iOS: pod install
```

**Notification:**
- Local: `notifee` / `@notifee/react-native`
- Remote: FCM (`@react-native-firebase/messaging`) + APNs setup
- Permission: `messaging().requestPermission()`

**Font:**
- Add `.ttf` vào `assets/fonts/`
- `react-native.config.js`:
  ```js
  module.exports = { assets: ['./assets/fonts/'] }
  ```
- `npx react-native-asset` link
- Hoặc Expo: `useFonts({ Inter: require('./Inter.ttf') })`

---

### K7. Custom hooks + Animation

📖 Chi tiết: [03 — Animation](./A3-core-react.md#animation)

**Animation lib khuyến nghị:**
- **Reanimated 3** ⭐ — chạy UI thread, không block JS
- **react-native-gesture-handler** — gesture
- **Moti** — declarative API trên Reanimated
- **Lottie** — animation phức tạp từ designer

```jsx
const offset = useSharedValue(0)
const style = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }))
const onPress = () => { offset.value = withSpring(100) }
```

---

### K8. Lấy tọa độ (Geolocation)

```ts
import * as Location from 'expo-location'

const { status } = await Location.requestForegroundPermissionsAsync()
if (status !== 'granted') return
const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
// loc.coords: latitude, longitude, accuracy, altitude, speed

// Watch
const sub = await Location.watchPositionAsync(
  { accuracy: Location.Accuracy.High, distanceInterval: 10 },
  position => {}
)
sub.remove()
```

**Background tracking** → cần `background` permission + foreground service (Android) / Significant location changes (iOS). Cẩn thận pin + privacy review store.

---

### K9. Responsive, Debugging, Logcat, DevTools, Expo

**Responsive:**
- `useWindowDimensions()` (re-render khi xoay)
- `Dimensions.get('window')` (snapshot)
- Percentage / flex
- `react-native-responsive-screen` / NativeWind breakpoints

**Debugging:**
- **React Native DevTools** (mới 2024) — Chrome DevTools-like
- **Flipper** (đang deprecate)
- **Reactotron** — network, redux, async storage
- **console.log** + `react-native log-ios` / `log-android`
- **Hermes Sampling Profiler**

**Logcat (Android):**
```bash
adb logcat *:S ReactNative:V ReactNativeJS:V
```

**iOS console:**
```bash
xcrun simctl spawn booted log stream --predicate 'process == "MyApp"'
```

**Expo:**
- Quick start, EAS Build/Submit/Update cloud
- `expo start` → QR scan với Expo Go (no native code)
- **Development build** khi cần native module → vẫn dùng được hot reload
- `npx expo install` — đảm bảo version compatible

---

### K10. Đọc PDF / Video / Webview

- **PDF**: `react-native-pdf`, `react-native-blob-util` (download)
- **Video**: `react-native-video`, `expo-video` ⭐ (2024)
- **Webview**: `react-native-webview`
- **Call API lấy video stream**: nhận URL `.m3u8` (HLS) / `.mpd` (DASH) / `.mp4` từ backend, pass vào component:
  ```jsx
  <Video source={{ uri: 'https://.../master.m3u8' }} controls />
  ```

---

### K11. Sinh trắc học (Biometric)

```ts
import * as LocalAuthentication from 'expo-local-authentication'

const hasHardware = await LocalAuthentication.hasHardwareAsync()
const isEnrolled = await LocalAuthentication.isEnrolledAsync()
const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Confirm to continue',
  fallbackLabel: 'Use passcode'
})
// result.success = true/false
```

**Pattern an toàn:** không lưu pwd, dùng biometric để unlock secret token trong Keychain.

---

### K12. AsyncStorage vs MMKV

| | AsyncStorage | MMKV |
|---|---|---|
| Speed | trung bình | **siêu nhanh** (~30x) |
| Sync API | ❌ async | ✅ sync (cũng có async) |
| Encryption | ❌ | ✅ built-in |
| Size limit | platform default | tốt cho data lớn |
| API | string only | typed (string, number, bool, buffer) |

```ts
// MMKV
import { MMKV } from 'react-native-mmkv'
const storage = new MMKV()
storage.set('user', JSON.stringify(user))
const user = JSON.parse(storage.getString('user') ?? 'null')
```

**Khuyến nghị:** **MMKV** cho mọi project mới. Sensitive token → vẫn dùng Keychain.

---

### K13. CI/CD cho RN

- **EAS Build** (Expo) — cloud, đơn giản
- **Bitrise** — mobile-first
- **Fastlane** — local/CI, build + sign + upload
- **GitHub Actions** + macOS runner (iOS) + Linux (Android)
- **App Center** (đang sunset)

```yaml
# GitHub Actions
- uses: actions/setup-node@v4
- run: npm ci
- run: cd ios && pod install
- run: cd android && ./gradlew assembleRelease
```

---

### K14. Thư viện share app

- **react-native-share** — share text, file, image qua native share sheet
- **expo-sharing** — chỉ share file
- Deep link để app khác mở: `Linking.openURL('whatsapp://send?text=hi')`
- Universal/App Links: custom domain → open app nếu installed

---

### K15. Tracking tọa độ background khi allowed

```ts
// expo-location background
await Location.startLocationUpdatesAsync('TRACKING_TASK', {
  accuracy: Location.Accuracy.High,
  distanceInterval: 50,
  foregroundService: { notificationTitle: 'Tracking', notificationBody: 'Active' }
})

import * as TaskManager from 'expo-task-manager'
TaskManager.defineTask('TRACKING_TASK', ({ data, error }) => {
  // gửi lên server
})
```

⚠️ **Privacy:**
- iOS: cần "Always" permission, App Store sẽ review kỹ
- Android: foreground service notification bắt buộc
- Cẩn thận pin, throttle interval

---

### K16. Thống kê truy cập app

**Analytics:**
- **Firebase Analytics** ⭐ (free, robust)
- **Amplitude** — product analytics mạnh
- **Mixpanel**
- **PostHog** (self-host được)
- **Segment** — router event sang nhiều destination
- **Sentry** — error + perf

```ts
import analytics from '@react-native-firebase/analytics'
await analytics().logEvent('screen_view', { screen: 'Home' })
await analytics().logEvent('purchase', { value: 99, currency: 'USD' })
```

Pattern: **define event schema** chung, không log linh tinh, respect privacy (GDPR consent).

---

### K17. Config ESLint cho RN

```json
{
  "extends": [
    "@react-native",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "error",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

Combo: ESLint + Prettier + Husky + lint-staged + commitlint.

---

### K18. Khác biệt `~` vs `^` trong version library

| Symbol | Ý nghĩa | Ví dụ `1.2.3` cho phép update |
|---|---|---|
| `^1.2.3` | Cùng MAJOR | `1.x.x` (1.2.4, 1.5.0) — KHÔNG 2.x |
| `~1.2.3` | Cùng MINOR | `1.2.x` (1.2.4) — KHÔNG 1.3.0 |
| `1.2.3` | Exact | chỉ 1.2.3 |
| `*` / `latest` | Bất kỳ | ⚠️ tránh |
| `>=1.2.3 <2.0.0` | Range | tương đương `^1.2.3` |

⚠️ **`0.x.x`**: `^0.2.3` chỉ cho phép `0.2.x` (vì 0.x coi mỗi minor là breaking).

**Best practice:** dùng `^` cho lib stable, `~` cho lib breaking thường xuyên, pin exact cho RN core và critical native lib (tránh skew).

---

### K19. Cách load 1 list lớn

📖 Chi tiết: [03 — RN Perf](./A3-core-react.md#rn-perf)

**Quick recap:**
- ❌ `items.map()` → render hết
- ✅ `<FlatList>` — virtualization
- 🚀 `<FlashList>` (Shopify) — nhanh hơn nhiều
- Setup: `estimatedItemSize`, `keyExtractor`, `getItemLayout` (nếu cố định)
- `removeClippedSubviews`, `initialNumToRender`, `windowSize`
- Pagination: `onEndReached` + `onEndReachedThreshold`
- Memo `renderItem` + `Item` component

```jsx
<FlashList
  data={items}
  estimatedItemSize={80}
  renderItem={renderItem}
  keyExtractor={i => i.id}
  onEndReached={fetchMore}
  onEndReachedThreshold={0.5}
/>
```

---

<a id="l-coding"></a>
## Phần L — Coding Challenges

### L1. PhoneInput component

> **Yêu cầu:** Chỉ chấp nhận số, auto format `(123)456-7890`. Thêm `(` khi nhập ký tự thứ 4, `-` trước ký tự thứ 7. Xử lý khi user xóa giữa.

```tsx
import { useState, useRef, ChangeEvent } from 'react'

function formatPhone(digits: string) {
  const d = digits.slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0, 3)})${d.slice(3)}`
  return `(${d.slice(0, 3)})${d.slice(3, 6)}-${d.slice(6)}`
}

function digitsBeforeCaret(value: string, caret: number) {
  return value.slice(0, caret).replace(/\D/g, '').length
}

function caretFromDigitIndex(formatted: string, digitIdx: number) {
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) count++
    if (count === digitIdx) return i + 1
  }
  return formatted.length
}

export function PhoneInput() {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const oldCaret = input.selectionStart ?? 0
    const digitIdx = digitsBeforeCaret(input.value, oldCaret)

    const digits = input.value.replace(/\D/g, '')
    const formatted = formatPhone(digits)
    setValue(formatted)

    // Restore caret sau format
    requestAnimationFrame(() => {
      const newCaret = caretFromDigitIndex(formatted, digitIdx)
      ref.current?.setSelectionRange(newCaret, newCaret)
    })
  }

  return <input ref={ref} value={value} onChange={onChange} placeholder="(123)456-7890" />
}
```

**Trả lời follow-up:** *"Caret có nhảy về cuối khi xóa giữa không?"* → KHÔNG, đoạn `caretFromDigitIndex` + `setSelectionRange` giữ caret đúng vị trí digit hiện tại.

---

### L2. List numbering (1, 1.1, 1.1.1) cho nested `<ol>`

> Render danh sách nested với numbering kiểu `1.`, `2.1.`, `2.2.3.` màu `#f44336`, cách 1 space.

```css
ol { list-style: none; counter-reset: item; padding-left: 16px; }
li { counter-increment: item; }
li::before {
  content: counters(item, ".") " ";
  color: #f44336;
}
```

→ `counters(item, ".")` tự nối theo cấp lồng: `1`, `1.1`, `1.1.1`...

**Demo HTML:**
```html
<ol>
  <li>BFE.dev</li>
  <li>JavaScript
    <ol>
      <li>TypeScript</li>
      <li>Framework
        <ol>
          <li>React</li>
          <li>Vue.js</li>
        </ol>
      </li>
    </ol>
  </li>
  <li>CSS</li>
</ol>
```

---

### L3. In A, B, C cách 1s — Promise & async/await

**Setup:**
```js
const getPromise = value => new Promise(resolve => {
  setTimeout(() => resolve(value), 1000)
})
```

**Promise chain (câu 6 gốc):**
```js
getPromise('A')
  .then(a => { console.log(a); return getPromise('B') })
  .then(b => { console.log(b); return getPromise('C') })
  .then(c => { console.log(c) })
// → A (1s) → B (2s) → C (3s)
```

**async/await (câu 7 gốc — rewrite chuẩn):**
```js
async function print() {
  const a = await getPromise('A'); console.log(a)
  const b = await getPromise('B'); console.log(b)
  const c = await getPromise('C'); console.log(c)
}
print()

// Hoặc với loop
async function print() {
  for (const v of ['A','B','C']) {
    console.log(await getPromise(v))
  }
}
```

> ⚠️ Code đề bài có lỗi typo (`getvalue` thay `getPromise`, `Let` thay `let`, `clg` thay `console.log`). Bản trên là rewrite đúng.

---

<a id="m-quiz"></a>
## Phần M — Code Output Quiz (7 snippets)

### Quiz 1 — Function hoisting

```js
sayHi('hi')
function sayHi(text) { console.log(text) }
```

**Output:** `hi`

**Giải thích:** Function **declaration** được hoist hoàn toàn (cả definition) → gọi trước khai báo OK.
> Nếu là `const sayHi = function(){}` → `ReferenceError: Cannot access 'sayHi' before initialization` (TDZ).

---

### Quiz 2 — `var`, `let` hoisting + reserved word

```js
function sayHi() {
  console.log(name)
  console.log(class)
  var name = 'Lydia'
  let class = 'cntt2019'
}
sayHi()
```

**Output:** `SyntaxError: Unexpected token 'class'`

**Giải thích:**
- `class` là **reserved keyword**, không thể làm tên biến → lỗi syntax NGAY khi parse, code không chạy được dòng nào.
- Nếu đổi `class` → `cls`:
  ```js
  console.log(name)    // undefined  (var hoisted but not initialized)
  console.log(cls)     // ReferenceError (TDZ — let chưa init)
  ```

---

### Quiz 3 — `var` vs `let` trong loop + setTimeout

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// Output: 3, 3, 3
```
**Giải thích:** `var` function-scoped → 1 biến `i` duy nhất. Khi `setTimeout` chạy (sau loop), `i = 3`.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// Output: 0, 1, 2
```
**Giải thích:** `let` block-scoped → mỗi iteration tạo `i` mới, closure giữ giá trị từng iteration.

---

### Quiz 3.5 — Closure với template string

```js
function createIncrement() {
  let count = 0
  function increment() { count++ }
  let message = `Count is ${count}`     // ← evaluate NGAY → "Count is 0"
  function log() { console.log(message) }
  return [increment, log]
}
const [increment, log] = createIncrement()
increment(); increment(); increment()
log()
// Output: "Count is 0"
```

**Giải thích:** `message` là string đã evaluate khi gọi `createIncrement()` (count lúc đó = 0). String là **primitive immutable** — sau đó `count` tăng cũng không ảnh hưởng `message`.

**Fix** nếu muốn lấy count mới nhất:
```js
function log() { console.log(`Count is ${count}`) }
```

---

### Quiz 4 — Reference vs Value

```js
let c = { greeting: 'Hey!' }
let d
d = c
c.greeting = 'Hello'
console.log(d.greeting)
// Output: "Hello"
```

**Giải thích:** Object là **reference type**. `d = c` copy reference (cùng trỏ vào 1 object). Sửa qua `c` → `d` thấy luôn.

> Để copy độc lập: `d = { ...c }` (shallow) hoặc `structuredClone(c)` (deep).

---

### Quiz 5 — useEffect cleanup + closure bug

```jsx
function Counter() {
  const [count, setCount] = React.useState(0)
  let id = null                    // ← khai báo local, reset mỗi render

  const clear = () => {
    window.clearInterval(ref.current)   // ← ref ko tồn tại → undefined.current crash
  }

  React.useEffect(() => {
    id = window.setInterval(() => {
      setCount(c => c + 1)
    }, 2000)
    return clear                   // cleanup
  }, [])

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={clear}>Stop</button>
    </div>
  )
}
```

**What happens when click Stop?**

→ **Crash**: `ref.current` — `ref` không được khai báo → `ReferenceError`.

**Vấn đề thêm:**
- `let id = null` reset mỗi render → ngay cả nếu sửa `ref.current` thành `id`, vẫn không hoạt động vì `clear` ở button capture `id = null` (do component re-render, đóng kín lần render đầu).

**Fix đúng:**
```jsx
function Counter() {
  const [count, setCount] = React.useState(0)
  const idRef = React.useRef<number | null>(null)

  const clear = () => {
    if (idRef.current) {
      window.clearInterval(idRef.current)
      idRef.current = null
    }
  }

  React.useEffect(() => {
    idRef.current = window.setInterval(() => setCount(c => c + 1), 2000)
    return clear
  }, [])

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={clear}>Stop</button>
    </div>
  )
}
```

→ `useRef` giữ giá trị across renders, button click access đúng interval ID hiện tại.

---

### Quiz 6 — In A, B, C qua Promise (như L3 ở trên)

✅ Đã giải ở [L3](#l3-in-a-b-c-cách-1s--promise--asyncawait).

---

### Quiz 7 — async/await rewrite

✅ Đã giải ở [L3](#l3-in-a-b-c-cách-1s--promise--asyncawait).

---

<a id="n-en"></a>
## Phần N — General English Questions

### N1. What's your current IP address?

**Trả lời:**
> "I can find it by `ifconfig` / `ip addr` on Mac/Linux or `ipconfig` on Windows for local IP. For public IP, I use `curl ifconfig.me` or visit whatismyipaddress.com. My local IP is usually in `192.168.x.x` (home router) or `10.x.x.x` (corporate)."

---

### N2. Public IP vs Private IP

| | Public | Private |
|---|---|---|
| Visible | trên Internet | trong LAN |
| Assigned by | ISP | router (DHCP) |
| Range | còn lại | `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` |
| Unique | globally | per network |
| Routing | direct | qua NAT khi ra Internet |

NAT (Network Address Translation) cho phép nhiều thiết bị share 1 public IP.

---

### N3. (Q3) HTML vs XHTML — see [J4](#j4-html-vs-xhtml)

### N4. (Q4) `==` vs `===` — see [A9](#a9-phân-biệt--vs-)

### N5. (Q5) `let` vs `var` — see [A1](#a1-phân-biệt-var-let-const)

### N6. (Q6) `null` vs `undefined` — see [A10](#a10-phân-biệt-null-vs-undefined)

### N7. (Q7) Handle error log async — see [A13](#a13-cách-handle-error-log-trên-async-function)

### N8. (Q8) Improve scrolling perf — see [D9](#d9-cải-thiện-scroll-performance--các-cách)

### N9. (Q9) Layout vs Paint vs Composite — see [D10](#d10-layout-vs-paint-vs-composite)

### N10. (Q10) Session vs Cookies & JWT — see [E3](#e3-jwt--session-hay-cookies-để-lưu), [E4](#e4-session-vs-cookie--khác-nhau)

### N11. (Q11) Release cycle — see [G5](#g5-mô-tả-1-release-cycle-của-bạn)

---

<a id="o-ask-back"></a>
## Phần O — Câu hỏi NÊN HỎI lại nhà tuyển dụng

**Về team & cách làm việc:**
1. Team mình hiện có bao nhiêu người, role gì? Mình sẽ join vai trò cụ thể nào?
2. Team chia task ra sao — Scrum, Kanban, hay khác? Có Daily/Planning/Retro không?
3. Có bao nhiêu dự án đồng thời? Nếu nhiều, phân chia task & priority như nào?
4. Timezone của team — overlap được bao nhiêu giờ/ngày? Async-first hay sync?
5. Có member ở VN không, hay toàn US/EU? Cách giao tiếp chính (Slack, email, meeting)?

**Về tech & dự án:**
6. Tech stack chính của dự án (FE, BE, infra, CI/CD)?
7. Mức độ legacy code vs greenfield?
8. Có **test coverage** và **CI/CD** chỉn chu không?
9. **Release cadence** — daily, weekly, sprint?
10. Process review code thế nào? Ai approve PR?

**Về support & growth:**
11. Onboarding 1–2 tuần đầu có gì? Có mentor/buddy không?
12. Khi bí có ai support? Channel hỏi technical?
13. Có budget học (course, conference) không?
14. Performance review cadence + career path?

**Về quyền lợi (chốt deal):**
15. Thử việc bao lâu, lương probation?
16. Bảo hiểm sức khỏe — gói gì, có cho người thân?
17. Lương 13, thưởng project/year-end — cơ chế tính?
18. Phép năm, leave policy, sick leave?
19. Work-from-home policy, equipment (laptop, monitor) cấp?
20. Khi nào confirm offer + contract — cho mình review trước khi ký?

> 💡 **Tip:** chọn 3–5 câu phù hợp ngữ cảnh interview. Hỏi đủ thể hiện sự chủ động, nhưng đừng "phỏng vấn ngược" quá đà.

---

<a id="p-css-advanced"></a>
## Phần P — CSS Styles (Advanced)

### P1. Box Model & `box-sizing`

```css
*, *::before, *::after { box-sizing: border-box; }
```

| `box-sizing` | `width` tính như nào |
|---|---|
| `content-box` (default) | chỉ **content** — padding/border cộng thêm |
| `border-box` ⭐ | bao gồm padding + border |

→ Nên reset `border-box` toàn project, dễ tính layout.

**Box model:** content → padding → border → margin (out → in: margin > border > padding > content).

---

### P2. Display: `block`, `inline`, `inline-block`, `flex`, `grid`

| | newline | width/height | margin top/bottom |
|---|---|---|---|
| `block` | có | ✅ | ✅ |
| `inline` | không | ❌ (theo content) | ❌ |
| `inline-block` | không | ✅ | ✅ |
| `flex` | có (block) | ✅ | ✅ + flex container |
| `grid` | có (block) | ✅ | ✅ + grid container |
| `none` | mất khỏi DOM render | — | — |
| `contents` | wrapper biến mất (giữ children) | — | — |

---

### P3. CSS Position — `static`, `relative`, `absolute`, `fixed`, `sticky`

| | Anchor | Out of flow | Use case |
|---|---|---|---|
| `static` (default) | normal flow | ❌ | bình thường |
| `relative` | so với chính nó | ❌ (vẫn chiếm chỗ) | offset nhẹ, làm anchor cho absolute con |
| `absolute` | nearest **positioned ancestor** | ✅ | overlay, dropdown |
| `fixed` | viewport | ✅ | sticky header, FAB |
| `sticky` | scroll container | mixed | sub-header sticky khi scroll |

**Stacking context** tạo bởi: `position:absolute/fixed` + `z-index`, `opacity < 1`, `transform`, `filter`, `isolation: isolate`...

---

### P4. CSS Grid (cheat)

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);      /* 3 cột bằng nhau */
  grid-template-columns: 200px 1fr 200px;     /* sidebar - main - sidebar */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* responsive ⭐ */
  grid-template-rows: auto 1fr auto;          /* header - main - footer */
  gap: 16px;
}
.item {
  grid-column: 1 / 3;          /* span từ col 1 đến col 3 (2 cột) */
  grid-column: span 2;
  grid-row: 1 / -1;            /* hết row */
  grid-area: header;           /* named */
}
.container {
  grid-template-areas:
    "header header"
    "nav    main"
    "footer footer";
}
```

**Grid vs Flexbox:**
- **Flex**: 1 chiều (row HOẶC column)
- **Grid**: 2 chiều (row + column cùng lúc), dễ làm layout phức tạp

---

### P5. Responsive — Media Query, Container Query

```css
/* Media query — viewport-based */
@media (min-width: 768px) {
  .card { padding: 24px }
}
@media (max-width: 600px), (orientation: landscape) {}
@media (prefers-color-scheme: dark) {}
@media (prefers-reduced-motion: reduce) {}
@media (hover: hover) {}     /* device có chuột */
@media (pointer: fine) {}

/* Container query (modern 2023+) — element-based */
.card-container { container-type: inline-size; container-name: card; }
@container card (min-width: 400px) {
  .card { display: flex }
}
```

**Mobile-first** (recommend): viết default cho mobile, dùng `min-width` để override lên rộng.

**Breakpoints phổ biến:**
- 640px (sm) — mobile lớn
- 768px (md) — tablet portrait
- 1024px (lg) — tablet landscape / laptop
- 1280px (xl) — desktop
- 1536px (2xl) — desktop lớn

---

### P6. Đơn vị CSS — chọn cái nào?

| Unit | Reference | Use case |
|---|---|---|
| `px` | absolute pixel | border, shadow chính xác |
| `rem` ⭐ | root font-size | font, spacing (scale theo user setting) |
| `em` | parent font-size | component-relative |
| `%` | parent dimension | width fluid |
| `vw` / `vh` | 1% viewport | hero, full screen |
| `dvh` / `svh` / `lvh` | dynamic/small/large viewport | mobile nav bar issue (modern) |
| `ch` | width của ký tự "0" | typography (line-length 65ch) |
| `fr` | grid fraction | grid columns |
| `clamp(min, val, max)` | responsive value | font-size, padding fluid |

```css
font-size: clamp(1rem, 2vw, 1.5rem);   /* tự co dãn theo viewport */
```

---

### P7. CSS Methodology — BEM, OOCSS, SMACSS, Tailwind

**BEM** (Block Element Modifier) ⭐:
```html
<div class="card card--featured">
  <img class="card__image">
  <h3 class="card__title">...</h3>
  <button class="card__btn card__btn--primary">Buy</button>
</div>
```
- Tránh nested selector
- Specificity thấp, dễ override
- Verbose nhưng rõ ràng

**Utility-first (Tailwind)** — modern ⭐:
```html
<div class="p-4 bg-white rounded-lg shadow flex items-center gap-3">
```
- Bundle CSS rất nhỏ (purge unused)
- Không phải đặt tên class
- Cần build step + plugin editor

**CSS Modules** — auto-scoped class:
```jsx
import s from './Card.module.css'
<div className={s.card}>...</div>
```

**CSS-in-JS** (styled-components, emotion) — runtime overhead. Hiện chuyển dần sang **zero-runtime** (Vanilla Extract, Linaria, Panda CSS).

---

### P8. CSS Animation & Transition

```css
/* Transition — between 2 states */
.btn {
  background: blue;
  transition: background 200ms ease-in-out, transform 100ms;
}
.btn:hover { background: red; transform: scale(1.05); }

/* Animation — keyframes */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.modal {
  animation: fadeIn 300ms ease-out forwards;
  animation-delay: 100ms;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;   /* giữ state cuối */
}
```

**Easing:**
- `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`
- `cubic-bezier(.25, .1, .25, 1)` — custom
- `steps(4)` — step animation (loading dots)

**Performance:**
- ✅ Chỉ animate `transform` + `opacity` (composite-only)
- ❌ Tránh animate `width`, `height`, `top`, `margin` (trigger layout)
- `will-change: transform` báo trước cho browser
- `@media (prefers-reduced-motion: reduce)` → tắt animation

---

### P9. CSS Variables (Custom Properties)

```css
:root {
  --color-primary: #3b82f6;
  --color-bg: #fff;
  --spacing-md: 16px;
}
[data-theme="dark"] {
  --color-bg: #111;
}
.btn {
  background: var(--color-primary);
  padding: var(--spacing-md);
}

/* Dynamic từ JS */
document.documentElement.style.setProperty('--color-primary', '#10b981')
```

**Khác Sass variable:**
- CSS variable **runtime**, đổi được bằng JS, cascade qua DOM
- Sass variable **compile-time**, fixed sau build

---

### P10. Stacking Context & `z-index`

`z-index` chỉ work khi element có `position` (relative/absolute/fixed/sticky) hoặc trong flex/grid với `z-index`.

**Stacking context tạo bởi:**
- `position` + `z-index` ≠ auto
- `opacity < 1`
- `transform`, `filter`, `perspective`, `clip-path`, `mask` ≠ none
- `isolation: isolate` ⭐ (modern, tạo stacking context không có side effect)
- `position: fixed` / `sticky`
- `will-change: transform/opacity`

⚠️ `z-index: 9999` không thắng được context khác. Hiểu stacking context để debug.

**Best practice z-index scale:**
```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-modal: 1050;
--z-toast: 1080;
--z-tooltip: 1090;
```

---

### P11. CSS Logical Properties (modern, RTL-friendly)

```css
/* Physical → Logical */
margin-left  → margin-inline-start
margin-right → margin-inline-end
padding-top  → padding-block-start
border-left  → border-inline-start
width        → inline-size
height       → block-size
```

→ Tự đảo cho RTL languages (Arabic, Hebrew) khi `dir="rtl"`.

---

### P12. Modern CSS features (đáng biết 2025+)

- **`:has()`** — parent selector
  ```css
  .form:has(input:invalid) { border-color: red }
  ```
- **`@layer`** — cascade layers (kiểm soát specificity)
- **`@scope`** — scoped CSS
- **Nesting** native (không cần Sass)
  ```css
  .card {
    & .title { font-size: 18px }
    &:hover { background: #f5f5f5 }
  }
  ```
- **`color-mix()`**, **`oklch()`** — color manipulation
- **`view-transitions`** API — page transition smooth
- **`subgrid`** — grid item dùng grid của cha
- **Anchor positioning** — popover relative tới element bất kỳ

---

### P13. Reset vs Normalize CSS

- **Reset CSS** (Eric Meyer) — về 0, dev tự định nghĩa lại tất cả
- **Normalize CSS** — giữ default useful, fix browser inconsistency
- **Modern Reset** (Andy Bell, Josh Comeau) — middle ground, hợp 2025

```css
/* Modern minimal reset */
*, *::before, *::after { box-sizing: border-box }
* { margin: 0 }
html, body { height: 100% }
body { line-height: 1.5; -webkit-font-smoothing: antialiased }
img, picture, video, canvas, svg { display: block; max-width: 100% }
input, button, textarea, select { font: inherit }
```

---

### P14. CSS Selector — Specificity

```
0,0,0,0
↑ ↑ ↑ ↑
│ │ │ └─ element/pseudo-element (h1, ::before)
│ │ └─── class/attr/pseudo-class (.x, [type], :hover)
│ └───── id (#x)
└─────── inline style (style="")
+ !important > everything
```

```css
#nav .item a:hover  /* 1, 2, 1 */
.btn.primary        /* 0, 2, 0 */
div div.box ul li   /* 0, 1, 4 */
```

**Tránh war:** dùng class, tránh ID + `!important`, dùng `@layer` (modern), hoặc methodology (BEM/Tailwind).

---

### P15. Hide element — các cách

| Cách | DOM | Render | Click | Screen reader | Animate được |
|---|---|---|---|---|---|
| `display: none` | còn | không | không | không | ❌ |
| `visibility: hidden` | còn | có (giữ chỗ) | không | không | ❌ |
| `opacity: 0` | còn | có | ✅ (vẫn click) | có | ✅ |
| `clip-path: inset(50%)` | còn | có | ✅ | có | ✅ |
| `position:absolute; left:-9999px` | còn | có | không (offscreen) | có | — |
| `hidden` attribute | còn | không | không | không | ❌ |
| `.sr-only` class | còn | nhỏ 1px | ❌ | ✅ ⭐ | — |

**`.sr-only` cho a11y:**
```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

---

<a id="q-perf-advanced"></a>
## Phần Q — Performance (Advanced)

### Q1. Core Web Vitals chi tiết + cách đo

| Metric | Đo cái gì | Good | Cách đo |
|---|---|---|---|
| **LCP** | Largest Contentful Paint | < 2.5s | PerformanceObserver, web-vitals lib |
| **INP** | Interaction to Next Paint (thay FID 2024) | < 200ms | web-vitals |
| **CLS** | Cumulative Layout Shift | < 0.1 | web-vitals |
| **FCP** | First Contentful Paint | < 1.8s | Performance API |
| **TTFB** | Time To First Byte | < 800ms | `navigation` entry |

```js
import { onLCP, onINP, onCLS } from 'web-vitals'
onLCP(metric => analytics.send('lcp', metric.value))
onINP(metric => analytics.send('inp', metric.value))
onCLS(metric => analytics.send('cls', metric.value))
```

**Field data** (RUM — Real User Monitoring) > **Lab data** (Lighthouse). Dùng cả 2.

---

### Q2. Cải thiện LCP

**Nguyên nhân LCP chậm:**
1. Server response chậm (TTFB)
2. Render-blocking JS/CSS
3. Resource load chậm (font, image)
4. Client-side rendering nặng

**Cách fix:**
- **Preload LCP image**: `<link rel="preload" as="image" href="hero.webp" fetchpriority="high">`
- `<img fetchpriority="high">` cho hero
- Server-side render / static HTML (Next.js, Astro)
- **Preconnect** CDN: `<link rel="preconnect" href="https://cdn.com">`
- Critical CSS inline, non-critical defer
- Optimize font: `font-display: swap`, preload font critical
- HTTP/2, HTTP/3
- CDN edge cache HTML (ISR)

---

### Q3. Cải thiện INP

INP = thời gian từ user interact đến next paint. Đo input lag thực tế.

**Cách fix:**
- **Chia nhỏ long task** (> 50ms): `scheduler.yield()` hoặc `setTimeout(0)`
- `useTransition` / `startTransition` cho update non-urgent (React 18)
- **Debounce/throttle** handler (search input, scroll)
- Move work to **Web Worker**
- Tránh `JSON.parse` lớn trên main thread → stream parse
- Optimize React render: `React.memo`, đúng key
- Tránh `requestAnimationFrame` chain dài

```js
async function longTask() {
  for (const item of items) {
    process(item)
    if (navigator.scheduling?.isInputPending()) {
      await new Promise(r => setTimeout(r, 0))   // yield
    }
  }
}
```

---

### Q4. Cải thiện CLS

CLS = layout shift không mong muốn. User đang đọc bỗng nhảy.

**Fix:**
- **Width/height attribute cho image**: `<img width="800" height="600">`
- `aspect-ratio: 16/9` cho video/embed
- **Reserve space cho ad/iframe** trước khi load
- **Font-display: swap** + `size-adjust` để giảm fallback shift
- Avoid inserting content above existing (chỉ append below)
- Skeleton có chính xác size

---

### Q5. Performance Budget

Đặt giới hạn cứng cho resource:
```json
{
  "size-limit": [
    { "path": "dist/main.*.js", "limit": "150 KB" },
    { "path": "dist/vendor.*.js", "limit": "100 KB" }
  ],
  "lighthouse-budgets": {
    "resourceSizes": [
      { "resourceType": "script", "budget": 300 },
      { "resourceType": "image", "budget": 500 }
    ],
    "timings": [
      { "metric": "interactive", "budget": 3000 }
    ]
  }
}
```

CI fail nếu vượt → "performance regression" được catch trước merge.

---

### Q6. RUM vs Synthetic Monitoring

| | RUM | Synthetic |
|---|---|---|
| Data từ | user thật | scripted bot |
| Khi đo | mọi lần user visit | scheduled |
| Stable | noisy (mạng/device khác) | reproducible |
| Use | production health | regression test, alerting |
| Tools | Sentry, Datadog RUM, Vercel | Lighthouse CI, WebPageTest, Checkly |

→ Dùng **cả 2** trong production.

---

### Q7. React Performance — 10 checklist

1. **Profiler đo trước** — Chrome DevTools React tab
2. **Key đúng** trong list (stable id)
3. **`React.memo`** + props stable
4. **`useCallback` / `useMemo`** chỉ khi cần
5. **Selector** cho store (Zustand: `useStore(s => s.x)`, Redux: shallow)
6. **Tách Context** theo concern
7. **Lazy load** route, modal
8. **Virtualize list** dài
9. **Suspense + concurrent** (transitions, useDeferredValue)
10. **Avoid inline object/function** khi pass xuống memoized child

**Anti-patterns:**
- `useState` cho derived value → tính trực tiếp
- `useEffect` để sync state → derive
- Memoize everything → đo trước, optimize sau

---

### Q8. Web Worker, Service Worker, Shared Worker

| | Web Worker | Service Worker | Shared Worker |
|---|---|---|---|
| Scope | 1 tab | tất cả tab cùng origin | nhiều tab |
| Lifecycle | tồn tại với page | persistent, separate | persistent |
| Use | heavy compute | offline cache, push, network proxy | shared state |
| Communicate | postMessage | postMessage, fetch handler | port |
| DOM access | ❌ | ❌ | ❌ |

```js
// Web Worker
const w = new Worker('worker.js', { type: 'module' })
w.postMessage({ task: 'parse', data })
w.onmessage = e => console.log(e.data)

// Service Worker
navigator.serviceWorker.register('/sw.js')
// sw.js
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
})
```

---

### Q9. HTTP/1.1 vs HTTP/2 vs HTTP/3

| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Transport | TCP | TCP | **QUIC (UDP)** |
| Multiplexing | ❌ (head-of-line block) | ✅ | ✅ không HoL |
| Header compression | text | HPACK binary | QPACK |
| Server push | ❌ | có (đang deprecate) | có |
| TLS | optional | bắt buộc trong thực tế | built-in |
| Mobile/lossy network | yếu | yếu hơn HTTP/3 | mạnh ⭐ |
| Setup | 1 RTT TCP + 2 RTT TLS | 1 RTT + 1 RTT TLS | 0-1 RTT (0-RTT resumption) |

→ HTTP/3 đặc biệt tốt cho mobile, mạng kém. Hỗ trợ từ Chrome 87+, Safari 14+.

---

### Q10. Image format & lazy load

**Decision tree:**
- Vector (icon, logo) → **SVG**
- Photo → **AVIF** > **WebP** > JPEG (fallback)
- Cần alpha + sắc nét → **PNG** hoặc **WebP**
- Animated → **WebP animation** > GIF
- HDR → **AVIF**

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="..." loading="lazy" decoding="async"
       width="1200" height="800" fetchpriority="high">
</picture>
```

**Lazy load native**: `loading="lazy"` (off-screen).
**`fetchpriority`**: `high` cho LCP, `low` cho below-fold.

**Modern image component** (Next.js `<Image>`, expo-image, gatsby-image) handle:
- Responsive `srcset`
- Blur placeholder / blurhash
- Lazy + intersection observer
- Format negotiation theo Accept header

---

### Q11. Font Performance

```html
<!-- 1. Preload font critical -->
<link rel="preload" href="/Inter-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- 2. CSS -->
<style>
@font-face {
  font-family: 'Inter';
  src: url('/Inter-var.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;        /* hoặc optional cho ko shift */
  size-adjust: 102%;          /* match fallback */
  unicode-range: U+0000-00FF, U+0102, U+0103, U+1EA0-1EF9, U+20AB;  /* subset VI */
}
</style>

<!-- 3. Fallback font giống -->
<style>
body { font-family: 'Inter', system-ui, -apple-system, sans-serif }
</style>
```

**Tips:**
- **Variable font** (1 file nhiều weight) thay vì 5 file weight
- **Subset** unicode chỉ ký tự cần (giảm 70% size)
- WOFF2 only (drop WOFF/TTF)
- Tránh `font-display: block` → FOIT (invisible text)
- Tools: `glyphhanger`, `fonttools subset`

---

### Q12. Bundle size optimization (deep)

**1. Audit:**
```bash
npx source-map-explorer dist/**/*.js
npx vite-bundle-visualizer
```

**2. Tree-shake friendly:**
- ESM imports (`import { x } from 'lib'`)
- `"sideEffects": false` trong package.json (hoặc list file CSS)
- Named imports, không default import "barrel"

**3. Replace lib nặng:**
| ❌ | ✅ | Save |
|---|---|---|
| moment (290KB) | dayjs (2KB) / date-fns | ~280KB |
| lodash | lodash-es + named | ~50KB |
| axios | ky / native fetch | ~13KB |
| underscore | native ES methods | full |

**4. Code-split:**
- Route-based: `React.lazy(() => import('./Settings'))`
- Vendor split (cache lâu)
- Async component (modal, chart)

**5. Compress:**
- **Brotli** > Gzip (~20% nhỏ hơn)
- Server gửi `Content-Encoding: br`

**6. Minify:**
- swc / esbuild / Terser
- CSS: lightningcss, cssnano

**7. Polyfill thông minh:**
- `core-js` + `browserslist` (chỉ polyfill cho browser cần)
- `@babel/preset-env` với `useBuiltIns: 'usage'`

---

### Q13. Critical CSS

CSS render-blocking → inline phần CSS cần cho above-the-fold, defer phần còn lại.

```html
<head>
  <style>/* critical CSS inline ~14KB */</style>
  <link rel="preload" href="full.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="full.css"></noscript>
</head>
```

Tools: **Critters** (Vite/Webpack plugin), **Penthouse**, **Beasties**.

Frameworks (Next.js, Astro) thường auto inline critical.

---

### Q14. Edge computing & SSR strategy

| Strategy | Mô tả | Khi nào |
|---|---|---|
| **CSR** | HTML rỗng + JS render | App dashboard authenticated |
| **SSR** | Render HTML mỗi request | Personalized (auth-aware) |
| **SSG** | Build trước, serve static | Marketing, blog, docs |
| **ISR** | SSG + revalidate sau X giây | E-commerce, có thay đổi |
| **RSC** | Server Component render server, stream | Mixed dynamic + static |
| **Edge SSR** | Render tại edge (Vercel/Cloudflare Workers) | Personalize global, latency thấp |
| **PPR** (Partial Prerender) | Static shell + dynamic holes | Next.js 14+ |

---

### Q15. Mobile perf checklist (React Native)

1. **Hermes engine** bật (default)
2. **New Architecture** (Fabric + TurboModule + Codegen)
3. **FlashList** > FlatList cho list dài
4. **expo-image** với cache + placeholder
5. **Reanimated 3** cho animation (UI thread)
6. **useNativeDriver: true** với Animated API
7. **InteractionManager.runAfterInteractions()** cho work nặng
8. **MMKV** thay AsyncStorage
9. **Lazy screen** với `React.lazy`
10. **Inline require** cho native module heavy
11. **Image resize server-side**, không bundle ảnh 4K
12. **Memoize renderItem** + Item component
13. **`removeClippedSubviews`** + `windowSize` tune FlatList
14. **Avoid bridge calls** trong loop (gom batch)
15. Profile: **Hermes Sampling Profiler**, **Flashlight**

---

<a id="r-caching-advanced"></a>
## Phần R — Caching (Advanced)

### R1. Cache layers — toàn bộ ngăn xếp

```
[User Browser]
  ↓ 1. Memory Cache (RAM tab)
  ↓ 2. Disk Cache (browser)
  ↓ 3. Service Worker Cache (PWA)
[Network]
  ↓ 4. ISP Cache (HTTP cache)
  ↓ 5. CDN Edge (CloudFront/Cloudflare)
  ↓ 6. Reverse Proxy (Varnish/Nginx)
[Origin]
  ↓ 7. App-level Cache (Redis/Memcached)
  ↓ 8. Database Query Cache
  ↓ 9. Database (Postgres/Mongo)
```

→ Tối ưu = hit ở lớp gần user nhất.

---

### R2. HTTP Cache Headers (chi tiết)

```http
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=300, immutable
ETag: "abc123"
Last-Modified: Wed, 22 May 2026 12:00:00 GMT
Vary: Accept-Encoding, Accept-Language
Age: 120
```

**Directives:**
| Directive | Ý nghĩa |
|---|---|
| `public` | cache cả ở CDN/proxy |
| `private` | chỉ browser cache (user-specific) |
| `max-age=N` | fresh N giây |
| `s-maxage=N` | max-age cho shared cache (CDN) |
| `no-cache` | phải revalidate trước khi serve |
| `no-store` | tuyệt đối không cache |
| `must-revalidate` | hết hạn → phải revalidate |
| `immutable` | không bao giờ đổi (file có hash) |
| `stale-while-revalidate=N` | serve cache cũ rồi refresh background |
| `stale-if-error=N` | serve cũ nếu origin lỗi |

**Validation:**
- `ETag` + `If-None-Match` → 304 Not Modified (không gửi body)
- `Last-Modified` + `If-Modified-Since`

---

### R3. Cache Strategy cho từng asset

```http
# Static asset có hash (chuẩn 2025)
GET /app.abc123.js
Cache-Control: public, max-age=31536000, immutable

# HTML entry
GET /index.html
Cache-Control: no-cache, must-revalidate

# API GET (read-mostly, có thể stale chút)
GET /api/posts
Cache-Control: public, max-age=60, stale-while-revalidate=300

# API user-specific
GET /api/me
Cache-Control: private, max-age=0, must-revalidate

# Mutation
POST /api/posts
Cache-Control: no-store
```

---

### R4. CDN cache invalidation

**Cách tránh phải invalidate:**
- **File có hash** (`app.[contenthash].js`) → URL mới = file mới = cache miss tự nhiên

**Khi phải invalidate:**
```bash
# CloudFront
aws cloudfront create-invalidation --distribution-id ABCD --paths "/index.html" "/api/*"

# Cloudflare
curl -X POST "https://api.cloudflare.com/.../purge_cache" -d '{"files":["..."]}'
```

⚠️ Invalidation tốn $, không tức thời. Ưu tiên versioning qua URL.

**Stale-while-revalidate** pattern: serve cũ ngay, refresh background → UX mượt + always fresh.

---

### R5. Service Worker Cache strategies

```js
// 1. Cache First — offline-first, static asset
async function cacheFirst(req) {
  return (await caches.match(req)) || fetch(req)
}

// 2. Network First — content fresh quan trọng
async function networkFirst(req) {
  try {
    const fresh = await fetch(req)
    cache.put(req, fresh.clone())
    return fresh
  } catch { return caches.match(req) }
}

// 3. Stale While Revalidate — best UX
async function swr(req) {
  const cached = await caches.match(req)
  const fetchPromise = fetch(req).then(res => {
    cache.put(req, res.clone()); return res
  })
  return cached || fetchPromise
}

// 4. Cache Only — pure offline asset
// 5. Network Only — never cache (analytics)
```

**Lib:** Workbox (Google), Vite PWA plugin.

---

### R6. App-level cache — TanStack Query / SWR

**TanStack Query có 2 cache:**
- `staleTime` — bao lâu coi là fresh (không refetch)
- `gcTime` (cũ là cacheTime) — bao lâu sau khi unused thì xóa

```ts
useQuery({
  queryKey: ['user', id],
  queryFn: () => api.getUser(id),
  staleTime: 5 * 60_000,        // 5 phút coi là tươi
  gcTime: 10 * 60_000,           // sau 10 phút unused → xóa
  refetchOnWindowFocus: true,    // tự refetch khi tab focus
  refetchOnReconnect: true       // tự refetch khi mạng lại
})
```

**Invalidation sau mutation:**
```ts
useMutation({
  mutationFn: updatePost,
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['posts'] })   // mark stale, refetch
    qc.setQueryData(['post', id], data)              // optimistic update
  }
})
```

---

### R7. Redis caching patterns

**1. Cache-Aside (Lazy loading)** — phổ biến nhất
```js
async function getUser(id) {
  const cached = await redis.get(`user:${id}`)
  if (cached) return JSON.parse(cached)
  const user = await db.user.findUnique({ where: { id } })
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user))
  return user
}
```

**2. Write-Through** — write vào cache + DB cùng lúc
**3. Write-Behind** — write cache, async ghi DB
**4. Read-Through** — cache lib tự fetch khi miss

**Cache invalidation:**
```js
// Sau update
await db.user.update({ where: { id }, data })
await redis.del(`user:${id}`)
// Hoặc tag-based với Redis modules
```

> "There are only two hard things in CS: cache invalidation and naming things." — Phil Karlton

---

### R8. Cache key design

```
# Good
user:123:profile
post:abc:comments:page:2:limit:20
ratelimit:ip:1.2.3.4:1700000000

# Bad
user (quá generic)
some_random_key
```

**Tips:**
- Namespace với `:` (chuẩn Redis)
- Include version (`v2:user:123`) để rollback dễ
- Include locale/auth state nếu cần (`user:123:vi`, `home:logged-in`)
- TTL hợp lý — không quá ngắn (miss nhiều) không quá dài (stale)

---

### R9. CDN-level cache key — Vary header

CDN cache theo URL. Nếu response thay đổi theo header (Accept-Language, Authorization), dùng `Vary`:

```
Vary: Accept-Encoding, Accept-Language
```

→ CDN cache riêng cho từng combo header. Cẩn thận `Vary: Cookie` → gần như mọi user 1 cache (vô dụng).

**Best practice:** decode auth ở edge (Cloudflare Workers) → set cache key tường minh, không phụ thuộc Vary.

---

### R10. Mobile (RN) caching

**HTTP response cache:**
- iOS: NSURLCache built-in (default 4MB memory + 20MB disk)
- Android: OkHttp cache
- Custom: dùng `react-native-cache-store` hoặc TanStack Query

**Image:**
- `expo-image` — memory + disk cache, blurhash placeholder
- `react-native-fast-image` — FFFastImage (iOS) / Glide (Android)

**App state persist (offline-first):**
```ts
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

persistQueryClient({
  queryClient: qc,
  persister: createAsyncStoragePersister({ storage: AsyncStorage })
})
```

**Offline-first DB:**
- **WatermelonDB** — SQLite-based, reactive
- **RxDB** — observable, sync
- **Realm** — local + cloud sync
- **PowerSync** — Postgres ↔ SQLite sync

---

<a id="s-security-advanced"></a>
## Phần S — Security (Advanced)

### S1. OWASP Top 10 (2021) — chi tiết mỗi mục

| # | Risk | Ví dụ FE/BE | Phòng |
|---|---|---|---|
| A01 | Broken Access Control | User A xem dữ liệu user B (`/api/users/123`) | Server enforce, không trust client; ACL/RBAC |
| A02 | Cryptographic Failure | Lưu password plaintext, dùng MD5 | bcrypt/argon2, TLS, AES-GCM |
| A03 | Injection | SQLi, NoSQLi, OS command, **XSS** | Parameterized query, sanitize, ORM |
| A04 | Insecure Design | Quên rate limit reset password | Threat modeling từ thiết kế |
| A05 | Security Misconfiguration | Debug mode prod, default password | Hardening, IaC, automated scan |
| A06 | Vulnerable Components | Lodash 4.17.10 CVE | Dependabot, Snyk |
| A07 | Auth Failures | Brute force OTP, weak password | MFA, lockout, password policy |
| A08 | Software & Data Integrity | NPM package compromised | Lock file, SBOM, signature |
| A09 | Logging & Monitoring | Không alert được attack | Centralized log, SIEM, alerts |
| A10 | SSRF | API fetch URL user nhập → internal IP | Allowlist, block internal IP |

---

### S2. XSS sâu — 3 loại + defense in depth

**Loại:**
1. **Stored** — payload lưu DB, mỗi user load đều dính (comment system)
2. **Reflected** — payload trong URL/query, server echo lại (search page)
3. **DOM-based** — JS client đọc `location.hash` → đẩy vào `innerHTML`

**Defense layers:**
1. **Output encoding** theo context:
   - HTML body: `&lt; &amp;`
   - HTML attribute: thêm escape `"`
   - URL: `encodeURIComponent`
   - JavaScript context: JSON encode + tránh inline
   - CSS: tránh user-controlled
2. **Input validation** — whitelist (regex chặt)
3. **React tự escape `{var}`** — KHÔNG dùng `dangerouslySetInnerHTML` với user data
4. **Sanitize HTML** nếu phải render rich text: **DOMPurify**
   ```js
   const clean = DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['b','i','a'], ALLOWED_ATTR: ['href'] })
   ```
5. **CSP** chặn inline script
6. **HttpOnly cookie** cho session → XSS ko đọc được

---

### S3. CSP (Content Security Policy) — chi tiết

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-RANDOMNONCE' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://*.cdn.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com wss://ws.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
  report-uri /csp-report;
  report-to default;
```

**Quy tắc:**
- `'self'` chỉ same-origin
- `'none'` chặn tất cả
- `'unsafe-inline'` cho phép `<script>...</script>` (TRÁNH — defeats CSP)
- `'unsafe-eval'` cho phép `eval()` (TRÁNH)
- **`'nonce-xxx'`** ⭐ — random nonce mỗi request, an toàn cho inline script
- **`'sha256-...'`** — hash của inline script cụ thể

**`frame-ancestors`** — replace `X-Frame-Options`, chống clickjacking.

**Report-Only mode** để test trước khi enforce:
```http
Content-Security-Policy-Report-Only: ...
```

---

### S4. CORS sâu

**Same-Origin Policy:** browser chặn JS đọc response từ origin khác.

**CORS** = server opt-in cho cross-origin:
```http
Access-Control-Allow-Origin: https://app.example.com    # KHÔNG dùng * khi có credentials
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
Access-Control-Expose-Headers: X-Total-Count
```

**Preflight (OPTIONS):**
- Trigger khi: custom header, method ngoài GET/POST/HEAD, hoặc `Content-Type` ngoài `text/plain`/`application/x-www-form-urlencoded`/`multipart/form-data`
- Browser tự gửi OPTIONS trước actual request
- Server phải reply 200 + CORS headers

⚠️ **CORS chỉ chặn browser đọc response**. Server vẫn nhận request (đôi khi side effect). Auth/CSRF protection vẫn cần server-side.

---

### S5. CSRF (Cross-Site Request Forgery) sâu

**Attack scenario:**
1. User login bank.com → cookie session set
2. Truy cập evil.com có hidden form `<form action="https://bank.com/transfer" method=POST>`
3. JS auto submit → browser tự gửi cookie bank.com → tiền chuyển

**Defenses:**
1. **SameSite cookie** ⭐ (modern default `Lax`)
   ```
   Set-Cookie: token=xxx; SameSite=Strict; HttpOnly; Secure
   ```
   - `Strict` — chặn mọi cross-site (kể cả link click)
   - `Lax` — cho phép navigation GET (default Chrome)
   - `None` — disable (cần `Secure`)
2. **CSRF Token** — sync token submit cùng form
3. **Check Origin/Referer** header
4. **Custom header** (`X-Requested-With`) + CORS → buộc preflight
5. **Double-submit cookie** — token trong cookie + body, server so sánh
6. **Re-authenticate** cho action critical (transfer money)

→ Dùng `Authorization: Bearer` header thay cookie → tự nhiên miễn CSRF (browser ko tự gửi header cross-site).

---

### S6. JWT — pitfalls

**Cấu trúc:**
```
header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.signature
```
Header + payload là **base64url** — DECODE ĐƯỢC, không phải mã hóa.

**Common mistakes:**
1. ❌ Lưu sensitive data trong payload (ai cũng đọc được)
2. ❌ `alg: none` accept (attacker chỉ cần đổi alg)
3. ❌ Verify với HS256 nhưng config nhầm RS256 → confuse attack
4. ❌ Token quá dài (1 năm) — không revoke được
5. ❌ Lưu trong localStorage (XSS)
6. ❌ Không check `exp`, `nbf`, `iss`, `aud`
7. ❌ JWT cho session — không revoke giữa chừng được; consider session cookie nếu cần revoke

**Best practice:**
- Access token ngắn (15p), refresh token dài (7-30d) + rotation
- Refresh trong httpOnly cookie
- Sign với RS256/EdDSA (asymmetric) cho microservices
- Verify mọi field: `exp`, `iss`, `aud`, `sub`
- Có **blacklist/whitelist** (Redis) cho immediate revoke
- Rotate signing key định kỳ

---

### S7. OAuth 2.0 & OIDC

**OAuth 2.0 flows:**
| Flow | Use case |
|---|---|
| **Authorization Code + PKCE** ⭐ | SPA, mobile (recommended hiện đại) |
| Authorization Code (no PKCE) | Server-side web app (legacy) |
| Client Credentials | M2M (service-to-service) |
| Resource Owner Password | ❌ deprecated |
| Implicit | ❌ deprecated (thay bằng PKCE) |
| Device Code | TV, CLI |

**PKCE (Proof Key for Code Exchange):**
```
1. Client tạo code_verifier (random) + code_challenge = SHA256(verifier)
2. Authorize URL kèm code_challenge
3. Nhận authorization code
4. Exchange code + code_verifier → access_token
5. Auth server verify verifier match challenge
```
→ Chống code interception (attacker bắt được code cũng không exchange được).

**OIDC** = OAuth 2.0 + `id_token` (JWT chứa identity) → standardize "login with X".

---

### S8. Authentication checklist

- [ ] Password: bcrypt/argon2 cost ≥ 12
- [ ] Password policy: min 8, không bắt phức tạp (NIST 2024), check **HaveIBeenPwned**
- [ ] MFA (TOTP/Authenticator), passkey/WebAuthn cho admin
- [ ] Lockout sau N attempts (rate limit thay vì hard lock — chống DoS)
- [ ] Captcha sau brute force detect (Cloudflare Turnstile, hCaptcha)
- [ ] Email verification trước khi enable account
- [ ] Password reset: token 1 lần, short expiry, không tiết lộ email tồn tại
- [ ] OAuth providers verified (Google, Apple, Microsoft)
- [ ] Session timeout reasonable
- [ ] Logout: revoke server-side (không chỉ xóa cookie)
- [ ] Audit log: login success/fail, password change, MFA change

---

### S9. Authorization — RBAC vs ABAC vs ReBAC

| | RBAC | ABAC | ReBAC |
|---|---|---|---|
| Decision basis | Role | Attribute | Relationship |
| Example | "admin can edit" | "can edit if dept = X AND time < 17:00" | "user owns doc → can edit" |
| Flex | thấp | cao | rất cao (graph) |
| Complexity | low | medium | high |
| Tools | Casbin | OPA (Rego) | Zanzibar, SpiceDB, Permify |
| Use | most apps | enterprise | collab (Google Docs share) |

**Enforce ở đâu:**
- **API/Server** — luôn (không trust client)
- **DB Row-Level Security** — Postgres RLS, Supabase
- **UI** — UX (ẩn nút) nhưng KHÔNG bảo mật

---

### S10. Mobile Security (RN) — deep

**1. Secure storage:**
- Keychain (iOS) / Keystore (Android) — `expo-secure-store`, `react-native-keychain`
- MMKV với encryption key trong Keychain
- ❌ KHÔNG AsyncStorage cho token

**2. Network:**
- HTTPS only, App Transport Security (ATS) iOS bật mặc định
- **Certificate Pinning** — chống MITM proxy attack
  ```ts
  import { pinningOptions } from 'react-native-cert-pinner'
  // hoặc react-native-ssl-pinning
  ```
- Verify server cert chain
- Refuse cleartext HTTP (`android:usesCleartextTraffic="false"`)

**3. Code protection:**
- Hermes bytecode (khó decompile hơn JS)
- ProGuard/R8 minify Android
- Obfuscation: `metro-minify-terser`, `react-native-obfuscating-transformer`
- Strip console.log production

**4. Anti-tampering:**
- Jailbreak/root detection: `jail-monkey`
- Debug detection
- App signature verification (Android: PackageManager.GET_SIGNING_CERTIFICATES)

**5. Sensitive UI:**
- iOS: `FLAG_SECURE` equivalent — chặn screenshot/screen record màn nhạy (LoginScreen, OTP)
  ```ts
  // react-native-prevent-screenshot
  ```

**6. Deep link safety:**
- Universal Links (iOS) / App Links (Android) — verify domain qua well-known JSON
- Validate params chặt (params trong URL = user-controllable)
- Don't trust intent extras

**7. Biometric:**
- `expo-local-authentication` + Keychain
- Pattern: biometric unlock token đã lưu, KHÔNG dùng làm auth chính

**8. Permission:**
- Just-in-time (xin khi cần, có context)
- Privacy strings iOS (Info.plist) — không có sẽ crash
- Android 12+ approximate location

**9. Privacy:**
- iOS Privacy Manifest (PrivacyInfo.xcprivacy) — required 2024
- Android Data Safety form
- GDPR consent flow nếu EU user
- App Tracking Transparency (ATT) iOS — xin trước khi tracking cross-app

---

### S11. Security Headers (full set)

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY                          # legacy, dùng frame-ancestors CSP
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=()  # disable feature
Cross-Origin-Opener-Policy: same-origin        # Spectre
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

Audit: [securityheaders.com](https://securityheaders.com), [Mozilla Observatory](https://observatory.mozilla.org).

---

### S12. Dependency security & Supply chain

**Threats:**
- Package bị compromise (event-stream 2018, ua-parser-js 2021, xz utils 2024)
- Typosquatting (`reactt`, `axoss`)
- Maintainer takeover

**Defense:**
- `npm audit` / `pnpm audit` + auto-fix
- **Dependabot** / **Renovate** auto PR
- **Snyk** / **Socket.dev** — supply chain scan
- Lock file commit (`package-lock.json`)
- Pin major (`^1.2.3`), avoid `*`
- Subresource Integrity (SRI) cho CDN: `<script integrity="sha384-...">`
- SBOM (Software Bill of Materials) — `npm sbom`
- Avoid `postinstall` script untrusted package
- Container scan (Trivy, Snyk)
- Sign artifact (Sigstore)

---

<a id="t-testing-advanced"></a>
## Phần T — Testing (Advanced)

### T1. Testing Strategy — Pyramid vs Trophy vs Diamond

```
PYRAMID                TROPHY (Kent C. Dodds)        DIAMOND
       /\                          E2E                       /\
      /E2E\                Integration ←⭐                  /UI/
     /------\              Unit                            /----\
    /  Int   \             Static (TS, Lint)              /  Int \
   /----------\                                          /--------\
  /   Unit     \                                        / Static + \
 /--------------\                                      /  Contract  \
```

**Quy tắc:**
- Test gì giúp giảm rủi ro nhất, viết và chạy được rẻ nhất
- Integration thường ROI cao nhất với React
- E2E ít nhưng cover critical path

---

### T2. Mocking strategies — sâu

**1. Module mock** (jest):
```ts
jest.mock('axios')
// → tất cả method = jest.fn()
```

**2. Manual mock** (`__mocks__/axios.ts`) — auto picked.

**3. Partial mock** (giữ một số real):
```ts
jest.mock('./service', () => ({
  ...jest.requireActual('./service'),
  expensiveFn: jest.fn().mockReturnValue(1)
}))
```

**4. Spy** (track real call):
```ts
const spy = jest.spyOn(api, 'fetch').mockImplementation()
// sau test
spy.mockRestore()
```

**5. MSW (network-level)** ⭐ — recommend cho integration test
```ts
const server = setupServer(
  http.get('/api/users', () => HttpResponse.json([{id:1}])),
  http.post('/api/login', async ({ request }) => {
    const body = await request.json()
    if (body.password === 'wrong') return new HttpResponse(null, { status: 401 })
    return HttpResponse.json({ token: 'xxx' })
  })
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

**6. Time mock:**
```ts
jest.useFakeTimers().setSystemTime(new Date('2026-01-01'))
jest.advanceTimersByTime(1000)
jest.runAllTimers()
jest.useRealTimers()
```

**7. Random/UUID mock:**
```ts
jest.spyOn(crypto, 'randomUUID').mockReturnValue('fixed-uuid')
```

**8. Network/fetch mock:**
- `nock` (Node)
- MSW (browser + Node)
- `fetch-mock`

---

### T3. Contract Testing (consumer-driven)

Test API contract giữa consumer (FE) và provider (BE), tránh "works on my machine" sau khi merge.

**Tools:**
- **Pact** ⭐ — consumer ghi expected interaction, provider verify
- **Spring Cloud Contract**

**Flow:**
1. FE viết test mock API → tạo **pact file** (JSON)
2. Push pact lên **Pact Broker**
3. BE pull, chạy test "với contract này có pass không?"
4. Nếu fail → BE biết sẽ break FE trước khi deploy

---

### T4. Visual Regression Testing

So sánh screenshot trước/sau để catch UI regression.

**Tools:**
- **Chromatic** (Storybook) — cloud, diff visual, có review UI
- **Percy** — đa framework
- **Playwright `toHaveScreenshot()`** — built-in
- **Loki** — Storybook RN
- **BackstopJS** — open source

```ts
// Playwright
await expect(page).toHaveScreenshot('home.png', {
  maxDiffPixels: 100,
  fullPage: true
})
```

**Workflow:**
1. CI chạy, gen screenshot
2. So với baseline
3. Diff → block PR, dev review
4. Accept thay đổi → update baseline

---

### T5. Accessibility Testing

```ts
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('no a11y violations', async () => {
  const { container } = render(<App />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**Storybook a11y addon** chạy axe trên mỗi story.

**Manual:**
- Tab keyboard qua mọi flow
- Screen reader: VoiceOver (iOS/Mac), TalkBack (Android), NVDA (Windows)
- Browser: aXe DevTools, Lighthouse a11y

---

### T6. Mutation Testing

Kiểm tra **test có thật sự đảm bảo logic không**: tool tự sửa code (replace `+` → `-`, `>` → `>=`) — nếu test vẫn pass = test yếu.

**Tool:** **Stryker** (JS/TS).

```bash
npx stryker run
```

Score 80%+ là tốt.

---

### T7. Performance Testing (Frontend)

- **Lighthouse CI** — score perf, a11y, SEO, best practices trong pipeline
- **Reassure** (RN) — đo render time component, regression test
- **Flashlight** (RN) — score app performance
- **WebPageTest** — multi-location, throttle

```yaml
# Lighthouse CI config
ci:
  assert:
    assertions:
      "categories:performance": ["error", { "minScore": 0.9 }]
      "first-contentful-paint": ["error", { "maxNumericValue": 2000 }]
```

---

### T8. Load Testing (cho BE FE-dev cần biết)

- **k6** ⭐ — modern, JS scripting
- **Artillery**, **JMeter**, **Locust**
- **Vegeta** (Go, đơn giản CLI)

```js
// k6
import http from 'k6/http'
import { check, sleep } from 'k6'
export const options = { vus: 100, duration: '30s' }
export default function() {
  const res = http.get('https://api.example.com/posts')
  check(res, { 'status 200': r => r.status === 200, 'p95<500ms': r => r.timings.duration < 500 })
  sleep(1)
}
```

---

### T9. E2E — Playwright vs Cypress vs Selenium

| | Playwright | Cypress | Selenium |
|---|---|---|---|
| Engine | Chromium, FF, WebKit | Chromium, FF, Edge | All browsers |
| Speed | nhanh | trung | chậm |
| Parallel | native | paid cloud | manual |
| Multi-tab/window | ✅ | ❌ | ✅ |
| iframe | ✅ | hạn chế | ✅ |
| API testing | ✅ | ✅ | ❌ |
| Auto-wait | ✅ | ✅ | thủ công |
| Language | JS/TS, Python, Java | JS/TS | Mọi |
| Debug DX | ⭐ trace viewer | ⭐ time-travel UI | weak |

→ **Playwright** là default tốt nhất 2025 cho project mới.

---

### T10. Detox vs Maestro (Mobile)

| | Detox | Maestro |
|---|---|---|
| Engine | gray-box (hook native) | black-box (UI automator) |
| Config | JS, phức tạp | YAML, đơn giản ⭐ |
| Speed | nhanh | nhanh hơn |
| Platform | iOS, Android, RN | iOS, Android, Flutter, Web |
| Reliability | high (sync) | high |
| CI setup | nặng | nhẹ |
| Learning | trung | easy |
| Community | mature | growing fast |

→ **Maestro** cho project mới (2024+).

```yaml
# maestro/login.yaml
appId: com.myapp
---
- launchApp
- tapOn: "Email"
- inputText: "test@example.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Login"
- assertVisible: "Welcome"
- takeScreenshot: home
```

---

### T11. Storybook — component-driven dev & test

**Use cases:**
- Develop component isolated (no app state needed)
- Visual documentation
- Visual regression test (Chromatic)
- A11y test (addon)
- Interaction test (`play` function)

```tsx
// Button.stories.tsx
export default { component: Button } satisfies Meta<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Click me' }
}

export const Disabled: Story = {
  args: { ...Primary.args, disabled: true }
}

export const WithInteraction: Story = {
  args: Primary.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await expect(canvas.getByText('Clicked!')).toBeInTheDocument()
  }
}
```

---

### T12. Coverage — đọc đúng

| Metric | Đo |
|---|---|
| Lines | % dòng được thực thi |
| Statements | % câu lệnh (1 dòng có nhiều stmt) |
| Functions | % function được gọi |
| Branches | % nhánh if/else/switch được thử |

**Mục tiêu thực tế:**
- 80% tổng coverage là rất tốt
- **Critical path 100%** (login, payment, auth)
- Coverage cao ≠ test tốt (chạy code không = assert behavior)
- Combine với **mutation testing** để biết test thực sự mạnh

```json
"coverageThreshold": {
  "global": { "branches": 70, "functions": 80, "lines": 80, "statements": 80 },
  "./src/lib/payment.ts": { "branches": 100, "functions": 100, "lines": 100, "statements": 100 }
}
```

---

<a id="u-system-design"></a>
## Phần U — System Design FE / Mobile

### U1. Design Frontend cho app như Twitter / Instagram feed

**Discussion points:**

**1. Functional requirements:**
- Infinite scroll feed
- Like, comment, share
- Real-time update khi có post mới
- Image/video render mượt
- Offline support cơ bản

**2. Non-functional:**
- LCP < 2.5s
- Smooth scroll 60fps
- Bundle < 200KB initial
- Accessible (WCAG AA)
- Offline-first đọc

**3. Architecture:**
```
[Mobile App / Web]
       ↓
   API Gateway / BFF (cache, auth)
       ↓
[Feed Service] [Post Service] [User Service] [Media Service]
       ↓                          ↓
   PostgreSQL + Redis        S3 + CloudFront CDN
```

**4. FE design decisions:**
- **List**: virtualization (FlashList/react-virtual) — render 10-15 cards visible
- **Image**: AVIF/WebP, lazy load, blurhash placeholder, CDN responsive
- **Video**: HLS adaptive, autoplay muted on viewport, pause off-screen
- **Cache**: TanStack Query staleTime, persist với MMKV
- **Pagination**: cursor-based (`?cursor=xxx`) — stable cho feed thay đổi
- **Real-time**: WebSocket subscribe → prepend new posts, show "X new posts" banner
- **Optimistic UI**: like → update ngay, rollback nếu fail
- **State**: server cache (Query) + UI local (Zustand)
- **Navigation**: stack + tab + modal cho post detail
- **Image upload**: signed URL S3 direct, compress trước upload

**5. Performance:**
- Code split per route
- Prefetch next page khi scroll 80%
- Preload top images
- Worker để parse big JSON
- Service Worker (web) cho offline shell

**6. Scaling concerns:**
- CDN cache hot post
- Read replicas DB
- Fanout cho timeline (push vs pull)
- Rate limit per user

---

### U2. Design Realtime Chat (như Slack/WhatsApp)

**Requirements:**
- 1-1, group chat
- Typing indicator, read receipts
- Online presence
- Offline message queue
- E2E encryption (optional)

**Stack:**
- Transport: **WebSocket** (Socket.IO, native) hoặc managed (Pusher, Ably, Supabase Realtime)
- Server: Node + Redis pub/sub (scale horizontal)
- DB: messages table indexed by `(chat_id, created_at)`
- Push: FCM (Android) + APNs (iOS) khi user offline
- Media: S3 + signed URL

**FE concerns:**
- Optimistic send → render ngay, mark "sending" → "sent" → "delivered" → "read"
- Message status pipeline
- Local DB (WatermelonDB / SQLite / MMKV) cho offline
- Reconnect logic + retry queue
- Diff sync: gửi `lastMessageId` khi reconnect, server trả delta
- Virtualized message list (reverse — newest at bottom)
- Typing event debounced (3-5s timeout)
- Notification badge count

---

### U3. Design Image Gallery (Pinterest-like)

- **Masonry layout** (cột không đều) — `react-window` không hỗ trợ native → dùng `react-photo-album` hoặc custom
- **Lazy load** với IntersectionObserver
- **Responsive images**: `<picture>` + `srcset` + CDN transform (?w=400)
- **Skeleton** giữ aspect-ratio (chống CLS)
- **Modal full screen** với `react-image-zoom` hoặc Lightbox
- **Infinite scroll** + recover scroll position khi back
- **CDN với image optimization**: Cloudinary, imgix, Cloudflare Images
- **Format negotiation**: server đọc `Accept: image/avif,image/webp` → trả format phù hợp

---

### U4. Design Search & Filter (e-commerce)

**Architecture:**
```
[Client] → [Search BFF] → [ElasticSearch / Algolia / Meilisearch]
                       → [Postgres for source of truth]
```

**FE concerns:**
- **Debounce input** (200-300ms)
- **Cancel previous request** (AbortController hoặc TanStack Query auto)
- **Cache result** theo query (`queryKey: ['search', q]`)
- **URL state**: search/filter trong query string (refresh-safe, share-able)
- **Skeleton** + show "Loading…" sau 500ms (tránh flash khi nhanh)
- **Empty state** rõ ràng + suggestion
- **Recent search** localStorage
- **Autocomplete** với keyboard nav (↑↓ Enter Esc)
- **Filter** counted (badge số filter active)
- **Mobile**: bottom sheet cho filter

```ts
const params = useSearchParams()
const q = params.get('q') ?? ''
const filters = JSON.parse(params.get('f') ?? '{}')

const { data } = useQuery({
  queryKey: ['search', q, filters],
  queryFn: ({ signal }) => api.search({ q, filters }, signal),
  enabled: q.length >= 2,
  staleTime: 60_000
})
```

---

### U5. Design Form (Multi-step Wizard)

- **State machine** (XState) hoặc reducer
- **Validation per step** + final validate
- **Persist progress** sessionStorage (recover khi refresh)
- **Skip step** không hợp lệ
- **Progress indicator** rõ
- **Back/Forward** giữ state
- **Mobile keyboard** không che input (KeyboardAvoidingView)
- **Inline error** cạnh field
- **Submit loading state** + disable double-submit
- **Confirm before leave** unsaved (beforeunload web, navigation listener RN)

```ts
// React Hook Form + Zod cho mỗi step
const StepSchemas = {
  1: z.object({ name: z.string().min(2) }),
  2: z.object({ email: z.string().email() }),
  3: z.object({ password: z.string().min(8) })
}
```

---

### U6. Design Offline-first Mobile App

**Core principles:**
- Local-first: data lưu local trước, sync khi có mạng
- Optimistic UI: action work offline, conflict resolve khi sync
- Visible sync state: "Pending sync", "Synced"

**Stack:**
- **Local DB**: WatermelonDB / SQLite / Realm / MMKV cho key-value
- **Sync engine**: WatermelonDB sync protocol, PowerSync, Replicache
- **Queue**: pending mutation lưu local, retry khi online
- **Conflict resolution**: last-write-wins, CRDT, manual (Git-like)

**FE pattern:**
```ts
// Pseudo
async function createPost(data) {
  const local = await db.posts.create({ ...data, status: 'pending' })
  syncQueue.add(() => api.createPost(data).then(remote => 
    db.posts.update(local.id, { ...remote, status: 'synced' })
  ))
}

// Online listener
NetInfo.addEventListener(state => {
  if (state.isConnected) syncQueue.flush()
})
```

---

### U7. Design Auth Flow (Mobile)

**Components:**
- Login (email/password, OAuth, biometric)
- Sign up + email verify
- Forgot password
- Auto-login (refresh token)
- Logout (revoke server-side)

**Flow:**
```
[App start]
  ↓
[Check token in Keychain]
  ↓
[Valid?] → Yes → [Refresh if near expiry] → Home
  ↓ No
[Login screen]
  ↓
[Login API] → Get access + refresh
  ↓
[Save refresh in Keychain, access in memory/state]
  ↓
[Set Authorization header in axios interceptor]
  ↓
[Home]
```

**Token strategy:**
- **Access token** (15p) — memory only
- **Refresh token** (7d) — Keychain/SecureStore, rotate mỗi refresh
- **401 interceptor** → auto refresh → retry → fail → logout

**Biometric:**
- Sau login đầu tiên, hỏi "Enable Face ID?"
- Nếu yes, lưu refresh token với `WHEN_UNLOCKED_THIS_DEVICE_ONLY` + biometry
- Lần sau mở app → Face ID → unlock token → auto refresh → vào app

---

### U8. Design Notification System

**Types:**
- **Push** (FCM, APNs) — khi app closed/background
- **In-app** (toast, banner) — khi app open
- **Email/SMS** — backend
- **WebSocket** — realtime in-app

**FE concerns:**
- Request permission đúng thời điểm (sau onboarding, không pop ngay)
- Handle khi user denied (graceful fallback)
- **Deep link** từ notification → đúng screen
- **Foreground** notification: show toast trong app
- **Background**: OS handle
- **Notification action**: reply, mark read inline
- **Badge count**: sync với server

```ts
import messaging from '@react-native-firebase/messaging'

// Foreground
messaging().onMessage(async msg => {
  showInAppToast(msg.notification)
})

// Background / closed → tap
messaging().onNotificationOpenedApp(msg => {
  navigation.navigate(msg.data.screen, msg.data.params)
})

// App opened from quit state
messaging().getInitialNotification().then(msg => {
  if (msg) navigation.navigate(...)
})

// Token refresh
messaging().onTokenRefresh(token => api.updateDeviceToken(token))
```

---

### U9. Design Error Handling & Monitoring

**3 layers:**

**1. Component level**
- ErrorBoundary (React) → fallback UI
- Async error → try/catch trong async function

**2. Global level**
- `window.onerror`, `window.onunhandledrejection` (web)
- `ErrorUtils.setGlobalHandler` (RN)
- React Native: `errorUtils` hook

**3. Monitoring**
- **Sentry** — error tracking, perf, session replay
- **Firebase Crashlytics** — mobile crashes
- **Datadog RUM** — perf + error
- **LogRocket** — session replay

```tsx
<ErrorBoundary fallback={<ErrorScreen />} onError={(err, info) => Sentry.captureException(err, { extra: info })}>
  <App />
</ErrorBoundary>
```

**Error UX:**
- Network error → retry button
- 401 → redirect login
- 403 → permission denied screen
- 404 → not found page
- 5xx → "Something went wrong" + report ID
- Field error → inline cạnh input
- Toast cho transient error

**Don't:**
- Log/show full error stack to user
- Swallow error silently (always log to Sentry)
- Retry infinitely (max 3, exponential backoff)

---

### U10. Design Feature Flag System

**Use cases:**
- Trunk-based dev (ship code chưa expose)
- A/B test
- Gradual rollout (10% → 50% → 100%)
- Kill switch
- Per-user/per-tenant flag

**Tools:**
- **GrowthBook** (open source, self-host)
- **Unleash** (open source)
- **LaunchDarkly** (enterprise)
- **ConfigCat**, **Statsig**, **Flagsmith**

**Architecture:**
```
[Admin UI] → [Flag Server / SDK] → [Client SDK in app]
                                         ↓
                                   localStorage cache
                                         ↓
                                   useFlag('newFeature')
```

```tsx
const { value: showNew } = useFlag('checkout-v2', {
  defaultValue: false,
  userId: user.id,
  attributes: { country: user.country, plan: user.plan }
})

return showNew ? <CheckoutV2 /> : <CheckoutV1 />
```

**Best practices:**
- Tên rõ (`enable_x`, `experiment_y`)
- TTL — dọn flag cũ (debt sớm dọn)
- Track metric đi kèm
- Default safe (off khi backend chết)
- Test cả 2 path (jest mock flag)

---

### U11. Design A/B Testing

**Components:**
- Hypothesis: "Variant B tăng conversion 5%"
- Random assignment user → variant (consistent: hash userId)
- Track events theo variant
- Statistical significance (sample size calculator)
- Stop early nếu rõ winner (sequential testing)

**Tools:** GrowthBook, Statsig, Optimizely, VWO.

```ts
const variant = useExperiment('homepage-hero')
// variant = 'control' | 'treatment-a' | 'treatment-b'
analytics.track('hero_viewed', { variant })
```

**Pitfalls:**
- Mẫu nhỏ → kết luận sai (false positive)
- Stop quá sớm (peeking problem)
- Multiple test cùng lúc → interaction effect
- Novelty effect (user lạ thấy mới → tăng tạm thời)
- Survivorship bias

---

### U12. Design Internationalization (i18n)

**Lib:**
- **react-i18next** ⭐ — phổ biến
- **react-intl** (FormatJS)
- **next-intl** (Next.js)
- **Lingui** (TS-friendly)

**Concerns:**
- **Translation key** (`home.title`) vs source string (`'Welcome'` làm key)
- **Pluralization**: `'1 item' / 'N items'` — ICU MessageFormat
- **Gender**: he/she/they
- **Number/date format** theo locale (`Intl.NumberFormat`, `Intl.DateTimeFormat`)
- **Currency**: format đúng symbol & position
- **RTL** (Arabic, Hebrew) — CSS logical properties
- **Fonts**: subset theo locale (CJK = nặng → load on-demand)
- **Lazy load** translation file per locale
- **Detect locale**: `navigator.language` / `getLocales()` (RN)
- **Override**: cho user chọn trong settings
- **Translation workflow**: Crowdin, Lokalise, Phrase

```ts
import { useTranslation } from 'react-i18next'
const { t } = useTranslation()
t('cart.itemCount', { count: 5 })
// "5 items"

// JSON
{
  "cart": {
    "itemCount_one": "1 item",
    "itemCount_other": "{{count}} items"
  }
}
```

---

### U13. Design Analytics & Tracking

**Schema design:**
```ts
type Event =
  | { name: 'screen_view'; props: { screen: string; referrer?: string } }
  | { name: 'cta_click'; props: { cta: string; section: string } }
  | { name: 'purchase'; props: { value: number; currency: string; itemCount: number } }
```

**Tools:**
- **Amplitude** / **Mixpanel** — product analytics
- **Google Analytics 4** — free
- **PostHog** — open source, self-host
- **Segment** — pipeline, route đến nhiều destination
- **Sentry** — error + perf

**Patterns:**
- **Single source of truth** event names (constants file, không hardcode)
- **Common props** (userId, sessionId, deviceId, appVersion) auto append
- **Sampling** cho perf event (10%)
- **Consent** (GDPR) — không track trước khi opt-in
- **PII** — không gửi email/phone raw (hash)
- **Funnel** quan trọng define từ đầu (signup, activation, purchase)

---

### U14. Design CDN & Asset Delivery

**Decisions:**
- Edge locations gần user (Cloudflare, CloudFront, Fastly)
- Cache key strategy (URL + Vary headers)
- TTL theo asset type
- Purge strategy (versioned URL > invalidation)
- Image optimization on the fly (Cloudinary, imgix)
- Geo routing (đẩy về region đúng)

**Modern stack:**
```
User → DNS (Cloudflare) → Edge (Cloudflare Workers SSR) → Origin (Vercel/AWS)
                              ↓
                          KV/D1 (edge DB)
```

→ **Edge SSR** cho personalize tốt + latency thấp.

---

### U15. Design Monitoring & Observability

**3 pillars:**
1. **Metrics** — Prometheus, Datadog, CloudWatch
2. **Logs** — Loki, ELK, Logtail, Datadog
3. **Traces** — Jaeger, Tempo, Honeycomb (distributed tracing)

**OpenTelemetry** — standard SDK collect all 3, ship đâu cũng được.

**FE-specific:**
- **RUM** (Real User Monitoring) — Sentry, Datadog RUM
- **Synthetic** monitoring — Checkly, Pingdom
- **Error tracking** — Sentry
- **Session replay** — LogRocket, Sentry Replay, Hotjar
- **Heatmap** — Hotjar, FullStory

**Mobile:**
- Sentry / Firebase Crashlytics cho crashes
- Firebase Performance cho startup time, screen render
- Network inspection

**Alert:**
- Error rate spike → PagerDuty
- p95 latency > threshold
- Crash-free rate < 99.5%
- Custom business metric (signup drop)

---

### U16. Design BFF (Backend-for-Frontend)

**Why:**
- FE & mobile cần shape data khác
- Hide microservice complexity từ client
- Aggregate multiple API calls server-side (giảm round-trip)
- Auth termination, rate limit centralized
- Type safety end-to-end (tRPC, GraphQL)

**Stack:**
- **GraphQL** gateway (Apollo Router, Hasura)
- **tRPC** server (Next.js API route, Hono)
- **Custom Node BFF** (Express/Fastify/Hono)

```
[Mobile App]    [Web App]
     ↓              ↓
[Mobile BFF]   [Web BFF]
     ↓              ↓
   [Microservices: User, Order, Catalog, ...]
```

→ Mỗi platform có BFF tối ưu cho mình, microservices không lo về client diversity.

---

### U17. Design Mobile App Architecture (Clean)

```
src/
├── app/                        # entry, navigation, providers
├── shared/
│   ├── ui/                     # design system primitives
│   ├── lib/                    # utils
│   ├── hooks/
│   ├── api/                    # axios base, interceptors
│   ├── i18n/
│   └── types/
├── entities/                   # domain models (User, Post)
│   ├── user/
│   └── post/
├── features/                   # business features
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── store/
│   │   └── index.ts            # public API barrel
│   ├── feed/
│   └── profile/
├── widgets/                    # composed UI (Header, Sidebar)
└── pages/ or screens/          # route handlers
```

→ Feature-Sliced Design (FSD) hoặc tương tự.

**Layered:**
```
Presentation (screens, hooks)
    ↓
Application (use cases)
    ↓
Domain (entities, business rules — pure, no FW)
    ↓
Infrastructure (API, DB, native modules)
```

→ Domain layer thuần TS, test dễ, đổi React → Vue cũng không động.

---

### U18. Design Release Strategy

**Strategies:**
- **Blue-Green** — switch traffic giữa 2 env identical
- **Canary** — ship 1% → monitor → 10% → 100%
- **Rolling** — update từng instance dần
- **Feature flag rollout** — code đã có, flag bật dần
- **A/B** — chia traffic test variant

**Mobile-specific:**
- **Staged rollout** (Play Store 1%, 5%, 20%, 50%, 100%)
- **TestFlight** (iOS) internal/external testers
- **OTA update** (EAS Update, CodePush) — chỉ JS, không native
- **Force update** dialog nếu version < min supported
- **Soft update** dialog cho new version available

```ts
// Check version
const { minSupported, latest } = await api.getAppVersion()
if (currentVersion < minSupported) showForceUpdate()
else if (currentVersion < latest) showSoftUpdate()
```

---

### U19. Design Cross-platform Code Sharing

**Options:**
| Approach | Share % | Pros | Cons |
|---|---|---|---|
| **React Native + Web** (RN Web) | 60-80% | 1 codebase | Web perf yếu hơn native web |
| **Expo Router + Universal** | 70% | File-based, modern | Mới |
| **Solito** | 70% | Next.js + Expo bridge | Setup phức tạp |
| **Capacitor / Ionic** | 90% | Web tech all-in | Native feel hạn chế |
| **Flutter** | 95% | Native perf, 1 codebase | Dart, không phải JS |
| **Native riêng** | 0% | Best UX | 3x cost |

**Monorepo structure:**
```
apps/
  web/             # Next.js
  mobile/          # Expo
packages/
  ui/              # shared components (RN + react-native-web)
  api-client/      # tRPC client
  types/           # shared types
  utils/
```

**Tools:** Turborepo, Nx, pnpm workspaces.

---

### U20. Top FE System Design Topics — chuẩn bị trả lời

Khi gặp câu "Design X", structure trả lời:

1. **Clarify requirements** (5 phút)
   - User scale? Geography? Mobile/web?
   - Read vs write heavy?
   - Real-time? Offline?
   - Auth?
2. **High-level architecture** (10 phút)
   - Vẽ sơ đồ client-server
   - Identify components
3. **Deep dive 2-3 areas** (15-20 phút)
   - Data model
   - API design
   - Caching
   - Realtime
   - Critical UX (perf, accessibility)
4. **Trade-offs** explicit (5 phút)
   - "Tôi chọn cursor pagination vì... thay vì offset vì..."
   - "Optimistic update tốt cho like, không hợp cho payment"
5. **Monitoring & rollout** (5 phút)
   - Metric quan trọng
   - Feature flag, canary

**Topic hay gặp:**
- Twitter/Instagram feed
- Chat app
- Google Docs collab (CRDT)
- Photo gallery / Pinterest
- Search & filter (Amazon)
- Multi-step form
- Video streaming player
- Stock ticker (real-time)
- File upload (resumable)
- Notification system
- Dashboard với chart real-time
- Offline-first PWA
- Design Component Library
- Design Micro-frontend
- Design CDN strategy
- Design auth flow (OAuth + biometric)

---

<a id="v-react-19"></a>
## Phần V — React 19 (Latest 2024-2025)

> **React 19** stable release: **December 2024**. Đây là bản update lớn nhất kể từ Hooks (2018), với Actions, Compiler, Server Components stable, và nhiều API mới.

### V1. React 19 có gì mới? (Quick recap)

**Top features:**
1. **Actions + `useActionState`** — handle form/mutation pattern
2. **`useFormStatus`** — biết form đang submitting (không cần prop drilling)
3. **`useOptimistic`** — optimistic update built-in
4. **`use()` hook** — đọc Promise/Context **conditionally** trong render
5. **`ref` as prop** — không cần `forwardRef` nữa
6. **Server Components** stable
7. **Document Metadata** — `<title>`, `<meta>`, `<link>` tự hoisted lên `<head>`
8. **Asset loading hints** — `preload`, `preloadModule`, `preconnect`, `prefetchDNS`
9. **`<Context>` as Provider** — không cần `.Provider`
10. **React Compiler** (RC) — auto-memoize, không cần `useMemo`/`useCallback` thủ công
11. **Improved Hydration errors** — báo cụ thể element nào mismatch
12. **`useDeferredValue` initial value**
13. **Custom Elements (Web Components)** full support
14. **Error boundaries cải tiến** — `createRoot` có `onUncaughtError`, `onCaughtError`

---

### V2. Actions là gì?

**Action** = async function pass vào prop `action` của `<form>` (hoặc gọi qua transition). React tự handle pending state, optimistic update, error.

**Trước React 19 (manual):**
```tsx
function ContactForm() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      await api.submit(new FormData(e.target))
    } catch (err) { setError(err) }
    finally { setPending(false) }
  }
  return <form onSubmit={handleSubmit}>...</form>
}
```

**React 19 với Action:**
```tsx
async function submitAction(formData: FormData) {
  await api.submit(formData)
}

function ContactForm() {
  return (
    <form action={submitAction}>
      <input name="email" />
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()        // tự lấy state từ form cha
  return <button disabled={pending}>{pending ? 'Sending...' : 'Send'}</button>
}
```

→ Code ngắn, không cần `useState` thủ công cho `pending`.

---

### V3. `useActionState` — quản lý state cho action

```tsx
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    try {
      const result = await api.signup(formData)
      return { success: true, data: result }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },
  { success: false, error: null }              // initial state
)

return (
  <form action={formAction}>
    <input name="email" />
    {state.error && <p>{state.error}</p>}
    {state.success && <p>Welcome!</p>}
    <button disabled={isPending}>Sign up</button>
  </form>
)
```

> 🆕 Trước đây tên là `useFormState` (React 18 canary). Trong React 19 stable đổi thành `useActionState`.

---

### V4. `useOptimistic` — UI nhanh trước khi server confirm

```tsx
function Likes({ likes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (current, _) => current + 1            // reducer pattern
  )

  async function handleLike(formData) {
    addOptimisticLike()                     // update ngay
    await api.like()                        // server call (có thể fail)
  }

  return (
    <form action={handleLike}>
      <button>❤️ {optimisticLikes}</button>
    </form>
  )
}
```

→ Nếu server fail, React tự rollback về `likes` thật.

---

### V5. `use()` hook — đọc Promise/Context conditionally

**Khác với hooks thường (không được gọi trong if):**

```tsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise)     // suspend cho đến khi resolve
  return comments.map(c => <Comment {...c} />)
}

// Parent
<Suspense fallback={<Spinner />}>
  <Comments commentsPromise={fetchComments()} />
</Suspense>

// use() trong if (không được với hooks khác!)
function Profile({ shouldShow }) {
  if (shouldShow) {
    const data = use(dataPromise)          // ✅ OK với use()
    return <div>{data}</div>
  }
  return null
}
```

**Read Context với use():**
```tsx
function Theme() {
  const theme = use(ThemeContext)          // tương tự useContext
  // nhưng có thể gọi trong if/loop
}
```

---

### V6. ref as prop — không cần `forwardRef`

**Trước React 19:**
```tsx
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />
})
```

**React 19:**
```tsx
function Input({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}

// Usage giống nhau
<Input ref={inputRef} />
```

→ `forwardRef` deprecated dần. Codemod tự convert: `npx codemod react/19/replace-use-form-state`.

---

### V7. Document Metadata — tự hoist lên `<head>`

```tsx
function BlogPost({ post }) {
  return (
    <article>
      <title>{post.title}</title>           {/* tự lên <head>! */}
      <meta name="description" content={post.excerpt} />
      <link rel="canonical" href={post.url} />
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  )
}
```

→ Không cần `react-helmet` nữa cho hầu hết case.

> ⚠️ Trong Next.js App Router, vẫn nên dùng **Metadata API** (`generateMetadata` export) vì cần ở build/server-side cho SEO.

---

### V8. Asset Loading Hints

```tsx
import { preload, preinit, prefetchDNS, preconnect } from 'react-dom'

function Page() {
  preload('/hero.jpg', { as: 'image' })
  preload('/critical.css', { as: 'style' })
  preinit('https://cdn.example.com/script.js', { as: 'script' })
  prefetchDNS('https://api.example.com')
  preconnect('https://cdn.example.com')
  return <div>...</div>
}
```

---

### V9. `<Context>` as Provider

**Trước:**
```tsx
const ThemeContext = createContext('light')
<ThemeContext.Provider value="dark">...</ThemeContext.Provider>
```

**React 19:**
```tsx
const ThemeContext = createContext('light')
<ThemeContext value="dark">...</ThemeContext>     {/* dùng trực tiếp */}
```

---

### V10. React Compiler (RC, sắp stable 2025)

**Vấn đề:** trước đây phải `useMemo`/`useCallback`/`React.memo` thủ công → verbose, dễ sai deps.

**React Compiler** tự phân tích code, tự memoize → bỏ qua mọi `useMemo`/`useCallback`.

```tsx
// Code thường
function ProductList({ products, filter }) {
  const filtered = products.filter(p => p.name.includes(filter))
  const handleClick = (id) => navigate(`/p/${id}`)
  return filtered.map(p => <Card key={p.id} onClick={() => handleClick(p.id)} />)
}
// Compiler tự memoize `filtered`, `handleClick`, từng Card prop
```

**Setup (Babel/Vite/Next 15):**
```js
// babel.config.js
{ plugins: [['babel-plugin-react-compiler', {}]] }

// Next 15
// next.config.js
experimental: { reactCompiler: true }
```

Có ESLint plugin (`eslint-plugin-react-hooks` đã include rule mới) cảnh báo code không tương thích.

---

### V11. Server Components (RSC) — render trên server, không gửi JS xuống

**RSC** không chạy ở browser — không có `useState`, `useEffect`, không có event handler. **Chỉ render** ra HTML/JSON.

```tsx
// app/page.tsx (Server Component default trong Next.js App Router)
import { db } from '@/lib/db'

export default async function Page() {
  const posts = await db.posts.findMany()       // gọi DB trực tiếp!
  return (
    <ul>
      {posts.map(p => <PostItem key={p.id} post={p} />)}
    </ul>
  )
}

// Component cần interactivity → 'use client'
'use client'
export function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>♥</button>
}
```

**Lợi ích:**
- Bundle JS nhỏ hơn (RSC không gửi xuống client)
- Truy cập DB/file system/secret trực tiếp
- Streaming HTML
- Tự handle loading với Suspense

**Hạn chế:**
- Không có hooks (useState, useEffect, useReducer)
- Không có event handler
- Không có context (cần Client Component wrapper)
- Phải framework hỗ trợ (Next.js App Router, Waku)

---

### V12. Server Actions — mutation từ form/button gọi function server

```tsx
// app/actions.ts
'use server'                                     // mark whole file as server actions

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  await db.posts.create({ data: { title } })
  revalidatePath('/posts')
}

// app/new-post/page.tsx (Server Component)
import { createPost } from '../actions'

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button>Create</button>
    </form>
  )
}
```

→ Không cần API route, không cần fetch — gọi function server trực tiếp từ form. Next.js handle serialization tự động.

---

### V13. Migration React 18 → 19 (key changes)

| Trước (React 18) | Sau (React 19) |
|---|---|
| `useFormState` | `useActionState` |
| `ReactDOM.render` | `createRoot().render` (đã từ R18, R19 enforce) |
| `defaultProps` (function component) | default param hoặc destructuring default |
| String refs | callback ref |
| `forwardRef` | `ref` as prop (forwardRef vẫn work nhưng deprecate dần) |
| Legacy Context (`contextTypes`) | `createContext` |
| `propTypes` (function component) | TypeScript |
| `<Context.Provider>` | `<Context>` |

Codemod: `npx codemod@latest react/19/...` chạy nhiều migration tự động.

---

### V14. React 19 + TypeScript

```tsx
// ref as prop với TS
import { Ref } from 'react'

function Input({ ref, ...props }: { ref?: Ref<HTMLInputElement> } & InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={ref} {...props} />
}

// Action với typed FormData
async function submit(prevState: State, formData: FormData): Promise<State> {
  const email = formData.get('email') as string
  return { ok: true }
}

const [state, action, pending] = useActionState(submit, { ok: false })
```

---

<a id="w-nextjs-15"></a>
## Phần W — Next.js 15 App Router (Latest)

> **Next.js 15** released **October 2024**, kèm **React 19**, **Turbopack stable** cho dev, async request APIs, PPR, và cải thiện caching defaults.

### W1. Next.js 15 có gì mới?

1. **React 19 support** (RC trong 15.0, stable 15.1+)
2. **Async Request APIs** — `cookies()`, `headers()`, `params`, `searchParams` giờ là async
3. **Caching defaults thay đổi** — `fetch()`, GET Route Handlers, Client Router Cache **không cache mặc định** nữa (trước đây cache aggressive)
4. **Turbopack** stable cho `next dev` (5x nhanh hơn webpack)
5. **`<Form>` component** — client navigation cho form
6. **`after()` API** — chạy code sau khi response sent (analytics, logging)
7. **Improved error UI** + stack trace với React 19
8. **Self-hosting improvements** — better cache control, `Cache-Control: stale-while-revalidate`
9. **TypeScript config** (`next.config.ts`)
10. **Partial Prerendering (PPR)** — incremental opt-in

---

### W2. App Router vs Pages Router

| | Pages Router (legacy) | App Router (modern, default từ 13) ⭐ |
|---|---|---|
| Folder | `pages/` | `app/` |
| Component default | Client | **Server** (`'use client'` để mark client) |
| Data fetching | `getServerSideProps`, `getStaticProps` | `async function` + `fetch()` trong component |
| Layout | `_app.tsx`, `_document.tsx` | `layout.tsx` per segment (nested layout) |
| Routing | file-based (`pages/about.tsx`) | folder-based (`app/about/page.tsx`) |
| Loading | manual | `loading.tsx` (Suspense fallback) |
| Error | `_error.tsx` | `error.tsx` per segment (Error Boundary) |
| Streaming | hạn chế | native với Suspense |
| Server Actions | không | ✅ |

→ Project mới: dùng **App Router**.

---

### W3. File conventions trong App Router

```
app/
├── layout.tsx              # Root layout (bắt buộc), wrap tất cả page
├── page.tsx                # / (route /)
├── loading.tsx             # Suspense fallback cho segment này
├── error.tsx               # Error boundary (Client Component)
├── not-found.tsx           # 404 cho segment
├── template.tsx            # Giống layout nhưng re-mount mỗi navigation
├── global-error.tsx        # Lỗi root layout
├── route.ts                # API route handler (GET/POST/...)
├── middleware.ts           # ngoài app/ — edge runtime
├── about/
│   └── page.tsx            # /about
├── blog/
│   ├── layout.tsx          # layout chung cho /blog/*
│   ├── page.tsx            # /blog
│   └── [slug]/
│       └── page.tsx        # /blog/:slug
├── (marketing)/            # group route — không ảnh hưởng URL
│   └── pricing/page.tsx    # /pricing
└── api/
    └── users/
        └── route.ts        # GET/POST /api/users
```

**Dynamic routes:**
- `[slug]` — single param (`/blog/abc`)
- `[...slug]` — catch-all (`/docs/a/b/c`)
- `[[...slug]]` — optional catch-all (matches `/docs` cũng OK)

---

### W4. Server Component vs Client Component (Next 15)

```tsx
// app/page.tsx — Server Component (default)
import { db } from '@/lib/db'
import { LikeButton } from './LikeButton'

export default async function Page() {
  const posts = await db.posts.findMany()       // async OK, gọi DB trực tiếp
  return (
    <ul>
      {posts.map(p => (
        <li key={p.id}>
          {p.title}
          <LikeButton postId={p.id} />          {/* client island */}
        </li>
      ))}
    </ul>
  )
}

// app/LikeButton.tsx
'use client'                                     // ← MUST be first line
import { useState } from 'react'

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>♥</button>
}
```

**Rules:**
- Server Component có thể import Client Component
- Client Component **KHÔNG** thể import Server Component trực tiếp (chỉ qua `children` prop)
- Pass data từ Server → Client phải **serializable** (no function, Date OK in R19)

---

### W5. Data Fetching trong App Router

```tsx
// 1. fetch() trong Server Component
export default async function Page() {
  const data = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }                    // ISR: revalidate sau 60s
  }).then(r => r.json())
  return <ul>...</ul>
}

// 2. Cache options (Next 15)
fetch(url)                                       // ⚠️ KHÔNG cache mặc định (đổi từ 14)
fetch(url, { cache: 'force-cache' })             // cache lâu
fetch(url, { cache: 'no-store' })                // không cache
fetch(url, { next: { revalidate: 3600 } })       // ISR 1h
fetch(url, { next: { tags: ['posts'] } })        // tag-based revalidate

// 3. Revalidate manually
import { revalidatePath, revalidateTag } from 'next/cache'
revalidatePath('/posts')
revalidateTag('posts')

// 4. Parallel fetch
export default async function Page() {
  const [posts, users] = await Promise.all([
    fetch(postsUrl).then(r => r.json()),
    fetch(usersUrl).then(r => r.json())
  ])
}

// 5. Direct DB call (tránh fetch nội bộ)
import { db } from '@/lib/db'
const posts = await db.posts.findMany()
```

---

### W6. Async Request APIs (Next 15 BREAKING)

**Trước (sync):**
```tsx
import { cookies, headers } from 'next/headers'
const cookie = cookies().get('token')
```

**Next 15 (async — BREAKING):**
```tsx
import { cookies, headers } from 'next/headers'
const cookie = (await cookies()).get('token')
const h = (await headers()).get('user-agent')

// params, searchParams cũng async
export default async function Page({ params, searchParams }) {
  const { slug } = await params
  const { q } = await searchParams
}
```

→ Codemod: `npx @next/codemod@canary next-async-request-api .`

---

### W7. Server Actions chi tiết

```tsx
// app/actions.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const Schema = z.object({
  title: z.string().min(3),
  content: z.string()
})

export async function createPost(prevState: any, formData: FormData) {
  const parsed = Schema.safeParse({
    title: formData.get('title'),
    content: formData.get('content')
  })
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }
  const post = await db.posts.create({ data: parsed.data })
  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)
}

// app/new/page.tsx
'use client'
import { useActionState } from 'react'
import { createPost } from '../actions'

export default function New() {
  const [state, action, pending] = useActionState(createPost, { errors: {} })
  return (
    <form action={action}>
      <input name="title" />
      {state.errors?.title && <p>{state.errors.title[0]}</p>}
      <textarea name="content" />
      <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>
    </form>
  )
}
```

**Pros:**
- Không cần API route boilerplate
- Form work khi JS disabled (progressive enhancement)
- Type-safe end-to-end

**Cons:**
- Coupling FE ↔ BE (Next-only)
- Security: tự validate input, không trust!

---

### W8. Streaming & Suspense

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<UserSkeleton />}>
        <UserList />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}

async function UserList() {
  const users = await db.users.findMany()       // slow
  return <ul>{users.map(...)}</ul>
}
```

→ Browser nhận shell ngay, mỗi Suspense stream khi sẵn sàng. UX nhanh hơn fetch all rồi render.

**Auto Suspense:** `loading.tsx` cùng cấp với `page.tsx` tự wrap Suspense.

---

### W9. Caching trong Next 15 (4 layers)

```
┌────────────────────────────────────────┐
│ 1. Request Memoization (per request)   │  ← fetch trùng URL trong 1 request → 1 lần
├────────────────────────────────────────┤
│ 2. Data Cache (persistent, shared)     │  ← fetch + DB query cache lâu, revalidate có chủ ý
├────────────────────────────────────────┤
│ 3. Full Route Cache (build time)       │  ← static route → HTML cached
├────────────────────────────────────────┤
│ 4. Client Router Cache (per session)   │  ← navigation page cache trong RAM
└────────────────────────────────────────┘
```

**⚠️ Next 15 default behavior thay đổi:**
- `fetch()` **không cache mặc định** (trước cache lâu)
- GET Route Handlers **không cache mặc định**
- Client Router Cache **không cache page mặc định** (chỉ layout)

→ **Opt-in caching** thay vì opt-out → safer cho dev.

**Force cache:**
```ts
// fetch
fetch(url, { cache: 'force-cache' })
// hoặc
import { unstable_cache } from 'next/cache'
const getCached = unstable_cache(async () => db.query(), ['key'], { revalidate: 3600 })
```

---

### W10. Partial Prerendering (PPR) — experimental

Kết hợp **static shell** + **dynamic holes** trong 1 page.

```tsx
// app/products/[id]/page.tsx
export const experimental_ppr = true

export default function Product({ params }) {
  return (
    <>
      <ProductInfo id={params.id} />            {/* static, prerendered */}
      <Suspense fallback={<CartSkeleton />}>
        <Cart />                                {/* dynamic, stream */}
      </Suspense>
    </>
  )
}
```

→ User nhận HTML static gần như instant, phần dynamic stream sau.

```js
// next.config.js
experimental: { ppr: 'incremental' }
```

---

### W11. Route Handlers (replace API routes)

```ts
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')
  const posts = await db.posts.findMany({ where: { title: { contains: q } } })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const post = await db.posts.create({ data: body })
  return NextResponse.json(post, { status: 201 })
}

// Dynamic
// app/api/posts/[id]/route.ts
export async function GET(req: NextRequest, { params }) {
  const { id } = await params                   // async trong 15!
  const post = await db.posts.findUnique({ where: { id } })
  if (!post) return new Response('Not found', { status: 404 })
  return NextResponse.json(post)
}
```

**Runtime selection:**
```ts
export const runtime = 'edge'                   // Edge Runtime (Cloudflare-like)
export const runtime = 'nodejs'                 // default, full Node API
```

---

### W12. Middleware

```ts
// middleware.ts (root, không trong app/)
import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Auth check
  const token = req.cookies.get('token')
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Headers
  const res = NextResponse.next()
  res.headers.set('x-custom', 'value')
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
```

→ Chạy ở **Edge Runtime** trước khi vào route handler / page.

---

### W13. Metadata API (SEO)

```tsx
// Static
export const metadata: Metadata = {
  title: 'My Page',
  description: '...',
  openGraph: {
    title: 'My Page',
    images: ['/og.png']
  },
  twitter: { card: 'summary_large_image' }
}

// Dynamic
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await db.posts.findUnique({ where: { id: params.id } })
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` }
  }
}

// Template
// layout.tsx
export const metadata = {
  title: { default: 'My Site', template: '%s | My Site' }
}
```

**Special files** tự gen metadata:
- `app/icon.png`, `app/apple-icon.png`
- `app/opengraph-image.tsx` (dynamic OG image gen)
- `app/sitemap.ts`, `app/robots.ts`
- `app/manifest.ts`

---

### W14. Image & Font Optimization

```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200} height={800}
  priority                                       // LCP image
  placeholder="blur"
  blurDataURL="data:image/..."
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Remote images cần config
// next.config.js
images: {
  remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }]
}
```

```tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'vietnamese'], display: 'swap' })

export default function Layout({ children }) {
  return <html className={inter.className}><body>{children}</body></html>
}

// Local font
import localFont from 'next/font/local'
const myFont = localFont({ src: './my-font.woff2' })
```

→ Next tự download Google Font lúc build (không request runtime), subset, preload.

---

### W15. `<Form>` component (Next 15)

```tsx
import Form from 'next/form'

export default function Search() {
  return (
    <Form action="/search">
      <input name="q" />
      <button>Search</button>
    </Form>
  )
}
```

→ Client-side navigate (`/search?q=...`) thay vì full page reload. Auto prefetch.

---

### W16. `after()` API (Next 15)

```ts
import { after } from 'next/server'

export async function GET() {
  const data = await fetchData()

  after(async () => {
    // Chạy SAU khi response sent đến user
    await analytics.track('page_view')
    await log.write({ ... })
  })

  return NextResponse.json(data)
}
```

→ User không phải chờ analytics/log.

---

### W17. Self-hosting Next.js (production)

```bash
# Build
next build

# Run
next start                                       # 1 instance
PORT=3000 next start

# Production stack
PM2 / Docker / Kubernetes
```

**Cache control headers** Next 15 tự set tốt hơn:
```
Cache-Control: s-maxage=31536000, stale-while-revalidate
```

**Docker example:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]

# next.config.js: output: 'standalone'
```

---

### W18. Common interview questions Next.js

**Q1. Khi nào dùng Server Component vs Client Component?**

| Server | Client |
|---|---|
| Fetch data | `useState`, `useEffect` |
| Truy cập backend (DB, file) | Event handler (onClick) |
| Giữ secret (API key) | Browser API (window, localStorage) |
| Bundle JS không gửi xuống | React hooks (useReducer, useContext) |
| Default | Phải mark `'use client'` |

**Q2. Sự khác nhau giữa `getServerSideProps` và Server Component?**
- `getSSP` (Pages Router): chạy server cho mỗi request, return props cho Client Component
- Server Component (App Router): chạy server, render trực tiếp, không cần "props pipeline"
- Server Component nhỏ gọn hơn, support streaming + Suspense

**Q3. ISR là gì?**
- **Incremental Static Regeneration** — generate static HTML khi build, revalidate background sau X giây
- Best of static (fast) + dynamic (fresh)
- `fetch(url, { next: { revalidate: 60 } })` hoặc `export const revalidate = 60`

**Q4. Khi nào Server Action vs Route Handler?**
- **Server Action**: form submit, mutation tightly coupled với UI (Next-only)
- **Route Handler**: external API, webhook, mobile app gọi, generic HTTP

**Q5. Edge Runtime vs Node.js Runtime?**
| | Edge | Node |
|---|---|---|
| Speed | nhanh hơn (V8 isolate) | slower start |
| API | Web standard (fetch, crypto) | full Node |
| Lib hỗ trợ | hạn chế (no `fs`, `path` native) | full |
| Cold start | gần như không | có |
| Use | middleware, lightweight API | DB call, complex logic |

**Q6. Streaming hoạt động thế nào?**
Server gửi HTML từng phần qua `Transfer-Encoding: chunked`. Browser nhận và render dần. Suspense fallback hiển thị trong khi component đang fetch. Khi resolve, server gửi HTML mới + JS để replace fallback.

---

<a id="x-rn-latest"></a>
## Phần X — React Native Latest (New Arch, Expo SDK 52+, Expo Router v4)

> **React Native 0.76+** (10/2024) — **New Architecture default**. **0.77+** (1/2025) — React 19 integration. **Expo SDK 52+** (11/2024) — New Arch default.

### X1. RN Latest có gì mới (2024-2025)?

1. **New Architecture default** (Fabric + TurboModule + Codegen + JSI) — RN 0.76+
2. **Bridgeless mode** — bỏ legacy bridge hoàn toàn
3. **Hermes** — default JS engine
4. **React 19** trong RN 0.77+
5. **Expo SDK 52** (11/2024) — New Arch default, React 19
6. **Expo SDK 53** (4/2025) — RN 0.79, edge improvements
7. **Expo Router v4** — file-based routing, typed routes, API routes
8. **EAS Build/Submit/Update** — production-ready cloud build
9. **Privacy Manifests** (iOS) — required từ 5/2024
10. **Predictive Back Gesture** (Android 14+)
11. **react-native-screens v4** — native stack better perf
12. **Reanimated 3.16+** + **Gesture Handler 2.20+** — animation UI thread mượt
13. **expo-image** — replace FastImage, blurhash, transitions
14. **MMKV 3+** — sync storage cực nhanh
15. **AsyncStorage v2** — vẫn hỗ trợ nhưng MMKV recommended

---

### X2. New Architecture chi tiết

**Cũ (Legacy Bridge):**
```
JS Thread ←→ JSON Bridge (async serialize) ←→ Native Thread
```
Vấn đề: serialize chậm, async lag, không kiểm soát thứ tự.

**Mới (Fabric + JSI):**
```
JS Thread ←→ JSI (direct C++) ←→ Native (Fabric Renderer)
                ↓
          TurboModule (lazy load)
```

**Components:**
- **JSI (JavaScript Interface)** — JS gọi native sync, share C++ object, không serialize JSON
- **Fabric** — render layer mới, đồng bộ với React 18 concurrent (Suspense work tốt)
- **TurboModule** — native module load lazy, type-safe qua Codegen
- **Codegen** — auto gen spec native từ TypeScript

**Enable:**
- RN 0.76+: bật mặc định
- RN 0.71-0.75: `gradle.properties`: `newArchEnabled=true`, `Podfile`: `:fabric_enabled => true`

**Migration concerns:**
- Native library phải support New Arch (đa số phổ biến đã)
- Một số RN lib cũ break — check trước
- Reanimated, gesture-handler, screens — tốt hơn với New Arch

---

### X3. Bridgeless mode

RN 0.74+: **Bridgeless** — bỏ hẳn legacy bridge, chỉ dùng JSI. App start nhanh hơn ~25%.

Default trong 0.76+ với New Arch.

---

### X4. React 19 trong RN

RN 0.77+ ship với React 19. Có thể dùng:
- `useActionState`, `useFormStatus`, `useOptimistic`
- `use()` hook
- `ref` as prop (không cần `forwardRef`)
- React Compiler (opt-in)

```tsx
// RN với React 19
import { useActionState } from 'react'

function LoginForm() {
  const [state, action, pending] = useActionState(async (_, formData) => {
    return await api.login(formData)
  }, null)

  return (
    <View>
      <TextInput placeholder="email" />
      <Pressable onPress={action} disabled={pending}>
        <Text>{pending ? 'Logging...' : 'Login'}</Text>
      </Pressable>
    </View>
  )
}
```

> Note: `<form action>` HTML chỉ work trên web. RN dùng action pattern với `useActionState` + manual call.

---

### X5. Expo SDK 52+ (11/2024)

**Highlights:**
- New Architecture **default** (vẫn opt-out được)
- React 19 RC support
- Expo Router v4
- expo-video (replace expo-av cho video)
- expo-audio (separate from av)
- expo-camera v2 (rewrite, faster)
- expo-image (recommended cho mọi case)
- Improved EAS Build cache
- expo-maps (mới)

**Setup project:**
```bash
npx create-expo-app@latest my-app
cd my-app
npx expo start
```

**EAS Build:**
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios --profile production
eas submit --platform ios
```

**EAS Update (OTA):**
```bash
eas update --branch production --message "Bug fix"
```
Chỉ JS+asset OTA, không native code.

---

### X6. Expo Router v4 (file-based routing)

**Tương tự Next.js App Router cho mobile.**

```
app/
├── _layout.tsx              # Root layout (giống Next.js)
├── index.tsx                # / (home)
├── (tabs)/                  # Group route → bottom tabs
│   ├── _layout.tsx          # Tabs layout
│   ├── home.tsx             # /home
│   ├── profile.tsx          # /profile
│   └── settings.tsx
├── (auth)/                  # Auth flow
│   ├── login.tsx
│   └── register.tsx
├── post/
│   └── [id].tsx             # /post/:id dynamic
├── +not-found.tsx           # 404
└── api/
    └── posts+api.ts         # API route /api/posts
```

**Layouts:**
```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="post/[id]" options={{ title: 'Post' }} />
    </Stack>
  )
}

// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
```

**Navigate:**
```tsx
import { Link, router, useLocalSearchParams } from 'expo-router'

<Link href="/post/123">Open</Link>
<Link href={{ pathname: '/post/[id]', params: { id: '123' } }}>Open</Link>

router.push('/post/123')
router.replace('/login')
router.back()

// Trong [id].tsx
const { id } = useLocalSearchParams<{ id: string }>()
```

**Typed routes (v4):**
```ts
// app.config.ts
experiments: { typedRoutes: true }
```
→ Tự gen TS types cho mọi route, autocomplete khi `<Link href="...">`.

**API routes (v4):**
```ts
// app/api/posts+api.ts
import { NextResponse } from 'next/server'   // tương tự Next

export async function GET(req: Request) {
  return Response.json([{ id: 1 }])
}

export async function POST(req: Request) {
  const body = await req.json()
  return Response.json({ ok: true })
}
```

→ Deploy lên EAS Hosting hoặc Vercel.

---

### X7. RN 0.76+ Modern Stack (Recommended 2025)

| Layer | Tool |
|---|---|
| Project setup | **Expo** (managed/dev build) |
| Routing | **Expo Router v4** (file-based) |
| State (client) | **Zustand** ⭐ hoặc Jotai |
| State (server) | **TanStack Query v5** |
| Forms | **React Hook Form + Zod** |
| Styling | **NativeWind v4** (Tailwind) hoặc **Tamagui** |
| Animation | **Reanimated 3** + **Gesture Handler** |
| List | **FlashList** (Shopify) |
| Image | **expo-image** (cache + blurhash) |
| Storage | **MMKV** (general), **expo-secure-store** (secrets) |
| HTTP | **axios** hoặc **ky** + TanStack Query |
| Notification | **expo-notifications** + FCM/APNs |
| Auth | **Clerk RN** hoặc **Supabase Auth** hoặc custom JWT |
| Analytics | **PostHog RN**, **Amplitude**, **Firebase** |
| Crash/perf | **Sentry RN** |
| Build/Deploy | **EAS Build** + **EAS Submit** + **EAS Update** |
| Testing | **Jest** + **@testing-library/react-native** + **Maestro** (E2E) |

---

### X8. Reanimated 3 + Gesture Handler (modern animation)

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

function Draggable() {
  const offsetX = useSharedValue(0)
  const offsetY = useSharedValue(0)

  const pan = Gesture.Pan()
    .onChange(e => {
      offsetX.value += e.changeX
      offsetY.value += e.changeY
    })
    .onEnd(() => {
      offsetX.value = withSpring(0)            // snap back
      offsetY.value = withSpring(0)
    })

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value }
    ]
  }))

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.box, style]} />
    </GestureDetector>
  )
}
```

→ Chạy **UI thread**, không block JS — 60fps even khi JS bận.

---

### X9. expo-image (replace FastImage)

```tsx
import { Image } from 'expo-image'

<Image
  source="https://example.com/hero.jpg"
  style={{ width: 200, height: 200 }}
  placeholder={blurhash}                       // blurhash placeholder
  contentFit="cover"
  transition={300}
  cachePolicy="memory-disk"
/>
```

Features:
- Memory + disk cache built-in
- Blurhash / thumbhash placeholder
- Smooth transition
- WebP, AVIF support
- Priority hint
- Faster than RN Image native + react-native-fast-image

---

### X10. MMKV vs AsyncStorage

```ts
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()                      // global instance

// Sync API
storage.set('user.name', 'Harry')
storage.set('user.age', 28)
storage.set('user.active', true)
storage.set('user.profile', JSON.stringify(profile))

storage.getString('user.name')                  // 'Harry'
storage.getNumber('user.age')                   // 28
storage.getBoolean('user.active')               // true

storage.contains('user.name')
storage.delete('user.name')
storage.clearAll()

// Listen change
const listener = storage.addOnValueChangedListener((key) => {})
listener.remove()

// Encryption
const secure = new MMKV({ id: 'secure', encryptionKey: 'my-key' })
```

| | AsyncStorage v2 | MMKV v3 |
|---|---|---|
| API | async | sync ⭐ |
| Speed | trung | ~30x nhanh |
| Encryption | thủ công | built-in |
| TS support | có | full ⭐ |
| New Arch | ✅ | ✅ |

→ **MMKV** cho mọi project mới. Secret token → `expo-secure-store` (Keychain).

---

### X11. NativeWind v4 (Tailwind cho RN)

```tsx
// Setup: npx expo install nativewind tailwindcss

// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: []
}

// app/_layout.tsx
import './global.css'

// Component
import { View, Text } from 'react-native'

<View className="flex-1 p-4 bg-white dark:bg-neutral-900">
  <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
    Hello
  </Text>
</View>
```

v4 advantages:
- Tailwind config full support
- Dark mode native
- Theme variables
- Run-time + build-time

---

### X12. TanStack Query v5 trong RN

```tsx
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query'

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 2,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false               // RN không có window focus
    }
  }
})

// Refetch khi app foreground
import { focusManager } from '@tanstack/react-query'
import { AppState } from 'react-native'

AppState.addEventListener('change', state => {
  focusManager.setFocused(state === 'active')
})

// Refetch khi online
import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'

onlineManager.setEventListener(setOnline =>
  NetInfo.addEventListener(state => setOnline(!!state.isConnected))
)

// Component
function Feed() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => api.getPosts()
  })
  if (isLoading) return <Skeleton />
  if (error) return <ErrorView onRetry={refetch} />
  return <FlashList data={data} renderItem={...} />
}
```

---

### X13. Privacy Manifest (iOS — required 5/2024)

```xml
<!-- ios/MyApp/PrivacyInfo.xcprivacy -->
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
  <key>NSPrivacyAccessedAPITypes</key>
  <array>
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array><string>CA92.1</string></array>
    </dict>
  </array>
  <key>NSPrivacyCollectedDataTypes</key>
  <array>
    <dict>
      <key>NSPrivacyCollectedDataType</key>
      <string>NSPrivacyCollectedDataTypeEmailAddress</string>
      <key>NSPrivacyCollectedDataTypeLinked</key>
      <true/>
      <key>NSPrivacyCollectedDataTypeTracking</key>
      <false/>
    </dict>
  </array>
</dict>
</plist>
```

→ Apple reject app không có manifest. Expo SDK 51+ tự generate.

---

### X14. Predictive Back Gesture (Android 14+)

```xml
<!-- AndroidManifest.xml -->
<application android:enableOnBackInvokedCallback="true">
```

→ React Navigation v7+ + react-native-screens v4 support tự động. User vuốt back thấy preview screen trước.

---

### X15. Common interview questions (RN Latest)

**Q1. New Architecture (Fabric/TurboModule) là gì? Lợi gì so với cũ?**

- **Fabric** thay UIManager cũ → render đồng bộ với React 18 concurrent, support Suspense
- **TurboModule** thay native module cũ → lazy load, type-safe qua Codegen
- **JSI** thay JSON bridge → JS gọi C++/native sync, không serialize
- **Codegen** tự gen spec native từ TypeScript

**Lợi ích:**
- Khởi động nhanh hơn ~25%
- Animation mượt hơn (sync rendering)
- Concurrent features (Suspense, useTransition) work tốt
- Type safety end-to-end
- Memory thấp hơn

**Q2. Hermes là gì? Tại sao default?**

Hermes = JS engine do Meta develop, optimize cho mobile:
- Ahead-of-time compile bytecode → start nhanh
- Memory footprint nhỏ
- Better support Reanimated worklet
- Built-in profiler (Hermes Sampling Profiler)
- Smaller bundle size vs JSC

Default từ RN 0.70+.

**Q3. Sự khác nhau giữa Expo Managed Workflow, Dev Build, Bare?**

| | Managed (Expo Go) | Dev Build | Bare |
|---|---|---|---|
| Native code | ❌ | ✅ custom | ✅ full control |
| App store | EAS Build | EAS Build | manual hoặc EAS |
| Setup speed | siêu nhanh (Expo Go QR) | nhanh | chậm |
| Native module | giới hạn (Expo SDK) | bất kỳ | bất kỳ |
| Khuyến nghị | learning, prototype | **production** ⭐ | needs full native |

Modern recommendation: **Expo Dev Build** — flexibility full nhưng vẫn dùng EAS workflow.

**Q4. EAS Update vs CodePush?**
- **EAS Update** (Expo) — modern, built-in cho Expo, channel-based, rollback dễ
- **CodePush** (Microsoft) — đang deprecated, retire **3/2025**
- Cả 2 chỉ update **JS bundle + asset**, không update native code → đổi native phải build lại

**Q5. Khi nào Expo Router vs React Navigation truyền thống?**

| | Expo Router v4 | React Navigation v7 |
|---|---|---|
| Pattern | file-based | imperative (config trong code) |
| Deep link | tự động | manual config |
| Typed route | ✅ built-in | manual |
| Learning | giống Next.js | RN-specific |
| Ecosystem | Expo-only | universal |
| Khuyến nghị | dự án mới Expo | đã có RN setup, hoặc bare RN |

→ Dự án mới Expo → **Expo Router**. Bare RN hoặc legacy → React Navigation.

**Q6. So sánh Reanimated 3 với Animated API gốc?**

| | Animated (built-in) | Reanimated 3 |
|---|---|---|
| Thread | JS thread (+ native driver) | UI thread (worklet) |
| Perf | trung | xuất sắc ⭐ |
| Gesture integration | manual | seamless với gesture-handler |
| API | Imperative | Imperative + declarative |
| Layout animation | hạn chế | `Layout`, `FadeIn`, etc declarative |
| Learning | dễ | trung |

→ Hầu hết case: **Reanimated 3**.

**Q7. FlashList vs FlatList?**

| | FlatList | FlashList |
|---|---|---|
| Render | every item create View | recycle View (giống RecyclerView Android) |
| Memory | cao | thấp |
| Scroll fps | ~30-50 với list dài | 60 stable |
| Setup | đơn giản | cần `estimatedItemSize` |
| TS | có | full ⭐ |
| Khuyến nghị | list ngắn | **list dài (>100 items)** ⭐ |

```tsx
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={items}
  renderItem={({ item }) => <Item data={item} />}
  estimatedItemSize={80}
  keyExtractor={i => i.id}
/>
```

**Q8. Cách giảm size app build (latest)**

- Bật **Hermes** + **New Arch** (default mới)
- **ProGuard/R8** Android: `enableProguardInReleaseBuilds=true`
- **ABI splits**: chỉ ship arch cần
- **AAB** thay APK
- `resConfigs "en", "vi"` chỉ giữ locale cần
- Image: dùng WebP/AVIF, resize server-side
- Lib nặng: thay date-fns thay moment, ky thay axios
- Lazy load màn ít dùng (`React.lazy`)
- Inline `require()` cho native module heavy
- Hermes bytecode (nhỏ hơn JS source)
- Strip console.log production
- Asset trên CDN, không bundle

**Q9. Cách handle App State (active, background, inactive)**

```ts
import { AppState } from 'react-native'

useEffect(() => {
  const sub = AppState.addEventListener('change', state => {
    if (state === 'active') refetch()
    if (state === 'background') save()
  })
  return () => sub.remove()
}, [])
```

3 state:
- `active` — foreground
- `background` — minimized
- `inactive` (iOS only) — transition, phone call

**Q10. Deep link & Universal Link setup**

**iOS Universal Link:**
1. Configure `apple-app-site-association` (AASA) trên domain
2. Capability "Associated Domains" trong Xcode
3. `Info.plist`: `applinks:yourdomain.com`

**Android App Link:**
1. `assetlinks.json` trên domain
2. `AndroidManifest.xml` intent filter với `autoVerify="true"`

```tsx
// Listen
import { Linking } from 'react-native'

Linking.addEventListener('url', ({ url }) => {
  // /post/123
})

// Or với Expo Router
// app/post/[id].tsx → tự handle yourdomain.com/post/123
```

---

### X16. Latest libraries cheatsheet (2025)

```bash
# Core
npx create-expo-app@latest my-app

# Navigation
npx expo install expo-router

# State
npm i zustand
npm i @tanstack/react-query

# Forms
npm i react-hook-form @hookform/resolvers zod

# Styling
npx expo install nativewind
# hoặc
npm i tamagui @tamagui/config

# Animation
npx expo install react-native-reanimated react-native-gesture-handler

# List
npm i @shopify/flash-list

# Image
npx expo install expo-image

# Storage
npm i react-native-mmkv
npx expo install expo-secure-store

# Auth (option)
npm i @clerk/clerk-expo
# hoặc supabase
npm i @supabase/supabase-js

# Push notification
npx expo install expo-notifications

# Analytics
npx expo install expo-tracking-transparency
npm i posthog-react-native

# Crash/perf
npm i @sentry/react-native

# Camera, Image picker
npx expo install expo-camera expo-image-picker

# Map (mới)
npx expo install expo-maps

# Video/audio
npx expo install expo-video expo-audio

# Testing
npm i -D jest @testing-library/react-native
# E2E
npm i -g @mobile-dev/maestro-cli
```

---

### X17. Migration cheatsheet (legacy → modern)

| Legacy | Modern |
|---|---|
| RN Bridge | JSI + Bridgeless (RN 0.76+) |
| JSC | **Hermes** (default) |
| AsyncStorage | **MMKV** ⭐ |
| FastImage | **expo-image** ⭐ |
| FlatList for long list | **FlashList** ⭐ |
| Animated API | **Reanimated 3** |
| react-native-keychain | **expo-secure-store** (Expo) |
| react-native-permissions | **expo-permissions** (deprecated) → individual `expo-*` modules |
| React Navigation v5 | **v7** + native-stack |
| StyleSheet + manual responsive | **NativeWind v4** hoặc **Tamagui** |
| Imperative navigation only | **Expo Router v4** |
| React 17/18 manual memo | **React 19 + React Compiler** |
| CodePush | **EAS Update** (CodePush retires 3/2025) |
| Fastlane manual | **EAS Build/Submit** |

---

### X18. References (latest docs)

**Official:**
- [React 19 release blog](https://react.dev/blog/2024/12/05/react-19) (12/2024)
- [Next.js 15](https://nextjs.org/blog/next-15) (10/2024)
- [Next.js docs](https://nextjs.org/docs)
- [React Native 0.76 — New Arch default](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture) (10/2024)
- [React Native 0.77](https://reactnative.dev/blog/2025/01/21/version-0.77)
- [Expo SDK 52](https://expo.dev/changelog/2024/11-12-sdk-52) (11/2024)
- [Expo SDK 53](https://expo.dev/changelog/2025/04-30-sdk-53)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Compiler](https://react.dev/learn/react-compiler)
- [Reanimated 3](https://docs.swmansion.com/react-native-reanimated/)

**Ecosystem:**
- [TanStack Query v5](https://tanstack.com/query/latest)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [NativeWind v4](https://www.nativewind.dev/)
- [FlashList](https://shopify.github.io/flash-list/)
- [MMKV](https://github.com/mrousavy/react-native-mmkv)

**Migration guides:**
- React 18 → 19: `npx codemod react/19/migration-recipe`
- Next 14 → 15: `npx @next/codemod@canary upgrade latest`
- RN: [upgrade-helper.netlify.app](https://react-native-community.github.io/upgrade-helper/)

---

<a id="y-react-core"></a>
## Phần Y — React Core Deep Dive (Hooks & Concepts)

> **Tất cả** đều base trên React: React.js (web), Next.js (full-stack), React Native (mobile), Remix, Expo Router... Hiểu sâu React core = hiểu được mọi thứ.

---

## I. React Internals & Cách hoạt động

### Y1. React hoạt động như thế nào? (High-level)

**Pipeline 1 lần render:**
```
Trigger (state/props/parent re-render)
        ↓
[Render Phase] — pure, có thể abort
   ├── Gọi function component → return JSX
   ├── JSX → React Element (object thuần)
   └── Reconcile (diff với cây cũ) → tạo Fiber tree mới
        ↓
[Commit Phase] — sync, không abort được
   ├── Apply changes vào DOM thật
   ├── Run refs
   └── Run useLayoutEffect (sync)
        ↓
[Browser paint]
        ↓
   Run useEffect (async, sau paint)
```

**3 layer:**
1. **React** — thư viện core (`createElement`, hooks API, reconciler scheduler)
2. **React DOM / React Native** — renderer (apply changes vào platform — DOM hay native UIView)
3. **Scheduler** — quyết định khi nào chạy work (priority, time slicing)

---

### Y2. Virtual DOM là gì?

**Virtual DOM (VDOM)** = cây JavaScript object đại diện cho UI. JSX compile thành `React.createElement()` calls → tạo VDOM.

```jsx
<div className="card">
  <h1>Hello</h1>
</div>

// Compile thành:
React.createElement('div', { className: 'card' },
  React.createElement('h1', null, 'Hello')
)

// = object thường:
{
  type: 'div',
  props: { className: 'card', children: { type: 'h1', ... } }
}
```

**Tại sao có VDOM:**
- Diff 2 cây JS object nhanh hơn nhiều so với DOM thật (DOM operation đắt)
- Cho phép batch update
- Cross-platform (RN render native, react-three-fiber render Three.js, ink render terminal)

**Tuy nhiên 2025+:** VDOM diffing không phải bottleneck thực sự. Vue's reactivity, Svelte's compile-time, Solid's signals đều bypass VDOM. React Compiler giảm work tương tự.

---

### Y3. Fiber là gì?

**Fiber** = đơn vị work trong React, là rewrite reconciler từ 2017 (React 16). Mỗi React Element tương ứng 1 Fiber node — chứa thông tin về element + state + work to do.

**Cấu trúc Fiber node (simplified):**
```js
{
  type: 'div',          // hoặc Component function
  key,
  stateNode,            // DOM node hoặc instance
  return: parentFiber,
  child: firstChildFiber,
  sibling: nextSiblingFiber,
  memoizedState,        // hooks state linked list
  memoizedProps,
  pendingProps,
  effectTag,            // flag (placement, update, deletion)
  alternate             // fiber từ render trước (double buffering)
}
```

**Tại sao Fiber:**
- Trước Fiber: reconciler dùng stack → không pause/resume → 1 render lớn block 100+ ms = lag
- Fiber: dùng linked list + work loop → có thể **chia nhỏ work**, yield control về browser giữa chừng (concurrent rendering)

**Double buffering:** React giữ 2 cây Fiber:
- `current` — đang hiển thị
- `workInProgress` — đang build
- Swap atomic khi commit → không UI nửa vời

---

### Y4. Reconciliation algorithm

Khi state/props đổi → React render lại → so cây mới với cây cũ → apply chỉ phần khác (diff).

**Quy tắc diff:**

1. **Different types → tear down**
   ```jsx
   // Trước
   <div><Counter /></div>
   // Sau
   <span><Counter /></span>
   // → unmount Counter, mount lại (mất state!)
   ```

2. **Same type → update props, recurse**
   ```jsx
   <div className="a" /> → <div className="b" />
   // → chỉ update className attribute
   ```

3. **Children là list → dùng `key` để match**
   ```jsx
   // Không có key (hoặc dùng index)
   ['A', 'B', 'C'] → ['Z', 'A', 'B', 'C']
   // React update từng position → 'A' → 'Z', 'B' → 'A'... → re-render hết!

   // Có stable key
   [{id:1,'A'},{id:2,'B'}] → [{id:0,'Z'},{id:1,'A'},{id:2,'B'}]
   // React match theo key → chỉ mount Z mới
   ```

**Heuristic O(n)** (không phải O(n³) — đó là theoretical thuật toán diff cây tổng quát).

---

### Y5. Render Phase vs Commit Phase

| Phase | Render | Commit |
|---|---|---|
| Chạy | Tính cây mới | Apply vào DOM |
| Pure? | **Phải pure** (idempotent) | Side effect OK |
| Có thể abort? | ✅ (concurrent) | ❌ atomic |
| Hooks chạy | `useState`, `useReducer`, `useMemo`, `useCallback` | `useLayoutEffect` (sync), refs |
| Browser paint | trước | sau commit (paint sau commit, trước useEffect) |
| Useffect | không | sau paint (async) |

**Render PHẢI pure** vì có thể React render 2 lần (StrictMode), abort giữa chừng, retry. Side effect trong render → bug.

```jsx
// ❌ Side effect trong render
function Bad() {
  fetch('/api')                  // gọi mỗi render!
  return <div>...</div>
}

// ✅ Side effect trong useEffect
function Good() {
  useEffect(() => { fetch('/api') }, [])
  return <div>...</div>
}
```

---

### Y6. Concurrent React là gì?

**Concurrent rendering** (React 18+) = render có thể bị **pause, resume, abort, prioritize**.

**Trước (sync):**
```
User input → state update → render block 200ms → paint → input lag
```

**Concurrent:**
```
User input → urgent update → render → paint (fast)
       ↓ non-urgent update → render khi rảnh → có thể abort nếu input mới
```

**API mở khoá concurrent:**
- `useTransition()` — đánh dấu update non-urgent
- `useDeferredValue()` — defer giá trị
- `Suspense` — declarative loading
- `startTransition()` (no hook)
- Automatic batching

```jsx
const [isPending, startTransition] = useTransition()

const onChange = (e) => {
  setInput(e.target.value)             // urgent — sync
  startTransition(() => {
    setFilteredList(filter(e.target.value))  // non-urgent — có thể bị interrupt
  })
}
```

→ Input không lag dù filter cả 10k items.

---

### Y7. Automatic Batching (React 18+)

Trước React 18, batch chỉ trong event handler React. Outside (setTimeout, Promise) → mỗi setState 1 render.

**React 18+:** mọi state update trong cùng tick đều batch:
```jsx
function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
  // Trước R18 trong event handler: 1 render ✅
  // Trước R18 trong setTimeout: 2 renders ❌
  // R18+: 1 render ✅ luôn
}

setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // R18+: 1 render
}, 100)
```

**Opt-out** (rare):
```jsx
import { flushSync } from 'react-dom'
flushSync(() => setCount(c => c + 1))  // force render ngay
```

---

### Y8. StrictMode là gì?

Tool dev-only để **phát hiện bug**, **không ảnh hưởng production**.

```jsx
<StrictMode>
  <App />
</StrictMode>
```

**Behaviors trong StrictMode (dev only):**
1. **Double-invoke render** + functions như `useState` initializer, reducer — để phát hiện không pure
2. **Double-invoke `useEffect`** — mount → cleanup → mount (test cleanup đúng không)
3. **Warning deprecated APIs** (legacy context, findDOMNode...)
4. **Warning unsafe lifecycle** (componentWillMount...)

→ Code đúng = chạy 1 lần hay 2 lần đều cho cùng kết quả (idempotent).

**Pitfall thường gặp:**
```jsx
// ❌ Effect chạy 2 lần → 2 lần subscribe → duplicate
useEffect(() => {
  socket.connect()           // không cleanup → leak!
}, [])

// ✅
useEffect(() => {
  socket.connect()
  return () => socket.disconnect()
}, [])
```

---

### Y9. JSX là gì?

**JSX** = syntax extension cho JS, compile thành function call (`React.createElement` hoặc `_jsx`).

```jsx
const el = <h1 className="title">Hi</h1>

// Babel/SWC compile:
const el = jsx('h1', { className: 'title', children: 'Hi' })

// Output (React element):
{ type: 'h1', props: { className: 'title', children: 'Hi' }, key: null }
```

**Rules:**
- Tag camelCase với HTML: `className` (không `class`), `tabIndex` (không `tabindex`), `htmlFor`
- 1 root element (hoặc `<>...</>` Fragment)
- Tự đóng tag: `<br />`, `<img />`
- Expression trong `{}`
- Component PascalCase (`<MyComp />`), HTML tag lowercase (`<div>`)
- Boolean attr: `<input disabled />` = `disabled={true}`
- Spread props: `<Comp {...props} />`

**JSX không phải HTML** — nó là JS syntax. Hiểu điều này để debug.

---

## II. Tất cả Hooks — Deep Dive

### Y10. Rules of Hooks (tại sao quan trọng)

**2 quy tắc:**

1. **Chỉ gọi ở top-level** — KHÔNG trong if/for/loop/nested function
2. **Chỉ gọi từ:** function component hoặc custom hook (không gọi từ regular function)

**Tại sao?** React track hooks bằng **thứ tự gọi** (linked list trong Fiber). Nếu gọi conditional → thứ tự thay đổi → React nhầm hook nào với hook nào → bug.

```jsx
// ❌ SAI
function Bad({ show }) {
  if (show) {
    const [x, setX] = useState(0)    // có khi 1 hook, có khi 0
  }
  const [y, setY] = useState(1)      // thứ tự inconsistent!
}

// ✅ ĐÚNG
function Good({ show }) {
  const [x, setX] = useState(0)      // luôn gọi
  const [y, setY] = useState(1)
  if (show) { /* use x */ }
}
```

**ESLint plugin** `eslint-plugin-react-hooks` enforce 2 rules + exhaustive deps.

---

### Y11. `useState` — chi tiết

```jsx
const [state, setState] = useState(initialState)
```

**Initial state:**
```jsx
const [count, setCount] = useState(0)
const [obj, setObj] = useState({ x: 0 })
const [arr, setArr] = useState([])

// Lazy initializer — chỉ chạy lần đầu (nếu compute đắt)
const [value, setValue] = useState(() => expensiveCalc())
const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'light')
```

**Updater (2 cách):**
```jsx
// 1. Direct value
setCount(5)
setCount(prev => prev + 1)              // functional updater

// 2. Functional updater (BẮT BUỘC khi update phụ thuộc prev state)
// ❌ Bug
const handleClick = () => {
  setCount(count + 1)
  setCount(count + 1)
  setCount(count + 1)
  // count = 1 (vì closure giữ count cũ)
}

// ✅ Đúng
const handleClick = () => {
  setCount(c => c + 1)
  setCount(c => c + 1)
  setCount(c => c + 1)
  // count = 3
}
```

**Quy tắc khi update:**
- **Object/Array**: phải tạo mới (immutable) — React dùng `Object.is` để diff
  ```jsx
  // ❌ Mutate — không re-render
  state.x = 99; setState(state)
  
  // ✅ New reference
  setState({ ...state, x: 99 })
  ```

- **Batch update**: nhiều setState trong cùng tick → 1 render
  ```jsx
  setCount(c + 1)
  setName('new')
  // 1 render với cả 2 thay đổi
  ```

- **Bailout**: nếu state mới `Object.is` bằng cũ → React skip render
  ```jsx
  setCount(5); setCount(5)              // chỉ 1 render
  setObj({a:1}); setObj({a:1})          // 2 render! (object reference khác)
  ```

**Common pitfalls:**
```jsx
// ❌ Derived state — không lưu vào state, compute trực tiếp
const [items, setItems] = useState([])
const [count, setCount] = useState(0)
useEffect(() => setCount(items.length), [items])   // ❌ thừa, extra render

// ✅ Compute
const count = items.length

// ❌ Sync state với props
function Comp({ initial }) {
  const [value, setValue] = useState(initial)
  useEffect(() => setValue(initial), [initial])    // ❌ anti-pattern
}

// ✅ Dùng key prop để reset
<Comp key={userId} initial={initial} />            // ✅ React reset state khi key đổi
```

---

### Y12. `useEffect` — chi tiết

```jsx
useEffect(setup, dependencies?)
```

**Lifecycle:**
```jsx
useEffect(() => {
  // Setup — chạy SAU commit + paint (async)
  console.log('mount or update')

  return () => {
    // Cleanup — chạy TRƯỚC effect lần kế tiếp + khi unmount
    console.log('cleanup')
  }
}, [dep1, dep2])
```

**4 patterns dep array:**

| Dep | Chạy khi nào |
|---|---|
| Không có | Mỗi render |
| `[]` | Chỉ mount + unmount |
| `[a, b]` | Khi a hoặc b đổi (`Object.is`) |
| `[obj]` (mới mỗi render) | ⚠️ mỗi render — như không có dep |

**Cleanup quan trọng:**
```jsx
// Timer
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])

// Event listener
useEffect(() => {
  const onResize = () => setSize(...)
  window.addEventListener('resize', onResize)
  return () => window.removeEventListener('resize', onResize)
}, [])

// Subscription
useEffect(() => {
  const sub = store.subscribe(callback)
  return () => sub.unsubscribe()
}, [store])

// Fetch — chống race condition
useEffect(() => {
  let cancelled = false
  fetch(`/users/${id}`)
    .then(r => r.json())
    .then(data => { if (!cancelled) setUser(data) })
  return () => { cancelled = true }
}, [id])

// Modern: AbortController
useEffect(() => {
  const ctrl = new AbortController()
  fetch(url, { signal: ctrl.signal })
    .then(r => r.json())
    .then(setData)
    .catch(e => { if (e.name !== 'AbortError') console.error(e) })
  return () => ctrl.abort()
}, [url])
```

**Common pitfalls:**

```jsx
// ❌ Stale closure
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000)
  return () => clearInterval(id)
}, [])                              // ⚠️ count luôn = 0 trong closure

// ✅ Functional updater
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000)
  return () => clearInterval(id)
}, [])

// ❌ Object/function trong dep
useEffect(() => {
  fetchData(config)
}, [{ a: 1 }])                      // mỗi render config mới → effect re-run

// ✅ Primitive dep hoặc useMemo
const config = useMemo(() => ({ a: 1 }), [])

// ❌ Effect chỉ để sync state — anti-pattern
useEffect(() => {
  setFiltered(items.filter(...))
}, [items])

// ✅ Compute trực tiếp hoặc useMemo
const filtered = useMemo(() => items.filter(...), [items])

// ❌ Effect chains
useEffect(() => { setA(...) }, [x])
useEffect(() => { setB(...) }, [a])    // domino → nhiều render
useEffect(() => { setC(...) }, [b])

// ✅ Tính tất cả trong 1 effect, hoặc handle trong event
```

**Khi nào KHÔNG cần useEffect:**
- Compute từ state/props → dùng biến hoặc `useMemo`
- Update state khi props đổi → `key` reset hoặc compute trong render
- Reset state → `key` prop
- Notify parent → callback prop trong event handler, không phải effect
- Fetch data → dùng **TanStack Query / RTK Query / SWR** thay vì effect tự viết

> 📖 [react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)

---

### Y13. `useLayoutEffect`

```jsx
useLayoutEffect(setup, dependencies?)
```

Giống `useEffect` nhưng chạy **đồng bộ TRƯỚC browser paint**.

| | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Chạy khi | sau commit + paint (async) | sau commit, trước paint (sync) |
| Block paint | không | có |
| Use case | hầu hết | đo lường layout, animation tránh flicker |

**Khi dùng `useLayoutEffect`:**
```jsx
// Đo kích thước element rồi adjust trước paint
useLayoutEffect(() => {
  const { width } = ref.current.getBoundingClientRect()
  setWidth(width)
}, [])

// Scroll position cần restore sync
useLayoutEffect(() => {
  ref.current.scrollTop = savedScroll
}, [])
```

> ⚠️ Block paint → cẩn thận perf. Default: `useEffect`.

**React Native:** chỉ có `useLayoutEffect` (giống `useEffect` về timing — không có browser paint distinction).

---

### Y14. `useRef` — chi tiết

```jsx
const ref = useRef(initialValue)
```

**2 use case:**

**1. DOM ref:**
```jsx
const inputRef = useRef<HTMLInputElement>(null)
useEffect(() => { inputRef.current?.focus() }, [])
return <input ref={inputRef} />
```

**2. Lưu mutable value KHÔNG trigger re-render:**
```jsx
const renderCount = useRef(0)
renderCount.current++                          // không re-render

const prevValue = useRef()
useEffect(() => { prevValue.current = value }) // track previous

const timerId = useRef<NodeJS.Timer>()
const start = () => { timerId.current = setInterval(...) }
const stop = () => { clearInterval(timerId.current) }
```

**Khác `useState`:**
| | `useRef` | `useState` |
|---|---|---|
| Trigger re-render khi đổi | ❌ | ✅ |
| Access | `.current` | trực tiếp |
| Persist across render | ✅ | ✅ |
| Use case | DOM, timer, mutable instance | render data |

**`useRef` vs `createRef`:**
- `useRef` — persistent across render (same ref object)
- `createRef` — class only, ref object mới mỗi render trong function

**Callback ref (lower-level):**
```jsx
const measuredRef = useCallback(node => {
  if (node) {
    const { width } = node.getBoundingClientRect()
  }
}, [])
return <div ref={measuredRef} />
```
→ Chạy khi mount/unmount, có node truyền vào.

---

### Y15. `useMemo` & `useCallback`

```jsx
const memoValue = useMemo(() => expensiveCalc(a, b), [a, b])
const memoFn = useCallback(() => fn(a), [a])
// useCallback(fn, deps) === useMemo(() => fn, deps)
```

**Khi nào dùng:**
1. Tính toán **thực sự đắt** (sort 10k items)
2. Pass xuống component đã `React.memo` (giữ reference stable)
3. Effect dependency (tránh re-run)

**Khi nào KHÔNG cần:**
- Compute rẻ → memo overhead lớn hơn
- Không pass xuống memoized child
- Mỗi value đều memo → "memo bệnh tật"

```jsx
// ❌ Memo thừa
const sum = useMemo(() => a + b, [a, b])      // cộng 2 số đâu đắt

// ✅ Memo đáng
const sorted = useMemo(() => bigList.sort(...), [bigList])

// ✅ Memo cho memoized child
const Memoed = React.memo(Child)
const onClick = useCallback(() => doSomething(id), [id])
return <Memoed onClick={onClick} />
```

**React Compiler (React 19):** Tự memo mọi thứ → trong tương lai, không cần `useMemo`/`useCallback` thủ công.

---

### Y16. `useContext` — chi tiết

```jsx
const ThemeContext = createContext('light')

// Provider
<ThemeContext.Provider value="dark">       // React 19: <ThemeContext value="dark">
  <App />
</ThemeContext.Provider>

// Consumer
const theme = useContext(ThemeContext)
```

**Cách hoạt động:** mỗi `Provider` cập nhật `value` → **mọi consumer** trong subtree re-render (kể cả parent của consumer đã memo).

**Performance trap:**
```jsx
// ❌ Object literal mỗi render → mọi consumer re-render
<UserContext.Provider value={{ user, setUser }}>

// ✅ useMemo
const value = useMemo(() => ({ user, setUser }), [user])
<UserContext.Provider value={value}>

// ❌ 1 context lớn cho nhiều thứ
const AppContext = createContext({ user, theme, locale, settings })
// user đổi → theme consumer cũng re-render!

// ✅ Tách context theo concern
<UserContext><ThemeContext><LocaleContext>
```

**Khi context KHÔNG đủ:**
- Cập nhật nhiều, granular (mỗi consumer chỉ care 1 field) → dùng **Zustand** với selector, hoặc **Jotai** atomic
- Server data → **TanStack Query**

**`use(Context)` (React 19):**
```jsx
function Comp({ show }) {
  if (!show) return null
  const theme = use(ThemeContext)             // ✅ gọi trong if được
  return <div className={theme}>...</div>
}
```

---

### Y17. `useReducer` — chi tiết

```jsx
const [state, dispatch] = useReducer(reducer, initialState, init?)

function reducer(state, action) {
  switch (action.type) {
    case 'inc': return { count: state.count + 1 }
    case 'set': return { count: action.payload }
    case 'reset': return initialState
    default: return state
  }
}

dispatch({ type: 'inc' })
dispatch({ type: 'set', payload: 10 })
```

**Khi dùng `useReducer` thay `useState`:**
1. State phức tạp (nhiều field liên quan)
2. Nhiều update logic (>3 transition)
3. Next state phụ thuộc complex previous
4. Testable (reducer là pure function — test riêng dễ)
5. Truyền `dispatch` xuống children (stable reference, không cần `useCallback`)

```jsx
// State machine pattern
function reducer(state, action) {
  switch (state.status) {
    case 'idle':
      if (action.type === 'fetch') return { status: 'loading' }
      return state
    case 'loading':
      if (action.type === 'success') return { status: 'success', data: action.payload }
      if (action.type === 'error') return { status: 'error', error: action.payload }
      return state
    // ...
  }
}
```

**Với Immer (mutable-style):**
```jsx
import { useImmerReducer } from 'use-immer'

const [state, dispatch] = useImmerReducer((draft, action) => {
  switch (action.type) {
    case 'addItem':
      draft.items.push(action.payload)        // mutate OK trong draft
      break
  }
}, initialState)
```

---

### Y18. `useImperativeHandle` + `forwardRef`

Expose **method tùy chỉnh** từ child ra parent qua ref (thay vì expose nguyên DOM node).

```jsx
// React < 19 với forwardRef
const Input = forwardRef((props, ref) => {
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = '' },
    getValue: () => inputRef.current.value
  }), [])

  return <input ref={inputRef} {...props} />
})

// React 19 (ref as prop)
function Input({ ref, ...props }) {
  const inputRef = useRef(null)
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus()
  }), [])
  return <input ref={inputRef} {...props} />
}

// Parent
const ref = useRef(null)
<Input ref={ref} />
<button onClick={() => ref.current.focus()}>Focus</button>
```

⚠️ Use sparingly — đa số case dùng prop/state đủ. Imperative là escape hatch.

---

### Y19. `useId`

```jsx
const id = useId()
return (
  <>
    <label htmlFor={id}>Name</label>
    <input id={id} />
  </>
)
```

→ Generate unique ID stable across server/client render (SSR-safe).

**KHÔNG dùng cho key trong list** — dùng id từ data.

---

### Y20. `useTransition` & `useDeferredValue`

**`useTransition`** — đánh dấu update là **non-urgent**:

```jsx
const [isPending, startTransition] = useTransition()

const onChange = (e) => {
  setQuery(e.target.value)                    // urgent
  startTransition(() => {
    setResults(filter(e.target.value))        // non-urgent, có thể interrupt
  })
}

return (
  <>
    {isPending && <Spinner />}
    <input onChange={onChange} />
    <Results data={results} />
  </>
)
```

**`useDeferredValue`** — defer 1 value (giống debounce nhưng smart):

```jsx
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
const results = useMemo(() => filter(deferredQuery), [deferredQuery])

// query update ngay (urgent)
// deferredQuery lag lại → results re-compute với value cũ → smooth
```

**Khi nào dùng:**
- `useTransition`: bạn control khi nào trigger update
- `useDeferredValue`: bạn nhận value từ ngoài (props), muốn defer dùng nó

---

### Y21. `useSyncExternalStore`

Subscribe **store ngoài React** (Redux, Zustand internal, browser API).

```jsx
function subscribe(callback) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,                   // get snapshot client
    () => true                                 // get snapshot server (SSR)
  )
}
```

→ Concurrent-safe (giải bug tearing trong concurrent rendering). Hầu hết user không gọi trực tiếp — Zustand/Redux dùng nội bộ.

---

### Y22. `useDebugValue`

```jsx
function useUser(id) {
  const [user, setUser] = useState()
  useDebugValue(user ? `User: ${user.name}` : 'No user')
  return user
}
```

→ Chỉ hiển thị trong React DevTools, debug custom hook.

---

### Y23. React 19 Hooks (recap nhanh)

| Hook | Use case |
|---|---|
| `useActionState(action, initialState)` | Form/action với state + pending |
| `useFormStatus()` | Đọc form status (pending, data, method, action) từ form cha |
| `useOptimistic(state, updateFn)` | Optimistic UI update |
| `use(promise | context)` | Đọc promise/context conditionally |

📖 Chi tiết: [Phần V — React 19](#v-react-19)

---

### Y24. Custom Hooks — patterns thực tế

**Quy tắc:**
- Tên bắt đầu `use*` (để ESLint check rules of hooks)
- Có thể gọi built-in hooks bên trong
- Return value tự do (object, array, primitive)
- Composable — 1 hook gọi hook khác

**Examples thường dùng:**

```jsx
// 1. useDebounce
function useDebounce<T>(value: T, ms = 300): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

// 2. usePrevious
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  useEffect(() => { ref.current = value }, [value])
  return ref.current
}

// 3. useToggle
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn(o => !o), [])
  return [on, toggle, setOn] as const
}

// 4. useLocalStorage
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}

// 5. useOnlineStatus
function useOnlineStatus() {
  return useSyncExternalStore(
    cb => {
      window.addEventListener('online', cb)
      window.addEventListener('offline', cb)
      return () => {
        window.removeEventListener('online', cb)
        window.removeEventListener('offline', cb)
      }
    },
    () => navigator.onLine,
    () => true
  )
}

// 6. useMediaQuery
function useMediaQuery(query: string) {
  const get = () => window.matchMedia(query).matches
  return useSyncExternalStore(
    cb => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    get,
    () => false
  )
}
const isMobile = useMediaQuery('(max-width: 768px)')

// 7. useClickOutside
function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [handler])
  return ref
}

// 8. useEventListener
function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
) {
  const handlerRef = useRef(handler)
  useEffect(() => { handlerRef.current = handler })
  useEffect(() => {
    const h = (e: WindowEventMap[K]) => handlerRef.current(e)
    window.addEventListener(event, h, options)
    return () => window.removeEventListener(event, h, options)
  }, [event])
}

// 9. useFetch (simple — production dùng TanStack Query)
function useFetch<T>(url: string) {
  const [state, setState] = useState<{
    data: T | null; loading: boolean; error: Error | null
  }>({ data: null, loading: true, error: null })

  useEffect(() => {
    const ctrl = new AbortController()
    setState({ data: null, loading: true, error: null })
    fetch(url, { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => {
        if (error.name !== 'AbortError') setState({ data: null, loading: false, error })
      })
    return () => ctrl.abort()
  }, [url])

  return state
}

// 10. useInterval (Dan Abramov)
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)
  useEffect(() => { savedCallback.current = callback }, [callback])
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}
```

---

### Y25. Hook patterns nâng cao

**Composing hooks:**
```jsx
function useUserProfile(userId: string) {
  const { data: user } = useFetch(`/users/${userId}`)
  const { data: posts } = useFetch(user ? `/users/${userId}/posts` : null)
  const isOnline = useOnlineStatus()
  return { user, posts, isOnline }
}
```

**Hook factory:**
```jsx
function createUseStore<T>(initialState: T) {
  let state = initialState
  const listeners = new Set<() => void>()

  return function useStore() {
    return useSyncExternalStore(
      cb => { listeners.add(cb); return () => listeners.delete(cb) },
      () => state
    )
  }
}
```

**Hook with reducer pattern:**
```jsx
function useToggleReducer() {
  const [state, dispatch] = useReducer(s => !s, false)
  return [state, dispatch] as const
}
```

---

## III. Component & Lifecycle

### Y26. Class Lifecycle vs Hooks mapping

| Class | Hooks equivalent |
|---|---|
| `constructor` | `useState` initializer |
| `componentDidMount` | `useEffect(fn, [])` |
| `componentDidUpdate` | `useEffect(fn, [deps])` |
| `componentWillUnmount` | `return () => {}` trong `useEffect` |
| `getDerivedStateFromProps` | compute trong render hoặc `useMemo` |
| `shouldComponentUpdate` | `React.memo` + custom compare |
| `componentDidCatch` | `ErrorBoundary` class (vẫn cần class) |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` |

---

### Y27. Functional vs Class Component (2026)

| | Class | Functional |
|---|---|---|
| Syntax | `class extends Component` | function |
| State | `this.state`, `setState` | `useState`, `useReducer` |
| Lifecycle | methods | `useEffect`, `useLayoutEffect` |
| `this` binding | rườm rà | không có |
| Code reuse | HOC, render props | **Custom hooks** ⭐ |
| Tree-shake | kém | tốt |
| Concurrent | partial support | full |
| Modern | legacy | **default** ⭐ |

→ **2026:** chỉ class cho `ErrorBoundary` (React chưa có hook tương đương).

---

### Y28. Component Composition vs Inheritance

**React khuyến nghị: Composition over Inheritance.**

```jsx
// ❌ Inheritance (anti-pattern)
class Dialog extends Modal {
  render() { return <div>...</div> }
}

// ✅ Composition
function Modal({ children, title, onClose }) {
  return (
    <div className="modal">
      <header>{title} <button onClick={onClose}>×</button></header>
      <main>{children}</main>
    </div>
  )
}

function Dialog({ message, onClose }) {
  return (
    <Modal title="Alert" onClose={onClose}>
      <p>{message}</p>
    </Modal>
  )
}
```

**Container pattern:**
```jsx
<Modal>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter><Button>OK</Button></ModalFooter>
</Modal>
```

---

### Y29. Children prop patterns

**1. Render children as-is:**
```jsx
function Card({ children }) {
  return <div className="card">{children}</div>
}
```

**2. Render prop:**
```jsx
function DataLoader({ url, children }) {
  const { data, loading } = useFetch(url)
  return children({ data, loading })
}

<DataLoader url="/users">
  {({ data, loading }) => loading ? <Spinner /> : <List data={data} />}
</DataLoader>
```

**3. Manipulate children (advanced):**
```jsx
import { Children, cloneElement } from 'react'

function Tabs({ children, active }) {
  return Children.map(children, (child, i) =>
    cloneElement(child, { active: i === active })
  )
}
```

> Modern thay thế: dùng Context để pass data xuống children không cần manipulate.

**4. Compound components:**
```jsx
const TabsContext = createContext({})

function Tabs({ children, defaultIndex = 0 }) {
  const [active, setActive] = useState(defaultIndex)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}
Tabs.List = function({ children }) { return <div role="tablist">{children}</div> }
Tabs.Tab = function({ children, index }) {
  const { active, setActive } = useContext(TabsContext)
  return <button onClick={() => setActive(index)}>{children}</button>
}
Tabs.Panel = function({ children, index }) {
  const { active } = useContext(TabsContext)
  return active === index ? <div>{children}</div> : null
}

// Usage
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>One</Tabs.Tab>
    <Tabs.Tab index={1}>Two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>First</Tabs.Panel>
  <Tabs.Panel index={1}>Second</Tabs.Panel>
</Tabs>
```

---

### Y30. Controlled vs Uncontrolled Component

**Controlled** — React giữ state:
```jsx
const [value, setValue] = useState('')
<input value={value} onChange={e => setValue(e.target.value)} />
```

**Uncontrolled** — DOM giữ state, đọc qua ref:
```jsx
const inputRef = useRef<HTMLInputElement>(null)
const onSubmit = () => alert(inputRef.current?.value)
<input defaultValue="hi" ref={inputRef} />
```

| | Controlled | Uncontrolled |
|---|---|---|
| Validation realtime | dễ | khó |
| Conditional disable button | dễ | khó |
| Format on input | dễ | khó |
| Code | nhiều hơn | ít hơn |
| Perf | tốt nếu chỉ form đơn giản | tốt cho form lớn nhiều field |

**Modern recommendation:** **React Hook Form** + Zod — combine cả 2: uncontrolled internally (perf tốt) nhưng API như controlled.

---

### Y31. Error Boundary

**Class only** (React chưa có hook tương đương):

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

**Catch được:**
- Render error
- Lifecycle error
- Constructor error

**KHÔNG catch được:**
- Event handler (dùng try/catch)
- Async code (Promise, setTimeout)
- SSR
- Error trong chính error boundary

**Modern alternatives:**
- **`react-error-boundary`** lib — hooks API (`useErrorBoundary`)
- **React 19**: `createRoot({ onUncaughtError, onCaughtError })` — global handler

```jsx
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'

function Comp() {
  const { showBoundary } = useErrorBoundary()
  useEffect(() => {
    fetchData().catch(err => showBoundary(err))
  }, [])
}

<ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => reset()}>
  <Comp />
</ErrorBoundary>
```

---

### Y32. Portal

Render children vào DOM node **ngoài cây React parent**.

```jsx
import { createPortal } from 'react-dom'

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.body                                // mount vào body
  )
}
```

**Use cases:**
- Modal, dropdown, tooltip — không bị clip bởi `overflow: hidden` của parent
- Z-index issue
- Side panel, drawer

**Event bubble:** event vẫn bubble theo **React tree** (không phải DOM tree) → tốt cho ErrorBoundary, Context.

---

### Y33. Lazy + Suspense

```jsx
const Heavy = React.lazy(() => import('./Heavy'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Heavy />
    </Suspense>
  )
}

// Conditional lazy
const Settings = lazy(() => 
  user.isPro 
    ? import('./ProSettings') 
    : import('./BasicSettings')
)

// Named export workaround
const Named = lazy(() => 
  import('./module').then(m => ({ default: m.NamedExport }))
)
```

**Suspense cho data fetching (R18+):**
```jsx
function User({ promise }) {
  const user = use(promise)                     // suspend
  return <div>{user.name}</div>
}

<Suspense fallback={<Skeleton />}>
  <User promise={fetchUser(id)} />
</Suspense>
```

**Suspense + Error Boundary:**
```jsx
<ErrorBoundary fallback={<ErrorView />}>
  <Suspense fallback={<Spinner />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

---

### Y34. React.memo deep dive

```jsx
const MemoComp = React.memo(Component, areEqual?)

// Default: shallow compare props
const MemoComp = React.memo(MyComp)

// Custom compare
const MemoComp = React.memo(MyComp, (prev, next) => prev.id === next.id)
```

**Khi nào dùng:**
- Component pure (output = f(props))
- Props thường stable
- Parent re-render thường

**Khi nào KHÔNG:**
- Props mới mỗi render (object/function literal) → memo vô ích
- Component nhẹ (memo overhead > render cost)

**Combo:**
```jsx
const MemoChild = React.memo(Child)

function Parent() {
  const data = useMemo(() => process(raw), [raw])
  const onClick = useCallback(id => handle(id), [])
  return <MemoChild data={data} onClick={onClick} />
}
```

→ Stable reference đảm bảo `React.memo` work.

---

### Y35. Keys trong list

```jsx
{items.map(item => <Item key={item.id} {...item} />)}
```

**Quy tắc:**
- Stable, unique trong list anh em
- KHÔNG dùng index nếu list có reorder/insert/delete giữa
- Không cần unique globally (chỉ trong siblings)

**Tại sao key matters:**
```jsx
// Reorder [A, B, C] → [C, A, B]
// Với index key (0, 1, 2): React thấy 0='C' (cũ 'A') → update tất
// Với id key: React match đúng, chỉ move
```

**Reset state với key:**
```jsx
<Form key={userId} initial={data} />          // userId đổi → Form remount, state reset
```

**Pitfall:** Math.random() làm key → mỗi render key mới → remount mọi item.

---

## IV. Common Interview Questions

### Y36. Top 20 câu hỏi React thường gặp

**1. Sự khác nhau giữa Element và Component?**
- **Element**: object mô tả UI (`{type: 'div', props: {...}}`) — immutable
- **Component**: function/class return element — reusable, có state

**2. Tại sao key prop quan trọng?**
- Giúp React identify item nào thay đổi/added/removed
- Dùng id stable, không phải index nếu list reorder
- Không dùng Math.random → remount mọi item

**3. useState vs useReducer khi nào?**
- `useState`: state đơn giản, 1-2 field
- `useReducer`: state phức tạp, nhiều transition, next phụ thuộc prev complex, dispatch stable cho children

**4. useEffect vs useLayoutEffect?**
- `useEffect`: sau paint (async) — default
- `useLayoutEffect`: trước paint (sync) — đo lường, animation tránh flicker

**5. useMemo vs useCallback?**
- `useMemo(fn, deps)` — memo VALUE
- `useCallback(fn, deps)` — memo FUNCTION reference
- `useCallback(fn, deps)` === `useMemo(() => fn, deps)`

**6. Tại sao functional updater?**
- Closure giữ state cũ → multiple setState liên tiếp dùng giá trị stale
- `setState(prev => prev + 1)` luôn nhận state mới nhất

**7. React.memo khác useMemo gì?**
- `React.memo(Component)` — memo cả component (HOC), skip render nếu props shallow equal
- `useMemo(fn, deps)` — memo 1 value tính toán

**8. Reconciliation hoạt động thế nào?**
- Diff cây VDOM mới với cũ
- Same type → update props, recurse children
- Different type → unmount + mount
- List → dùng key match

**9. Concurrent rendering là gì?**
- Render có thể pause, abort, resume, prioritize
- `useTransition`, `useDeferredValue`, `Suspense` mở khoá
- Cải thiện UX khi update nặng

**10. Tại sao state update là async?**
- React batch nhiều update → 1 render
- Performance: tránh re-render giữa chừng
- Đọc state ngay sau setState → thấy giá trị cũ

**11. Stale closure là gì?**
- Function trong useEffect/useCallback capture biến tại thời điểm define
- Sau đó state đổi → closure vẫn dùng giá trị cũ
- Fix: thêm vào dep array, hoặc dùng functional updater, hoặc useRef

**12. Khi nào dùng useRef vs useState?**
- `useRef`: lưu value KHÔNG cần re-render khi đổi (DOM, timer, mutable instance)
- `useState`: lưu value cần render khi đổi

**13. Context vs Redux/Zustand?**
- Context: prop drilling nhỏ, ít update (theme, auth, locale)
- Store lib: state lớn, update thường xuyên, selector granular
- Context update → mọi consumer re-render

**14. Suspense hoạt động thế nào?**
- Child throw Promise → Suspense catch → show fallback
- Khi Promise resolve → re-render child
- React 19: `use(promise)` chính thức

**15. Error Boundary catch được gì?**
- Render error, lifecycle error, constructor error
- KHÔNG catch: event handler (try/catch), async (rejection handler), SSR

**16. Strict Mode làm gì?**
- Dev only — không ảnh hưởng prod
- Double-invoke render + useState init + useEffect để phát hiện side effect không pure
- Warning deprecated API

**17. Portal use case?**
- Modal, tooltip, dropdown — render ngoài parent (tránh overflow clip, z-index)
- Event vẫn bubble theo React tree

**18. SSR vs CSR khi nào?**
- **CSR**: dashboard authenticated, behind-login app
- **SSR**: SEO-sensitive, content marketing, e-commerce
- **SSG**: blog, docs (build trước)
- **ISR**: e-commerce có thay đổi (revalidate)

**19. Khi nào không cần useEffect?**
- Compute từ props/state → biến hoặc useMemo
- Sync state với props → key prop
- Notify parent → callback trong event handler
- Fetch → TanStack Query

**20. React Compiler thay thế gì?**
- Auto memoize → bỏ useMemo/useCallback/React.memo thủ công
- Vẫn cần useEffect, useState, useRef
- React 19 RC, sắp stable

---

### Y37. Top câu hỏi tricky (advanced)

**1. Tại sao React rerender khi state set cùng giá trị?**
- Primitive same value → skip (bailout)
- Object/array literal mới → reference khác → rerender
```jsx
setObj({...obj})  // rerender (reference khác)
setCount(5); setCount(5)  // không rerender (bailout)
```

**2. Sự khác nhau giữa `useEffect(fn, [])` và `useEffect(fn)`?**
- `[]`: chỉ mount + unmount
- không có dep: mỗi render

**3. Component re-render khi nào?**
1. State (`useState`, `useReducer`) đổi
2. Props từ parent đổi (parent re-render)
3. Context value đổi
4. Force update (`useReducer(s => s+1, 0)[1]()`)

**4. Tại sao không nên gọi setState trong render?**
- Infinite loop → render → setState → render → setState...
- Trừ khi có guard: `if (a !== b) setB(a)` — vẫn tránh, dùng useEffect

**5. Difference giữa class state và functional state?**
- Class: `this.state` MERGE khi setState (shallow merge auto)
- Functional: REPLACE — phải spread thủ công
```jsx
// Class
this.setState({ a: 1 })  // chỉ đổi a, giữ b
// Functional
setState({ a: 1 })       // mất b!
setState(s => ({ ...s, a: 1 }))  // ✅
```

**6. Multiple setState trong handler — bao nhiêu render?**
- React 17 trong event handler: 1 render
- React 17 ngoài event handler: N render
- React 18+: luôn 1 render (automatic batching)

**7. useEffect chạy 2 lần dev mà chỉ 1 lần prod?**
- StrictMode dev double-invoke để test cleanup
- Cleanup → setup → cleanup → setup
- Prod chỉ chạy 1 lần
- Code đúng phải idempotent

**8. Cleanup function khi nào chạy?**
- Trước effect lần kế tiếp (deps đổi)
- Khi component unmount
- Trong StrictMode dev: ngay sau setup đầu tiên (test)

**9. forwardRef còn cần không (R19)?**
- React 19: `ref` là prop bình thường, không cần forwardRef
- Backward compatible — forwardRef vẫn work
- Codemod: `npx codemod react/19/...`

**10. Hydration là gì?**
- SSR: server gen HTML
- Browser: parse HTML, JS load
- React "hydrate" HTML có sẵn → attach event listener, state
- Bug: HTML server ≠ client render → "hydration mismatch"

---

### Y38. Code questions (predict output)

**Q1:**
```jsx
function Counter() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }
  return <button onClick={handleClick}>{count}</button>
}
// Click 1 lần: count = ?
```
**Output:** 1 (closure capture count=0, setCount(0+1) x3 → state cuối = 1)

**Fix:** `setCount(c => c + 1)` x3 → 3.

---

**Q2:**
```jsx
useEffect(() => {
  console.log('effect')
  return () => console.log('cleanup')
}, [count])
```
**Console khi count đổi từ 0 → 1?**
1. `cleanup` (cleanup của render trước)
2. `effect` (setup mới)

---

**Q3:**
```jsx
function Parent() {
  const [count, setCount] = useState(0)
  return <Child onClick={() => setCount(c => c + 1)} />
}
const Child = React.memo(({ onClick }) => {
  console.log('Child render')
  return <button onClick={onClick}>+</button>
})
// Click button — Child có re-render không?
```
**Output:** Có. `onClick={() => ...}` là function mới mỗi parent render → memo vô ích.

**Fix:** `useCallback(() => setCount(c=>c+1), [])`.

---

**Q4:**
```jsx
function App() {
  console.log(1)
  useEffect(() => console.log(2), [])
  useLayoutEffect(() => console.log(3), [])
  console.log(4)
  return null
}
```
**Output:** `1, 4, 3, 2` (render → layoutEffect sync → paint → effect async)

---

**Q5:**
```jsx
const [items, setItems] = useState([1, 2, 3])
const add = () => {
  items.push(4)
  setItems(items)
}
```
**Có re-render không?**
**Output:** Không. Mutate cùng reference → `Object.is(prev, next) === true` → bailout.

**Fix:** `setItems([...items, 4])`.

---

### Y39. References (official docs)

**React core:**
- [react.dev](https://react.dev) ⭐ — official, viết lại 2023, có interactive examples
- [react.dev/learn](https://react.dev/learn) — tutorial từ đầu
- [react.dev/reference/react](https://react.dev/reference/react) — full hooks reference
- [react.dev/blog](https://react.dev/blog) — release notes
- [GitHub react](https://github.com/facebook/react)

**Patterns & guides:**
- [you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect)
- [reading state in event handlers](https://react.dev/learn/state-as-a-snapshot)
- [overreacted.io](https://overreacted.io) — Dan Abramov deep dives
- [Patterns.dev — React](https://www.patterns.dev/react)
- [Kent C. Dodds](https://kentcdodds.com) — best practices

**Internals:**
- [React Fiber Architecture (Andrew Clark)](https://github.com/acdlite/react-fiber-architecture)
- [Build your own React (Pomber)](https://pomber.github.io/build-your-own-react/) — 90 dòng dựng React mini
- [Inside Fiber](https://indepth.dev/posts/1008/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react)

**Newsletter/blog:**
- [This Week in React](https://thisweekinreact.com)
- [Josh Comeau — joshwcomeau.com](https://www.joshwcomeau.com)
- [Bytes by Cassidoo](https://bytes.dev)

**Interactive practice:**
- [BFE.dev](https://bigfrontend.dev) — React challenges
- [JS Challenger React](https://reactchallenger.com)
- [react.gg](https://react.gg) — visual learning

---

## Cheat Sheet — Ôn nhanh 1 trang trước phỏng vấn

**JS:** var/let/const, closure, hoisting, this 5 rules, event loop (micro vs macro), Promise.all/allSettled/race/any, ==/===, ??/||, null/undefined.

**React:** hooks list, useMemo/useCallback (chỉ khi cần), reconciliation + key, Context re-render, Custom hook, ErrorBoundary.

**State:** Zustand/RTK/TanStack Query, 4 loại state (UI, server, global, URL), Redux flow + Immer.

**Perf:** virtualize list, lazy load, code split, image format/size, memo đúng cách, transform+opacity animate, debounce/throttle.

**Security:** XSS escape (React tự), CSRF SameSite cookie, JWT httpOnly cookie, CSP, OWASP top 10.

**Testing:** RTL (test user behavior), MSW mock API, jest.fn/spyOn/mock khác nhau, Maestro cho RN E2E.

**Git:** GitHub Flow, squash merge, revert vs reset, cherry-pick, feature flag.

**RN:** Hermes + New Arch, Reanimated UI thread, FlashList, MMKV, Keychain, Expo + EAS, OTA cho JS only.

**A11y:** semantic HTML, contrast 4.5:1, keyboard nav, ARIA roles, touch 44px.

---

**Chúc bạn phỏng vấn thuận lợi! 🚀**
