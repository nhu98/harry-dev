# 09 — Personal Notes Summary (từ repo `experience_note`)

> Tổng hợp + annotate + cập nhật kiến thức từ repo cá nhân [tantruc1505/experience_note](https://github.com/tantruc1505/experience_note).
>
> **Format mỗi mục:**
> - 📝 **Note gốc (cô đọng):** các điểm chính từ file note bạn đã viết
> - 💡 **Annotation:** mình bổ sung, cập nhật, chỉnh chỗ nào outdated
> - 🔗 Link tới file chi tiết hơn trong knowledge base (01–08)

---

## Mục lục các file gốc

| File gốc | Chủ đề | Mục trong file này |
|---|---|---|
| `5_JS.txt` | JavaScript core | [§1](#section-1) |
| `8_React.txt` | React | [§2](#section-2) |
| `5_Typescript.txt` | TypeScript | [§3](#section-3) |
| `5_CSS.txt` | CSS | [§4](#section-4) |
| `5_HTML.txt` | HTML & Browser | [§5](#section-5) |
| `4_DesignPattern.txt` | Design Patterns | [§6](#section-6) |
| `3_API.txt` | REST API, Caching, HTTP | [§7](#section-7) |
| `2_Internet.txt` | Networking & Security | [§8](#section-8) |
| `6_Rxjs.txt` | RxJS | [§9](#section-9) |
| `1_DataStructure.txt`, `1_Algorithm.txt` | DS & Algo | [§10](#section-10) |
| `9_Jest-Testing.txt` | Testing | [§11](#section-11) |
| `10_GIT.txt` | Git workflow | [§12](#section-12) |
| `11_Capacitor.txt` | Capacitor (hybrid mobile) | [§13](#section-13) |
| Q&A gốc | Câu hỏi phỏng vấn từ note | [§14](#section-14) |

---

<a id="section-1"></a>
## §1 — JavaScript Core (từ `5_JS.txt`)

### 1.1. JS Engine & Cách chạy

📝 **Note gốc:**
- Mỗi browser có engine khác nhau: Chrome (V8), Firefox (SpiderMonkey), Safari (JavaScriptCore)
- Quá trình: Parse JS → AST → Interpreter (V8 Ignition) gen bytecode → Profiler (V8 TurboFan) compile sang machine code + tối ưu
- JS là **single-threaded** → chỉ 1 Call Stack
- Compiler vs Interpreter: Compiler dịch toàn bộ rồi chạy (bảo mật, đa luồng), Interpreter dịch từng dòng

💡 **Annotation:**
- V8 modern có thêm tier compile mới: **Sparkplug** (non-optimizing baseline compiler, nằm giữa Ignition và TurboFan) — giảm thời gian warm-up. Có cả **Maglev** (mid-tier optimizing) từ 2023.
- Hermes (RN engine của Meta) **Ahead-of-Time** compile sang bytecode → app start nhanh hơn cả V8 với JS source.

### 1.2. Event Loop & Memory Model

📝 **Note gốc:**
- Call Stack (LIFO) + Web APIs + Callback Queue + Event Loop
- Microtask > Macrotask > Render
- Microtask: Promise.then, queueMicrotask, MutationObserver
- Macrotask: setTimeout, setInterval, I/O, DOM events
- Stack: primitive + reference. Heap: object + function (Garbage Collected — Mark-and-Sweep)

💡 **Annotation:**
- Đúng và đầy đủ. Cập nhật thêm:
  - **`queueMicrotask()`** — API native push vào microtask (thay vì trick `Promise.resolve().then`)
  - **`scheduler.yield()`** (mới 2024) — yield control về browser giữa long task để giảm INP
- Loupe demo (latentflip.com) — tool visualize tuyệt vời, recommend cho người mới hiểu event loop

🔗 Chi tiết: [A1 §A1 — Event Loop](./A1-core-javascript.md#advanced-js), [B2 §INP](./B2-web-performance-security.md)

### 1.3. Data Types

📝 **Note gốc:**
- **Primitive (immutable, compare by value):** string, number, boolean, undefined, null, symbol, bigint
- **Reference (mutable, compare by address):** object, array, function, Date, Set, Map, RegExp, Error
- `typeof null === 'object'` (bug lịch sử)
- Hack `undefined`: dùng `void 0` thay vì `=== undefined` vì có thể bị override (chỉ trong scope cũ)
- Coercion: `[1] == 1 → true`, `'113' + 1 = '1131'`, `+null = NaN`

💡 **Annotation:**
- ES2020+ trở đi `globalThis` chuẩn — thay cho `window` (browser), `global` (Node), `self` (worker)
- Trick `void 0` chỉ cần thiết trong code rất cũ (ES3). Modern engine không cho `undefined` re-assign ở global scope.
- Strict equality `===` ưu tiên — coercion là nguồn bug

🔗 Chi tiết: [01 §Day 2](./A1-core-javascript.md#day-2)

### 1.4. Scope, Hoisting, Closure

📝 **Note gốc:**
- `var` function scope, hoist init undefined; `let` block scope, không hoist; `const` immutable binding
- Closure: function nhớ scope outer, return func vẫn truy cập được biến ngoài
- Use cases: private OOP, currying, module pattern
- ⚠️ Có thể ảnh hưởng hiệu năng + memory

💡 **Annotation:**
- Bổ sung **Temporal Dead Zone (TDZ)** — vùng giữa start scope và khai báo `let/const`. Access trong TDZ → ReferenceError (không phải undefined như `var`).
- Closure không "ảnh hưởng tiêu cực" nếu dùng đúng — chỉ là cần cleanup ref khi xong để GC. Trong React: closure trong useEffect/useCallback rất hay gặp **stale closure bug**.

🔗 Chi tiết: [01 §Day 19](./A1-core-javascript.md#day-19), [08 §Y12](./D1-interview-questions.md#y-react-core)

### 1.5. Function Types

📝 **Note gốc:**
- Declaration (hoisted full) — `function a() {}`
- Expression — `const a = function() {}`
- Arrow — không bind `this`, không có `arguments`, không làm constructor
- `call/bind/apply` — borrow function với this khác

💡 **Annotation:**
- Đầy đủ. Bổ sung:
  - Arrow function không có **`prototype`** property — không `new` được
  - Modern `Array.prototype.forEach.call(arguments, ...)` → `[...arguments].forEach(...)` (rest spread)
  - `bind` tạo function mới — `f.bind(ctx)` ≠ `f` về reference (cẩn thận khi pass props vào memoized child)

### 1.6. Promise & Async

📝 **Note gốc:**
- 3 states: pending → fulfilled / rejected
- `Promise.all` fail-fast → fix bằng `.map(p => p.catch(e => e))` hoặc `Promise.allSettled`
- `Promise.race` reject 1 cái → reject all → dùng `Promise.any` (ES2021)
- async/await đẩy phần await vào callback queue
- Error handling: try/catch, .then().catch(), wrapper `[err, data]`

💡 **Annotation:**
- Bổ sung **`Promise.withResolvers()`** (ES2024) — return `{ promise, resolve, reject }` để có resolver ở scope ngoài (thay deferred pattern):
  ```js
  const { promise, resolve, reject } = Promise.withResolvers()
  ```
- **AbortController** + `AbortSignal.timeout(ms)` (modern) cho cancel + timeout:
  ```js
  fetch(url, { signal: AbortSignal.timeout(5000) })
  ```
- Wrapper pattern `[err, data]` đẹp, lib **`neverthrow`**, **`fp-ts Either`** chuyên dụng hơn

### 1.7. JWT & Auth Flow

📝 **Note gốc:**
- JWT = 3 phần: Header.Payload.Signature
- Signature = SHA256(base64(header) + base64(payload) + secretKey)
- Cách 1 đơn giản: Access Token trong storage, gắn header mỗi request
- Cách 2 bảo mật: Access Token trong store (memory), Refresh Token trong httpOnly cookie, withCredentials
- Cookie vs JWT: cookie cần server check DB, JWT stateless
- Cookie có session ID + state ở server, scale khó. JWT nhiều info, scale dễ, mobile ok

💡 **Annotation:**
- Note rất chuẩn. Cập nhật thêm:
  - **Access token NGẮN** (15p) + **Refresh token rotation** (mỗi lần refresh → token mới, invalidate cũ) — chống token replay
  - **Không lưu access token trong localStorage** — XSS đọc được. Memory hoặc httpOnly cookie
  - JWT signing modern dùng **RS256** (asymmetric) thay HS256 (symmetric) cho microservice — chỉ auth server có private key
  - JWT có nhược điểm: **không revoke giữa chừng được** → dùng JWT blacklist (Redis) cho immediate logout
  - **Passkey/WebAuthn** đang thay thế password (Apple, Google đẩy 2024+)

🔗 Chi tiết: [08 §E3](./D1-interview-questions.md#e-security), [08 §S6 JWT pitfalls](./D1-interview-questions.md#s-security-advanced)

### 1.8. Method String/Array/Object cheat (đã có trong note)

📝 **Note gốc:** liệt kê methods string, array, object phổ biến — search, padStart, slice, splice, concat, fromEntries...

💡 **Annotation:** đầy đủ. Bổ sung modern:
- ES2023 immutable array methods: `toSorted()`, `toReversed()`, `toSpliced()`, `with()`
- ES2022: `arr.at(-1)`, `Object.hasOwn(obj, key)` (thay `obj.hasOwnProperty`)
- ES2024: `Object.groupBy(arr, fn)`, `Map.groupBy(arr, fn)`

🔗 Chi tiết: [01 §Day 5, 8](./A1-core-javascript.md#day-5)

### 1.9. Web Component, WebSocket, Proxy, Web Worker, Hidden Class

📝 **Note gốc:**
- Web Component: Custom Element + Shadow DOM + Template
- WebSocket: 2 chiều, low latency. Có heartbeat ping/pong
- SSE: 1 chiều server → client, hỗ trợ native
- Proxy: `new Proxy(target, handler)` — handler có get, set, has, deleteProperty
- Web Worker: multi-thread cho FE. 3 loại: Dedicated, Shared, Service Worker
- Hidden Class (V8): trick optimize property lookup, instance variable fixed offset
- Shadow DOM: encapsulate component

💡 **Annotation:**
- Note tốt. Update:
  - WebSocket modern lib: **Socket.IO 4+**, **Phoenix Channels**, **Pusher**, **Ably** (managed)
  - Server-Sent Events vẫn hữu ích — đơn giản, auto-reconnect, hỗ trợ HTTP/2 multiplex
  - Service Worker: cốt lõi của **PWA**, **offline-first**, push notification web
  - **OffscreenCanvas** + Worker — render canvas off main thread (game perf)
  - **WebTransport** (mới, dựa trên QUIC) — sắp thay WebSocket cho low-latency

🔗 Chi tiết: [07 §5 WebSocket](./A7-core-backend.md#realtime), [04 §Q8 Worker](./D1-interview-questions.md#q-perf-advanced)

### 1.10. Q&A phỏng vấn (từ cuối file)

📝 **Note gốc câu hỏi:**
- Object vs Map (Map giữ insertion order, có .size, key bất kỳ)
- Slice vs Splice (splice mutate, slice immutable + dùng được cho string)
- Arrow vs regular function
- High Order Function — function nhận callback hoặc return function
- 4 OOP principles: Encapsulation, Inheritance, Polymorphism, Abstraction
- KISS, DRY, SOLID, YAGNI
- JSON, API, Reflow vs Repaint
- Google/FB tracking qua lib analytic

💡 **Annotation:** câu trả lời đã đầy đủ. Có thêm trong [08 §Y36](./D1-interview-questions.md#y-react-core).

---

<a id="section-2"></a>
## §2 — React (từ `8_React.txt`)

### 2.1. Virtual DOM, Hooks, Lifecycle

📝 **Note gốc:**
- VDOM không nhanh hơn DOM thật — sinh ra để dễ thao tác + thay đổi nội dung
- Hooks: cho phép "kết nối" state & lifecycle vào stateless component
- 13 hooks: useState, useReducer, useEffect, useLayoutEffect, useRef, useMemo, useCallback, useContext, useImperativeHandle, useDebugValue, ...
- `useEffect` lifecycle: mount → render → effect; update → render → cleanup → effect; unmount → cleanup
- `useRef = react.createRef`, dùng cho DOM + giữ value không re-render
- `useCallback/useMemo` — cache function/value tránh re-render thừa
- Lifecycle class: constructor, getDerivedStateFromProps, shouldComponentUpdate, render, getSnapshotBeforeUpdate, componentDidMount, componentDidUpdate, componentWillUnmount, getDerivedStateFromError, componentDidCatch

💡 **Annotation:** Note đúng, nhưng **đã có nhiều update kể từ React 18/19** mà note chưa cover:

#### React 18 (2022) đã có:
- **Automatic batching** — mọi state update batch (cả trong setTimeout/Promise)
- **Concurrent rendering** — `useTransition`, `useDeferredValue`, `Suspense for data`
- **`useId`**, **`useSyncExternalStore`** — hooks mới
- **Strict Mode** double-invoke để phát hiện side effect không pure

#### React 19 (12/2024) — quan trọng nhất:
- **`use(promise/context)`** — đọc Promise/Context conditionally
- **`useActionState`** (thay `useFormState`) — form action với pending state
- **`useFormStatus`** — đọc form status
- **`useOptimistic`** — optimistic UI built-in
- **`ref` as prop** — không cần `forwardRef`
- **`<Context>` as Provider** — không cần `.Provider`
- **Server Components + Server Actions** stable
- **React Compiler** — auto memoize, không cần `useMemo`/`useCallback` thủ công

> ⚠️ **`useRef = react.createRef`** không chính xác:
> - `useRef` persistent across renders (same ref object)
> - `createRef` chỉ cho class, mỗi render trong function tạo ref mới

🔗 Chi tiết: [08 §V — React 19](./D1-interview-questions.md#v-react-19), [08 §Y — React Core](./D1-interview-questions.md#y-react-core), [03 §Hooks](./A3-core-react.md#hooks)

### 2.2. setState async

📝 **Note gốc:**
- setState async vì component phải rerender + tạo VDOM → tốn CPU
- Code mẫu giải thích thứ tự sync/async với setTimeout

💡 **Annotation:**
- React 18+: **automatic batching** — mọi setState trong cùng tick (kể cả trong setTimeout, Promise) đều batch thành **1 render**
- Pre-18: chỉ batch trong event handler React
- Closure pitfall: `setCount(count + 1)` x3 → chỉ + 1 (count cũ trong closure). Fix bằng **functional updater** `setCount(c => c + 1)`

### 2.3. Context API, Redux, Saga, Thunk

📝 **Note gốc:**
- Context: tránh prop drilling, Provider + Consumer (hoặc useContext)
- Redux: Store + Reducer + Action — flow đơn giản
- Redux-Saga: middleware handle side effect dùng generator + helper effects (put, call, fork, takeEvery, takeLatest, select)
- Saga vs Thunk: Thunk lồng nhiều dispatch khó nhìn, Saga theo pattern dễ track

💡 **Annotation:**
- **Modern 2026: Redux nguyên bản đã lỗi thời.** Dùng **Redux Toolkit (RTK)** — built-in Immer, createSlice, createAsyncThunk, RTK Query.
- Redux-Saga vẫn dùng được nhưng đa số project mới chuyển sang:
  - **TanStack Query** (server state)
  - **Zustand** (client state)
  - **Jotai** (atomic)
- Context update → mọi consumer re-render (kể cả memo) → **tách context theo concern** hoặc dùng Zustand selector

🔗 Chi tiết: [02 §State](./A2-core-architecture-patterns.md#state), [03 §State Mgmt](./A3-core-react.md#state-mgmt)

### 2.4. React.memo, HOC, Render Props, Custom Hook

📝 **Note gốc:**
- React.memo: HOC, function comp, shallow compare props
- HOC: input khác, logic output giống nhau
- Render Props: callback function, logic giống, output khác
- Custom Hook: tách logic ra UI, share giữa components

💡 **Annotation:**
- HOC, Render Props ngày nay **mostly replaced bởi Custom Hooks** — dễ compose, không nesting, không prop conflict
- React.memo + `useCallback`/`useMemo` cần combine cẩn thận. Memo riêng vô ích nếu props là object/function literal
- React Compiler (R19) sẽ làm chuyện này tự động

### 2.5. Form, Theme, Routing

📝 **Note gốc:**
- Form: Formik + Yup hoặc React Hook Form
- Theme: ThemeProvider (styled-components) hoặc CSS variable (`document.body.dataset.theme`)
- React Router: exact match, Link vs NavLink, useParams

💡 **Annotation:**
- 2026: **React Hook Form + Zod** ⭐ thay Formik (perf tốt hơn, TS-first, bundle nhỏ)
- React Router v7 (2024) — major rewrite, merge với Remix data router patterns
- Server-driven theme với CSS variables + `data-theme` attribute trên `<html>` — pattern chuẩn hiện nay
- **Tailwind CSS dark mode**: `dark:` prefix

🔗 Chi tiết: [03 §Forms](./A3-core-react.md#forms), [02 §Design System](./A2-core-architecture-patterns.md#design-system)

### 2.6. React Fiber (note bỏ trống)

📝 Note bạn để dở: "* React Fiber?"

💡 **Mình bổ sung:**
- **Fiber** = đơn vị work + linked list rebuild reconciler từ React 16 (2017)
- Mỗi React element → 1 Fiber node với: type, key, child, sibling, return, stateNode, memoizedState (hooks linked list), effectTag, alternate (double buffer)
- Cho phép **chia nhỏ work** → pause/resume/abort → mở khoá concurrent rendering
- 2 cây: `current` (đang display) + `workInProgress` (đang build) — swap atomic khi commit

🔗 Chi tiết: [08 §Y3 Fiber](./D1-interview-questions.md#y-react-core)

---

<a id="section-3"></a>
## §3 — TypeScript (từ `5_Typescript.txt`)

### 3.1. Interface, Type, Enum, Generic

📝 **Note gốc:**
- Interface: định nghĩa model API, có thể implement/extends
- Type alias: có thể khai báo function type, union
- Enum: numeric hoặc string-based
- Intersection `&`, Union `|`
- Type guard `person is Name`
- Utility: `Partial<T>`, `Omit<T, K>`
- Conditional type `T extends U ? X : Y`
- `keyof` cho key names
- Generic: function, variable, class, extends constraint

💡 **Annotation:** Note bao quát tốt các basics. Bổ sung modern TS (5.x):

#### Utility Types đầy đủ:
```ts
Partial<T>          // tất cả optional
Required<T>         // tất cả required
Readonly<T>         // tất cả readonly
Pick<T, K>          // chọn subset key
Omit<T, K>          // bỏ key
Record<K, V>        // map key-value
ReturnType<F>       // type return của function
Parameters<F>       // tuple types của args
Awaited<P>          // unwrap Promise
NonNullable<T>      // bỏ null | undefined
Exclude<T, U>       // exclude type khỏi union
Extract<T, U>       // extract type từ union
InstanceType<C>     // type instance của class
```

#### Modern features (TS 4.5+):
- **`satisfies`** operator — check type mà không widen:
  ```ts
  const config = { a: 1, b: 'x' } satisfies Record<string, unknown>
  ```
- **Template literal types**:
  ```ts
  type Greeting = `Hello ${string}`
  type Routes = `/api/${'users' | 'posts'}`
  ```
- **Discriminated union** + exhaustive check:
  ```ts
  type State = { tag: 'loading' } | { tag: 'success', data: any } | { tag: 'error', err: Error }
  switch (s.tag) {
    case 'loading': return ...
    case 'success': return s.data
    case 'error': return s.err
    default: const _: never = s    // exhaustive check
  }
  ```
- **`const` type parameter** (TS 5.0):
  ```ts
  function fn<const T>(arr: T[]): T[] { return arr }
  fn(['a', 'b'])  // T = 'a' | 'b' (literal), không widen thành string
  ```
- **`strict` config**: bật `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`
- **Zod / Valibot** — runtime validation + type infer

🔗 Chi tiết: [08 §H1 TypeScript](./D1-interview-questions.md#h-ts-style)

---

<a id="section-4"></a>
## §4 — CSS (từ `5_CSS.txt`)

### 4.1. Features CSS3 & Priority

📝 **Note gốc:**
- CSS3: @font-face, box-shadow, border-radius, opacity, gradient, animation, 3d transform, calc(), media queries
- External < Internal/Inline (theo thứ tự nằm sau) < Inline
- Selector: inline > id > class/pseudo > tag

💡 **Annotation:** Đúng. Bổ sung modern CSS (2023-2025):
- **Container Queries** (`@container`) — query theo size của parent element thay vì viewport
- **`:has()`** — parent selector
- **`@layer`** — cascade layers, kiểm soát specificity
- **Nesting** native (không cần Sass)
- **CSS Variables** (`--var`) — runtime, đổi qua JS
- **`color-mix()`**, **`oklch()`** — color modern
- **`view-transitions`** API — page transition mượt
- **`subgrid`** — grid item dùng grid của cha
- **Anchor positioning** — popover relative tới element bất kỳ
- **`light-dark()`** color function — auto theme

### 4.2. Flexbox, Grid, Box-sizing

📝 **Note gốc:**
- Flex: 2 div 50px + 100% → div 1 ko đủ 50px, phải set `flex: 1` cho div 2
- Float vs Flex: float phải tính margin, dễ xuống hàng
- `box-sizing: content-box` — width tính cả padding (đảo ngược thực tế!)

💡 **Annotation:** ⚠️ **Note sai chỗ box-sizing:**
- **`content-box` (default)**: `width` CHỈ tính content, padding/border CỘNG THÊM
- **`border-box`**: `width` BAO GỒM padding + border (chuẩn hiện nay)

Recommend `* { box-sizing: border-box }` cho mọi project.

- Flex: `flex: 1 1 0%` = `flex: 1` (grow, shrink, basis)
- **Modern: CSS Grid** mạnh hơn flex cho 2 chiều, `grid-template-areas` rất dễ đọc
- `gap` property work cho cả flex + grid (2022+)

🔗 Chi tiết: [08 §P1-P5 CSS](./D1-interview-questions.md#p-css-advanced)

### 4.3. SASS

📝 **Note gốc:**
- Mixin: truyền tham số như function, nhưng lặp code
- Extend: kế thừa class, gom nhóm tự động

💡 **Annotation:**
- SASS vẫn dùng tốt, nhưng nhiều dự án chuyển:
  - **Tailwind CSS** ⭐ — utility-first, không cần Sass
  - **CSS Modules** + nesting native
  - **Vanilla Extract**, **Linaria**, **Panda CSS** — zero-runtime CSS-in-JS
- `@use` thay `@import` (Sass mới)
- `@forward` để re-export

---

<a id="section-5"></a>
## §5 — HTML & Browser Internals (từ `5_HTML.txt`)

### 5.1. Browser components & Render engine

📝 **Note gốc:**
- Browser components: UI, Browser engine, Rendering engine, Networking, JS engine, Storage
- Render engines: Gecko (FF), WebKit (Safari), Blink (Chrome/Opera 15+)
- Render pipeline: HTML → DOM tree, CSS → CSSOM tree → Render tree → Layout → Paint → Display
- Reflow vs Repaint: reflow = layout lại; repaint = vẽ lại (không thay đổi layout)

💡 **Annotation:** Đúng và đầy đủ. Bổ sung:
- **Compositor thread** — sau Paint, browser tạo các layer, composite trên GPU. Animate `transform` + `opacity` chỉ trigger compositor → 60fps mượt
- **Critical Rendering Path** — tối ưu = giảm thời gian từ HTML start đến First Contentful Paint
- **Reflow trigger**: thay đổi width, height, font-size, position, display, padding/margin/border
- **Repaint trigger**: thay đổi background, color, visibility (không thay đổi layout)
- **Compositor-only**: transform, opacity, filter
- **`content-visibility: auto`** (CSS modern) — skip render off-screen → boost perf

🔗 Chi tiết: [04 §3 Runtime Perf](./B2-web-performance-security.md), [08 §D10](./D1-interview-questions.md#d-build-perf)

### 5.2. Async vs Defer

📝 **Note gốc:**
- Không async/defer → parse HTML dừng khi gặp `<script>`, fetch + exec, parse tiếp
- **Async**: parse HTML + fetch song song. Fetch xong → DỪNG parse → exec JS
- **Defer**: parse HTML + fetch song song. Parse XONG → exec JS

💡 **Annotation:** Đúng. Bổ sung:
- **`type="module"`** — defer mặc định + scoped + ESM
- **`<script async type="module">`** — async cho ES module
- **Order**: defer giữ thứ tự khai báo; async không đảm bảo order → analytics dùng async, app code dùng defer
- **`<link rel="modulepreload">`** preload module

### 5.3. HTML5 features

📝 **Note gốc:**
- Geolocation, Drag & Drop, LocalStorage, Web Workers, SSE
- Semantic tags: header, nav, aside, section, article, footer, mark, figure, embed, audio, video, canvas, svg, data, time, wbr

💡 **Annotation:** Đầy đủ. Bổ sung modern HTML:
- **`<dialog>`** — native modal (2022+), method `.showModal()`, `.show()`, `.close()`
- **`<details>` / `<summary>`** — native disclosure widget
- **`<picture>` + `<source srcset>`** — responsive image, format negotiation (AVIF, WebP)
- **`loading="lazy"`** — native lazy load image/iframe
- **`fetchpriority="high"`** — LCP hero image
- **Form attributes**: `inputmode`, `autocomplete`, `enterkeyhint`

### 5.4. SVG vs Canvas

📝 **Note gốc:**
- SVG: XML, scalable, modify CSS/JS
- Canvas: JS, raster, không scale tốt
- Dữ liệu lớn → canvas

💡 **Annotation:** Đúng. Bổ sung:
- **Lib SVG**: D3.js, Recharts, Visx
- **Lib Canvas**: Chart.js, PixiJS, Three.js (3D), Konva
- **WebGL/WebGPU** — canvas accelerated cho 3D, large dataset
- **WASM** trong canvas — ngôn ngữ khác (Rust, C++) compile sang WASM, draw vào canvas → game/visualization perf cao

---

<a id="section-6"></a>
## §6 — Design Patterns (từ `4_DesignPattern.txt`)

### 6.1. SOLID & Principles

📝 **Note gốc:**
- **S**ingle Responsibility — class 1 trách nhiệm
- **O**pen/Closed — mở rộng, không sửa
- **L**iskov Substitution — class con thay thế cha không đổi tính đúng
- **I**nterface Segregation — interface nhỏ, cụ thể
- **D**ependency Inversion — phụ thuộc abstraction
- **KISS, DRY, YAGNI**
- DI vs IoC: DI là 1 cách thực hiện IoC

💡 **Annotation:** Đầy đủ. Trong frontend hiện đại:
- **Dependency Injection** ít gặp dạng class, hay thấy qua **props**, **context**, **hook arguments**
- **Composition over Inheritance** — quan trọng hơn trong functional React
- **Pure function**, **immutable data** — base của FP & React

### 6.2. 23 GoF Patterns (3 nhóm)

📝 **Note gốc:**
- Creational: Singleton, Builder, Factory, Constructor, Prototype, Module
- Structural: Facade, Decorator, Mixin
- Behavioral: Observer, Command
- Code mẫu Singleton (với `Object.freeze`), Builder (method chaining), Factory, Facade

💡 **Annotation:**
- Singleton trong JS thường KHÔNG cần class — module ES singleton tự nhiên (export 1 instance)
- Modern patterns đáng biết:
  - **State machine** (XState) — thay if/else lồng nhau
  - **Reactive (Observable, Signal)** — Vue, Solid, MobX, RxJS
  - **Command Bus, Event Sourcing** — DDD lớn
  - **Repository pattern** — tách data access khỏi business logic

🔗 Chi tiết: [02 §4 GoF](./A2-core-architecture-patterns.md#gof), [08 §C — React patterns](./D1-interview-questions.md#c-react)

---

<a id="section-7"></a>
## §7 — REST API, Caching, HTTP (từ `3_API.txt`)

### 7.1. REST 6 Principles

📝 **Note gốc:**
- Uniform Interface, Client-Server, Stateless, Cacheable, Layered System, Code on Demand (optional)
- Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, CONNECT, TRACE
- GET vs POST: GET cached, có log URL — không bảo mật sensitive data
- PUT vs POST: PUT idempotent, POST không
- PUT vs PATCH: PATCH partial update, ít tốn bandwidth

💡 **Annotation:** Note rất chuẩn. Bổ sung:
- **HTTP/3 (QUIC)** — UDP-based, multiplexing không head-of-line block, 0-RTT
- **Idempotency-Key** header (Stripe pattern) cho POST/payment
- **Pagination**: cursor-based (`?cursor=xxx`) > offset cho feed thay đổi nhanh
- **RFC 7807 Problem Details** — JSON error format chuẩn:
  ```json
  { "type": "...", "title": "...", "status": 422, "detail": "..." }
  ```

🔗 Chi tiết: [07 §2 REST](./A7-core-backend.md#rest)

### 7.2. REST vs SOAP vs GraphQL/tRPC

📝 **Note gốc:**
- REST: JSON/HTML/XML, cache GET tốt
- SOAP: XML only, đa giao thức (HTTP/TCP/SMTP/JMS), security WS-SECURITY, có thể kế thừa tốt hơn

💡 **Annotation:** Bổ sung:
- **GraphQL** — client chọn field, 1 endpoint, schema typed, có Subscription. Pitfall: N+1 → dùng DataLoader
- **tRPC** — TS end-to-end type-safe, không codegen, hay trong monorepo Next.js + RN
- **gRPC** — protobuf, microservice (BE-to-BE)
- **REST** vẫn là default cho public API

🔗 Chi tiết: [07 §3-4](./A7-core-backend.md#graphql)

### 7.3. HTTP Caching

📝 **Note gốc:**
- Browser cache: Expires, Cache-Control (max-age, s-maxage, public, private, no-store, no-cache, must-revalidate, proxy-revalidate)
- ETag (strong/weak), Last-Modified
- Proxy cache, Reverse proxy cache, Database cache
- GZIP compression: client gửi `Accept-Encoding: gzip`, server response `Content-Encoding: gzip`

💡 **Annotation:** Note đầy đủ. Bổ sung:
- **Brotli** > Gzip (~20% nhỏ hơn cho text) — `Accept-Encoding: br`
- **`stale-while-revalidate`** (modern) — serve cache cũ ngay, refresh background → UX mượt
- **`immutable`** cho asset có hash → cache forever
- Modern stack: **CDN edge cache** (Cloudflare, CloudFront, Fastly) + **`stale-while-revalidate`** + filename hash

🔗 Chi tiết: [08 §R — Caching](./D1-interview-questions.md#r-caching-advanced)

### 7.4. HTTP Status Codes

📝 **Note gốc:** Đầy đủ 200, 304, 400, 401, 403, 404, 422, 500

💡 **Annotation:** Bổ sung hay gặp:
- **201 Created** — POST thành công, có body resource
- **204 No Content** — DELETE thành công
- **409 Conflict** — duplicate
- **429 Too Many Requests** — rate limit (kèm `Retry-After` header)
- **502 Bad Gateway** — upstream lỗi
- **503 Service Unavailable** — maintenance/overload

---

<a id="section-8"></a>
## §8 — Networking & Security (từ `2_Internet.txt`)

### 8.1. SSR vs CSR

📝 **Note gốc:**
- SSR: server trả HTML có content → SEO tốt, response chậm, chuyển trang reload
- CSR: server trả HTML rỗng + JS → response nhanh, không reload, SEO kém

💡 **Annotation:** Modern (2024+) đã có nhiều hybrid:
- **SSG** (Static Site Generation): build trước HTML → fast + SEO
- **ISR** (Incremental Static Regeneration): SSG + revalidate
- **RSC** (React Server Components): hybrid, stream JSX serialized
- **Edge SSR** (Cloudflare Workers, Vercel Edge): render gần user → fast + dynamic
- **PPR** (Partial Prerendering, Next 15): static shell + dynamic holes

🔗 Chi tiết: [08 §W2-W10 Next.js 15](./D1-interview-questions.md#w-nextjs-15)

### 8.2. HTTPS, TLS, Bcrypt

📝 **Note gốc:**
- HTTPS: SSL cert + public key → browser, dùng asymmetric encrypt symmetric key → symmetric encrypt data
- Port: HTTP 80, HTTPS 443
- Bcrypt: hash 1 chiều, salt round tăng độ phức tạp

💡 **Annotation:**
- TLS 1.3 (2018) — chuẩn hiện đại, faster handshake (1-RTT, 0-RTT resumption)
- **Argon2** mạnh hơn Bcrypt — recommended 2024+
- **HSTS** header bắt buộc HTTPS
- **CSP** (Content Security Policy) chặn XSS
- **Certificate transparency logs** — phát hiện cert giả

🔗 Chi tiết: [08 §S — Security Advanced](./D1-interview-questions.md#s-security-advanced)

### 8.3. Session vs Cookie, TCP, ISP, Proxy, HttpOnly

📝 **Note gốc:**
- Cookie: chứa token, gửi mỗi request
- Session: store ram server (vd cart trước login)
- TCP: reliable transport, 3-way handshake, order, retransmit
- Proxy: middle server, firewall, cache, private
- Reverse Proxy: ngược, đặt gần origin, load balance, cache
- HttpOnly cookie: JS không đọc được

💡 **Annotation:**
- **QUIC (HTTP/3)** — UDP, không có HoL blocking → nhanh hơn TCP cho mạng yếu/mobile
- Modern session/auth: **JWT in httpOnly Secure SameSite cookie**, refresh token rotation
- **Reverse proxy hiện đại**: Nginx, HAProxy, Caddy, Traefik. Cloud: Cloudflare, CloudFront

### 8.4. Security: XSS, CSRF, Clickjacking

📝 **Note gốc:**
- **XSS** 3 loại: Reflected (`?` query), Stored (DB), DOM-based (`#` hash)
- Chống: escape, CSP, httpOnly cookie, không lưu token localstore
- **CSRF**: từ trang A submit form đến trang B đã login → bị thực thi với cookie. Chống: anti-forgery token, authen token, SameSite cookie
- **Clickjacking**: iframe đè giao diện hack. Chống: `X-Frame-Options: DENY`

💡 **Annotation:** Note rất tốt. Bổ sung:
- **DOMPurify** lib sanitize HTML
- **CSP** với `nonce-xxx` thay vì `'unsafe-inline'`
- React tự escape `{var}` — **KHÔNG dùng `dangerouslySetInnerHTML`** với user data
- **`frame-ancestors`** CSP thay `X-Frame-Options` (modern)
- **SameSite=Lax** default Chrome (2020+) — chống được nhiều CSRF case
- **Subresource Integrity (SRI)** — `<script integrity="sha384-...">` cho CDN

🔗 Chi tiết: [08 §S2-S5 XSS/CSRF/CSP/CORS](./D1-interview-questions.md#s-security-advanced)

---

<a id="section-9"></a>
## §9 — RxJS (từ `6_Rxjs.txt`)

### 9.1. Subjects

📝 **Note gốc:**
- `Subject`: subscribe rồi mới next
- `BehaviorSubject`: có initial value
- `ReplaySubject`: replay N history records
- `AsyncSubject`: chỉ emit value cuối khi complete

💡 **Annotation:** Đúng đầy đủ. Use case:
- `BehaviorSubject`: state store (Angular service, simple state mgmt)
- `ReplaySubject(1)`: cache 1 emission, late subscriber vẫn nhận
- `Subject`: event bus

### 9.2. Operators

📝 **Note gốc:**
- Creation: `of`, `from`, `fromEvent`, `interval`, `timer`, `throwError`, `defer`, `ajax`, `fromFetch`
- Transformation: `merge`, `concat`, `map`, `every`, `pluck`, `toArray`, `reduce`, `scan`, `buffer`, `bufferTime`, `iif`
- Filtering: `filter`, `first`, `last`, `find`, `take`, `takeLast`, `takeUntil`, `takeWhile`, `skip`, `distinct`, `distinctUntilChanged`, `debounceTime`, `throttleTime`, `auditTime`, `sampleTime`
- Combination: `forkJoin` (= Promise.all), `combineLatest`
- Higher Order: `mergeAll`, `concatAll`, `switchAll`
- Flatten: `mergeMap`, `concatMap`, `switchMap`, `exhaustMap`
- Use case rất chính xác:
  - `mergeMap` → form combined values
  - `concatMap` → upload sequential
  - `switchMap` → search autocomplete (cancel previous)
  - `exhaustMap` → submit button (ignore double-click)
- `tap` vs `tapResponse`: tap có thể throw, tapResponse silence

💡 **Annotation:**
- Note rất hay & chi tiết. **Best practice 2026:**
  - **`pipe()`** chuẩn — không còn dot chain
  - **`takeUntilDestroyed()`** (Angular 16+) thay manual `takeUntil(destroy$)` cleanup
  - **Signals** (Angular 17+) đang thay nhiều RxJS use case đơn giản (state reactive)
  - RxJS vẫn xuất sắc cho complex stream (search debounce, polling, web socket)
- Trong React: **TanStack Query** đã handle hầu hết use case (caching, refetch, dedupe) — không cần RxJS

### 9.3. Sự khác biệt `tap` vs `tapResponse`

📝 **Note gốc:** Trình bày chi tiết edge cases — error callback trong tap thì có throw, tapResponse silence

💡 **Annotation:** Đây là phần advanced của @ngrx/component-store. **Quy tắc nhớ nhanh:**
- `tap()` — observer (next/err/complete) chạy side effect, **nếu callback err throw → catchErr bắt được**
- `tapResponse()` — wrap callback, **silence err nội bộ**, tương đương `tap + catchError(() => EMPTY)`

---

<a id="section-10"></a>
## §10 — Algorithms & Data Structures (từ `1_Algorithm.txt` + `1_DataStructure.txt`)

### 10.1. Big-O 8 levels

📝 **Note gốc:**
- O(1) constant — hashtable lookup
- O(log n) — binary search
- O(n) — linear scan
- O(n log n) — merge sort, quick sort
- O(n²) — bubble, nested loop
- O(n³) — 3 nested
- O(2ⁿ) — Fibonacci naive, power set, TSP
- O(n!) — permutation, factorial

💡 **Annotation:** Đầy đủ chuẩn. Bổ sung:
- **Space complexity** đo tương tự cho memory
- **Amortized**: average over many operations (vd array push amortized O(1))
- **Best/Average/Worst case** — Big-O thường chỉ worst

### 10.2. 8 Data Structures

📝 **Note gốc:** Array, Linked, Hash table, Hash Map, Stack (LIFO), Queue (FIFO), Tree, Graph

💡 **Annotation:** Đủ. Bổ sung sâu hơn:
- **Heap** (Priority Queue) — get min/max O(log n), dùng cho top-K, Dijkstra
- **Trie** (Prefix tree) — autocomplete, dictionary, O(m) cho m=length từ
- **Disjoint Set (Union-Find)** — connected components O(α(n))
- **BST** (Binary Search Tree) — sorted, O(log n) avg
- **Self-balancing BST**: AVL, Red-Black (V8 Map internal)
- **B-Tree** — database index

### 10.3. Algorithms

📝 **Note gốc:**
- Binary search: O(log n), recursive (chia đôi) hoặc iterative
- Bubble sort, Merge sort (link stackblitz)
- Câu hỏi PV: xử lý chuỗi, sort, khoảng cách 1-1, custom stack, big number string addition

💡 **Annotation:**
- **JS native `.sort()`** dùng Timsort (V8) — O(n log n), stable
- **Quicksort** average O(n log n), worst O(n²) — JS hiếm tự implement
- Patterns hay gặp:
  - **Two Pointers** — sorted array, palindrome
  - **Sliding Window** — substring max sum, longest no-repeat
  - **Hash Map cho lookup** — two-sum
  - **Prefix Sum** — range sum query nhiều lần
  - **Fast & Slow Pointer** — cycle detection
  - **Merge Intervals**
  - **BFS/DFS** — tree, graph
  - **DP** — knapsack, LCS, edit distance

🔗 Chi tiết: [06 — Algorithms & DS](./A6-core-algorithms.md)

---

<a id="section-11"></a>
## §11 — Testing (từ `9_Jest-Testing.txt`)

📝 **Note gốc:**
- `describe()` block mô tả
- `beforeEach/All`, `afterEach/All`
- `it()` / `test()`
- `expect()` + matchers: `toBe`, `toEqual`, `not.toBe`
- Mock function, mock prop, mock return values
- Q&A: UT lib, snapshot, test hooks, mock modules, jest.fn vs spy vs mock

💡 **Annotation:** Note tóm lược tốt. Bổ sung modern:
- **Vitest** ⭐ — drop-in replacement cho Jest, nhanh hơn nhiều với Vite/ESM
- **React Testing Library** — test user behavior, không impl detail
- **MSW (Mock Service Worker)** — mock network thay vì module
- **Playwright** — E2E web modern (thay Cypress được)
- **Maestro** — E2E RN modern (đơn giản hơn Detox)
- **Storybook + Chromatic** — visual regression
- **jest-axe** — a11y trong unit test

Câu trả lời chi tiết các Q gốc:
- **`jest.fn`**: tạo function mock đứng riêng
- **`jest.spyOn(obj, 'method')`**: track real method, có thể mockImplementation
- **`jest.mock('module')`**: replace toàn module

🔗 Chi tiết: [05 — Testing & Quality](./A5-core-testing.md), [08 §F + §T](./D1-interview-questions.md#f-testing)

---

<a id="section-12"></a>
## §12 — Git Workflow (từ `10_GIT.txt`)

### 12.1. Core commands

📝 **Note gốc:**
- `git status`: kiểm tra (xanh: added, đỏ: chưa, đỏ modified: đã add nhưng đổi)
- `git stash` / `git stash pop`
- **Undo:**
  - `git checkout -- [file]` — undo WD
  - `git reset HEAD~` — unstage
  - `git reset --soft/--mixed/--hard [commit]` — về commit cũ với các mức
  - `git revert [commit]` — tạo commit mới undo
- **Branch:** `git branch`, `checkout -b`, `merge`, `merge --no-ff`, `rebase`, `rebase --preserve-merges`, `cherry-pick`, `branch -d`
- **Repo:** `commit`, `commit --amend`, `push --force`, `clone`, `fetch`, `pull`, `remote add origin`
- Credential: `--global credential.helper store` (disk) vs `cache --timeout=18000` (ram)
- Conflict: rebase vs merge flow

💡 **Annotation:** Note rất đầy đủ cho daily work. Bổ sung modern:
- **`git switch`** (Git 2.23+) — thay `checkout` cho branch (rõ ràng hơn)
- **`git restore`** — thay `checkout --` cho file (rõ ràng hơn)
  ```bash
  git switch -c feature/x       # tạo branch mới
  git switch main               # chuyển branch
  git restore file.js            # undo file (WD)
  git restore --staged file.js   # unstage
  ```
- **`git push --force-with-lease`** ⭐ thay `--force` — an toàn hơn (kiểm tra remote không bị ai khác push)
- **Conventional Commits** + commitlint:
  ```
  feat(auth): add login screen
  fix(navigation): handle deep link crash
  ```
- **Husky + lint-staged** — pre-commit hook auto format
- **Semantic-release** / **changesets** — auto changelog + version
- **GitHub Flow** vs GitFlow: GitHub Flow đơn giản, main + feature branch + PR — đa số team dùng
- **Trunk-Based Development** + Feature Flag — high-perf team

🔗 Chi tiết: [08 §G1-G6](./D1-interview-questions.md#g-git-deploy), [05 §13](./A5-core-testing.md#git-ci)

---

<a id="section-13"></a>
## §13 — Capacitor (từ `11_Capacitor.txt`)

### 13.1. Capacitor là gì

📝 **Note gốc:**
- Custom plugin: link docs Capacitor + iOS Media tutorial
- `CapacitorConfig` → `cordova.preferences` cho config Cordova plugin
- Cordova plugin: `npm i` trong project, `@awesome-cordova-plugins` global → use như service Angular
- Check URL DB trên Xcode: `FileManager.default.urls(.documentDirectory)`
- Debug iOS 16: `bridgedWebView?.isInspectable = true`

💡 **Annotation:**
- **Capacitor** (Ionic team) là native runtime cho web app — replacement modern của Cordova/PhoneGap
- Use case: PWA wrapping → iOS/Android app (Ionic Framework, hoặc bất kỳ web stack: Angular, React, Vue)
- **So với React Native:**

| | Capacitor | React Native |
|---|---|---|
| Cốt lõi | WebView + native bridge | JSI + native components |
| Render | HTML/CSS trong WebView | Native UIView/ViewGroup |
| Performance | Web-level | Native-level |
| Code base | Web (HTML/CSS/JS) | RN components |
| Native module | Capacitor Plugin (Swift/Kotlin) | TurboModule |
| Khi nào dùng | Đã có web app, muốn ship mobile nhanh | App mới, perf cao, native feel |
| Bundle size | nhỏ hơn | lớn hơn |
| App stores | accept (nếu có native value) | accept |

- **Modern alternatives:**
  - **Tauri** (mobile mới beta 2024) — Rust-based, light hơn
  - **Expo SDK** với Web target — Universal app
- **WKWebView inspector** iOS 16.4+ bắt buộc set `isInspectable = true` để Safari Web Inspector kết nối

### 13.2. AwesomeCordovaPlugins

📝 **Note gốc:** install global, dùng như Angular service

💡 **Annotation:** **Capacitor 5+** đã có nhiều plugin native riêng — ưu tiên dùng `@capacitor/*` plugins thay `@awesome-cordova-plugins` (cordova đang deprecate dần).

---

<a id="section-14"></a>
## §14 — Tổng hợp câu hỏi phỏng vấn (từ các file note)

### Từ `5_JS.txt`:
1. Code ví dụ async-await thành promise ✅ ([08 §A7](./D1-interview-questions.md#a7))
2. Các dạng function asynchronous (callback, promise, async/await, generator) ✅ ([08 §A8](./D1-interview-questions.md#a8))
3. CSS flexbox, grow, shrink ✅ ([08 §J1](./D1-interview-questions.md#j-css-a11y))
4. CSS specific ✅ ([08 §J2](./D1-interview-questions.md#j-css-a11y))
5. Accessibility ✅ ([08 §J3](./D1-interview-questions.md#j-css-a11y))
6. Browser hoạt động ✅ ([08 §B1](./D1-interview-questions.md#b-browser-dom))
7. DOM event, bubbling ✅ ([08 §B2-B3](./D1-interview-questions.md#b-browser-dom))
8. Rendering HTML ✅ ([08 §B4](./D1-interview-questions.md#b-browser-dom))
9. Storage clients (local/session/cookies) ✅ ([08 §B5](./D1-interview-questions.md#b-browser-dom))
10. Webpack config, chunk split, monitor bundle, tree shaking, lazy load, loader vs plugin ✅ ([08 §D1-D6](./D1-interview-questions.md#d-build-perf))
11. Security FE, XSS textbox ✅ ([08 §E1-E2 + §S](./D1-interview-questions.md#e-security))

### Từ `2_Internet.txt`:
12. Deploy CDN, caching ✅ ([08 §G4 + §R](./D1-interview-questions.md#r-caching-advanced))
13. Web Component ✅ ([08 §B6](./D1-interview-questions.md#b-browser-dom))
14. TypeScript ✅ ([08 §H1 + §3 file này](#section-3))
15. Styled-component ✅ ([08 §H2](./D1-interview-questions.md#h-ts-style))
16. Theme color (như antd) ✅ ([08 §H3](./D1-interview-questions.md#h-ts-style))
17. Tại sao uglify code vẫn xem được ✅ ([08 §D8](./D1-interview-questions.md#d-build-perf))
18. Micro-frontend (tổ chức, auth, iframe, communicate) ✅ ([08 §I1-I6](./D1-interview-questions.md#i-mfe))

### Từ `9_Jest-Testing.txt`:
19. Dùng gì viết UT, truy element snapshot, test hooks, mock modules, jest.fn vs spy vs mock ✅ ([08 §F1-F5](./D1-interview-questions.md#f-testing))

### Từ `1_Algorithm.txt`:
20. Xử lý mảng/chuỗi, regex
21. Sort
22. Tính khoảng cách xa nhất giữa 1-1 trong "1001000101"
23. Custom Stack class (push, pop, values)
24. Cộng 2 chuỗi số dài (không dùng BigInt)

**Lời giải các bài coding (gốc note để trống):**

#### 22. Khoảng cách xa nhất 1-1
```js
function maxGap(str) {
  let lastOne = -1, maxDist = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '1') {
      if (lastOne >= 0) maxDist = Math.max(maxDist, i - lastOne)
      lastOne = i
    }
  }
  return maxDist
}
maxGap('1001000101')  // 4
```

#### 23. Custom Stack
```js
class Stack {
  #items = []
  push(item) { this.#items.push(item) }
  pop() { return this.#items.pop() }
  peek() { return this.#items.at(-1) }
  values() { return [...this.#items] }
  get size() { return this.#items.length }
  isEmpty() { return this.#items.length === 0 }
}
```

#### 24. Cộng 2 chuỗi số dài
```js
function addStrings(a, b) {
  let i = a.length - 1, j = b.length - 1, carry = 0
  const result = []
  while (i >= 0 || j >= 0 || carry) {
    const sum = (+(a[i] ?? 0)) + (+(b[j] ?? 0)) + carry
    result.push(sum % 10)
    carry = Math.floor(sum / 10)
    i--; j--
  }
  return result.reverse().join('')
}
addStrings('1000000000000', '1000000000000000')  // '1001000000000000'
```

---

## Kết luận

### Điểm mạnh trong note gốc:
- ✅ Bao quát rộng: JS internals, React, Angular ecosystem, RxJS, Testing, Git, Security, API
- ✅ Có code examples thực tế (đặc biệt RxJS use cases — rất sâu)
- ✅ Phân tích sự khác biệt cụ thể (Cookie vs JWT, PUT vs POST, REST vs SOAP)
- ✅ Có Q&A từ phỏng vấn thực tế

### Cần cập nhật:
- ⚠️ **React** — note ở v16/17, thiếu React 18 (concurrent, automatic batching), React 19 (Actions, Compiler, Server Components)
- ⚠️ **Redux** — Redux Toolkit + RTK Query là chuẩn, Saga/Thunk legacy
- ⚠️ **Box-sizing** sai (content-box vs border-box)
- ⚠️ **Class lifecycle** — đa số dự án mới dùng hooks, lifecycle class chỉ ErrorBoundary

### Recommend học tiếp:
1. Đọc kỹ **[file A1](./A1-core-javascript.md)** cho JS sâu thực tế (Day 1-30 + Advanced)
2. **[File 03](./A3-core-react.md)** cho React/RN modern
3. **[File 08 §V + §W + §X](./D1-interview-questions.md#v-react-19)** cho React 19, Next 15, RN latest
4. **[File 08 §Y](./D1-interview-questions.md#y-react-core)** cho React Core Deep (Fiber, hooks deep dive)
5. **[File 06](./A6-core-algorithms.md)** cho Algorithm & DS thực hành (LRU, BFS/DFS, DP)

---

> Note này là tài liệu cá nhân được tổng hợp từ kinh nghiệm thực tế — rất đáng quý. Kết hợp với knowledge base hiện đại (file A1-08) sẽ có bộ tài liệu hoàn chỉnh.
