# B2 — Performance & Security (Web)

> Phần security nền tảng (OWASP/XSS/JWT...) dùng chung cho cả mobile. Phần RN-specific (performance RN, secure storage, cert pinning, biometric...) đã tách sang `C2-mobile-performance-security-testing.md`. Browser internals sâu hơn xem `B1-web-browser-internals.md`.

---

## PHẦN A — PERFORMANCE

### Mục lục Performance

1. [Core Web Vitals](#cwv)
2. [Loading Performance](#loading)
3. [Runtime Performance](#runtime)
4. [Bundle Optimization](#bundle)
5. [Image & Asset](#image)
6. [Caching strategies](#caching)
7. [React Performance Checklist](#react-perf)
8. [Memory & Memory Leaks](#memory)
9. [Profiling tools](#profiling)

---

<a id="cwv"></a>
## 1. Core Web Vitals (Google)

| Metric | Đo cái gì | Target "Good" |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Tốc độ render khối lớn nhất | < 2.5s |
| **INP** (Interaction to Next Paint) | Độ trễ tương tác (thay FID 2024) | < 200ms |
| **CLS** (Cumulative Layout Shift) | Tổng dịch chuyển layout không mong muốn | < 0.1 |
| **FCP** | First Contentful Paint | < 1.8s |
| **TTFB** | Time To First Byte | < 800ms |

**Đo:** Lighthouse (Chrome DevTools), PageSpeed Insights, web-vitals lib, RUM (Sentry, Datadog).

---

<a id="loading"></a>
## 2. Loading Performance

### Critical rendering path
HTML → CSS parsed → CSSOM → Render tree → Layout → Paint → Composite.

### Resource hints
```html
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
<link rel="preload" href="hero.webp" as="image">
<link rel="prefetch" href="/next-page.js">      <!-- low priority, idle -->
<link rel="modulepreload" href="/chunk.js">
```

### Script loading
```html
<script src="a.js"></script>          <!-- blocking parser -->
<script src="a.js" defer></script>    <!-- ✅ download song song, exec sau parse -->
<script src="a.js" async></script>    <!-- ✅ exec ngay khi load xong (order ko đảm bảo) -->
<script type="module" src="a.js"></script>  <!-- defer mặc định -->
```

### Code splitting & lazy load (React)
```jsx
const Settings = React.lazy(() => import('./Settings'))
<Suspense fallback={<Spinner />}>
  <Settings />
</Suspense>
```

### Server-side rendering
- **SSR** (Next.js, Remix): HTML render server, FCP nhanh hơn SPA
- **SSG** / ISR (Next.js): build trước, CDN cache
- **RSC** (React Server Components): component chạy server, gửi JSX serialized

### HTTP/2, HTTP/3
- HTTP/2: multiplexing, header compression
- HTTP/3 (QUIC): UDP, kết nối nhanh trên mạng yếu/mobile

---

<a id="runtime"></a>
## 3. Runtime Performance

### JS performance basics
- Tránh layout thrashing — đọc DOM xong rồi mới write
```js
// ❌ thrash
els.forEach(el => { const w = el.offsetWidth; el.style.width = w + 10 + 'px' })
// ✅ batch
const widths = els.map(el => el.offsetWidth)
els.forEach((el, i) => el.style.width = widths[i] + 10 + 'px')
```

- **Debounce / Throttle** input
```js
const debounce = (fn, ms) => {
  let t
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) }
}
const throttle = (fn, ms) => {
  let last = 0
  return (...a) => { const n = Date.now(); if (n - last > ms) { last = n; fn(...a) } }
}
```

- `requestAnimationFrame` cho animation 60fps
- `requestIdleCallback` cho tác vụ nền không gấp
- **Web Workers** cho heavy compute (parse, hash, image)
- **OffscreenCanvas** — render canvas trong worker

### Event delegation (web)
1 listener trên parent thay vì N listener trên children:
```js
list.addEventListener('click', e => {
  const item = e.target.closest('.row')
  if (item) handle(item.dataset.id)
})
```

### Virtualization cho list dài
- Web: `react-window`, `react-virtual` (TanStack), `react-virtualized`

---

<a id="bundle"></a>
## 4. Bundle Optimization

### Phân tích bundle
- Webpack: `webpack-bundle-analyzer`
- Vite: `rollup-plugin-visualizer`

### Kỹ thuật
- **Tree shaking**: ESM imports, no side-effect (đánh dấu `"sideEffects": false` trong package.json)
- **Code splitting**: tách route, dynamic import
- **Minify**: Terser, esbuild, swc
- **Compression**: Brotli > Gzip
- **Dead code elimination**: bundler tự
- **Polyfill hợp lý**: `core-js@3` + browserslist, không polyfill khi không cần
- **Replace lib nặng**:
  - `moment` (290KB) → `date-fns` / `dayjs` (2KB)
  - `lodash` → `lodash-es` + named import / native ES methods
  - `axios` → `fetch` (giảm 13KB) nếu không cần feature
- **Dynamic import lib**: `const { Chart } = await import('chart.js')`

### Modern build tools
- **Vite** / **esbuild** / **swc** — nhanh hơn webpack 10-100x
- **Turbopack** (Next.js)
- **Bun**

---

<a id="image"></a>
## 5. Image & Asset

### Format
| Format | Use case |
|---|---|
| **AVIF** | Best compression, hỗ trợ rộng từ 2024 |
| **WebP** | Fallback tốt, hỗ trợ ~99% |
| **JPEG** | Photo cũ, fallback cuối |
| **PNG** | Cần alpha + sắc nét (icon, logo) |
| **SVG** | Icon, illustration vector |

### Responsive images
```html
<img
  src="img-800.jpg"
  srcset="img-400.jpg 400w, img-800.jpg 800w, img-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"
  loading="lazy"
  decoding="async"
  alt="..."
  width="800" height="600"  <!-- chống CLS -->
>
<picture>
  <source srcset="img.avif" type="image/avif">
  <source srcset="img.webp" type="image/webp">
  <img src="img.jpg" alt="...">
</picture>
```

### Font
- `font-display: swap` để tránh FOIT
- `preload` font critical
- Subset (chỉ giữ ký tự cần) — quan trọng cho tiếng Việt
- Variable fonts (1 file nhiều weight)

---

<a id="caching"></a>
## 6. Caching Strategies

### HTTP cache headers
```
Cache-Control: public, max-age=31536000, immutable   # static asset có hash
Cache-Control: no-cache, must-revalidate              # HTML → revalidate
Cache-Control: private, max-age=0                     # user-specific
ETag: "abc123"
Last-Modified: ...
```

### Service Worker (PWA)
```js
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  )
})
```
Strategies: cache-first, network-first, stale-while-revalidate.

### CDN
- CloudFront, Cloudflare, Fastly
- Edge cache → giảm latency, giảm origin load

---

<a id="react-perf"></a>
## 7. React Performance Checklist

1. **Đo trước, optimize sau** (Profiler)
2. **Key đúng** trong list (stable id, không index nếu re-order)
3. **`React.memo`** cho component pure pass props nhiều
4. **`useMemo`/`useCallback`** chỉ khi:
   - Tính toán đắt
   - Pass xuống child đã memo
5. **Selector cho store**: tránh consumer re-render khi state khác đổi
6. **Tách Context** theo concern, đừng nhồi 1 context lớn
7. **`useTransition`** cho update non-urgent (filter list)
8. **Suspense + lazy** cho route, modal
9. **Avoid inline object/function** khi pass xuống memoized child
10. **Concurrent features** (React 18): automatic batching, transitions

```jsx
// ❌ object literal mỗi render → memoize ko hiệu quả
<Child style={{ color: 'red' }} onPress={() => {}} />

// ✅
const style = useMemo(() => ({ color: 'red' }), [])
const onPress = useCallback(() => {}, [])
<Child style={style} onPress={onPress} />
```

---

<a id="memory"></a>
## 8. Memory & Memory Leaks

### Common leaks
1. **Listener không cleanup**
```jsx
useEffect(() => {
  const sub = emitter.addListener('event', fn)
  return () => sub.remove()
}, [])
```
2. **Timer không clear** (`setInterval`, `setTimeout`)
3. **WebSocket không close**
4. **Detached DOM node** giữ trong biến
5. **Closure giữ reference lớn**
6. **Global cache mọc vô hạn** → dùng WeakMap, hoặc cap size (LRU)

### Debug
- Chrome DevTools → Memory → Heap snapshot, so sánh
- Allocation Timeline

---

<a id="profiling"></a>
## 9. Profiling Tools

- **Lighthouse** (audit toàn diện web)
- **Chrome DevTools Performance** (flame chart)
- **WebPageTest** (multi-location, throttle)
- **React DevTools Profiler** (component render time)
- **Why Did You Render**
- **Sentry Performance / Datadog RUM** (production)

---

## PHẦN B — SECURITY

### Mục lục Security

1. [OWASP Top 10 (web 2021)](#owasp)
2. [XSS](#xss)
3. [CSRF](#csrf)
4. [CORS](#cors)
5. [CSP](#csp)
6. [Authentication & Authorization](#authn)
7. [JWT do's & don'ts](#jwt)
8. [Password & Crypto](#crypto)
9. [Dependency security](#deps)
10. [Security checklist](#checklist)

---

<a id="owasp"></a>
## 1. OWASP Top 10 (2021)

1. **A01: Broken Access Control** — user truy cập tài nguyên không thuộc về mình
2. **A02: Cryptographic Failures** — lưu/truyền data nhạy cảm không mã hóa
3. **A03: Injection** — SQLi, NoSQLi, command injection, XSS
4. **A04: Insecure Design**
5. **A05: Security Misconfiguration**
6. **A06: Vulnerable Components** — dependency lỗi
7. **A07: Authentication Failures**
8. **A08: Software & Data Integrity Failures** — supply chain
9. **A09: Logging & Monitoring Failures**
10. **A10: SSRF** — server-side request forgery

---

<a id="xss"></a>
## 2. XSS (Cross-Site Scripting)

**3 loại:** Stored, Reflected, DOM-based.

```js
// ❌ React with dangerouslySetInnerHTML — chỉ dùng với HTML đã sanitize
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ React tự escape mọi text
<div>{userInput}</div>
```

**Phòng ngừa:**
- Escape output theo context (HTML, attribute, JS, URL, CSS)
- Sanitize HTML người dùng: **DOMPurify**
- Set **CSP** chặn inline script
- HttpOnly cookie cho session token (XSS không đọc được)

---

<a id="csrf"></a>
## 3. CSRF (Cross-Site Request Forgery)

Trình duyệt tự gửi cookie → attacker submit form từ site lạ thay user.

**Phòng:**
- **SameSite cookie**: `Strict` / `Lax` (Lax default modern browser)
- **CSRF token** đồng bộ submit
- Kiểm `Origin` / `Referer` header server-side
- Dùng `Authorization: Bearer` header thay cookie (không tự gửi cross-site)

---

<a id="cors"></a>
## 4. CORS (Cross-Origin Resource Sharing)

Browser chặn request cross-origin mặc định. Server cho phép qua headers:
```
Access-Control-Allow-Origin: https://my-app.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true     # nếu gửi cookie
```
**Preflight** OPTIONS xảy ra khi: custom header, method ngoài GET/POST/HEAD, hoặc Content-Type ngoài 3 loại đơn giản.

⚠️ `Access-Control-Allow-Origin: *` + `Allow-Credentials: true` → KHÔNG hợp lệ.

---

<a id="csp"></a>
## 5. CSP (Content Security Policy)

```
Content-Security-Policy: default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://*.cdn.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';                  # chống clickjacking
  upgrade-insecure-requests;
```
Dùng `nonce` hoặc `hash` thay vì `unsafe-inline`.

---

<a id="authn"></a>
## 6. Authentication & Authorization

**AuthN (xác thực):** bạn là ai
**AuthZ (phân quyền):** bạn được làm gì

**Patterns:**
- **Session cookie** (server stateful, traditional) — httpOnly, Secure, SameSite
- **JWT** (stateless) — token trong header / cookie
- **OAuth 2.0** — delegated (Login with Google)
- **OIDC** — OAuth + identity layer (id_token)
- **PKCE** — bắt buộc cho mobile/SPA flow (chống code interception)
- **Refresh token rotation** — mỗi refresh → token mới, revoke cái cũ
- **MFA / TOTP / WebAuthn (passkeys)** — second factor

**RBAC vs ABAC:**
- RBAC: role-based (admin, user, editor)
- ABAC: attribute-based (rule động: `user.dept === resource.dept`)

---

<a id="jwt"></a>
## 7. JWT — Do's & Don'ts

✅ Do:
- Sign với secret/keypair mạnh (HS256 secret ≥ 256-bit, hoặc RS256/ES256)
- Đặt `exp` ngắn (15–60p), refresh token dài hơn
- Verify signature SERVER-SIDE mỗi request
- Lưu refresh trong **httpOnly cookie** hoặc **secure storage** (RN)

❌ Don't:
- Lưu access token trong **localStorage** (XSS)
- Trust JWT chưa verify
- Dùng `alg: none`
- Đặt PII/secret trong payload (JWT base64, AI ĐỌC ĐƯỢC)
- Không có refresh strategy

```js
// Verify (server)
import jwt from 'jsonwebtoken'
const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] })
```

---

<a id="crypto"></a>
## 8. Password & Crypto

### Password hashing
- **NEVER** lưu plaintext, NEVER dùng `MD5`/`SHA1`
- Dùng **bcrypt** (cost 12+), **argon2** (recommended 2024+), **scrypt**
```js
import bcrypt from 'bcrypt'
const hash = await bcrypt.hash(password, 12)
const ok = await bcrypt.compare(password, hash)
```

### Encryption
- Symmetric: **AES-256-GCM** (authenticated)
- Asymmetric: **RSA-2048+**, **ECDSA P-256**, **Ed25519**
- KDF: **PBKDF2**, **scrypt**, **Argon2**

### Random
- Browser: `crypto.getRandomValues(new Uint8Array(32))`
- Node: `crypto.randomBytes(32)`
- ❌ NEVER `Math.random()` cho security

---

<a id="deps"></a>
## 9. Dependency Security

```bash
npm audit              # tìm CVE
npm audit fix
pnpm audit
yarn audit
```
- **Dependabot** / **Renovate** — auto PR update
- **Snyk**, **Socket.dev** — scan supply chain
- Lock file (`package-lock.json` / `pnpm-lock.yaml`) commit
- Pin major version, range minor (`^1.2.3`)

⚠️ **Supply chain attacks**: package bị compromise (event-stream 2018, ua-parser-js 2021). Subscribe security advisory, hạn chế install package có nhiều transitive deps.

---

<a id="checklist"></a>
## 10. Security Checklist (web app)

- [ ] HTTPS everywhere, HSTS header
- [ ] Cookie: `HttpOnly`, `Secure`, `SameSite=Lax/Strict`
- [ ] CSP đặt strict, không `unsafe-inline` (hoặc nonce)
- [ ] Input validation server-side (Zod, Joi, Yup)
- [ ] Output escape theo context
- [ ] CSRF protection cho mutating routes có cookie
- [ ] Rate limit + brute-force protect (login, OTP)
- [ ] Password: bcrypt/argon2, min 8 ký tự, check breached (HIBP)
- [ ] MFA cho admin
- [ ] Logging — không log password/PII/token
- [ ] Error message generic ra client, chi tiết log server
- [ ] Security headers: HSTS, X-Frame-Options/`frame-ancestors`, X-Content-Type-Options: nosniff, Referrer-Policy
- [ ] CORS allow-list rõ ràng
- [ ] Dependencies updated, no critical CVE
- [ ] Backup + disaster recovery
- [ ] Pen test / bug bounty (mature)

---

## References
- [OWASP Top 10](https://owasp.org/Top10/)
- [web.dev/performance](https://web.dev/performance)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Mozilla Observatory](https://observatory.mozilla.org)
- [Auth0 Blog — JWT best practices](https://auth0.com/blog)
