---
name: add-phrases
description: Thêm nhóm câu mẫu tiếng Anh A2 mới vào flashcard (features/phrases/phrases.ts). Dùng khi muốn thêm câu cho tình huống mới (họp, demo, xin nghỉ, code review...).
argument-hint: [tình huống]
---
Tình huống: $ARGUMENTS

1. Đọc `src/features/phrases/phrases.ts` để tránh trùng.
2. Viết 4–6 câu EN, mỗi câu dưới 12 từ, mức A2, kèm `vi`. Không tên người thật.
3. Thêm một object `{ title, hint, items }` vào `PHRASE_GROUPS`. `hint` là 1 câu nhắc cách dùng.
4. Chạy `pnpm lint`. Không sửa component.
