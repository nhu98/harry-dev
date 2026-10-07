# 07 — Backend Basics (cho FE/RN Dev)

> Đủ để bạn hiểu phía sau, design API tốt, debug network, ráp full-stack.

---

## Mục lục

1. [HTTP căn bản](#http)
2. [REST API design](#rest)
3. [GraphQL](#graphql)
4. [tRPC](#trpc)
5. [WebSocket & Realtime](#realtime)
6. [Node.js basics](#node)
7. [Express / Fastify / Hono](#express)
8. [Database](#db)
9. [ORM (Prisma / Drizzle)](#orm)
10. [Authentication backend](#auth)
11. [File upload, jobs, cron](#misc)
12. [Deployment](#deploy)

---

<a id="http"></a>
## 1. HTTP căn bản

### Method
| Method | Idempotent | Safe | Body |
|---|---|---|---|
| GET | ✅ | ✅ | không |
| HEAD | ✅ | ✅ | không |
| OPTIONS | ✅ | ✅ | không |
| POST | ❌ | ❌ | có |
| PUT (replace) | ✅ | ❌ | có |
| PATCH (partial) | ❌ (thường) | ❌ | có |
| DELETE | ✅ | ❌ | có |

### Status Code (top)
- **2xx Success:** 200 OK, 201 Created, 204 No Content
- **3xx Redirect:** 301 Moved Permanent, 302 Found, 304 Not Modified
- **4xx Client Error:** 400 Bad Request, 401 Unauthorized (chưa auth), 403 Forbidden (đã auth nhưng không quyền), 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests
- **5xx Server Error:** 500 Internal, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout

### Headers quan trọng
```
Request:
  Authorization: Bearer eyJ...
  Content-Type: application/json
  Accept: application/json
  User-Agent: ...
  Cookie: session=...
  If-None-Match: "etag"
  Accept-Language: vi-VN, en;q=0.9

Response:
  Content-Type: application/json; charset=utf-8
  Cache-Control: public, max-age=3600
  ETag: "abc"
  Set-Cookie: token=...; HttpOnly; Secure; SameSite=Lax
  Location: /resource/1
  X-RateLimit-Remaining: 99
```

### HTTPS / TLS
- TLS 1.3 chuẩn hiện đại
- Certificate (Let's Encrypt free, ACME protocol)
- HSTS: ép browser dùng HTTPS

---

<a id="rest"></a>
## 2. REST API Design

### Resource-oriented URLs
```
GET    /api/v1/users              ← list
POST   /api/v1/users              ← create
GET    /api/v1/users/123          ← read one
PUT    /api/v1/users/123          ← replace
PATCH  /api/v1/users/123          ← partial update
DELETE /api/v1/users/123          ← delete

# Nested
GET /api/v1/users/123/posts
POST /api/v1/users/123/posts

# Search/filter qua query string
GET /api/v1/posts?author=123&tag=js&sort=-createdAt&page=2&limit=20
```

**Convention:**
- Plural noun: `/users` không `/user`
- Lowercase, kebab/snake-case
- Version trong URL (`/v1/`) hoặc header (`Accept: application/vnd.app.v1+json`)
- Filter, sort, paginate qua query

### Pagination patterns
```
# Offset (đơn giản, có thể skip/duplicate khi data thay đổi)
GET /posts?page=2&limit=20

# Cursor (recommend cho feed infinite scroll)
GET /posts?cursor=eyJ...&limit=20
→ { data: [...], nextCursor: 'eyJ...' }
```

### Response shape (gợi ý)
```json
{
  "data": { ... },
  "meta": { "pagination": { ... } },
  "errors": null
}
```
Lỗi chuẩn (RFC 7807 — Problem Details):
```json
{
  "type": "https://example.com/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "Email is required",
  "instance": "/users/123",
  "errors": [{ "field": "email", "message": "Required" }]
}
```

### Idempotency
- POST với `Idempotency-Key` header — tránh double charge (Stripe pattern)

### Versioning
- URL: `/v1/`, `/v2/` (rõ ràng nhất)
- Header version (clean URL nhưng khó test)
- Đừng break v1 — thêm field optional, deprecate có thông báo

---

<a id="graphql"></a>
## 3. GraphQL

```graphql
# Schema
type User { id: ID!, name: String!, posts: [Post!]! }
type Post { id: ID!, title: String!, author: User! }

type Query {
  user(id: ID!): User
  posts(first: Int, after: String): PostConnection!
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
}
```

```graphql
# Client query
query GetUser($id: ID!) {
  user(id: $id) {
    name
    posts(first: 5) { title }
  }
}
```

**Pros:** client chọn field, 1 endpoint, strongly typed, subscription.
**Cons:** caching khó hơn REST, N+1 trap (dùng **DataLoader** để batch), learning curve.

**Tools:**
- Server: Apollo Server, GraphQL Yoga, Pothos (TS-first)
- Client: Apollo Client, urql, Relay, **graphql-request** (simple)
- Codegen: `graphql-codegen` → types + hooks tự sinh

---

<a id="trpc"></a>
## 4. tRPC (TypeScript-end-to-end)

Không cần codegen, gọi function backend như local function với full type safety. Tuyệt vời cho monorepo Next.js + RN.

```ts
// server/router.ts
const appRouter = router({
  user: router({
    byId: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => db.user.findUnique({ where: { id: input.id } })),
    create: publicProcedure
      .input(z.object({ name: z.string() }))
      .mutation(({ input }) => db.user.create({ data: input }))
  })
})
export type AppRouter = typeof appRouter

// client/app.tsx
const user = await trpc.user.byId.query({ id: '1' })   // type-safe!
```

---

<a id="realtime"></a>
## 5. WebSocket & Realtime

### Khi nào dùng gì
| Need | Solution |
|---|---|
| Chat, multiplayer game | WebSocket |
| Server push notification 1 chiều | SSE (Server-Sent Events) |
| Online status, presence | WebSocket + heartbeat |
| Sync collab (Google Docs) | WebSocket + CRDT (Yjs, Automerge) |
| Push notification mobile | FCM (Firebase) / APNs |

```js
// Client
const ws = new WebSocket('wss://api.example.com/chat')
ws.onopen = () => ws.send(JSON.stringify({type:'join', room:'1'}))
ws.onmessage = e => console.log(JSON.parse(e.data))
ws.onerror = ...; ws.onclose = ...
```

**Lib:**
- **Socket.IO** — fallback long-polling, room, namespace (nặng hơn raw WS)
- **ws** (Node) — raw, hiệu năng cao
- **Pusher, Ably, Supabase Realtime** — managed
- **Liveblocks** — collab features

---

<a id="node"></a>
## 6. Node.js Basics

### Event loop (single thread)
```
Timers → Pending callbacks → Idle/prepare → Poll (I/O) → Check (setImmediate) → Close
```
+ Microtask queue (Promise, queueMicrotask) chạy giữa các phase.

### Module systems
```js
// CommonJS (legacy)
const fs = require('fs')
module.exports = { fn }

// ESM (modern, default trong Node 22+ với "type": "module")
import fs from 'node:fs/promises'
export const fn = () => {}
```

### File I/O (async)
```js
import fs from 'node:fs/promises'
const data = await fs.readFile('file.txt', 'utf8')
await fs.writeFile('out.txt', 'hello')

// Streaming for large files
import { createReadStream } from 'node:fs'
createReadStream('big.log').pipe(process.stdout)
```

### Environment & config
```js
process.env.NODE_ENV
// Load .env: import 'dotenv/config' hoặc Node 20+ native --env-file=.env
```

### Process management
- **PM2** — process manager, cluster, restart on crash, log
- **Docker** — containerize
- **Kubernetes** — orchestrate (enterprise)

---

<a id="express"></a>
## 7. Express vs Fastify vs Hono

### Express (classic)
```js
import express from 'express'
const app = express()
app.use(express.json())
app.use(cors())

app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db.user.findUnique({ where: { id: req.params.id } })
    if (!user) return res.status(404).json({ error: 'not found' })
    res.json(user)
  } catch (e) { next(e) }
})

// Error handler (4 args)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'server error' })
})

app.listen(3000)
```

### Fastify — nhanh hơn 2-3x, plugin-based, JSON Schema validation built-in
```js
import Fastify from 'fastify'
const app = Fastify({ logger: true })
app.get('/ping', async () => ({ pong: true }))
app.listen({ port: 3000 })
```

### Hono — siêu nhanh, edge-ready (Cloudflare Workers, Deno, Bun)
```ts
import { Hono } from 'hono'
const app = new Hono()
app.get('/users/:id', c => c.json({ id: c.req.param('id') }))
export default app
```

### Middleware pattern
Pipeline: req → mw1 → mw2 → handler → res
```js
app.use(logger)
app.use(auth)        // gọi next() nếu valid
app.get('/profile', handler)
```

---

<a id="db"></a>
## 8. Database

### SQL vs NoSQL
| | SQL (Postgres, MySQL) | NoSQL Document (Mongo) | KV (Redis) |
|---|---|---|---|
| Schema | strict | flexible | none |
| ACID | full | tx limited (Mongo có) | depends |
| Join | mạnh | tự manual | không |
| Use | relational, transaction | flexible doc, đọc nhanh | cache, session, queue |

### Postgres (recommended default)
- Mạnh nhất open-source SQL
- Hỗ trợ JSON/JSONB, full-text search, geo (PostGIS)
- Hosted: Supabase, Neon, Railway, Render

### SQL cơ bản
```sql
SELECT id, name FROM users WHERE active = true ORDER BY created_at DESC LIMIT 20;

INSERT INTO users (name, email) VALUES ('Harry', 'h@x.com') RETURNING id;

UPDATE users SET name = 'Harry' WHERE id = 1;

DELETE FROM users WHERE id = 1;

-- JOIN
SELECT u.name, p.title
FROM users u
JOIN posts p ON p.user_id = u.id
WHERE u.id = 1;

-- INDEX
CREATE INDEX idx_users_email ON users(email);

-- Transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- hoặc ROLLBACK
```

### Performance tips
- **Index** trên field WHERE, JOIN, ORDER BY
- **EXPLAIN ANALYZE** xem query plan
- **N+1**: dùng JOIN hoặc IN thay vì loop query
- **Connection pool** (PgBouncer, Prisma pool)
- **Cache** (Redis) cho read nóng

### Mongo basics
```js
db.users.find({ active: true }).sort({ createdAt: -1 }).limit(20)
db.users.insertOne({ name: 'Harry' })
db.users.updateOne({ _id }, { $set: { name: 'Harry' } })
db.users.aggregate([
  { $match: { active: true } },
  { $group: { _id: '$country', count: { $sum: 1 } } }
])
```

### Redis
```
SET key value EX 60        # TTL 60s
GET key
INCR counter
LPUSH queue:tasks "job1"
RPOP queue:tasks
HSET user:1 name Harry email h@x.com
ZADD leaderboard 100 user1
```
Use: cache, rate limit, pub/sub, session, queue (Bull, BullMQ).

---

<a id="orm"></a>
## 9. ORM — Prisma vs Drizzle

### Prisma (popular, batteries-included)
```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
  posts Post[]
}
model Post {
  id       Int  @id @default(autoincrement())
  title    String
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```
```ts
const user = await prisma.user.create({
  data: { email: 'h@x.com', name: 'Harry', posts: { create: [{ title: 'Hi' }] } },
  include: { posts: true }
})

const list = await prisma.user.findMany({ where: { active: true }, take: 20, orderBy: { createdAt: 'desc' } })
```

### Drizzle (lightweight, SQL-first)
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  name: text('name')
})

const list = await db.select().from(users).where(eq(users.active, true))
```

**Khi nào dùng:**
- **Prisma**: muốn ergonomic max, type-safe, migration tool, đa SQL.
- **Drizzle**: muốn raw SQL, edge runtime, bundle nhỏ, kiểm soát query.

---

<a id="auth"></a>
## 10. Authentication Backend

### Patterns
- **Session + Cookie** (stateful, server giữ session) — đơn giản, an toàn
- **JWT** (stateless) — scale tốt, nhưng revoke khó
- **OAuth/OIDC** — third-party (Google, GitHub, Apple)
- **Magic link** — không password
- **OTP/SMS/Email**
- **Passkey/WebAuthn** — không phishing được

### Lib all-in-one
- **NextAuth.js / Auth.js** — Next.js & framework agnostic
- **Clerk** — managed, đẹp, có RN SDK
- **Supabase Auth** — kèm Postgres + RLS
- **Auth0** — enterprise
- **Better Auth** — TS, self-host

### Session example (Express + cookie)
```js
import session from 'express-session'
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 7*24*3600*1000 }
}))

// Login
app.post('/login', async (req, res) => {
  const user = await verifyUser(req.body)
  req.session.userId = user.id
  res.json({ ok: true })
})

// Middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'unauth' })
  next()
}
```

### Refresh token rotation
```
Access token (15 min) → expired
→ POST /auth/refresh + httpOnly refresh cookie
→ Server: verify, rotate (mark old as used, issue new pair)
→ Return new access + set new refresh cookie
```

---

<a id="misc"></a>
## 11. File Upload, Jobs, Cron

### Upload
- Multipart form: `multer` (Express), `@fastify/multipart`
- **Direct-to-S3 signed URL** ⭐ (server không qua file)
```js
const url = await s3.getSignedUrl('putObject', { Bucket, Key, Expires: 60 })
// Client PUT file lên url
```

### Background jobs
- **BullMQ** (Redis) — queue, retry, schedule, priority
- **Inngest** — modern, durable workflow
- **Trigger.dev** — task scheduling, observability

```ts
import { Queue, Worker } from 'bullmq'
const emailQ = new Queue('email', { connection: redis })
await emailQ.add('welcome', { to: 'h@x.com' })

new Worker('email', async job => {
  await sendEmail(job.data)
}, { connection: redis })
```

### Cron
- `node-cron` đơn giản
- Vercel Cron / Cloudflare Cron Triggers
- Inngest scheduled functions

---

<a id="deploy"></a>
## 12. Deployment

### Hosting backend
| Tier | Service |
|---|---|
| Serverless | Vercel, Netlify, Cloudflare Workers |
| Container PaaS | Railway, Render, Fly.io |
| Cloud VM/K8s | AWS, GCP, Azure, DigitalOcean |

### 12-Factor App (recommended)
1. Codebase trong VCS
2. Dependencies declare + isolate
3. Config trong ENV
4. Backing services là attached resources
5. Build, release, run tách biệt
6. Process stateless
7. Port binding
8. Concurrency (scale horizontal)
9. Disposability (start/stop fast)
10. Dev/prod parity
11. Logs as event stream
12. Admin task one-off

### Observability
- **Logging**: Pino, Winston → ship to Datadog/Logtail/Loki
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry
- **Error**: Sentry
- **Uptime**: BetterStack, Pingdom

### Containerizing Node (Dockerfile basic)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```
Multi-stage build để giảm image size.

---

## References
- [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [REST API Tutorial](https://restfulapi.net)
- [GraphQL docs](https://graphql.org/learn/)
- [tRPC](https://trpc.io)
- [Prisma](https://www.prisma.io)
- [Postgres tutorial](https://www.postgresqltutorial.com)
- [12-Factor App](https://12factor.net)
