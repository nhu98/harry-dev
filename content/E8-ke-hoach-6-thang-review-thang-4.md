# E8 — Kế hoạch 6 tháng tới kỳ review tháng 4/2027: Tiếng Anh + Product Engineer

> Viết ngày 2026-10-07. **Đây là kế hoạch chính hiện tại**, thay cho E1/E3 (tạm gác, chỉ mở lại khi có lịch phỏng vấn).
> Lịch mỗi ngày ở [E5](E5-thoi-gian-bieu-tieng-anh.md). Brag doc + nhật ký ở [E9](E9-brag-doc.md).
> Bối cảnh: làm remote ở Tuy Hòa cho công ty hiện tại, dự án Waxstat (backend Rails của leader, PO là PO nói tiếng Anh). Sếp vừa nhắc: thiếu business mindset, không hỏi/phản biện PO. Review lương + role tháng 4/2027.

---

## 0. Thứ tự ưu tiên và vì sao

| Ưu tiên | Việc | Vì sao |
|---|---|---|
| **1** | **Tiếng Anh** (60% thời gian học) | Là nút thắt chung của mọi thứ: nói chuyện với PO, review tháng 4, phỏng vấn sau này, đọc docs. Và là thứ AI không làm thay được. |
| **2** | **Product Engineer trên dự án thật** (40%) | Đúng cái sếp đòi. Không cần học ngoài, chỉ cần đổi cách làm task hiện tại. Bằng chứng cho review tháng 4. |
| **0** | Ôn phỏng vấn (A/B/C/D) | **Không ôn** cho tới khi có lịch phỏng vấn. Lúc đó mở [CV/Interview-Script-Harry.md](CV/Interview-Script-Harry.md) + D2 + D4, cần 1–2 tuần là nóng máy. |

Hai ưu tiên trên **giao nhau ở một điểm**: nói chuyện với PO bằng tiếng Anh về sản phẩm. Mọi thứ trong file này quy về điểm đó.

---

## 1. Mục tiêu đo được tới 4/2027 (chỉ 5 con số)

| # | Mục tiêu | Cách đo | Hiện tại → Mục tiêu |
|---|---|---|---|
| 1 | Hỏi / đề xuất với PO bằng EN | Đếm số lần trong E9 | 0/tuần → **2/tuần** |
| 2 | Hiểu backend Rails của Waxstat | Số endpoint đã vẽ luồng trong E9 §3 | 0 → **≥ 20** |
| 3 | Brag doc | Số dòng thành tựu có bằng chứng | 0 → **≥ 24** (1/tuần) |
| 4 | Tiếng Anh lên B1 (đo khách quan, **mỗi tháng**) | **EF SET** 50 phút tại https://www.efset.org, làm **CN cuối mỗi tháng** (lịch nhắc đã có) + thu âm self-intro 2 phút | Lần 0 (10/2026) = xuất phát · 11: ≥33 · 12: ≥35 · **1/2027 (mốc 3 tháng): ≥37** · 2: ≥39 · 3: ≥40 · **4/2027 (mốc 6 tháng): ≥41 = B1** |
| 5 | Một đề xuất sản phẩm được chấp nhận | PO/sếp đồng ý làm theo cách bạn đề xuất | 0 → **≥ 1** (ghi rõ trong E9) |

Đạt 4/5 là buổi review tháng 4 bạn có chuyện để nói, dù kết quả lương thế nào.

**Luật chống lười cho mục tiêu 4:** tháng nào điểm EF SET không tăng so với tháng trước, tuần đầu tháng sau tăng nói lên 45 phút/tối và báo cho Claude trong `/weekly-review` để đổi cách học, không chờ tới tháng 4.

---

## 2. Lộ trình theo tháng

