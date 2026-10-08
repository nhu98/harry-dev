# E11 — Hướng dẫn từng ngày: mở gì, bấm đâu, làm theo bước nào (từ 2026-10-08)

> File này trả lời câu "hàng ngày tôi học như thế nào?". Mỗi khối giờ trong [E5](E5-thoi-gian-bieu-tieng-anh.md) được viết lại thành: **Mở gì (link) → Làm gì (bước) → Xong khi (kết quả nhìn thấy được)**.
> Nếu quá tải: chỉ làm mục 0. Ba việc đó cộng lại 45 phút và đã đủ tính là một ngày đạt.
> Trang web: https://harry-dev-lemon.vercel.app/checklist có nút "Cách làm" cho từng dòng, dùng trên điện thoại.

---

## 0. Nếu chỉ làm 3 việc (ngày lười, ngày bận)

| Giờ | Việc | Mở | Xong khi |
|---|---|---|---|
| 12h45 | Duolingo 10 phút | App Duolingo trên iPhone, 2 bài | Streak còn sống |
| 13h30 | Từ vựng 20 phút | App MochiVocab (khoá đang học) → xong thì mở Anki deck tech | Mochi báo hết lượt ôn hôm nay |
| 14h00 | Nghe + chép 15 phút | 1 video ở mục 2 | Chép được 3 câu vào ghi chú |
| 19h40 | Nói 10 phút | Mục 5, bước "voice với AI" | Nói được 1 phút không dừng quá 5 giây |
| 15h30 | Ngữ pháp 1 unit | Mục 4.0 | 1 unit đánh dấu trong vở |

---

## 1. 8h00 sáng — nghe thụ động khi sửa soạn (0 phút tốn thêm)

- **Mở:** BBC 6 Minute English, https://www.bbc.co.uk/learningenglish/english/features/6-minute-english (web hoặc app BBC Learning English). Chọn tập mới nhất, bấm play, bật loa ngoài.
- **Làm:** không cần hiểu hết. Chỉ để tai quen nhịp. Đánh răng, thay đồ, ăn sáng như bình thường.
- **Xong khi:** hết 6 phút. Không ghi chép gì.
- **Thay thế:** podcast "Easy English" trên Spotify, hoặc nghe lại video hôm qua của mục 2.

---

## 2. 14h00 — Tiếng Anh khối 1: NGHE + CHÉP với tai nghe (45 phút, im lặng, ở công ty)

### 2.1. Chọn video (2 phút)
Chọn **một** kênh dưới đây, chọn video 8–12 phút, có phụ đề EN (bấm CC). Mỗi tuần một kênh để quen giọng.

| Kênh | Link | Vì sao hợp bạn |
|---|---|---|
| Web Dev Simplified | https://www.youtube.com/@WebDevSimplified | Nói chậm, rõ, chủ đề React/JS bạn đã biết nên đoán được nghĩa |
| Traversy Media | https://www.youtube.com/@TraversyMedia | Giọng Mỹ chuẩn, tốc độ vừa, hay dùng "crash course" |
| Jack Herrington | https://www.youtube.com/@jherr | React/Next.js hiện đại, giải thích tốt |
| Fireship | https://www.youtube.com/@Fireship | Nhanh, chỉ xem khi đã quen, dùng để "nghe thử sức" |
| Learn English with TV Series | https://www.youtube.com/@LearnEnglishWithTVSeries | Cho T7 giải trí, học cụm đời thường |

Gợi ý tuần đầu (8–12/10): Web Dev Simplified, tìm trong kênh video có tiêu đề bắt đầu bằng "Learn React Hooks" hoặc "useEffect". Chủ đề bạn đã biết thì não dồn sức vào tiếng Anh thay vì vào nội dung.

### 2.2. Xem 3 lần (30 phút)
1. **Lần 1, sub EN, tốc độ 0.75** (bấm bánh răng → Playback speed). Chỉ xem, không dừng.
2. **Lần 2, sub EN, tốc độ 1.0.** Dừng ở 5 câu bạn thấy hay hoặc hay dùng khi đi làm. Chép 5 câu đó vào ghi chú điện thoại (Apple Notes / Google Keep), ghi kèm phút giây.
3. **Lần 3, tắt sub, tốc độ 1.0.** Nghe xem còn hiểu bao nhiêu. Không cần hiểu hết.

### 2.3. Đọc hiểu 5 câu đã chép (10 phút, im lặng)
- Với mỗi câu: tra nghĩa từ lạ, đánh dấu chỗ nhấn giọng (nghe lại đoạn đó 2 lần). Chỉ nghe, không phát ra tiếng.
- Từ nào không biết đọc: mở https://youglish.com, gõ từ đó, nghe 3 người thật nói (tai nghe).
- 5 câu này là "bài tập về nhà" cho 19h40: tối sẽ nhại to và thu âm.

