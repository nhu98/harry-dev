# 13 — Hướng đi sự nghiệp: Fullstack TypeScript + AI (bản thiết kế riêng cho Harry)

> Viết ngày 2026-08-06, dựa trên hồ sơ thật: ReactJS từ 2021 → React Native từ 2023 (công ty hiện tại) + NextJS một thời gian + Java BE cũ (2020, đã quên) + đang tự học NodeJS/NestJS.
> Mục tiêu: (1) đậu phỏng vấn Senior FE trước mắt (Qualgo hoặc tương đương), (2) trong 12 tháng chuyển dần sang vị trí ít bị cạnh tranh, có tương lai trong thời AI.

---

## 1. Đọc thị trường 2026 một cách thực tế

**"FE không còn phát triển nữa" — đúng một nửa.** Cái đang chết là *FE thuần cắt giao diện* (pixel-perfect landing page, CRUD form) — vì AI code được phần đó rất nhanh. Cái KHÔNG chết, thậm chí tăng giá:

1. **FE khó** — realtime, offline-first, performance ở quy mô lớn, desktop (Electron), video call. Chính là JD Qualgo: họ trả senior để giải bài "10.000 tin nhắn realtime không giật UI", không phải để cắt Figma. AI chưa thay được lớp này.
2. **Người build được SẢN PHẨM end-to-end** — hiểu UI + API + data + deploy. AI làm code nhanh hơn → 1 người làm được việc của 3 người → công ty chuộng "product engineer" hơn là chuyên viên 1 lớp.
3. **Người tích hợp AI vào sản phẩm** (AI engineer phía application) — không phải train model, mà là: gọi LLM đúng cách, RAG, agent, streaming UI, đánh giá chất lượng, kiểm soát chi phí. Nhu cầu vượt xa nguồn cung, và nền tảng cần thiết chính là... kỹ năng web/app mà bạn đã có.

**Kết luận:** không cần bỏ nghề FE để "chạy sang AI". Con đường đúng là **cộng dồn**: FE giỏi → fullstack TypeScript → fullstack biết tích hợp AI. Mỗi bước tái sử dụng ~80% cái đã có.

---

## 2. Ngách đề xuất: "Product Engineer — TypeScript end-to-end + AI, có vũ khí riêng là Mobile"

Vì sao ngách này hợp với bạn nhất và "không phải chọi quá nhiều":

| Lựa chọn | Đánh giá cho bạn |
|---|---|
| FE thuần tiếp | ❌ Đông người, dễ bị AI ép giá, trần lương thấp dần |
| Chuyển hẳn BE Java/Spring | ❌ Phí 5 năm FE, Java của bạn đã quên từ 2020, chọi với người làm Java 5-10 năm |
| ML/Data Scientist | ❌ Cần toán + Python sâu + bằng cấp, thị trường entry rất chật |
| **Fullstack TS (Next/Nest) + AI integration + RN** | ✅ Tái dùng 100% TypeScript. Combo **RN + AI** cực hiếm ở VN — hầu hết AI engineer không biết mobile, hầu hết mobile dev chưa biết AI. Đây là điểm khác biệt của bạn |

**Chân dung sau 12 tháng:** "Engineer 5 năm kinh nghiệm React/React Native, tự build và deploy được sản phẩm fullstack TypeScript (NextJS/NestJS + Postgres), đã ship tính năng AI thật (chat RAG có trích nguồn, agent gọi tool) trên cả web lẫn mobile." — hồ sơ này ở VN 2026 rất ít người có, và apply được cả 3 loại job: Senior FE/RN, Fullstack TS, AI Application Engineer.

---

## 3. Lộ trình 3 giai đoạn (song song với ROADMAP 8 tuần hiện có)

### Giai đoạn 1 — NGAY BÂY GIỜ → +2 tháng: Đậu Senior FE (Qualgo-type)
Không học lan man. Toàn lực ôn theo JD:
- Học file **A4-core-redux-thunk.md**, **B1-web-browser-internals.md**, **B3-web-electron-realtime-e2ee.md** (mới bổ sung theo JD) + đọc lại A1, B2 — theo đúng lịch trong **E1-ke-hoach-on-jd-qualgo.md**.
- Chạy **PROMPT-trich-xuat-du-an.md** trên các dự án cũ → dựng 3 câu chuyện phỏng vấn (file D2).
- Build 1 **mini chat app** làm bằng chứng: React + TS + Redux Thunk + WebSocket + IndexedDB offline + virtualized list (chi tiết ở cuối file B3). 1 repo này "cover" được 70% JD khi kể chuyện.
- **Output:** đậu ít nhất 1 offer Senior FE. Lương tăng ngay là ở bước này.

