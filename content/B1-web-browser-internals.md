# 11 — Browser Internals: Critical Rendering Path, V8, Memory, Race Conditions, Workers

> **Vì sao file này tồn tại:** JD yêu cầu *"Deeply optimize the Critical Rendering Path (Layout, Paint, Composite)"*, *"manage high-frequency real-time data to prevent UI jank"*, *"deep knowledge of V8 internals to analyze memory leaks, profile performance, and solve complex race conditions"*, *"Event Loop, Microtasks, Memory Management"*. Kho cũ có nền event loop browser (file A1) + reflow/repaint (file D3 §5.1) nhưng thiếu: pipeline render chi tiết, compositor, V8, Node event loop, race condition có tên gọi, Web Worker thực hành. File này lấp đủ.

## Mục lục
1. [Critical Rendering Path — pipeline đầy đủ](#1)
2. [Layout thrashing & compositor layers](#2)
3. [Event Loop: browser vs Node.js vs Electron](#3)
4. [V8 internals — hidden classes, inline caching, JIT](#4)
5. [High-frequency realtime data không jank (bài đinh của JD)](#5)
6. [Race conditions — nhận diện và xử lý](#6)
7. [Memory management & săn memory leak](#7)
8. [Web Workers / Service Worker / SharedWorker](#8)
9. [Câu hỏi phỏng vấn + trả lời mẫu](#9)

---

<a id="1"></a>
## 1. Critical Rendering Path — pipeline đầy đủ

Từ HTML đến pixel, mỗi frame đi qua pipeline:

```
HTML ──parse──▶ DOM ─┐
                     ├─▶ Render Tree ─▶ Layout ─▶ Paint ─▶ Composite
CSS ──parse──▶ CSSOM ┘      (Style)   (geometry)  (pixels)  (ghép layer trên GPU)
```

- **Style (Recalculate Style):** match CSS rule → computed style cho từng node.
- **Layout (Reflow):** tính vị trí + kích thước (geometry). Layout một node có thể lan ra cả cây (cha co giãn theo con).
- **Paint:** vẽ pixel (màu, chữ, bóng, border) vào từng **layer** — chưa lên màn hình.
- **Composite:** compositor thread ghép các layer (đã raster trên GPU) thành frame cuối.

**Điều quan trọng nhất phải thuộc — chi phí theo property:**

| Đổi property | Phải chạy lại | Chi phí |
|---|---|---|
| `width`, `height`, `top/left`, `margin`, `font-size`, thêm/xoá DOM | Layout → Paint → Composite | Đắt nhất |
| `background`, `color`, `box-shadow`, `visibility` | Paint → Composite | Trung bình |
| `transform`, `opacity` (và `filter`) | **Chỉ Composite** | Rẻ nhất — không đụng main thread |

→ Đây là lý do animation luôn dùng `transform/opacity`: compositor thread tự xử lý, **kể cả khi main thread đang bận JS thì animation vẫn mượt**.

**Loading side của CRP** (đã có ở file B2 §2, tóm lại cho đủ bức tranh): CSS là **render-blocking** (browser không paint khi chưa có CSSOM — tránh FOUC); `<script>` thường là **parser-blocking** (nên dùng `defer`); **preload scanner** vẫn quét trước HTML để tải song song resource dù parser đang bị block — nên đừng giấu resource quan trọng sau JS.

Frame budget: màn 60Hz → **16.7ms/frame** (màn 120Hz chỉ 8.3ms). JS + Style + Layout + Paint phải xong trong đó, không thì **dropped frame = jank**. Task > 50ms = **long task** — block luôn input (INP xấu).

---

<a id="2"></a>
## 2. Layout thrashing & compositor layers

### 2.1. Forced synchronous layout (layout thrashing)

Browser **gom** các thay đổi style và chỉ layout 1 lần trước khi paint. Nhưng nếu bạn **đọc** giá trị geometry ngay sau khi **ghi**, browser buộc phải layout NGAY để trả số đúng:

```js
// ❌ Thrash: mỗi vòng lặp ghi rồi đọc → N lần layout đồng bộ
boxes.forEach((box) => {
  box.style.width = box.offsetWidth / 2 + 'px'; // đọc offsetWidth → force layout
});

// ✅ Batch: đọc hết trước, ghi hết sau → 1 lần layout
const widths = boxes.map((b) => b.offsetWidth);
boxes.forEach((b, i) => { b.style.width = widths[i] / 2 + 'px'; });
```

**Danh sách API "đọc" gây force layout (thuộc để nhận diện):** `offsetTop/Left/Width/Height`, `clientWidth/Height`, `scrollTop/Height`, `getBoundingClientRect()`, `getComputedStyle()`, `focus()`. Nhìn thấy chúng trong vòng lặp cạnh chỗ ghi style = red flag khi code review.

### 2.2. Compositor layers

Mỗi layer được raster riêng trên GPU; đổi transform/opacity chỉ cần compositor ghép lại. Element được "thăng cấp" (promote) lên layer riêng khi: có `transform: translateZ(0)`/3D, `will-change: transform`, `<video>/<canvas>`, `position: fixed` (tuỳ), animation transform/opacity đang chạy.

- `will-change: transform` = báo trước cho browser chuẩn bị layer. **Dùng đúng lúc**: bật trước animation, tắt sau khi xong.
- ⚠️ **Layer explosion:** mỗi layer tốn RAM GPU (width × height × 4 bytes). Promote hàng trăm message bubble = chết memory. Chỉ promote thứ thật sự animate.
- Debug: DevTools → More tools → **Rendering** (Paint flashing = chỗ nào đang repaint, Layer borders) + tab **Layers**.

---

<a id="3"></a>
## 3. Event Loop: browser vs Node.js vs Electron

### 3.1. Browser (ôn nhanh — chi tiết ở file A1 Bonus A1)

Mỗi tick: lấy 1 **macrotask** (script, setTimeout, message event...) → chạy xong → **xả TOÀN BỘ microtask queue** (Promise.then, queueMicrotask, MutationObserver) → nếu đến lúc render: chạy `requestAnimationFrame` callbacks → Style → Layout → Paint. `requestIdleCallback` chạy lúc rảnh cuối frame.

Bẫy nói được điểm: microtask xả **cạn queue** — Promise loop vô hạn sẽ **treo trang** (starvation), còn setTimeout loop thì không (mỗi lần chỉ 1 macrotask, browser vẫn kịp render giữa các lần).

### 3.2. Node.js — thứ kho cũ đang thiếu hoàn toàn

Node event loop (libuv) chạy theo **phase**, mỗi vòng:

```
┌─▶ timers          — setTimeout/setInterval đến hạn
│   pending callbacks
│   poll            — chờ & xử lý I/O (fs, network) — "trái tim" của loop
│   check           — setImmediate
└── close callbacks — socket.on('close')
    (giữa MỌI bước chuyển: xả process.nextTick queue TRƯỚC, rồi microtask queue)
```

Điểm phải thuộc:
- `process.nextTick` ưu tiên **cao hơn cả Promise microtask** — chạy ngay sau operation hiện tại, trước khi loop đi tiếp. Lạm dụng → starve I/O.
- `setImmediate` (phase check) vs `setTimeout(0)` (phase timers): gọi trong main module thì **thứ tự không xác định**; gọi trong I/O callback thì `setImmediate` **luôn chạy trước** (vì đang ở poll, phase check đến trước timers của vòng sau).
- Ứng dụng thực: chia nhỏ CPU-bound work bằng `setImmediate` để không chặn I/O.

### 3.3. Electron — nơi hai loop gặp nhau (chuẩn bị cho file B3)

Electron có **main process chạy Node event loop** (thật ra là loop tích hợp Node + Chromium message pump) và **mỗi renderer chạy event loop Chromium**. Hệ quả: (1) IPC giữa chúng là **bất đồng bộ** qua message passing; (2) block main process (vd `fs.readFileSync` file lớn) → **toàn bộ cửa sổ app đơ** kể cả khi renderer rảnh — nên mọi việc nặng ở main phải async hoặc đẩy sang `utilityProcess`.

---

<a id="4"></a>
## 4. V8 internals — đủ để trả lời "khai thác deep knowledge of V8"

### 4.1. Pipeline thực thi (tiering)

```
Source ─parse─▶ AST ─▶ Ignition (interpreter, bytecode)
                          │ code nóng (chạy nhiều)
                          ▼
                Sparkplug (baseline compiler) ─▶ Maglev ─▶ TurboFan (optimizing JIT)
                          ▲                                    │
                          └──────── DEOPT (bailout) ◀──────────┘  khi giả định sai
```

TurboFan optimize dựa trên **type feedback**: "hàm này 1000 lần đều nhận `{x: number}`" → sinh machine code chuyên cho shape đó. Khi gặp input phá giả định → **deoptimization**: vứt code đã optimize, rơi về bytecode. Deopt lặp đi lặp lại (deopt loop) = hàm hot mãi không được optimize = chậm.

### 4.2. Hidden classes (shapes/maps)

JS object là dynamic, nhưng V8 gán cho mỗi object một **hidden class** mô tả layout (property nào ở offset nào). Object cùng cấu trúc, tạo **cùng thứ tự property** → chung hidden class → truy cập property = đọc offset cố định (nhanh như struct C).

```js
// ✅ Cùng hidden class — mọi message cùng shape
function makeMessage(id, text) { return { id, text, readAt: null }; }

// ❌ Phá hidden class:
const m = { id: 1 };
m.text = 'hi';          // thêm property sau khi tạo → transition sang class khác
delete m.readAt;        // delete → có thể rơi về "dictionary mode" (chậm)
// và: makeMessage() chỗ này gán id trước, chỗ kia gán text trước → 2 class khác nhau
```

### 4.3. Inline caching (IC)

Tại mỗi điểm truy cập property (`msg.text`), V8 cache "lần trước object có hidden class X, offset 2". Lần sau cùng class → lấy thẳng offset, khỏi tra cứu.
- **Monomorphic** (1 shape) — nhanh nhất → **Polymorphic** (2–4 shapes) — chậm hơn → **Megamorphic** (>4) — bỏ cache, tra cứu chậm mọi lần.
- **Ứng dụng cho app chat:** hàm hot xử lý stream tin nhắn (parse, reduce, render) nên nhận object **đồng nhất shape**. Server trả JSON field lúc có lúc không → chuẩn hoá về shape cố định (điền `null`) ngay lớp API trước khi cho vào store.

### 4.4. Elements kinds

Array có "loại phần tử": `PACKED_SMI` (int liền mạch, nhanh nhất) → `PACKED_DOUBLE` → `PACKED_ELEMENTS` (object) → `HOLEY_*` (có lỗ). Chỉ đi một chiều, không quay lại. Tránh: `arr[1000] = x` khi arr đang rỗng (thành holey), trộn number với object trong mảng hot path.

### 4.5. Kiểm chứng khi cần

`node --trace-opt --trace-deopt app.js` xem hàm nào bị deopt vì sao; DevTools Performance panel thấy thời gian dồn vào hàm nào. Câu trả lời senior chuẩn mực: *"Tôi không viết code 'phục vụ V8' một cách mù quáng — tôi viết code sạch, shape ổn định, rồi profile; chỉ khi flame chart chỉ vào hot path tôi mới tối ưu theo IC/hidden class."*

---

<a id="5"></a>
## 5. High-frequency realtime data không jank — BÀI ĐINH của JD

**Bài toán:** WebSocket đẩy 50–200 event/giây (message mới, typing, presence, read receipt). Xử lý ngây thơ = mỗi event 1 setState → hàng trăm render/giây → long task → input lag, scroll giật.

**Chiến lược 5 lớp (kể theo thứ tự này khi phỏng vấn):**

### Lớp 1 — Batch/coalesce ở tầng nhận (trước khi đụng React)
```js
class MessageBuffer {
  #queue = [];
  #scheduled = false;
  constructor(private flush: (batch: Event[]) => void) {}

  push(event) {
    this.#queue.push(event);
    if (!this.#scheduled) {
      this.#scheduled = true;
      requestAnimationFrame(() => {         // gom mọi event trong 1 frame
        this.#scheduled = false;
        this.flush(this.#queue.splice(0)); // → 1 dispatch duy nhất (file A4 §8)
      });
    }
  }
}
```
Coalesce theo loại: typing/presence chỉ giữ **trạng thái cuối** (không cần replay 20 lần "đang gõ"); message thì giữ hết nhưng dispatch 1 batch.

### Lớp 2 — Store update rẻ
Normalized state + memoized selector (file A4 §6–7): 1 message mới chỉ làm re-render đúng conversation liên quan.

### Lớp 3 — Virtualization (windowing) cho message list
Chỉ render ~20 item trong viewport thay vì 10.000 DOM node:
```tsx
import { Virtuoso } from 'react-virtuoso'; // hợp chat nhất: hỗ trợ dynamic height + stick-to-bottom
<Virtuoso
  data={messages}
  followOutput="smooth"            // auto scroll xuống khi có tin mới (nếu đang ở đáy)
  firstItemIndex={firstIndex}      // prepend lịch sử cũ không nhảy scroll (scroll anchoring)
  itemContent={(i, msg) => <MessageBubble message={msg} />}
/>
```
(so với `react-window`: Virtuoso đo dynamic height tự động — tin nhắn cao thấp khác nhau; đây là lý do chọn.)

### Lớp 4 — Ưu tiên render với React concurrent
```tsx
// Tin nhắn của chat ĐANG MỞ: update ngay (urgent).
// Cập nhật sidebar/badge/unread: để sau — không được chặn typing của user
startTransition(() => setSidebarData(next));
// Search-as-you-type trong lịch sử chat:
const deferredQuery = useDeferredValue(query); // list kết quả render theo nhịp rảnh
```
`useSyncExternalStore` khi đọc từ external store (socket manager, local DB) — tránh tearing.

### Lớp 5 — Đẩy việc nặng khỏi main thread
Parse/decrypt payload lớn, search index, resize ảnh → **Web Worker** (§8). Main thread chỉ nhận kết quả cuối.

**Đo:** DevTools Performance → tìm long task (vạch đỏ) trong lúc bơm event giả; React DevTools Profiler xem component nào render oan; FPS meter trong tab Rendering. Số liệu kể chuyện: "trước batch: 40 render/giây, frame 45ms; sau: 1–2 render/giây, frame < 10ms".

---

<a id="6"></a>
## 6. Race conditions — nhận diện và xử lý

Race condition = kết quả phụ thuộc **thứ tự về đích** của các tác vụ async — JS single-thread vẫn dính vì mọi await là một "khe hở" cho việc khác chen vào.

### Pattern 1 — Stale response (kinh điển nhất)
User gõ "ab" → request A; gõ tiếp "abc" → request B. B về trước, A về sau **đè mất** kết quả đúng.
```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/search?q=${query}`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResults)
    .catch((e) => { if (e.name !== 'AbortError') setError(e); });
  return () => controller.abort();   // đổi query/unmount → huỷ request cũ
}, [query]);
// Cách 2 khi không abort được: cờ `let ignore = false` trong effect,
// cleanup set ignore = true, chỉ setResults khi !ignore (pattern chính thức react.dev)
// Cách 3: đánh số sequence, chỉ nhận response có seq === latestSeq
```

### Pattern 2 — Double-submit / duplicate action
User bấm "Gửi" 2 lần nhanh → 2 message trùng. Fix: disable khi pending + **idempotency key** (clientId — file A4 §8) để server dedupe. Nguyên tắc: chống ở UI là UX, chống ở server mới là đúng.

### Pattern 3 — Check-then-act trên state cũ
```js
// ❌ giữa lúc check và act, việc khác đã đổi state
if (!cache.has(key)) { cache.set(key, await fetchUser(key)); } // 2 caller cùng lúc → fetch 2 lần
// ✅ cache promise, không cache kết quả — caller thứ 2 nhận cùng promise đang bay
function getUser(key) {
  if (!cache.has(key)) cache.set(key, fetchUser(key).catch((e) => { cache.delete(key); throw e; }));
  return cache.get(key);
}
```

### Pattern 4 — Out-of-order messages qua WebSocket
Reconnect + resend khiến message đến trùng/lệch thứ tự. Fix: server gắn **sequence number** tăng dần theo conversation; client sort theo seq, phát hiện **gap** (nhận seq 10 khi mới có 7) → gọi API lấp `?after=7&before=10`; dedupe theo id. (Chi tiết giao thức ở file B3 §2.)

### Pattern 5 — Mutex cho tác vụ tuần tự (refresh token, ghi IndexedDB)
```ts
// Hàng đợi promise: mọi caller xếp hàng, chạy tuần tự
let chain = Promise.resolve();
function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task);
  chain = run.catch(() => {});   // lỗi không phá hàng đợi
  return run;
}
// Ứng dụng thật: 3 API cùng nhận 401 → chỉ 1 lần refresh token, 2 cái kia chờ chung promise
```

Trong React còn có **stale closure**: callback giữ state cũ tại thời điểm tạo — fix bằng functional update `setCount(c => c + 1)` hoặc đưa vào dependency đúng.

---

<a id="7"></a>
## 7. Memory management & săn memory leak

### 7.1. GC trong V8 — nói được 1 phút

Heap chia **young generation** (object mới, chết sớm — dọn bằng **Scavenger**, nhanh, thường xuyên) và **old generation** (object sống sót vài lần scavenge được "thăng cấp" — dọn bằng **Mark-Sweep-Compact**). GC hiện đại (Orinoco) chạy **concurrent/incremental/parallel** để giảm pause, nhưng old-gen GC vẫn có thể gây pause vài chục ms → một nguồn jank khó hiểu ("không làm gì cũng giật") chính là **allocation pressure**: tạo/vứt quá nhiều object mỗi frame khiến GC chạy liên tục. Fix: tái sử dụng object/buffer ở hot path, tránh tạo closure/array tạm trong vòng lặp per-frame.

GC thu hồi object **không còn đường đi tới từ root** (mark-and-sweep) — circular reference KHÔNG phải vấn đề; vấn đề là **reference vô tình còn sống**.

### 7.2. 6 nguồn leak thường gặp trong app chat/SPA (file B2 §9 đã liệt kê — đây là bản + cách nhận diện)

1. **Listener không remove** — `socket.on('message', handler)` trong component, unmount không off → component bị giữ cả cây. Nhận diện: heap có N instance của cùng component.
2. **Timer** — `setInterval` poll presence không clear.
3. **Closure giữ data lớn** — handler giữ reference tới mảng messages cũ.
4. **Detached DOM** — giữ `ref`/biến trỏ tới node đã remove (hay gặp khi tự làm virtualization). Filter "Detached" trong heap snapshot.
5. **Cache không giới hạn** — map `messageCache` chỉ thêm không xoá → dùng **LRU** (code ở file A6 §10) hoặc `WeakMap` khi key là object.
6. **Subscription store/observable** — subscribe mà không unsubscribe trong cleanup.

### 7.3. Quy trình heap snapshot 3 bước (kể được là ăn điểm "Diagnostics & RCA")

1. DevTools → Memory → **Heap snapshot #1** (baseline, sau khi bấm nút GC 🗑).
2. Làm hành động nghi leak **lặp lại N lần** (mở/đóng chat 10 lần) → GC → **snapshot #2**.
3. So sánh: chọn snapshot #2 → dropdown **Comparison** với #1 → sort theo **# Delta**: object nào tăng đúng ~10 instance = thủ phạm. Mở **Retainers** xem **ai đang giữ nó** (đường đi từ GC root) — thấy ngay `handler in eventListeners of socket`.
- Đọc số: **Shallow size** = bản thân object; **Retained size** = tổng bộ nhớ sẽ được giải phóng nếu object chết (quan trọng hơn).
- Kèm: **Allocation instrumentation on timeline** xem allocation theo thời gian thực; Performance panel bật checkbox Memory xem đường JS Heap có "răng cưa đi lên" (leak) hay răng cưa ổn định (bình thường).

### 7.4. WeakMap / WeakRef ứng dụng
`WeakMap<DOMNode, Metadata>`: node bị remove → metadata tự được thu hồi. `FinalizationRegistry`/`WeakRef` — biết tồn tại, thực tế hiếm dùng (nói thật như vậy khi phỏng vấn).

---

<a id="8"></a>
## 8. Web Workers / Service Worker / SharedWorker

### 8.1. Web Worker — thread thật sự cho JS

```js
// crypto.worker.js — use case ĐÚNG domain E2EE: mã hoá/giải mã không block UI
self.onmessage = async ({ data: { id, ciphertext, key } }) => {
  const plaintext = await decrypt(ciphertext, key);   // việc nặng chạy ở đây
  self.postMessage({ id, plaintext });
};

// main thread
const worker = new Worker(new URL('./crypto.worker.js', import.meta.url)); // Vite/Webpack đều hiểu cú pháp này
worker.postMessage({ id, ciphertext, key });
worker.onmessage = ({ data }) => resolvePending(data.id, data.plaintext);
```

- Worker **không có DOM**, giao tiếp qua `postMessage` — data được **structured clone** (copy). Payload lớn → copy đắt → dùng **Transferable**: `postMessage(buffer, [buffer])` chuyển **quyền sở hữu** ArrayBuffer (zero-copy, bên gửi mất quyền dùng).
- Wrap RPC cho đỡ khổ: thư viện **Comlink** biến worker thành async function call.
- `SharedArrayBuffer` + `Atomics` = share memory thật (cần header COOP/COEP) — dùng cho case cực nặng (codec, SQLite WASM).
- **Use case trong app chat:** decrypt/encrypt (libsignal WASM), build search index lịch sử tin nhắn, parse batch JSON lớn, xử lý ảnh trước upload.

### 8.2. SharedWorker — 1 kết nối cho nhiều tab
Mở app ở 3 tab → 3 WebSocket? SharedWorker cho các tab **dùng chung 1 worker** giữ 1 socket duy nhất, broadcast message qua `port` cho từng tab (hoặc dùng `BroadcastChannel` đồng bộ state giữa tab). Câu hỏi hay gặp ở app chat web — đáng kể ra khi phỏng vấn. (Electron ít cần vì thường 1 window chính.)

### 8.3. Service Worker — proxy giữa app và network
Khác Web Worker về mục đích: SW **chặn network request** (`fetch` event) → offline cache, và nhận **Web Push** khi trang đã đóng. Lifecycle: `install` (precache) → `waiting` (chờ tab cũ đóng — trừ khi `skipWaiting`) → `activate` (dọn cache cũ, `clients.claim`). Chiến lược cache (cache-first, network-first, stale-while-revalidate) đã có ở file B2 §6 + file D1 R5. Trong Electron, offline làm bằng IndexedDB/SQLite chứ không cần SW; SW quan trọng cho bản **web** của app.

---

<a id="9"></a>
## 9. Câu hỏi phỏng vấn + trả lời mẫu

**Q1. Trình bày Critical Rendering Path và cách bạn tối ưu từng bước.**
→ Vẽ pipeline §1 → loading side (defer, preload, critical CSS) → runtime side (giảm layout: batch đọc/ghi; giảm paint: tránh box-shadow động, paint flashing để soi; tận dụng composite: transform/opacity). Chốt bằng bảng chi phí property.

**Q2. Vì sao animation bằng `transform` mượt hơn `left/top`?**
→ `left/top` đổi geometry → Layout+Paint+Composite mỗi frame trên main thread; `transform` chỉ Composite, chạy trên compositor thread — main thread bận JS animation vẫn 60fps. Bonus: `will-change` để promote layer trước, và cảnh báo layer explosion.

**Q3. App nhận 100 WebSocket event/giây, UI giật — bạn xử lý thế nào?**
→ Trả lời theo 5 lớp §5: đo trước (Performance panel tìm long task) → batch theo rAF → coalesce typing/presence → normalized store + selector → virtualization → startTransition cho update phụ → worker cho decrypt. Có số liệu trước/sau.

**Q4. Node.js event loop khác browser thế nào? `process.nextTick` vs `setImmediate`?**
→ §3.2: phases, nextTick chạy trước microtask giữa mọi bước chuyển, setImmediate ở phase check; trong I/O callback setImmediate trước setTimeout(0); main module thì không xác định. Liên hệ Electron: main process là Node loop, block nó là đơ cả app.

**Q5. Hidden class và inline caching là gì, ảnh hưởng code hàng ngày ra sao?**
→ §4.2–4.3 + 2 quy tắc thực dụng: khởi tạo object đủ field cùng thứ tự (constructor/factory), chuẩn hoá shape data từ API trước khi vào hot path. Chốt: chỉ tối ưu khi profiler chỉ ra.

**Q6. Kể quy trình tìm memory leak thực tế.**
→ Kịch bản 3-snapshot §7.3, kể như câu chuyện: "nghi leak khi mở/đóng chat → lặp 10 lần → comparison thấy 10 instance ChatView → retainers chỉ vào socket listener → quên off trong cleanup → fix + viết lint rule cho team."

**Q7. Race condition trong JS single-thread? Cho ví dụ và cách fix.**
→ Định nghĩa (await = khe hở) + 2 ví dụ đinh: stale search response (AbortController/ignore flag/seq number) và refresh-token kép (promise mutex §6.5). Với chat: ordering bằng sequence number + gap fill.

**Q8. Khi nào dùng Web Worker? Chi phí là gì?**
→ Task > ~50ms thuần tính toán (crypto, parse, index). Chi phí: structured clone payload (né bằng Transferable), không DOM, phức tạp code (né bằng Comlink). Kể use case decrypt E2EE là trúng tim JD.

> Ôn kèm: file A1 Bonus A1 (event loop browser + quiz), file B2 §1–3 (CWV, loading, runtime), file D3 §5.1 (reflow/repaint), file D1 mục D (bundling/perf) + Q (workers, HTTP/2-3).