| Tháng | Tiếng Anh (E6/E7 chạy tuần tự) | Product Engineer | Mốc kiểm tra cuối tháng |
|---|---|---|---|
| **10/2026** | Frames nhóm 1–2 (E6 §2), batch từ W1–W4. Chat gõ chữ với AI mỗi chiều. **Bắt đầu Grammar in Use unit 1–20 (1 unit/ngày, 15 phút ở cty).** Làm EF SET lần 0 để biết điểm xuất phát. | Bắt đầu 3 dòng Product mỗi task. Đọc 4 endpoint Rails đầu tiên (các API app Waxstat gọi nhiều nhất). | Thu âm self-intro #1. E9 có ≥ 4 dòng. |
| **11/2026** | Frames nhóm 3–4, W5–W8. Grammar unit 21–40. Bắt đầu gửi tin nhắn cho PO bằng EN tự viết (AI chỉ sửa). | 4 endpoint tiếp. Gửi câu hỏi "why" đầu tiên cho PO trong meeting. | 1 câu hỏi đã hỏi PO trực tiếp. |
| **12/2026** | Frames nhóm 5–6. Grammar unit 41–60. Thêm E7 Kho 6 hội thoại. | Vẽ sơ đồ database Waxstat (bảng chính + quan hệ). Đề xuất đầu tiên cho PO (cách làm đơn giản hơn / tính năng user cần). | Self-intro #3. Sơ đồ DB 1 trang. |
| **1/2027** | Frames nhóm 7–8. **Làm EF SET lần 1** (ghi điểm vào E9). Grammar in Use unit 61–80. | 4 endpoint. Xin leader 1 task backend nhỏ (sửa 1 API) — làm với AI giải thích, không AI viết hộ. | 1 PR backend đã merge. |
| **2/2027** | Ôn lại 50 frames. Grammar unit 81–100. Tập trình bày 1 tính năng bằng EN 3 phút. | 4 endpoint. Viết 1 trang "hệ thống Waxstat nhìn từ trên xuống" bằng EN (E9 §4). | Trình bày 1 trang đó cho AI nghe, AI hỏi lại. |
| **3/2027** | Luyện script review tháng 4 (§7). Grammar unit 101–120 + ôn lỗi hay sai. Mock buổi review với AI voice 3 lần. | Chốt brag doc, chọn 5 dòng mạnh nhất. Hỏi sếp/leader feedback trước 1 tháng. | Script review thuộc. |
| **4/2027** | **EF SET lần 2** (mục tiêu ≥ 41). Review. | Review. | Quyết định: ở lại với mức mới, hay mở lại E1/E3 + CV để tìm việc HCM với 6 tháng bằng chứng trong tay. |

---

## 3. Ba thói quen hằng ngày (mỗi cái 5–10 phút)

### 3.1. "3 dòng Product" trước mỗi task

Viết vào đầu task (Linear comment hoặc file E9 §2) bằng EN đơn giản. Đây **chính là** business mindset dưới dạng có thể thực hành.

```
1. User goal: What does the user get from this? → ...
2. Simpler way: Is there a smaller way to get 80% of the value? → ...
3. One question for PO: ... → (gửi nếu câu trả lời ảnh hưởng tới cách làm)
```

Ví dụ thật (điền theo task của bạn):
```
Task: Add release calendar filter by brand
1. User goal: collectors only care about 2–3 brands, they want to see only those.
2. Simpler way: remember the last selected brand instead of a full filter UI?
3. Question for PO: Do most users follow one brand, or many? → decides filter vs. favorites.
```

Luật: nếu dòng 3 trống 3 task liên tiếp, bạn đang quay lại chế độ "chăm chăm code". Ép mình hỏi.

### 3.2. 1 endpoint Rails / tuần với AI làm gia sư (chi tiết §4)

### 3.3. Brag doc 1 dòng / tuần (chi tiết §6)

---

## 4. Cách học backend Rails của Waxstat bằng AI (đảo ngược cách dùng AI)

**Luật mới:** ở công ty, câu lệnh đầu tiên cho AI luôn là **"Explain"**, không phải "Write".