### Giai đoạn 2 — Tháng 3 → 8: Fullstack TypeScript thật sự
Chọn stack hẹp, làm sâu, KHÔNG đổi qua lại:
- **NestJS + PostgreSQL + Prisma** (bạn đã học Nest — đúng hướng, tiếp tục) hoặc NextJS fullstack cho sản phẩm nhỏ.
- Phải tự tay làm đủ 1 vòng: auth (JWT + refresh + OAuth), phân quyền, upload file, background job (BullMQ), WebSocket server (Socket.IO/ws — nối thẳng với kiến thức FE realtime), viết test, Docker hoá, deploy (Railway/Fly.io/VPS), logging + monitoring.
- Ôn lại SQL nghiêm túc (index, transaction, N+1) — file A7 đã có nền, đào sâu thêm.
- **Output:** 1 sản phẩm fullstack chạy thật có user (dù nhỏ), backend tự viết 100%.

### Giai đoạn 3 — Tháng 6 → 12 (gối đầu GĐ2): AI Application Engineering trên nền TypeScript
Không cần Python trước — hệ sinh thái TS đã đủ mạnh:
- **Nền tảng:** cách LLM hoạt động (token, context window, temperature), prompt engineering có cấu trúc, function/tool calling, structured output.
- **Kỹ thuật lõi:** embeddings + vector DB (pgvector — tái dùng luôn Postgres), **RAG** (chunking, retrieval, re-rank, trích nguồn), **streaming UI** (SSE — nối thẳng kiến thức realtime của GĐ1), **agent** (vòng lặp tool-use), **MCP** (chuẩn kết nối tool cho AI — đang thành chuẩn ngành), **evals** (đo chất lượng output) + kiểm soát chi phí/latency.
- **Công cụ:** Vercel AI SDK (TS), Claude API/OpenAI API, LangChain.js chỉ cần biết đọc.
- **Flagship project (chọn 1):**
  - *Trợ lý hỏi-đáp tài liệu* (PDF → RAG → trả lời có trích nguồn) — dễ demo khi phỏng vấn;
  - *AI feature nhúng trong app RN* — phát huy đúng vũ khí riêng: rất ít người demo được RAG chạy trong mobile app.
- Song song: dùng AI coding tool (Claude Code/Cursor) thành thạo trong công việc hằng ngày — 2026 đây là kỹ năng được hỏi thẳng trong phỏng vấn ("bạn dùng AI vào workflow thế nào?"), và là cách bạn học nhanh gấp nhiều lần.
- **Output:** 1-2 sản phẩm AI deploy thật, viết 2-3 bài blog/LinkedIn tiếng Anh kể quá trình build → tạo "bằng chứng công khai" để nhà tuyển dụng tự tìm đến.

### Vì sao KHÔNG khuyên học ngay: Python/ML sâu, Web3, DevOps chuyên trách, Golang/Rust
Mỗi thứ đó là một nghề riêng, học bây giờ là phân tán lực. Python chỉ cần học *sau* khi đã vững AI trên TS và thấy cần (đọc code mẫu, script nhỏ — 2 tuần là đủ mức cần).

---

## 4. Nguyên tắc vận hành (để không bỏ cuộc giữa chừng)

1. **Một thời điểm chỉ một mục tiêu:** đang ở GĐ1 thì cấm mở khoá học RAG. Ghi vào backlog, quay lại sau.
2. **Học bằng dự án, không học bằng khoá học:** mỗi giai đoạn có đúng 1 repo output. Tutorial chỉ xem khi bị kẹt.
3. **Mọi thứ viết bằng tiếng Anh công khai** (README, commit, blog) — luyện tiếng Anh (E4-english-for-devs.md) + xây hồ sơ cùng lúc.
4. **Nhật ký 15 phút/tuần:** ghi lại "tuần này giải được bài khó gì" — chính là nguyên liệu cho câu chuyện phỏng vấn sau này.
5. **Đo lại mỗi 3 tháng:** mở lại file này, tự chấm đang ở đâu, apply thử 2-3 chỗ để "đo nhiệt" thị trường kể cả khi chưa muốn nhảy.

---

## 5. Tài nguyên chọn lọc (ít mà chất)

- **Fullstack TS:** NestJS docs (chính chủ, rất tốt) · Prisma docs · "Total TypeScript" (Matt Pocock) cho TS nâng cao
- **AI engineering:** Vercel AI SDK docs · Anthropic docs (tool use, MCP, prompt engineering) · "What We Learned from a Year of Building with LLMs" (loạt bài O'Reilly) · simonwillison.net (blog theo dõi ngành sát nhất)
- **RAG/pgvector:** Supabase AI docs (pgvector + TS, ví dụ chạy được)
- **Giữ nhịp tin tức:** JavaScript Weekly + 1 nguồn AI (TLDR AI hoặc Latent Space) — 15 phút/tuần, không hơn.
