# 10 — Redux + Redux Thunk Deep Dive (viết riêng cho JD Qualgo)

> **Vì sao file này tồn tại:** JD ghi rõ *"Execute complex application state logic using Redux and handle asynchronous side effects with Thunk"* và *"Design and implement scalable Redux state containers"*. Kho tài liệu cũ (file A2, 03) thiên về Zustand/TanStack Query — Redux chỉ được nhắc tên. File này lấp đúng lỗ hổng đó, với ví dụ xuyên suốt là **app chat** (đúng domain của công ty).
> Học xong file này phải trả lời được: Redux hoạt động bên trong ra sao, thunk là gì (tự viết được middleware thunk 5 dòng), tổ chức store cho 10.000 tin nhắn thế nào, và test Redux ra sao.

## Mục lục
1. [Redux core — tự viết lại createStore](#1)
2. [Middleware — cơ chế và tự viết thunk](#2)
3. [Redux Thunk — async patterns đầy đủ](#3)
4. [Redux Toolkit — cách viết hiện đại](#4)
5. [React-Redux — useSelector/useDispatch và connect legacy](#5)
6. [Selector & reselect — chống re-render](#6)
7. [Normalized state — thiết kế store cho app chat](#7)
8. [Redux với WebSocket & optimistic updates](#8)
9. [redux-persist & khôi phục state](#9)
10. [Testing Redux](#10)
11. [Câu hỏi phỏng vấn + trả lời mẫu](#11)

---

<a id="1"></a>
## 1. Redux core — hiểu bằng cách tự viết lại

Redux chỉ là ~100 dòng code quanh 3 nguyên tắc: **single source of truth** (1 store), **state is read-only** (chỉ đổi qua dispatch action), **changes via pure functions** (reducer thuần).

```js
// createStore tối giản — interviewer RẤT hay yêu cầu viết cái này
function createStore(reducer, preloadedState) {
  let state = preloadedState;
  let listeners = [];

  function getState() { return state; }

  function dispatch(action) {
    state = reducer(state, action);        // reducer thuần: (state, action) => newState
    listeners.forEach((l) => l());         // báo mọi subscriber
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => { listeners = listeners.filter((l) => l !== listener); }; // unsubscribe
  }

  dispatch({ type: '@@INIT' });            // tạo state ban đầu
  return { getState, dispatch, subscribe };
}
```

**Điểm cần thuộc:**
- Reducer phải **pure**: không mutate state, không gọi API, không `Date.now()`/`Math.random()`. Vì pure nên: dễ test, time-travel debug được, hot-reload được.
- Immutability không phải "style" — React-Redux so sánh **reference** (`===`) để biết state đổi chưa. Mutate object cũ → reference không đổi → UI không re-render. Đây là gốc rễ của 90% bug "dispatch rồi mà UI không update".
- Flow một chiều: `UI → dispatch(action) → middleware → reducer → new state → subscribers → UI re-render`.

```js
// Reducer mẫu — immutable update
function messagesReducer(state = { byId: {}, allIds: [] }, action) {
  switch (action.type) {
    case 'messages/received':
      return {
        byId: { ...state.byId, [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id],
      };
    default:
      return state; // LUÔN trả state cũ cho action lạ — giữ reference
  }
}
```

---

<a id="2"></a>
## 2. Middleware — cơ chế và tự viết thunk

Middleware là lớp nằm **giữa dispatch và reducer**, được viết theo dạng curry 3 tầng:

```js
const middleware = (storeAPI) => (next) => (action) => {
  // storeAPI: { getState, dispatch }
  // next: middleware kế tiếp (hoặc dispatch gốc nếu là middleware cuối)
  // action: thứ vừa được dispatch
  return next(action);
};
```

```js
// Ví dụ 1: logger
const logger = (store) => (next) => (action) => {
  console.log('dispatching', action.type, action.payload);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

// Ví dụ 2: TỰ VIẾT redux-thunk — toàn bộ thư viện thật sự chỉ có nhiêu đây
const thunk = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    // action là function → không đưa vào reducer, mà GỌI nó
    return action(store.dispatch, store.getState);
  }
  return next(action); // action thường → đi tiếp
};
```

**Giải thích dễ hiểu:** bình thường `dispatch` chỉ nhận object `{type, payload}`. Reducer là hàm thuần nên **không được gọi API**. Vậy code async để đâu? Thunk middleware "bắt" những action là **function**, gọi function đó và đưa cho nó `dispatch` + `getState` — nhờ vậy function này gọi API xong có thể dispatch tiếp action thường. Đơn giản vậy thôi.

Chain middleware: `applyMiddleware(thunk, logger)` → dispatch đi qua thunk → logger → reducer. Thunk luôn đứng đầu chain để function action được xử lý trước.

---

<a id="3"></a>
## 3. Redux Thunk — async patterns đầy đủ

### 3.1. Thunk cơ bản — pattern request/success/failure

```js
// Action creators
const fetchMessagesRequest = (chatId) => ({ type: 'messages/fetchRequest', payload: { chatId } });
const fetchMessagesSuccess = (chatId, messages) => ({ type: 'messages/fetchSuccess', payload: { chatId, messages } });
const fetchMessagesFailure = (chatId, error) => ({ type: 'messages/fetchFailure', payload: { chatId, error } });

// Thunk = function trả về function nhận (dispatch, getState)
function fetchMessages(chatId) {
  return async (dispatch, getState) => {
    // Đọc state để quyết định — ví dụ: đã cache thì khỏi fetch
    const cached = getState().messages.byChatId[chatId];
    if (cached?.status === 'loaded') return;

    dispatch(fetchMessagesRequest(chatId));
    try {
      const res = await api.get(`/chats/${chatId}/messages`);
      dispatch(fetchMessagesSuccess(chatId, res.data));
    } catch (err) {
      dispatch(fetchMessagesFailure(chatId, err.message));
    }
  };
}

// Dùng: dispatch(fetchMessages('chat-1')) — thunk middleware sẽ gọi function bên trong
```

### 3.2. Thunk nâng cao — điều kiện, chain, cancel

```js
// Chain nhiều thunk — dispatch trả về Promise của thunk
function openChat(chatId) {
  return async (dispatch) => {
    dispatch(setActiveChat(chatId));
    await dispatch(fetchMessages(chatId));      // đợi messages về
    dispatch(markChatAsRead(chatId));            // rồi mới mark read
  };
}

// Chống race condition: search cũ về sau đè search mới (xem file B1 §6)
let searchController = null;
function searchMessages(query) {
  return async (dispatch) => {
    searchController?.abort();                   // huỷ request cũ
    searchController = new AbortController();
    dispatch({ type: 'search/start', payload: query });
    try {
      const res = await fetch(`/api/search?q=${query}`, { signal: searchController.signal });
      dispatch({ type: 'search/success', payload: await res.json() });
    } catch (err) {
      if (err.name !== 'AbortError') dispatch({ type: 'search/failure', payload: err.message });
    }
  };
}
```

### 3.3. Thunk vs Saga vs RTK Query — trả lời khi được hỏi "sao không dùng X?"

| | Thunk | Saga | RTK Query |
|---|---|---|---|
| Bản chất | Function được dispatch | Generator + effect model | Data-fetching layer trên RTK |
| Học | 5 phút (là 1 middleware 5 dòng) | Nặng (generator, take/put/call/fork) | Vừa |
| Hợp với | Hầu hết logic async thông thường | Flow phức tạp: debounce/cancel/watch nhiều action, long-running process | CRUD/caching API chuẩn REST |
| Nhược | Logic phức tạp dễ thành spaghetti | Boilerplate, khó debug với người mới | Không thay được logic realtime tuỳ biến |

Trả lời khôn ngoan: *"Thunk đủ cho 90% case và cả team đọc hiểu được; saga chỉ đáng khi cần orchestration phức tạp; với app chat, luồng WebSocket realtime tôi xử lý bằng middleware riêng (xem §8) kết hợp thunk."*

---

<a id="4"></a>
## 4. Redux Toolkit (RTK) — cách viết hiện đại

RTK là cách viết Redux **chính thức được khuyên dùng** (bản thân docs Redux gọi cách viết cũ là legacy). Nhưng JD kiểu này thường có codebase cũ → phải biết **cả hai** và map qua lại.

```ts
import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// createAsyncThunk = thunk + tự sinh 3 action pending/fulfilled/rejected
export const fetchMessages = createAsyncThunk(
  'messages/fetch',
  async (chatId: string, { rejectWithValue, signal }) => {
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, { signal }); // signal: RTK hỗ trợ cancel sẵn
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return (await res.json()) as Message[];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
  { // tránh fetch trùng khi user click liên tục
    condition: (chatId, { getState }) =>
      (getState() as RootState).messages.statusByChat[chatId] !== 'loading',
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { byId: {}, idsByChat: {}, statusByChat: {} } as MessagesState,
  reducers: {
    // Immer bên trong: "mutate" thoải mái, thực chất tạo state mới immutable
    messageReceived(state, action: PayloadAction<Message>) {
      const m = action.payload;
      state.byId[m.id] = m;
      (state.idsByChat[m.chatId] ??= []).push(m.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state, { meta }) => { state.statusByChat[meta.arg] = 'loading'; })
      .addCase(fetchMessages.fulfilled, (state, { payload, meta }) => {
        state.statusByChat[meta.arg] = 'loaded';
        payload.forEach((m) => { state.byId[m.id] = m; });
        state.idsByChat[meta.arg] = payload.map((m) => m.id);
      })
      .addCase(fetchMessages.rejected, (state, { meta }) => { state.statusByChat[meta.arg] = 'error'; });
  },
});

export const store = configureStore({
  reducer: { messages: messagesSlice.reducer },
  // thunk ĐÃ BẬT SẴN trong configureStore — cùng với devtools + 2 middleware check
  // (serializableCheck & immutableCheck, chỉ chạy ở dev)
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Map legacy ↔ RTK (thuộc bảng này để đọc codebase cũ):**

| Legacy | RTK |
|---|---|
| `createStore(rootReducer, applyMiddleware(thunk))` | `configureStore({ reducer })` |
| `combineReducers` | object trong `reducer: {}` |
| switch-case reducer + action type string | `createSlice` (tự sinh action creators) |
| spread `{...state}` thủ công | Immer (viết như mutate) |
| thunk tự viết request/success/failure | `createAsyncThunk` |
| `connect(mapStateToProps)(Comp)` | `useSelector` / `useDispatch` |

⚠️ Bẫy Immer: trong `createSlice` **hoặc** mutate **hoặc** return state mới — làm cả hai sẽ lỗi. Và đừng mutate state ở ngoài slice (dev mode RTK sẽ throw nhờ immutableCheck).

---

<a id="5"></a>
## 5. React-Redux — hooks và connect legacy

```tsx
// Cách hiện đại — hooks (typed)
import { useSelector, useDispatch } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function ChatView({ chatId }: { chatId: string }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.messages.statusByChat[chatId]);
  useEffect(() => {
    const promise = dispatch(fetchMessages(chatId));
    return () => promise.abort(); // cancel khi unmount/đổi chat — chống race
  }, [chatId, dispatch]);
  // ...
}
```

```jsx
// Cách legacy — connect (codebase cũ chắc chắn có, phải đọc được)
import { connect } from 'react-redux';

class ChatView extends React.Component {
  componentDidMount() { this.props.fetchMessages(this.props.chatId); }
  render() { return <MessageList messages={this.props.messages} />; }
}

const mapStateToProps = (state, ownProps) => ({
  messages: selectMessagesByChat(state, ownProps.chatId),
});
const mapDispatchToProps = { fetchMessages }; // object shorthand — tự bind dispatch

export default connect(mapStateToProps, mapDispatchToProps)(ChatView);
```

**Cơ chế bên trong `useSelector` (câu hỏi senior):** subscribe vào store qua `useSyncExternalStore`; mỗi lần store đổi, chạy lại selector và so sánh kết quả với lần trước bằng `===` (hoặc `shallowEqual` nếu truyền vào) — khác thì re-render component. Suy ra 2 quy tắc:
1. Selector trả về **object/array mới mỗi lần chạy** (vd `.map()`, `.filter()`) → component re-render theo MỌI thay đổi của store → cần memoized selector (§6).
2. Select **miếng nhỏ nhất** cần dùng, đừng `useSelector(s => s)`.

---

<a id="6"></a>
## 6. Selector & reselect — chống re-render

```ts
import { createSelector } from 'reselect'; // RTK re-export sẵn

// Input selectors — rẻ, chỉ trỏ vào nhánh state
const selectMessagesById = (s: RootState) => s.messages.byId;
const selectIdsByChat = (s: RootState, chatId: string) => s.messages.idsByChat[chatId] ?? EMPTY;
const EMPTY: string[] = []; // hằng số module-level — tránh tạo [] mới mỗi lần (đổi reference!)

// Memoized: chỉ tính lại khi MỘT trong các input đổi reference
export const selectChatMessages = createSelector(
  [selectMessagesById, selectIdsByChat],
  (byId, ids) => ids.map((id) => byId[id])   // phần "đắt" chỉ chạy khi cần
);

// Derived data — unread count: KHÔNG lưu vào store, tính từ state gốc
export const selectUnreadCount = createSelector(
  [selectChatMessages, (s: RootState) => s.auth.userId],
  (messages, me) => messages.filter((m) => !m.readBy.includes(me) && m.senderId !== me).length
);
```

Điểm nói ra sẽ ăn điểm senior:
- `createSelector` mặc định **cache size = 1** — dùng cho nhiều chatId luân phiên sẽ miss liên tục; giải pháp: selector factory (`makeSelectChatMessages()` mỗi component instance một cái) hoặc `reselect` v5 `weakMapMemoize` (mặc định từ v5) đã xử lý per-argument caching.
- Nguyên tắc: **store giữ state tối thiểu, mọi thứ suy diễn được thì để selector tính** (unread count, danh sách đã sort, filter). Tránh double source of truth.

---

<a id="7"></a>
## 7. Normalized state — thiết kế store cho app chat (câu hỏi ĐINH của JD)

**Vấn đề:** lưu nested `chats: [{id, messages: [...]}, ...]` sẽ chết vì: update 1 message phải tìm sâu và copy cả cây; message xuất hiện ở 2 nơi (search result + chat) bị lệch nhau; render list nào cũng re-render tất.

**Giải pháp: normalize như database** — mỗi entity một "bảng" `byId` + mảng id giữ thứ tự:

```ts
interface ChatState {
  chats:    { byId: Record<string, Chat>;    allIds: string[] };          // sort theo lastMessageAt
  messages: { byId: Record<string, Message>; idsByChat: Record<string, string[]> }; // sort theo thời gian
  users:    { byId: Record<string, User> };
  // UI state tách riêng khỏi entity
  ui: { activeChatId: string | null; draftByChat: Record<string, string> };
}

interface Message {
  id: string;             // server id — HOẶC clientId khi đang pending (xem §8)
  chatId: string;
  senderId: string;       // reference, KHÔNG nhúng cả object user
  text: string;
  sentAt: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'; // state machine
}
```

Lợi ích nói được ngay: update message = O(1) (`byId[id] = ...`); 1 message đổi → chỉ component subscribe message đó re-render; user đổi avatar → sửa 1 chỗ, mọi nơi hiển thị đúng; pagination = nối thêm id vào `idsByChat`.

RTK có sẵn `createEntityAdapter` làm việc này:

```ts
import { createEntityAdapter } from '@reduxjs/toolkit';
const messagesAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => a.sentAt - b.sentAt,   // luôn giữ đúng thứ tự thời gian
});
// Cho sẵn: addOne/upsertMany/updateOne/removeOne + selectors selectById/selectAll
```

**Pagination 2 chiều cho message list** (đặc thù chat — load cũ hơn khi scroll lên):
```ts
// Lưu cursor theo chat; prepend vào idsByChat
interface ChatPagination { oldestCursor: string | null; hasMore: boolean }
// fetchOlder(chatId): API ?before=oldestCursor → unshift ids — nhớ dedupe vì
// WebSocket có thể đã đẩy 1 message trùng vào (Set hoặc kiểm tra byId trước khi thêm)
```

---

<a id="8"></a>
## 8. Redux với WebSocket & optimistic updates (nối thẳng vào JD realtime)

WebSocket sống lâu hơn component → đặt trong **middleware**, không đặt trong useEffect của component:

```ts
// socketMiddleware.ts — pattern chuẩn cho app chat
export const socketMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action: any) => {
    switch (action.type) {
      case 'socket/connect': {
        socket = new WebSocket(action.payload.url);
        socket.onmessage = (e) => {
          const event = JSON.parse(e.data);
          // server event → dispatch action thường → reducer xử lý
          if (event.type === 'message') store.dispatch(messageReceived(event.data));
          if (event.type === 'ack')     store.dispatch(messageAcked(event.data)); // clientId → serverId
        };
        socket.onclose = () => store.dispatch({ type: 'socket/disconnected' });
        break;
      }
      case 'messages/send': {
        socket?.send(JSON.stringify(action.payload)); // gửi lên server
        break;                                        // vẫn cho action xuống reducer (optimistic)
      }
    }
    return next(action);
  };
};
```

**Optimistic update — luồng gửi tin nhắn hoàn chỉnh (thuộc lòng để kể):**
1. User bấm gửi → dispatch `messages/send` với `clientId = crypto.randomUUID()`, `status: 'sending'` → UI hiện ngay lập tức (optimistic).
2. Middleware gửi qua socket (kèm clientId).
3. Server ack về `{clientId, serverId, sentAt}` → reducer **reconcile**: thay id, đổi `status: 'sent'`. Nhờ clientId nên khi chính message đó quay lại qua broadcast cũng **dedupe** được (đã có trong byId).
4. Timeout/socket lỗi → `status: 'failed'` + nút retry. Khi retry gửi lại **cùng clientId** → server idempotent, không bị double-send.
5. Batch khi nhận dồn dập: gom message trong ~50ms rồi dispatch 1 action `messagesReceivedBatch` — tránh 100 dispatch/giây làm 100 lần re-render (kỹ thuật chống jank, chi tiết file B1 §5).

---

<a id="9"></a>
## 9. redux-persist & khôi phục state

```ts
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // web: localStorage. App chat thật: dùng IndexedDB (file B3 §4)

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'chats'],   // CHỌN LỌC — đừng persist cả store
  // ui state, socket status... không persist (blacklist mặc định)
  version: 1,
  migrate: (state) => Promise.resolve(migrations(state)), // đổi shape giữa các version
};
```
Điểm phỏng vấn: persist gì (entity + auth), không persist gì (trạng thái kết nối, form tạm), migration khi đổi store shape, và với app E2EE thì **key mã hoá không nằm trong redux-persist/localStorage** — nằm trong IndexedDB dạng non-extractable CryptoKey hoặc Electron `safeStorage` (file B3 §5).

---

<a id="10"></a>
## 10. Testing Redux

```ts
// 1. Reducer — hàm thuần, test dễ nhất
test('messageReceived thêm message vào đúng chat', () => {
  const state = messagesSlice.reducer(initialState, messageReceived(msg('m1', 'chat1')));
  expect(state.byId['m1']).toBeDefined();
  expect(state.idsByChat['chat1']).toEqual(['m1']);
});

// 2. Thunk — mock fetch (MSW hoặc jest.fn), dùng store thật cho gọn
test('fetchMessages: success flow', async () => {
  server.use(http.get('/api/chats/c1/messages', () => HttpResponse.json([msg('m1', 'c1')])));
  const store = configureStore({ reducer: { messages: messagesSlice.reducer } });
  await store.dispatch(fetchMessages('c1'));
  expect(store.getState().messages.statusByChat['c1']).toBe('loaded');
});

// 3. Component + store — helper renderWithProviders (pattern chính thức của Redux docs)
function renderWithProviders(ui: ReactElement, { preloadedState = {} } = {}) {
  const store = configureStore({ reducer: rootReducer, preloadedState });
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}

test('hiển thị message', async () => {
  renderWithProviders(<ChatView chatId="c1" />, { preloadedState: seededState });
  expect(await screen.findByText('hello')).toBeInTheDocument();
});
```
Triết lý trả lời: *"Tôi ưu tiên integration test qua component + store thật (renderWithProviders + MSW) vì nó test đúng hành vi user thấy; reducer phức tạp (reconcile, dedupe) thì thêm unit test riêng."* — khớp philosophy file A5.

---

<a id="11"></a>
## 11. Câu hỏi phỏng vấn + trả lời mẫu

**Q1. Redux giải quyết vấn đề gì mà useState/Context không làm được?**
→ Context không phải state manager — nó là cơ chế truyền giá trị; mọi consumer re-render khi value đổi, không có selector, không middleware, không devtools. Redux cho: update có kiểm soát (action log → dễ debug/time-travel), subscribe theo miếng nhỏ (selector), tách side effects (middleware), và state sống ngoài React (quan trọng khi nhận WebSocket event lúc component chưa mount).

**Q2. Thunk là gì? Viết middleware thunk.**
→ "Thunk là function được dispatch thay vì object; middleware thunk bắt function đó và gọi nó với (dispatch, getState) để nó chạy async rồi dispatch tiếp action thường." + viết 5 dòng code ở §2. (Đây là câu ăn tiền — rất ít candidate viết được.)

**Q3. Store 10.000 messages — tổ chức sao cho không lag?**
→ 4 lớp: (1) normalize byId + idsByChat (§7), (2) memoized selector (§6), (3) virtualization khi render (file B1 §5), (4) batch dispatch khi nhận dồn dập (§8). Kể thêm pagination cursor + dedupe.

**Q4. Vì sao không được mutate state? Chuyện gì xảy ra nếu mutate?**
→ React-Redux so sánh reference. Mutate → reference cũ → selector thấy "không đổi" → UI không update (hoặc ngược lại: đã render mà state "đổi ngầm" → bug time-travel/undo). RTK dùng Immer để viết như mutate nhưng output vẫn immutable + freeze state ở dev để bắt lỗi này.

**Q5. dispatch 2 lần liên tiếp → mấy lần re-render?**
→ React 18 tự động batch (automatic batching) kể cả trong async callback → 1 lần render. Nhưng mỗi dispatch vẫn chạy toàn bộ reducer + notify — nên với burst 100 event/giây vẫn phải gom batch thành 1 action (§8).

**Q6. useSelector hoạt động thế nào bên trong?**
→ §5: subscribe store qua `useSyncExternalStore`, chạy lại selector khi store notify, so sánh `===` kết quả, khác mới re-render. Kể luôn bug kinh điển selector trả array mới → fix bằng createSelector/shallowEqual.

**Q7. Khi nào tách logic ra thunk, khi nào để trong component?**
→ Thunk: logic đụng nhiều nhánh state, tái sử dụng ở nhiều nơi, cần test độc lập, hoặc chạy ngoài lifecycle component (retry queue). Component: logic UI thuần (focus, scroll). Middleware: cross-cutting (socket, analytics, logging).

> Ôn kèm: câu C8 trong file D1 (Redux/RTK cơ bản) · `useSyncExternalStore` file D1 dòng ~7075 · virtualization + jank ở file B1 · IndexedDB persist ở file B3.