### 2.4. Nạp từ (3 phút)
- 3–5 từ mới từ video → thêm vào Anki (app https://apps.ankiweb.net trên máy, hoặc https://ankiweb.net trên điện thoại). Thẻ mặt trước: từ + câu trong video. Mặt sau: nghĩa VI.
- Chưa có deck tech? Import file [anki-tech-english.txt](anki-tech-english.txt) theo hướng dẫn E5 bản cũ: File → Import → Tab separated.

**Xong khi:** có 5 câu trong ghi chú + 3 thẻ Anki mới. (Ghi âm là việc buổi tối.)

---

## 3. 14h45 — Khối Product Engineer (45 phút)

### T2 và T4: đọc 1 endpoint backend với AI làm gia sư
1. Mở repo backend trong Claude Code hoặc Cursor.
2. Chọn endpoint mà app/web Waxstat gọi nhiều nhất (giá box, lịch sử giá, scan UPC, subscription, notification). Tuần đầu: endpoint **giá box**.
3. Dán nguyên văn prompt này:
```
Tôi là FE dev, chưa hiểu Rails. Hãy làm gia sư, KHÔNG viết code mới.
Với endpoint [METHOD /path]:
1. Chỉ cho tôi file routes → controller → service/model → DB table, theo đúng thứ tự dữ liệu chạy.
2. Giải thích từng bước bằng 1–2 câu tiếng Việt đơn giản, giữ thuật ngữ tiếng Anh.
3. Chỉ ra business rule nào nằm ở đây (quyền, tính tiền, trạng thái) và vì sao rule đó ở backend chứ không ở app.
4. Hỏi tôi 3 câu kiểm tra hiểu, chờ tôi trả lời rồi mới chấm.
5. Cuối cùng cho 1 câu tiếng Anh ngắn để tôi mô tả endpoint này cho PO.
```
4. Trả lời 3 câu kiểm tra bằng tay, không nhờ AI.
5. Vẽ luồng ra giấy (5 ô: app → route → controller → service → DB). Chụp ảnh.
6. Chép 5 dòng vào [E9](E9-brag-doc.md) §3 theo mẫu E8 §4.3.
- Đọc thêm khi cần: Rails Guides, mục "Getting Started", https://guides.rubyonrails.org/getting_started.html (chỉ đọc phần MVC và routing, 20 phút, một lần duy nhất).

**Xong khi:** E9 §3 có thêm 1 mục + 1 ảnh vẽ tay.

### T3 và T5: brag doc + 1 câu hỏi cho PO
1. Mở [E9](E9-brag-doc.md) §1. Nhớ lại 2 ngày qua: có hỏi PO câu nào? có đề xuất gì? có bắt được yêu cầu lệch nào? Ghi 1 dòng nếu có. Không có thì ghi "chưa" và lý do.
2. Mở task đang làm trên Linear. Viết "3 dòng Product" (E8 §3.1) nếu sáng chưa viết.
3. Soạn 1 câu hỏi "why/who" cho PO bằng EN, lấy mẫu ở E8 §5 hoặc trang https://harry-dev-lemon.vercel.app/phrases nhóm "Hỏi vì sao". Gửi lên Slack/Linear comment trong ngày.
- Đọc thêm (tuỳ chọn, 15 phút/tuần): Shape Up của Basecamp, miễn phí, https://basecamp.com/shapeup, chương "Principles of Shaping". Đây là cách nghĩ "làm bản nhỏ trước" mà bạn sẽ đề xuất với PO.

**Xong khi:** 1 câu hỏi đã gửi đi (có link/ảnh chụp).

### T6: tổng kết tuần (15 phút)
Trong Claude Code tại thư mục kho, gõ `/weekly-review`. Trả lời câu nó hỏi. Nó tự đối chiếu 5 mục tiêu E8 và chốt 3 việc tuần sau.

---

## 4. 15h30 — Tiếng Anh khối 2: NGỮ PHÁP + VIẾT + CHAT (60 phút, im lặng được)

### 4.0. Ngữ pháp 15 phút, 1 unit/ngày (15h30–15h45)
- **Sách:** *English Grammar in Use* (Raymond Murphy, Cambridge), bản 5th edition, trình độ B1 (bìa xanh). Mua sách giấy ở Fahasa/Tiki (~250k) hoặc app **"English Grammar in Use"** trên App Store (mua từng phần). Trang chính thức: https://www.cambridge.org/elt/grammar-in-use
- **Cách làm:** mỗi unit là 2 trang. Trang trái: đọc giải thích 5 phút, chép 2 ví dụ vào vở. Trang phải: làm bài tập 8 phút, viết tay. Đối chiếu đáp án cuối sách 2 phút, đánh dấu câu sai.
- **Thứ tự:** đi theo số unit từ 1. Mỗi tháng 20 unit (T2–T6). Lộ trình: 10/2026 unit 1–20 · 11 unit 21–40 · 12 unit 41–60 · 1/2027 unit 61–80 · 2 unit 81–100 · 3 unit 101–120. Unit nào dễ, biết rồi thì làm bài tập thôi, bỏ qua phần đọc.
- **Dùng ngay:** chọn 1 cấu trúc vừa học, ép mình dùng trong buổi chat 15h45 và trong tin nhắn Slack hôm đó.
- **Xong khi:** có 1 unit đánh dấu trong vở + ít nhất 1 câu Slack/chat dùng cấu trúc đó.

### 4.0b. Đo trình độ khách quan
- **EF SET** miễn phí, 50 phút, ra điểm CEFR: https://www.efset.org. Làm lần 0 trong tuần này (ghi điểm vào E9). Làm lại tháng 1/2027 và tháng 4/2027. Mục tiêu tháng 4: **≥ 41 điểm (B1)**.

### 4.1. Chat với AI bằng tiếng Anh (25 phút, từ 15h45)
- Mở ChatGPT / Claude / Gemini bản web. Dán prompt:
```
You are my English tutor. I am a frontend developer, English level A2.
Rules: use simple words. Ask me ONE question at a time about my work day. Wait for my answer.
After each answer, fix my mistakes in one short line, then ask the next question.
Topic today: [lấy 1 đề ở E7 Kho 2, ví dụ "a bug I fixed this week"]
```
- Gõ trả lời bằng tay, câu ngắn. Không copy từ AI. Chat tối thiểu 10 lượt.
- Cuối buổi gõ: `Give me my 3 most common mistakes today in a table.` Chép 3 lỗi vào ghi chú.

### 4.2. Viết thật ở công ty (15 phút)
Chọn 1 trong 3, cái nào có thật hôm nay:
- Viết PR description bằng EN theo mẫu E6 §6 (What / Why / How to test).
- Viết tin nhắn cho PO/PM bằng EN. Viết VN trước, dán vào AI: "Rewrite in simple English, A2 level, max 3 sentences." Đọc hiểu từng từ rồi mới gửi.
- Đọc 1 hội thoại E7 Kho 6, đọc thầm cả 2 vai.

### 4.3. 17h35 — nhật ký 3 câu (5 phút)
Mở E9 §2, viết 3 câu EN: Today I... / The hardest part was... / Tomorrow I will... Đề gợi ý ở E7 Kho 3.

**Xong khi:** có 3 lỗi ghi lại + 3 câu nhật ký.

---

## 5. 19h40 — NÓI 20 phút (việc duy nhất buổi tối)

### T3 và T4: nhại + voice với AI (ở nhà, 30 phút)
1. Mở ghi chú 5 câu đã chép buổi chiều. Mỗi câu: nghe đoạn video → nhại to đúng ngữ điệu → 3 lần. Bật Voice Memos thu âm 5 câu liên tiếp, nghe lại 1 lần (5 phút).
2. Mở app ChatGPT (nút tai nghe, Voice) hoặc Gemini Live hoặc app Claude (voice).
3. Nói prompt này bằng tiếng Anh, đơn giản: *"Let's practice. You are my teammate. Ask me about my work today. Speak slowly. Correct me gently."*
4. Nói 10 phút. Sai cứ nói tiếp. Mục tiêu là số câu nói ra.
5. Kết thúc: *"What were my 3 biggest mistakes?"* Ghi lại.
6. **10 phút cuối:** kể lại video chiều nay trong 1 phút, không nhìn giấy, thu âm. Nghe lại 1 lần. Đây là bài "retell", kỹ năng nói lên nhanh nhất nhờ nó.

### T6 (19h00–19h20, trước khi về ba mẹ)
Voice với AI 20 phút, đề: *"Tell me about your week"*. Xong là nghỉ hẳn tới T2.

### Mỗi sáng chạy xe (5 phút, không tai nghe)
Nói thầm lại 5 câu đã chép hôm qua, từ trí nhớ. Quên thì bỏ qua, không dừng xe mở điện thoại.
- Tuần có khách nước ngoài sang: thay bằng prompt đóng vai ở [E10](E10-script-gap-PM.md) mục 9.

### T2 và T5: lớp giao tiếp 20h–21h
- 19h40: điền template E6 §7 (chủ đề từ E7 Kho 4 + 3 câu small talk E7 Kho 5). 15 phút.
- Sau lớp: 3 lỗi bị sửa + 3 từ mới → Anki.

### CN (tuỳ hứng, 15 phút)
Voice với AI kể về tuần vừa rồi. CN cuối tháng: thu âm self-intro 2 phút theo E6 §5, lưu file tên `intro-2026-10.m4a`. Tháng sau so với tháng này.

---

## 6. Sáng, trước task đầu tiên — "3 dòng Product" (5 phút)

Mở task trên Linear, viết comment (EN, đơn giản):
```
User goal: ...
Simpler way: ...
Question for PO: ...
```
Mẫu đầy đủ và ví dụ ở E8 §3.1. Nếu task do PM tạo lại từ ý PO, dùng thêm mẫu 3 dòng "confirm / done when / not included" ở E10 §4b, gửi lại trước khi code.

---

## 7. Tuần này cụ thể (T4 08/10 → T6 10/10, rồi T2 13/10 → T6 17/10)

| Ngày | 14h00 video | 14h45 PE | 15h30 chat đề | 19h40 |
|---|---|---|---|---|
| T4 08/10 | Web Dev Simplified, useEffect | Endpoint giá box (T4 làm endpoint) | "What I did today at work" | Voice: kể việc hôm nay |
| T5 09/10 | Cùng video, lần 2–3 | Brag doc + 1 câu hỏi cho PO | "A bug I fixed" | Lớp |
| T6 10/10 | Video mới cùng kênh | `/weekly-review` | "My weekend plan" | Nghỉ |
| T2 13/10 | Traversy Media, React crash course phần đầu | Endpoint lịch sử giá | "Explain my app to a friend" | Lớp |
| T3 14/10 | Cùng video | Brag doc + luyện E10 mục 7 (cứu nguy) | "My team and my role" | Voice đóng vai PM (E10 §9) |
| T4 15/10 | Cùng video, tắt sub | Endpoint scan UPC | "A feature I want to build" | Voice đóng vai PM |
| T5 16/10 | Video mới | Brag doc + câu hỏi cho PO/PM | "What I learned this week" | Lớp |
| T6 17/10 | Learn English with TV Series | `/weekly-review` + ghi buổi gặp PM vào E9 | tự do | Nghỉ |

---

## 7b. Nhắc nhở tự động

Trang https://harry-dev-lemon.vercel.app/today có nút "Thêm lịch nhắc vào iPhone". Mở trên iPhone → Thêm tất cả → mỗi khối giờ có thông báo. Duolingo (12h45 mỗi ngày) và MochiVocab (13h30 ngày thường, 9h30 cuối tuần) đã nằm trong đó.

## 8. Công cụ cần cài một lần (15 phút, làm hôm nay)

| Công cụ | Ở đâu | Để làm gì |
|---|---|---|
| Duolingo + MochiVocab (đã có trên iPhone) | App Store | 12h45 Duolingo, 13h30 Mochi. Bật thông báo trong app để nhắc thêm |
| English Grammar in Use (sách hoặc app) | Fahasa / App Store | 15 phút ngữ pháp mỗi chiều ở cty |
| EF SET | https://www.efset.org | Đo trình độ tuần này, tháng 1, tháng 4 |
| Anki (máy) + AnkiWeb (điện thoại) | https://apps.ankiweb.net · https://ankiweb.net | Deck từ tech, đồng bộ máy ↔ điện thoại |
| ChatGPT app (voice) hoặc Gemini app | App Store / Play | Nói buổi tối |
| YouGlish | https://youglish.com | Nghe người thật phát âm 1 từ |
| Voice Memos | có sẵn iPhone | Thu âm nhại + self-intro hàng tháng |
| GitHub app (điện thoại) | App Store / Play | Đọc E8/E9/E10 riêng tư trên điện thoại (sau khi push kho lên repo private) |
| Web harry-dev | https://harry-dev-lemon.vercel.app | Checklist + flashcard + kiến thức công khai |

---

## 9. Kiến thức nền nào liên quan, đọc khi nào

| Khi làm việc gì | Đọc |
|---|---|
| Không biết nói gì với PO | E8 §5 (25 câu) · web /phrases |
| Không hiểu vì sao "hỏi why" quan trọng | E8 §0 và §3.1 · Shape Up chương 1 |
| Đọc code Rails không hiểu MVC | Rails Guides "Getting Started", phần MVC · A7 (REST, HTTP) trong kho |
| Nghe video không ra từ | E6 §3 (96 từ tech) · E6 §4 (ngữ pháp 1 trang) |
| Không biết nói câu dài | E4 §5 (học theo cụm) · E6 §2 (50 frames) |
| Sắp gặp khách nước ngoài | E10 toàn bộ |
| Sắp có phỏng vấn | CV/Interview-Script-Harry.md · D2 · D4 |
