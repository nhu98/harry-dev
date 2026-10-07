# 02 — Architecture & Design Patterns

> Kiến trúc, design patterns, design system — bilingual VI/EN cho FE & React Native developer.

---

## Mục lục

1. [SOLID Principles](#solid)
2. [Clean Architecture & Layered Architecture](#clean-architecture)
3. [MVC / MVP / MVVM / Flux / Redux](#mvc-mvvm)
4. [GoF Design Patterns (JS examples)](#gof)
5. [React-specific Patterns](#react-patterns)
6. [Atomic Design](#atomic)
7. [Design System & Tokens](#design-system)
8. [Folder Structure (FE/RN)](#folder)
9. [Monorepo & Code Sharing](#monorepo)
10. [State Management Architecture](#state)

---

<a id="solid"></a>
## 1. SOLID Principles

> 5 nguyên tắc OOP do Robert C. Martin (Uncle Bob) tổng hợp. Áp dụng được cả OOP và functional.

### S — Single Responsibility Principle
**VI:** Một class/module/function chỉ làm 1 việc, chỉ có 1 lý do để thay đổi.

```js
// ❌ user service làm cả validate, save, email
class UserService {
  register(data) {
    if (!data.email) throw 'invalid'   // validation
    db.save(data)                       // persistence
    mail.send(data.email, 'welcome')   // notification
  }
}

// ✅ tách
class UserValidator { validate(data) {} }
class UserRepo { save(data) {} }
class EmailService { sendWelcome(email) {} }
class UserService {
  constructor(v, r, m) { this.v=v; this.r=r; this.m=m }
  register(data) {
    this.v.validate(data); this.r.save(data); this.m.sendWelcome(data.email)
  }
}
```

### O — Open/Closed
**VI:** Mở để mở rộng, đóng để chỉnh sửa. Thêm tính năng → kế thừa/inject, không sửa code cũ.

```js
// ❌ thêm payment method = sửa if/else
function pay(method) {
  if (method === 'card') {} else if (method === 'paypal') {}
}

// ✅ strategy
const payments = {
  card: amount => {/*...*/},
  paypal: amount => {/*...*/},
  momo: amount => {/*...*/}, // thêm dễ
}
function pay(method, amount) { return payments[method](amount) }
```

### L — Liskov Substitution
**VI:** Subclass phải thay thế được parent mà không phá behavior. Nếu `Penguin extends Bird` và `Bird.fly()` thì sai thiết kế (penguin không bay).

### I — Interface Segregation
**VI:** Đừng ép class implement method không cần. Tách interface nhỏ.

```ts
// ❌
interface Worker { work(); eat(); sleep() }
// Robot không eat/sleep → vẫn phải implement
// ✅
interface Workable { work() }
interface Eatable { eat() }
class Robot implements Workable {}
```

### D — Dependency Inversion
**VI:** Module cấp cao không phụ thuộc module cấp thấp; cả hai phụ thuộc abstraction (interface).

```js
// ❌ tightly coupled
class OrderService {
  constructor() { this.db = new MySQLDB() }
}
// ✅ inject
class OrderService {
  constructor(db) { this.db = db }  // db là abstraction
}
new OrderService(new MySQLDB())   // hoặc MockDB cho test
```

---

<a id="clean-architecture"></a>
## 2. Clean Architecture / Layered

```
┌───────────────────────────────────┐
│  Presentation (UI, screens)       │ ← React/RN components
├───────────────────────────────────┤
│  Application (use cases)          │ ← business workflow
├───────────────────────────────────┤
│  Domain (entities, business rules)│ ← pure logic, no FW
├───────────────────────────────────┤
│  Infrastructure (API, DB, native) │ ← axios, AsyncStorage
└───────────────────────────────────┘
```

**Quy tắc:** Lớp trong KHÔNG biết lớp ngoài. Domain không import React/axios. Test dễ vì domain là pure.

**Example folder cho RN app:**
```
src/
├── domain/
│   ├── entities/User.ts
│   ├── repositories/UserRepository.ts  (interface)
│   └── usecases/RegisterUser.ts
├── data/
│   ├── api/UserApi.ts
│   └── repositories/UserRepositoryImpl.ts  (implements interface)
├── presentation/
│   ├── screens/RegisterScreen.tsx
│   ├── components/...
│   └── hooks/useRegister.ts
└── infrastructure/
    ├── http/axios.ts
    └── storage/keychain.ts
```

---

<a id="mvc-mvvm"></a>
## 3. MVC / MVP / MVVM / Flux

| Pattern | View ↔ Logic | Phù hợp |
|---|---|---|
| **MVC** | Controller làm trung gian | Web server, Rails |
| **MVP** | Presenter thay Controller, View "dumb" | Android cổ |
| **MVVM** | ViewModel + data binding 2 chiều | Vue, WPF, SwiftUI |
| **Flux** | One-way data flow, store immutable | React + Redux |

**Flux flow:**
```
Action → Dispatcher → Store → View ↺ (View emit Action)
```

**Redux = Flux đơn giản hóa:**
```js
// 1 store, reducer pure
function reducer(state, action) {
  switch (action.type) {
    case 'INC': return { ...state, count: state.count + 1 }
    default: return state
  }
}
```

---

<a id="gof"></a>
## 4. GoF Design Patterns (top 10 hay dùng trong JS)

### Creational

**1. Singleton** — 1 instance duy nhất
```js
const Config = (() => {
  let instance
  return {
    getInstance: () => instance ??= { theme: 'dark' }
  }
})()
```
Use: logger, DB connection, app config. ⚠️ khó test, gây global state — dùng tiết kiệm.

**2. Factory** — tạo object qua function, ẩn `new`
```js
function createButton(type) {
  if (type === 'primary') return new PrimaryButton()
  if (type === 'icon') return new IconButton()
}
```

**3. Builder** — tạo object phức tạp step-by-step
```js
class QueryBuilder {
  select(f) { this.fields=f; return this }
  where(c)  { this.cond=c;   return this }
  build()   { return `SELECT ${this.fields} WHERE ${this.cond}` }
}
new QueryBuilder().select('*').where('id=1').build()
```

### Structural

**4. Adapter** — wrap API cũ thành API mới
```js
class OldApi { fetchData(cb) {} }
class NewApiAdapter {
  constructor(old) { this.old = old }
  async fetch() {
    return new Promise(r => this.old.fetchData(r))
  }
}
```

**5. Decorator** — thêm hành vi mà không sửa object
```js
function withLogging(fn) {
  return function(...args) {
    console.log('call', fn.name, args)
    const r = fn(...args)
    console.log('return', r)
    return r
  }
}
const loggedAdd = withLogging(add)
```

**6. Facade** — interface đơn giản che hệ thống phức tạp
```js
class ApiFacade {
  async login(email, pwd) {
    const token = await auth.signIn(email, pwd)
    await session.set(token)
    analytics.track('login')
    return token
  }
}
```

**7. Proxy** — kiểm soát truy cập object
```js
const handler = {
  get(t, k) { return k in t ? t[k] : `missing ${k}` }
}
new Proxy({a:1}, handler).b  // "missing b"
```

### Behavioral

**8. Observer / Pub-Sub** — 1-nhiều subscribe, emit event
```js
class EventBus {
  constructor() { this.events = {} }
  on(e, fn)   { (this.events[e] ??= []).push(fn) }
  off(e, fn)  { this.events[e] = this.events[e].filter(f => f !== fn) }
  emit(e, ...args) { this.events[e]?.forEach(f => f(...args)) }
}
```
Use: RxJS, Redux subscribe, RN DeviceEventEmitter.

**9. Strategy** — đổi thuật toán runtime
```js
const sortStrategies = {
  asc: (a,b) => a-b,
  desc: (a,b) => b-a,
  byName: (a,b) => a.name.localeCompare(b.name)
}
arr.sort(sortStrategies[mode])
```

**10. Command** — đóng gói action thành object
```js
class AddCommand {
  constructor(receiver, data) { this.r = receiver; this.d = data }
  execute() { this.r.add(this.d) }
  undo()    { this.r.remove(this.d) }
}
```
Use: undo/redo, queue, macro.

---

<a id="react-patterns"></a>
## 5. React-specific Patterns

### Container / Presentational
- **Container:** chứa logic, gọi API, hold state.
- **Presentational:** nhận props, render UI, không biết về data source.

> Modern: ranh giới mờ đi nhờ hooks, nhưng vẫn hữu ích để tách concern.

### Custom Hooks
```jsx
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    fetch(url).then(r=>r.json()).then(d => !cancelled && setData(d)).finally(() => setLoading(false))
    return () => { cancelled = true }
  }, [url])
  return { data, loading }
}
```

### Compound Components
```jsx
<Tabs>
  <Tabs.List>
    <Tabs.Tab id="a">A</Tabs.Tab>
    <Tabs.Tab id="b">B</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="a">Content A</Tabs.Panel>
</Tabs>
```
Cha quản state, con dùng context.

### Render Props
```jsx
<DataLoader render={data => <List items={data} />} />
```

### Higher-Order Component (HOC) — legacy, prefer hooks
```jsx
const withAuth = Comp => props => isAuth ? <Comp {...props} /> : <Login />
```

### Provider Pattern
```jsx
<ThemeProvider value={theme}>
  <App />
</ThemeProvider>
// const theme = useContext(ThemeContext)
```

### Controlled vs Uncontrolled
```jsx
// Controlled — React giữ state
<input value={v} onChange={e => setV(e.target.value)} />
// Uncontrolled — DOM giữ state, đọc qua ref
<input ref={inputRef} defaultValue="x" />
```

---

<a id="atomic"></a>
## 6. Atomic Design (Brad Frost)

```
Atoms       → Button, Input, Icon, Label
Molecules   → SearchBar (Input + Button)
Organisms   → Header (Logo + Nav + SearchBar)
Templates   → Layout không có data
Pages       → Template + real data
```

**Áp dụng trong React/RN:**
```
src/components/
├── atoms/Button.tsx
├── molecules/SearchBar.tsx
├── organisms/Header.tsx
├── templates/MainLayout.tsx
└── pages/HomePage.tsx
```

> ⚠️ Đừng theo cứng nhắc. Nhiều team chỉ dùng 2 layer: `ui/` (primitives) + `features/` (composed).

---

<a id="design-system"></a>
## 7. Design System & Design Tokens

**Design System** = UI library + design tokens + guidelines + a11y rules. Ví dụ: Material 3, Apple HIG, Shopify Polaris, IBM Carbon.

**Design Tokens** = biến nguyên tử cho color/spacing/typography, định nghĩa 1 lần dùng mọi nơi.

```ts
// tokens.ts
export const colors = {
  primary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' },
  neutral: { 0: '#fff', 900: '#111' },
  semantic: { success: '#10b981', danger: '#ef4444' }
}
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 }
export const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 }
}
export const radius = { sm: 4, md: 8, full: 9999 }
```

**Component variants** (với CVA hoặc custom):
```tsx
<Button variant="primary" size="md" />
<Button variant="ghost"   size="sm" disabled />
```

**Theming light/dark:**
```ts
const lightTheme = { bg: '#fff', text: '#111' }
const darkTheme  = { bg: '#111', text: '#fff' }
// ThemeContext + useColorScheme() trong RN
```

**Tooling phổ biến:**
- Web: Tailwind + shadcn/ui, Radix UI, MUI, Chakra
- RN: NativeWind, Tamagui, React Native Paper, Restyle (Shopify)
- Tokens cross-platform: Style Dictionary, Theo
- Docs: Storybook (cả web & RN qua Storybook for RN)

---

<a id="folder"></a>
## 8. Folder Structure cho FE/RN

### Feature-based (recommended cho app vừa-lớn)
```
src/
├── app/                    # entry, navigation, providers
├── shared/                 # reusable cross-feature
│   ├── ui/                 # design system primitives
│   ├── lib/                # utils, helpers
│   ├── hooks/
│   ├── api/                # http client base
│   └── types/
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── store/
│   │   └── index.ts        # public API barrel
│   ├── feed/
│   └── profile/
├── entities/               # domain models (User, Post)
└── assets/                 # images, fonts
```

> Tham khảo: **Feature-Sliced Design (FSD)** — chuẩn cho FE app phức tạp.

### Layer-based (đơn giản, project nhỏ)
```
src/
├── components/
├── screens/
├── hooks/
├── services/
├── store/
├── utils/
└── types/
```

---

<a id="monorepo"></a>
## 9. Monorepo & Code Sharing

**Khi nào dùng monorepo:**
- Share code giữa web + RN (UI logic, types, API client)
- Nhiều app cùng team, cùng release cycle
- Internal libs nhiều

**Tools:**
- **Turborepo** — fast, đơn giản, caching tốt
- **Nx** — feature-rich, plugin system, gen scaffolding
- **pnpm workspaces** — basic, no orchestrator
- **Yarn workspaces** — như trên

**Cấu trúc gợi ý:**
```
my-monorepo/
├── apps/
│   ├── web/          # Next.js
│   ├── mobile/       # React Native (Expo)
│   └── admin/
├── packages/
│   ├── ui/           # shared design system (RN + web qua react-native-web)
│   ├── api-client/   # tRPC / axios wrapper
│   ├── types/
│   ├── config/       # eslint, tsconfig
│   └── utils/
├── turbo.json
└── package.json
```

---

<a id="state"></a>
## 10. State Management Architecture

**4 loại state:**
1. **UI/local** — `useState` (form input, modal open)
2. **Server cache** — TanStack Query / RTK Query / SWR
3. **Global client** — Zustand / Jotai / Redux Toolkit / Context
4. **URL** — search params, route — single source of truth cho share/refresh

**Decision tree:**
```
Cần ở 1 component? → useState
Cần subtree? → Context (nhẹ) hoặc lift state
Data từ server? → TanStack Query (cache, refetch, dedupe)
Global client (theme, auth, cart)? → Zustand/Jotai (nhẹ) hoặc Redux Toolkit (lớn)
```

**Zustand example:**
```ts
import { create } from 'zustand'
const useCart = create((set, get) => ({
  items: [],
  add: item => set(s => ({ items: [...s.items, item] })),
  total: () => get().items.reduce((sum, i) => sum + i.price, 0)
}))

// component
const items = useCart(s => s.items)   // selector → chỉ re-render khi items đổi
```

**TanStack Query example:**
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['user', id],
  queryFn: () => api.getUser(id),
  staleTime: 60_000
})
```

---

## Anti-patterns cần tránh

- **God component** — 500+ dòng, làm mọi thứ → tách
- **Prop drilling 4+ levels** → Context/store
- **Side effect trong render** → `useEffect`
- **Mutating state trực tiếp** → tạo object/array mới
- **Memo hóa mọi thứ** → đo trước (Profiler), chỉ memo khi cần
- **One giant store** → chia slice theo domain
- **Folder by type ở app lớn** (`components/`, `hooks/`...) → đổi feature-based

---

## References

- [Clean Architecture — Robert C. Martin]
- [Refactoring Guru — Patterns](https://refactoring.guru/design-patterns)
- [Patterns.dev (Lydia Hallie)](https://www.patterns.dev)
- [Feature-Sliced Design](https://feature-sliced.design)
- [Atomic Design — Brad Frost](https://atomicdesign.bradfrost.com)
- [Design Tokens W3C](https://design-tokens.github.io/community-group/)