### 4.1. Chọn endpoint
Bắt đầu từ API mà app/web Waxstat gọi nhiều nhất (bạn biết vì bạn viết phía gọi): giá box, lịch sử giá, scan UPC, subscription, notification, raffle, Shopify sync. Mỗi tuần 1 cái, tuần nào khoẻ thì 2.

### 4.2. Prompt dùng trong Claude Code / Cursor trên repo Rails (dán nguyên văn)

```
Tôi là FE dev, chưa hiểu Rails. Hãy làm gia sư, KHÔNG viết code mới.
Với endpoint [METHOD /path]:
1. Chỉ cho tôi file routes → controller → service/model → DB table, theo đúng thứ tự dữ liệu chạy.
2. Giải thích từng bước bằng 1–2 câu tiếng Việt đơn giản, giữ thuật ngữ tiếng Anh.
3. Chỉ ra business rule nào nằm ở đây (quyền, tính tiền, trạng thái) — vì sao rule đó nằm ở backend chứ không phải ở app.
4. Hỏi tôi 3 câu kiểm tra hiểu, chờ tôi trả lời rồi mới chấm.
5. Cuối cùng cho 1 câu tiếng Anh ngắn để tôi mô tả endpoint này cho PO.
```

Prompt phụ khi gặp đoạn không hiểu:
```
Giải thích đoạn code này như giải thích cho một FE dev: nó tương đương với cái gì trong React/Redux mà tôi đã biết?
```

### 4.3. Sau mỗi endpoint, ghi vào E9 §3 theo mẫu (5 dòng, tự tay, không copy AI)

```
### [GET /api/v1/boxes/:id/price_history] — tuần 42
Flow: routes.rb → BoxesController#price_history → PriceHistoryService → box_prices table
Business rule: chỉ trả giá đã verify; user free chỉ thấy 30 ngày (paywall nằm ở BE, không phải app)
Tôi ngạc nhiên vì: ...
Câu EN cho PO: "This endpoint returns verified prices only. Free users get 30 days, paid users get all."
Vẽ tay: (ảnh chụp giấy hoặc mermaid 5 dòng)
```

### 4.4. Không cần học Ruby syntax riêng
Học qua endpoint là đủ. Mọi thứ bạn gặp đều map được: controller ≈ route handler, model ≈ schema + ORM, service ≈ thunk logic, serializer ≈ hàm map response. Nếu sau tháng 1 thấy thích, mới mở sách Rails.

---

## 5. Bộ câu tiếng Anh với PO (học thuộc 25 câu này trước mọi thứ khác)

Nguyên tắc: **câu ngắn, hỏi trước, đề xuất sau, xác nhận cuối.** Nói chậm là được.

**Hỏi "vì sao" (business mindset bắt đầu từ đây)**
- Can I ask why we need this feature?
- Who is this for? Free users, or paid users?
- What problem does this solve for the user?
- How will we know it works? Do we track anything?

**Đề xuất cách đơn giản hơn**
- I have a suggestion. Can I share it?
- I think there is a simpler way: [X]. It gives most of the value with less work.
- What if we start with [small version] first, and see how users react?
- My concern is [X]. For example, [case].

**Xác nhận đã hiểu (dùng nhiều nhất)**
- Let me make sure I understand. You want [X], right?
- So the priority is [A] first, then [B]. Correct?
- Just to confirm: this is for the next release, not now?

**Khi không hiểu / không nghe kịp**
- Sorry, could you say that again?
- Could you type that in Slack? I want to be sure.
- I'm not sure I understand. Do you mean [X] or [Y]?

**Daily standup (3 câu, mỗi ngày giống nhau)**
- Yesterday I finished [X].
- Today I'm working on [Y].
- I'm blocked on [Z] / No blockers.

**Báo tin xấu sớm (sếp thích hơn là giấu)**
- Heads up: this is taking longer than I expected.
- I found a problem with [X]. Here are two options: [A] or [B]. Which one do you prefer?
- I made a mistake on [X]. I fixed it by [Y].

