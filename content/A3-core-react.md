# A3 — React Core (dùng chung Web + Mobile)

> Kiến thức React dùng chung cho ReactJS/NextJS/React Native: fundamentals, hooks, state management, forms, data fetching — bilingual VI/EN. Phần đặc thù React Native đã chuyển sang `C1-mobile-react-native.md`. Redux deep dive xem `A4-core-redux-thunk.md`.

---

## Mục lục

1. [React Core Concepts](#react-core)
2. [Hooks — toàn bộ + custom hooks](#hooks)
3. [State Management](#state-mgmt)
4. [Forms](#forms)
5. [Data Fetching](#data-fetching)

---

<a id="react-core"></a>
## 1. React Core Concepts

### Virtual DOM & Reconciliation
**VI:** React giữ 1 cây Virtual DOM trong bộ nhớ. Khi state đổi → tạo cây mới → diff với cây cũ → patch DOM thật.

> Kiến trúc render của React Native (native views, bridge/JSI) → xem `C1-mobile-react-native.md`.

### Components
```jsx
// Functional (default ngày nay)
function Hello({ name }) { return <Text>Hi {name}</Text> }

// Class (legacy)
class Hello extends React.Component {
  render() { return <Text>Hi {this.props.name}</Text> }
}
```

### JSX rules
- 1 root element (hoặc Fragment `<></>`)
- Expression trong `{}`
- `className` (web) / `style={{}}` (RN)
- Attribute camelCase: `onClick`, `onPress`

### Rendering rules
React re-render khi:
1. State (`useState`, `useReducer`) thay đổi
2. Props thay đổi
3. Parent re-render (con cũng re-render trừ khi memo)
4. Context value thay đổi

### Keys
```jsx
{items.map(item => <Row key={item.id} {...item} />)}
```
Key **phải stable & unique** trong list anh em. KHÔNG dùng index nếu list re-order.

---

<a id="hooks"></a>
## 2. Hooks

### useState
```jsx
const [count, setCount] = useState(0)
setCount(c => c + 1)            // functional update — luôn lấy state mới nhất
const [user, setUser] = useState(() => loadFromStorage()) // lazy init
```

### useEffect
```jsx
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)  // cleanup
}, [deps])                         // [] = mount only, không deps = mọi render
```

**Common pitfalls:**
- Missing deps → stale closure
- Object/function trong deps → re-run mỗi render (dùng `useMemo`/`useCallback`)
- Set state trong effect không có guard → infinite loop

### useLayoutEffect
Chạy đồng bộ sau DOM mutation, trước paint. Dùng cho đo lường layout, animation chuyển tiếp tránh flicker. **RN:** giống `useEffect` về cơ bản.

### useRef
```jsx
const inputRef = useRef(null)
inputRef.current.focus()

// Lưu giá trị giữa render mà không trigger re-render
const renderCount = useRef(0)
renderCount.current++
```

### useMemo / useCallback
```jsx
const sorted = useMemo(() => bigList.slice().sort(), [bigList])
const handleClick = useCallback(id => onSelect(id), [onSelect])
```
> **Quy tắc:** chỉ memo khi giá trị **đắt để tính**, hoặc được pass xuống child đã `React.memo`. Đừng memo bừa — overhead không đáng.

### useContext
```jsx
const ThemeContext = createContext('light')
<ThemeContext.Provider value="dark"><App /></ThemeContext.Provider>
// Trong child:
const theme = useContext(ThemeContext)
```
⚠️ Context update → mọi consumer re-render. Tách context theo concern (auth, theme, locale).

### useReducer
```jsx
const [state, dispatch] = useReducer(reducer, initial)
function reducer(s, action) {
  switch (action.type) {
    case 'add': return { ...s, items: [...s.items, action.payload] }
  }
}
dispatch({ type: 'add', payload: {id:1} })
```
Dùng khi state phức tạp, nhiều transition, hoặc next state phụ thuộc previous.

### useImperativeHandle + forwardRef
```jsx
const Input = forwardRef((props, ref) => {
  const inputRef = useRef()
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => inputRef.current.value = ''
  }))
  return <input ref={inputRef} {...props} />
})
```

### useId
```jsx
const id = useId()  // stable unique id — accessibility
<label htmlFor={id}>...</label><input id={id} />
```

### useTransition / useDeferredValue (React 18+)
```jsx
const [isPending, startTransition] = useTransition()
startTransition(() => setQuery(input))  // mark là non-urgent
```

### useSyncExternalStore
Tạo store ngoài React (Zustand, Redux subclassing). Hiếm khi user code dùng trực tiếp.

### Custom Hooks pattern
```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn(o => !o), [])
  return [on, toggle]
}
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => { ref.current = value }, [value])
  return ref.current
}
```

---

<a id="state-mgmt"></a>
## 3. State Management — chọn cái nào?

| Tool | Khi nào | Boilerplate | Learning |
|---|---|---|---|
| `useState` + lift | nhỏ, local | minimal | easy |
| Context | theme, auth, locale | nhỏ | easy |
| **Zustand** | global vừa | rất ít | easy ⭐ |
| **Jotai** | atomic, granular | ít | easy |
| **Redux Toolkit** | enterprise, devtools, middleware | trung | trung |
| **TanStack Query** | server cache (BẮT BUỘC nên có) | ít | trung |
| **MobX** | reactive OOP | trung | trung |
| **XState** | flow phức tạp, state machine | nhiều | khó |

**Combo phổ biến năm 2026:**
- App nhỏ-vừa: **Zustand** (client) + **TanStack Query** (server)
- App lớn: **Redux Toolkit** (client) + **RTK Query** (server) hoặc Redux + TanStack
- Form: **React Hook Form** + **Zod**

---

<a id="forms"></a>
## 4. Forms

### React Hook Form + Zod (recommended)
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
type Form = z.infer<typeof Schema>

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(Schema)
  })
  return (
    <form onSubmit={handleSubmit(data => api.login(data))}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register('password')} />
      <button>Login</button>
    </form>
  )
}
```

> Trong React Native dùng `Controller` với `TextInput` — xem `C1-mobile-react-native.md`.

---

<a id="data-fetching"></a>
## 5. Data Fetching — TanStack Query

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['posts', { page }],
  queryFn: ({ signal }) => api.getPosts(page, signal),
  staleTime: 5 * 60_000,        // 5 phút coi là fresh
  gcTime: 10 * 60_000,          // sau 10 phút unused → xóa cache
  retry: 2,
  enabled: !!userId             // điều kiện chạy
})

// Mutation
const qc = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: (body) => api.createPost(body),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] })
})

// Infinite list
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => api.feed({ cursor: pageParam }),
  initialPageParam: null,
  getNextPageParam: lastPage => lastPage.nextCursor
})
```

**Optimistic update:**
```tsx
useMutation({
  mutationFn: like,
  onMutate: async ({ id }) => {
    await qc.cancelQueries({ queryKey: ['post', id] })
    const prev = qc.getQueryData(['post', id])
    qc.setQueryData(['post', id], old => ({ ...old, liked: true }))
    return { prev }
  },
  onError: (err, vars, ctx) => qc.setQueryData(['post', vars.id], ctx.prev),
  onSettled: (data, err, vars) => qc.invalidateQueries({ queryKey: ['post', vars.id] })
})
```

---

## References
- [React docs (react.dev)](https://react.dev)
- [TanStack Query](https://tanstack.com/query)
- [Patterns.dev — React](https://www.patterns.dev/react)
