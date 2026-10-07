# 12 — Electron · WebSocket sâu · WebRTC · IndexedDB/Offline-first · E2EE

> **Vì sao file này tồn tại:** đây là 5 mảng **trắng hoàn toàn** trong kho cũ nhưng chiếm hơn nửa JD Qualgo: *"Desktop Integration using Electron, utilizing Node.js APIs and IPC patterns"*, *"Master the Electron IPC bridge... hardened against vulnerabilities"*, *"WebSocket connections to deliver sub-second latency"*, *"local storage and databases (e.g., IndexedDB)... offline-ready"*, *"audio, video, and group calls"*, E2EE, XMPP (nice-to-have), WebAssembly (nice-to-have).
> Bạn chưa làm Electron thật — mục tiêu file này là đủ hiểu bản chất + nói được cách "bắc cầu" từ kinh nghiệm React Native (bridge/native module ≈ IPC).

## Mục lục
1. [Electron — process model, IPC, security](#1)
2. [WebSocket sâu — reconnect, heartbeat, ordering, latency](#2)
3. [WebRTC — call 1-1 và group call](#3)
4. [IndexedDB & kiến trúc offline-first](#4)
5. [E2EE — WebCrypto, Signal protocol, XMPP](#5)
6. [WebAssembly — vừa đủ cho nice-to-have](#6)
7. [Mini project: chat app chứng minh 70% JD](#7)
8. [Câu hỏi phỏng vấn + trả lời mẫu](#8)

---

<a id="1"></a>
## 1. Electron — process model, IPC, security

### 1.1. Process model (giống Chrome, và giống RN một cách bất ngờ)

```
┌─ Main process (Node.js) ──────────────────────────┐
│  - 1 cái duy nhất, chạy trước tiên (main.js)      │
│  - Toàn quyền OS: fs, network, tray, menu, window │
│  - Tạo BrowserWindow, điều phối app lifecycle     │
└──────────────┬────────────────────────────────────┘
               │ IPC (async message passing)
┌──────────────┴───────────────────────────────────┐
│  Renderer process (Chromium) — mỗi window 1 cái  │
│  - Chạy React app của bạn, KHÔNG có Node API     │
│  - Sandbox, như một tab Chrome                    │
│  + Preload script: cầu nối có kiểm soát          │
└──────────────────────────────────────────────────┘
(+ utilityProcess: process phụ cho việc nặng — như worker ở tầng Node)
```

**Bắc cầu từ RN (dùng khi phỏng vấn):** RN có JS thread ↔ native thread nói chuyện qua bridge/JSI bằng message bất đồng bộ; Electron có renderer ↔ main y hệt vậy qua IPC. Bạn từng viết native module cho RN = từng thiết kế API bắc qua ranh giới process — cùng bài toán: **API tối thiểu, validate input, không block, serialize được**.

### 1.2. IPC patterns (thuộc cả 4)

```js
// ============ preload.js — cây cầu duy nhất ============
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Pattern 1: Renderer → Main, cần kết quả (request/response) — DÙNG NHIỀU NHẤT
  saveAttachment: (data) => ipcRenderer.invoke('attachment:save', data),

  // Pattern 2: Renderer → Main, fire-and-forget
  logEvent: (name) => ipcRenderer.send('analytics:log', name),

  // Pattern 3: Main → Renderer (push: tin nhắn mới, update sẵn sàng...)
  onNewMessage: (cb) => {
    const handler = (_e, msg) => cb(msg);
    ipcRenderer.on('message:new', handler);
    return () => ipcRenderer.removeListener('message:new', handler); // cleanup — tránh leak
  },
});

// ============ main.js ============
const { ipcMain, BrowserWindow } = require('electron');

ipcMain.handle('attachment:save', async (event, data) => {
  // BẢO MẬT: coi mọi message từ renderer như request từ client KHÔNG TIN CẬY
  if (!validateSender(event.senderFrame)) return;      // 1. check nguồn
  const parsed = attachmentSchema.parse(data);          // 2. validate schema (zod)
  const safePath = path.join(ATTACH_DIR, path.basename(parsed.name)); // 3. chống path traversal
  await fs.promises.writeFile(safePath, parsed.buffer);
  return { path: safePath };
});

// Push xuống renderer:
win.webContents.send('message:new', message);

// ============ React component ============
useEffect(() => window.api.onNewMessage((m) => dispatch(messageReceived(m))), []);
```

Pattern 4: `MessagePort` — kênh trực tiếp renderer ↔ renderer hoặc renderer ↔ utilityProcess, không qua main (dùng khi 2 window cần stream data cho nhau).

**Typed IPC (điểm cộng TS):** định nghĩa 1 interface `ApiSchema` chung, preload và `window.api` đều derive từ đó → gọi IPC có autocomplete + compile-time check.

### 1.3. Security hardening (JD ghi rõ "hardened against vulnerabilities")

Mô hình đe doạ: renderer hiển thị nội dung có thể chứa attack (tin nhắn XSS, link độc). Nếu renderer bị XSS **và** với tới Node API → kẻ tấn công chạy được lệnh trên máy user = **RCE**. Mọi rule dưới đây nhằm chặt đứt đường đó:

```js
new BrowserWindow({
  webPreferences: {
    contextIsolation: true,   // preload chạy ở context tách biệt — web content không sửa được cầu (default từ Electron 12)
    nodeIntegration: false,   // renderer KHÔNG có require/process (default false)
    sandbox: true,            // renderer bị sandbox như Chrome tab (default từ Electron 20)
    webSecurity: true,        // giữ same-origin policy
    preload: path.join(__dirname, 'preload.js'),
  },
});
```

Checklist nói được khi phỏng vấn:
1. 3 cờ trên + **chỉ expose hàm hẹp qua contextBridge** — không bao giờ expose `ipcRenderer` thô hay `fs`.
2. **Validate mọi IPC message ở main** (sender + schema) — IPC là security boundary, như API server validate request.
3. CSP chặt cho renderer; sanitize nội dung tin nhắn (DOMPurify) — chống XSS từ gốc.
4. Chặn navigation/popup: `will-navigate` + `setWindowOpenHandler` → link ngoài mở bằng `shell.openExternal` (sau khi validate URL, chỉ cho `https:`).
5. Không load remote content trong window có quyền; update qua **autoUpdater có chữ ký** (code signing + notarization macOS); ASAR integrity.
6. Secret (token, key E2EE) lưu bằng **`safeStorage`** (mã hoá bằng keychain của OS) — không localStorage.

### 1.4. Những thứ Electron hay bị hỏi thêm
- **Vì sao app Electron nặng RAM?** Mỗi window 1 Chromium renderer + main Node. Giảm: ít window, tái sử dụng window ẩn, cẩn thận layer/leak (file B1 §7), `utilityProcess` thay vì spawn window.
- **Block main = đơ toàn app** (file B1 §3.3) — mọi fs/net ở main phải async.
- **Deep link** (`app.setAsDefaultProtocolClient`), tray, badge count, OS notification — bộ mặt "desktop thật" của app chat.
- Electron vs **Tauri**: Tauri dùng webview hệ thống + Rust backend → nhẹ hơn nhiều, nhưng webview không đồng nhất giữa OS; Electron ship cả Chromium → nặng nhưng render nhất quán + đội FE tự chủ. Big app chat (Slack, Discord, Signal Desktop) vẫn Electron.

---

<a id="2"></a>
## 2. WebSocket sâu — reconnect, heartbeat, ordering, latency

File 07 §5 mới có "hello world". Đây là phần production-grade — **đúng chữ "sub-second latency" trong JD**.

### 2.1. Client WebSocket production-grade

```ts
class ChatSocket {
  private ws?: WebSocket;
  private attempt = 0;
  private heartbeatTimer?: number;
  private pongTimeout?: number;
  private sendQueue: string[] = [];          // tin gửi khi đang mất kết nối

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      this.attempt = 0;
      this.flushQueue();                     // gửi lại tin xếp hàng lúc offline
      this.resume();                         // báo server: tôi đã có tới seq N → gửi phần thiếu
      this.startHeartbeat();
    };
    this.ws.onmessage = (e) => this.handleMessage(JSON.parse(e.data));
    this.ws.onclose = (e) => {
      this.stopHeartbeat();
      if (e.code !== 1000) this.scheduleReconnect(); // 1000 = đóng chủ động, khỏi reconnect
    };
  }

  // Exponential backoff + jitter — jitter để ngàn client không cùng lúc "dội" server sau sự cố
  private scheduleReconnect() {
    const base = Math.min(30_000, 1000 * 2 ** this.attempt++); // 1s,2s,4s...cap 30s
    const delay = base / 2 + Math.random() * (base / 2);       // jitter
    setTimeout(() => this.connect(), delay);
  }

  // Heartbeat: phát hiện "kết nối chết mà không biết" (đứt mạng giữa chừng TCP không báo)
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.ws?.send('{"t":"ping"}');
      this.pongTimeout = setTimeout(() => this.ws?.close(4000), 5000); // 5s không pong → coi như chết
    }, 25_000);
  }
  private handlePong() { clearTimeout(this.pongTimeout); }
}
```

### 2.2. Ordering & reliability (giao thức tầng ứng dụng — server + client cùng chơi)

- Server gắn **sequence number tăng dần theo conversation** cho mỗi event.
- Client lưu `lastSeq` theo conversation; nhận event mới:
  - `seq === lastSeq + 1` → apply.
  - `seq > lastSeq + 1` → **gap** (mất gói khi reconnect) → buffer event này, gọi API `GET /events?after=lastSeq` lấp lỗ hổng, rồi apply theo thứ tự.
  - `seq <= lastSeq` → duplicate → bỏ (idempotent).
- Reconnect gửi `resume { lastSeq }` → server replay phần thiếu (XMPP gọi đây là **Stream Management XEP-0198**; Slack/Telegram đều có cơ chế tương đương).
- Gửi tin: client sinh `clientId` (UUID) → optimistic UI → server ack map `clientId → serverId` → dedupe kể cả khi resend (chi tiết reducer ở file A4 §8).

### 2.3. Sub-second latency — các đòn cụ thể
- **Đừng đóng/mở socket theo màn hình** — 1 socket sống suốt phiên (trong middleware/service, file A4 §8; nhiều tab → SharedWorker, file B1 §8.2).
- **Binary frame** thay JSON cho payload lớn: `ws.binaryType = 'arraybuffer'` + MessagePack/Protobuf → nhỏ hơn, parse nhanh hơn (và parse trong worker).
- **Batch phía server**, coalesce phía client theo rAF (file B1 §5).
- Nén: permessage-deflate (đánh đổi CPU; thường tắt cho message nhỏ, bật cho payload lớn).
- Đo thật: timestamp server trong payload → client tính `receiveLag = now - sentAt` (nhớ clock skew — dùng để so sánh tương đối); `getStats` RTT của chính WS qua ping/pong; p50/p95/p99 chứ không trung bình.
- Fallback: WS bị chặn bởi proxy công ty → fallback SSE/long-polling (Socket.IO làm sẵn); tương lai: WebTransport (HTTP/3).

---

<a id="3"></a>
## 3. WebRTC — call 1-1 và group call

JD: *"audio, video, and group calls"*. Cần hiểu **kiến trúc + luồng**, không cần thuộc API từng dòng.

### 3.1. Luồng thiết lập call 1-1 (vẽ được sơ đồ này là đạt)

```
A                    Signaling server (chính là WebSocket chat!)                    B
│  getUserMedia() → local stream                                                   │
│  pc = new RTCPeerConnection({iceServers: [STUN/TURN]})                           │
│  pc.createOffer() → setLocalDescription                                          │
│──── offer (SDP: codec, media caps) ────────────────────────────────────────────▶ │
│                                              setRemoteDescription; createAnswer  │
│◀─── answer (SDP) ────────────────────────────────────────────────────────────────│
│◀──── ICE candidates (trickle, chạy song song, cả 2 chiều) ──────────────────────▶│
│            ...ICE chọn được cặp đường đi tốt nhất...                              │
│═════════ media chảy TRỰC TIẾP P2P (DTLS-SRTP, đã mã hoá) ════════════════════════│
```

- **SDP** = bản mô tả "tôi hỗ trợ codec gì, media gì" — trao đổi qua **signaling server** (WebRTC không quy định signaling → app chat dùng luôn kênh WebSocket/XMPP có sẵn).
- **ICE** = quá trình tìm đường: thử candidate local → **STUN** (server rẻ tiền chỉ trả lời "public IP:port của anh là X" để xuyên NAT) → **TURN** (relay toàn bộ media qua server — đắt, chỉ dùng khi NAT/firewall chặn P2P, ~10-20% call).
- Media tự mã hoá transport bằng **DTLS-SRTP** (nhưng qua SFU thì server thấy media — xem §3.2/E2EE).

### 3.2. Group call — vì sao cần SFU

| Kiến trúc | Cách chạy | Vấn đề |
|---|---|---|
| **Mesh** (P2P từng đôi) | N người → mỗi người upload N-1 stream | Chết upload từ ~4-5 người |
| **MCU** | Server trộn tất cả thành 1 stream | Server đắt CPU, mất linh hoạt layout |
| **SFU** ✅ chuẩn hiện nay | Mỗi người upload 1 lần, server **forward** chọn lọc | Cân bằng nhất; kèm **simulcast** (gửi 3 độ phân giải, SFU chọn theo băng thông người nhận) |

E2EE cho group call qua SFU: SFU chỉ forward gói đã mã hoá — client mã hoá **frame media** bằng **Insertable Streams API** trước khi đóng gói SRTP (cách Signal/Matrix làm). Nói được câu này là điểm son cho công ty E2EE.

### 3.3. Vận hành call trong app thật
- Call state machine: `idle → dialing → ringing → connecting → active → reconnecting → ended` — UI bám máy trạng thái này (bạn từng làm state machine phức tạp ở RN → kể được).
- Đổi mạng WiFi↔4G: **ICE restart**. Đo chất lượng: `pc.getStats()` (packet loss, jitter, RTT) → hiện cảnh báo "mạng yếu".
- Permission camera/mic, chọn thiết bị (`enumerateDevices`), screen share (`getDisplayMedia`), echo cancellation (constraint mặc định).

---

<a id="4"></a>
## 4. IndexedDB & kiến trúc offline-first

JD: *"Local DB, ensuring seamless data synchronization"*, *"IndexedDB... robust offline-ready functionality"*.

### 4.1. IndexedDB bản chất — key-value + index, transactional, async

```ts
// API thô rất cồng kềnh — hiểu concept qua wrapper `idb` (Promise-based)
import { openDB } from 'idb';

const db = await openDB('chat-db', 2, {
  upgrade(db, oldVersion) {                    // versioning: chạy khi bump version — như migration
    if (oldVersion < 1) {
      const messages = db.createObjectStore('messages', { keyPath: 'id' });
      messages.createIndex('by-chat-time', ['chatId', 'sentAt']);   // index kép — truy vấn đinh của chat
      db.createObjectStore('chats', { keyPath: 'id' });
    }
    if (oldVersion < 2) db.createObjectStore('outbox', { keyPath: 'clientId' });
  },
});

// Ghi batch trong 1 transaction (atomic — thành công hết hoặc rollback hết)
const tx = db.transaction(['messages', 'chats'], 'readwrite');
await Promise.all([...batch.map((m) => tx.objectStore('messages').put(m)), tx.done]);

// Trang 50 tin mới nhất của 1 chat — dùng index + cursor ngược
const idx = db.transaction('messages').store.index('by-chat-time');
const range = IDBKeyRange.bound([chatId, 0], [chatId, Infinity]);
let cursor = await idx.openCursor(range, 'prev');
const page = [];
while (cursor && page.length < 50) { page.push(cursor.value); cursor = await cursor.continue(); }
```

Phải nói được:
- Vì sao không dùng localStorage: sync (block main thread), ~5MB, chỉ string, không index/transaction. IndexedDB: async, GB-scale, index, transaction, dùng được **trong Worker**.
- **Transaction tự đóng** khi hết microtask không còn request — `await fetch()` giữa chừng transaction là nó chết (bug kinh điển).
- Quota & eviction: `navigator.storage.estimate()`, xin `navigator.storage.persist()` để không bị dọn.
- Cao cấp hơn cho app chat lớn: **SQLite qua WASM** (wa-sqlite + OPFS) — query SQL thật, full-text search; Electron thì dùng thẳng **better-sqlite3 ở main process** (Node API — đúng chữ "utilizing Node.js APIs" trong JD, và Signal Desktop làm y vậy).

### 4.2. Kiến trúc offline-first cho app chat (vẽ được là ăn)

```
                UI (React) ── đọc ──▶ Redux store (bộ nhớ, nguồn render)
                    │ gửi                     ▲ hydrate/page-in
                    ▼                         │
                ┌── Sync layer ───────────────┴──┐
                │  outbox (tin chờ gửi, retry)   │
                │  inbox apply (seq, dedupe)     │
                └──┬──────────────────▲──────────┘
          write-through│              │ replay khi online
                    ▼                 │
                IndexedDB/SQLite   WebSocket
                (nguồn sự thật local) (nguồn sự thật server)
```

- **Đọc:** mở app → hydrate chats + trang tin nhắn gần nhất từ local DB (mở tức thì, offline vẫn đầy đủ) → connect socket → `resume(lastSeq)` → server đẩy phần thiếu → ghi DB + update store.
- **Ghi (outbox pattern):** gửi tin → ghi vào `outbox` + optimistic UI → online thì flush outbox (retry + backoff, giữ nguyên clientId để idempotent) → ack thì xoá khỏi outbox, ghi bản chính thức.
- **Conflict:** chat ít conflict thật (append-only theo seq); phần có conflict (draft, settings, pin) → **Last-Write-Wins** theo server timestamp là đủ; nói thêm được CRDT/vector clock cho tài liệu cộng tác là điểm cộng, kèm nhận định "chat không cần CRDT".
- **Store không giữ hết:** Redux chỉ giữ chats + messages của chat đang mở (window); lịch sử sâu nằm ở DB, page-in khi scroll — kết hợp virtualization (file B1 §5).
- E2EE twist: DB local lưu **plaintext sau khi giải mã** (Signal Desktop mã hoá file DB bằng key trong keychain — `safeStorage`) — server chỉ có ciphertext nên **không thể** làm search server-side → search phải local, index local (lý do dùng SQLite FTS).

---

<a id="5"></a>
## 5. E2EE — WebCrypto, Signal protocol, XMPP

Không ai bắt FE viết crypto — nhưng vào công ty E2EE phải **nói đúng khái niệm** và biết ranh giới "đừng tự chế crypto".

### 5.1. E2EE khác gì TLS
TLS mã hoá **đường truyền** client↔server — server vẫn đọc được nội dung. E2EE mã hoá **client↔client** — server chỉ trung chuyển ciphertext. Hệ quả kiến trúc đổ hết lên client (và đó là lý do JD này tuyển FE giỏi): key management ở client, search local, backup phức tạp, multi-device phức tạp.

### 5.2. WebCrypto API — mức cần biết

```ts
// Trao đổi khoá ECDH + mã hoá AES-GCM — xương sống của mọi E2EE
const myKeys = await crypto.subtle.generateKey(
  { name: 'ECDH', namedCurve: 'P-256' },
  false,                                  // extractable: false — key KHÔNG THỂ đọc ra ngoài
  ['deriveKey']
);
// non-extractable CryptoKey lưu thẳng vào IndexedDB — XSS cũng không trộm được key material

const shared = await crypto.subtle.deriveKey(
  { name: 'ECDH', public: theirPublicKey },
  myKeys.privateKey,
  { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
);

const iv = crypto.getRandomValues(new Uint8Array(12));      // IV KHÔNG BAO GIỜ tái sử dụng với cùng key
const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, shared, plaintextBuffer);
```
Từ khoá nói được: symmetric (AES-GCM — nhanh, mã hoá nội dung) vs asymmetric (ECDH/X25519 — trao đổi khoá), HKDF (dẫn xuất key), chạy crypto nặng trong **Worker** (file B1 §8.1), attachment = mã hoá blob rồi upload ciphertext.

### 5.3. Signal protocol — kể được ở mức khái niệm
- **X3DH:** cách 2 người lập shared secret kể cả khi người kia **offline** (server giữ sẵn "prekey bundle" — chỉ public key).
- **Double Ratchet:** mỗi tin nhắn dùng key mới, "quay cóc" liên tục → **forward secrecy** (lộ key hôm nay không đọc được tin cũ) + **post-compromise security** (hồi phục an toàn sau khi bị lộ).
- **Group:** sender key (fan-out hiệu quả) → chuẩn mới **MLS (RFC 9420)** cho group lớn.
- **Multi-device:** mỗi device 1 danh tính, mã hoá **per-device** (gửi 1 tin cho user có 3 device = 3 ciphertext) — giải thích luôn vì sao link device mới phải quét QR (trao khoá an toàn).
- **Safety number/fingerprint:** để user xác minh không bị man-in-the-middle; key đổi → warning.
- Ranh giới đúng của FE: *"dùng libsignal (thường build sang WASM), tuyệt đối không tự implement; việc của FE là tích hợp — chạy trong worker, quản lý session state trong DB local, xử lý UX key-change/verify."*

### 5.4. XMPP — nice-to-have trong JD, học 30 phút
- Giao thức nhắn tin chuẩn mở, XML stream, chạy qua **WebSocket binding (RFC 7395)** trên web; lib JS: `strophe.js`, `stanza.io`.
- 3 loại **stanza**: `<message>` (chat), `<presence>` (online/typing), `<iq>` (request/response).
- Các XEP đáng nhắc tên: **XEP-0384 OMEMO** (= Signal protocol trên XMPP), **XEP-0313 MAM** (message archive — lịch sử), **XEP-0198 Stream Management** (ack + resume — chính là bài ordering/reconnect ở §2.2!), XEP-0085 (typing).
- Câu khôn khi phỏng vấn: *"Em chưa làm XMPP production, nhưng em hiểu bài toán nó giải — ack/resume của XEP-0198 chính là cơ chế seq/gap-fill em trình bày ở phần WebSocket; OMEMO là Signal protocol đóng gói vào XMPP."* → biến nice-to-have thành câu trả lời có chiều sâu.

---

<a id="6"></a>
## 6. WebAssembly — vừa đủ cho nice-to-have

- WASM = binary format chạy trong sandbox browser với tốc độ gần native; compile từ Rust/C/C++; **không thay JS** — JS gọi WASM qua import/export function, chia sẻ **linear memory** (ArrayBuffer).
- Khi nào thắng JS: tính toán thuần CPU, không đụng DOM — **đúng 3 use case của app chat E2EE:** (1) crypto primitives (libsignal), (2) codec media, (3) SQLite (wa-sqlite). JD ghi *"Wasm for high-performance cryptographic operations"* — chính là (1).
- Chi phí phải nói được: gọi qua biên JS↔WASM có overhead copy data → thiết kế API "gọi ít, làm nhiều"; chạy trong Worker để không block main thread; `WebAssembly.instantiateStreaming` để compile song song lúc tải.
- Với V8: WASM bỏ qua toàn bộ chuyện hidden class/IC (file B1 §4) vì typed sẵn — đó là lý do nhanh và ổn định (không deopt).

---

<a id="7"></a>
## 7. Mini project: chat app chứng minh 70% JD (2–3 tuần buổi tối)

Xây **"MiniChat"** — monorepo: `apps/web` (React+TS+Vite), `apps/desktop` (Electron bọc web), `apps/server` (Node ws nhỏ — tái dùng kiến thức NestJS đang học).

Checklist tính năng ↔ JD:
- [ ] Redux + **thunk** + normalized store + reselect (file A4) → *State Management, Data & State Orchestration*
- [ ] WebSocket client class §2 đầy đủ: backoff+jitter, heartbeat, seq+gap fill, outbox → *Real-Time Conversations*
- [ ] IndexedDB (idb) + hydrate + outbox → mở app offline vẫn thấy tin nhắn → *Comprehensive Data Management*
- [ ] Message list **virtualized** (Virtuoso) + batch theo rAF; giả lập 100 msg/s để demo số liệu trước/sau → *Performance Mastery*
- [ ] Electron shell: preload + contextBridge (3 IPC pattern), OS notification, badge, `safeStorage` — bật đủ cờ security → *Desktop Integration, System Integration & Security*
- [ ] Mã hoá tin nhắn demo bằng WebCrypto (ECDH + AES-GCM, chạy trong Worker) — kèm README ghi rõ "demo primitives, production dùng libsignal" → *E2EE context + Wasm talking point*
- [ ] Vite config: code splitting, bundle analyze, 2 target web/electron → *Build Infrastructure*
- [ ] Vài test: reducer reconcile, thunk với MSW, 1 Playwright E2E → *Code Quality*

Giá trị: khi interviewer hỏi "em đã làm Electron/realtime chưa?" — thay vì "chưa", bạn mở repo: "em chưa làm production, nên em tự build cái này để hiểu bản chất — đây là cách em xử lý reconnect storm/gap fill/optimistic update...". Với vòng senior, câu chuyện này + kinh nghiệm RN thật là combo đủ mạnh.

---

<a id="8"></a>
## 8. Câu hỏi phỏng vấn + trả lời mẫu

**Q1. Trình bày process model của Electron và cách hai bên nói chuyện.**
→ Sơ đồ §1.1 + 4 IPC pattern §1.2 (invoke/handle là chính). Bắc cầu RN bridge. Nhấn: preload + contextBridge là cây cầu duy nhất, API hẹp.

**Q2. Làm sao harden một app Electron?**
→ Mô hình đe doạ (XSS → Node = RCE) rồi checklist 6 điểm §1.3. Câu chốt: "IPC là security boundary — main validate mọi message như server validate API request."

**Q3. Thiết kế reconnect cho WebSocket? Sao phải có jitter? Heartbeat để làm gì?**
→ Code §2.1: backoff cap 30s + jitter (chống thundering herd), heartbeat phát hiện dead connection (TCP không tự báo đứt), close code 1000 thì không reconnect, resume(lastSeq) sau khi nối lại.

**Q4. Đảm bảo tin nhắn không mất, không trùng, đúng thứ tự?**
→ §2.2: seq per conversation, gap → buffer + fetch lấp, dup → bỏ; gửi đi: clientId idempotent + outbox + ack reconcile (nối sang file A4 §8). Đây là câu ăn tiền nhất cho JD messaging — luyện nói trôi 2 phút.

**Q5. Offline-first hoạt động thế nào trong app của bạn?**
→ Vẽ sơ đồ §4.2, kể luồng đọc (hydrate → resume) và ghi (outbox → flush → ack). Nêu trade-off: store giữ window nhỏ, DB giữ tất, search local vì server không đọc được ciphertext.

**Q6. Vì sao IndexedDB chứ không localStorage? Bẫy transaction?**
→ §4.1: async/dung lượng/index/transaction/worker; bẫy: transaction auto-close khi await việc ngoài transaction; version upgrade = migration.

**Q7. Call video 1-1 thiết lập ra sao? STUN khác TURN gì? Group call dùng gì?**
→ Sơ đồ §3.1 (offer/answer qua signaling = chính WebSocket chat, ICE tìm đường, STUN rẻ - TURN relay đắt) + bảng Mesh/SFU/MCU, simulcast, E2EE qua Insertable Streams §3.2.

**Q8. E2EE khác TLS? Forward secrecy là gì?**
→ §5.1 + §5.3: server chỉ thấy ciphertext; Double Ratchet đổi key mỗi tin → lộ key không đọc được quá khứ. Chốt ranh giới: dùng libsignal, không tự chế crypto; FE lo tích hợp (worker, session state, UX verify).

**Q9. (Nice-to-have) Biết gì về XMPP / WASM?**
→ Trả lời "bắc cầu" §5.4 và §6 — thẳng thắn mức độ, nhưng cho thấy hiểu bản chất bài toán chúng giải.

> Ôn kèm: file A4 (Redux/thunk cho luồng optimistic), file B1 §5 (chống jank khi nhận dồn dập), file B1 §8 (Worker cho crypto), file D1 U2/U6 (system design chat/offline), file B2 phần B (security nền).