**Demo / báo xong**
- This is done. Here is a quick demo.
- I tested it on iOS and Android. One edge case: [X].
- Can you try it and tell me if this is what you expected?

**Kết thúc, cảm ơn**
- Thanks, that's clear now.
- Good idea. I'll do that.

---

## 6. Template chuẩn bị trước mỗi meeting với PO (10 phút, chiều hôm trước)

Điền tiếng Việt → dán cho AI: *"Chuyển thành 3–5 câu tiếng Anh đơn giản, mức A2, để tôi nói trong meeting với PO. Không dùng từ khó."* → đọc to 3 lần → mang vào meeting.

```
Meeting: [ngày] với PO
1. Việc tôi đã làm xong (1 câu):
2. Một câu hỏi "why/who" về task sắp tới:
3. Một đề xuất nhỏ (nếu có):
4. Một thứ tôi lo (nếu có):
Sau meeting: PO trả lời gì? → ghi vào E9. Tôi có nói được câu 2 không? ☐
```

---

## 7. Chuẩn bị buổi review tháng 4/2027

Mang theo: **5 dòng mạnh nhất trong E9** + sơ đồ hệ thống 1 trang + số lần đề xuất được chấp nhận.

**Script 2 phút (EN đơn giản, học thuộc tháng 3):**
> Six months ago, I got feedback that I focused too much on code and not enough on the product.
> I took it seriously. Since then, I ask "why" and "who is this for" before every task.
> I made [N] suggestions to PO, and [M] of them were accepted. For example, [one concrete example].
> I also learned our backend. I traced [N] endpoints and I made my first backend PR in January.
> My English is better. I can run my part of the meeting without preparing every sentence.
> I would like to talk about my role and salary for the next year. Based on this, I'm asking for [X].

🇻🇳 *6 tháng trước nhận feedback chăm chăm code. Tôi nghiêm túc tiếp thu. Từ đó hỏi why/who trước mỗi task. Đề xuất N lần, M lần được chấp nhận, ví dụ... Học backend, vẽ N endpoint, PR backend đầu tiên tháng 1. Tiếng Anh tốt hơn, họp không cần soạn từng câu. Muốn bàn về role và lương năm tới, đề xuất X.*

Nếu kết quả không như mong muốn: bạn vẫn có 6 tháng bằng chứng. Mở lại E1/E3 + CV, bật chế độ tìm việc. Cả hai nhánh đều có đường đi.

---

## 7b. Nói thật với người thật (tuỳ chọn nhưng là đòn bẩy lớn nhất)

Lịch hiện tại cho khoảng 5,5 giờ nói mỗi tuần, phần lớn với AI và lớp. Muốn chắc B1 vào tháng 4 thay vì "chớm B1": thêm **1 buổi italki 30 phút/tuần** với giáo viên cộng đồng (khoảng 100–150k/buổi), https://www.italki.com. Chọn giáo viên Philippines hoặc Việt Nam nói chậm, yêu cầu chủ đề "daily standup, explain a feature, ask why". Đây là khoản đầu tư rẻ nhất cho kỳ review.

## 8. Luật chống trì hoãn (đọc khi thấy "nản nản lười lười")

1. **Ngày lười chỉ làm dòng 🔴 trong E5.** Dưới 1 tiếng. Vẫn tính đạt.
2. **Không bỏ 2 ngày liên tiếp.** Bỏ 1 ngày là bình thường, bỏ 2 ngày là chuỗi đứt.
3. **Chỉ nhìn tuần này.** Không nhìn tháng 4. Tuần này: 1 endpoint, 1 câu hỏi cho PO, 1 dòng brag doc, 5 buổi tiếng Anh chiều.
4. **Thứ 6 tổng kết 15 phút** vào E9. Thấy số tăng là có động lực. Số không tăng cũng ghi, không trốn.
5. Stress thì vận động. Đá bóng, cầu lông, boxing. Không phải lời khuyên suông, đó là cách rẻ nhất để não hết "đóng băng".
