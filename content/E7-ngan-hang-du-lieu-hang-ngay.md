# E7 — Ngân hàng dữ liệu hằng ngày (rút ra thay thế mỗi ngày)

> Cách dùng: mỗi ngày lấy **1 mục ở mỗi kho** theo số thứ tự lần lượt (hết vòng thì quay lại từ đầu — lúc đó ôn lại chính là spaced repetition).
> - Tối T3/T4 (20p nói): lấy 3 câu ở **Kho 1** để shadowing + 1 đề ở **Kho 2** để nói với AI.
> - Cuối giờ chiều (5p viết): lấy 1 đề ở **Kho 3**.
> - Trước lớp T2/T5: lấy 1 chủ đề ở **Kho 4** + 3 câu hỏi ở **Kho 5**.
> - Lúc rảnh ở cty: đọc 1 hội thoại ở **Kho 6** (đọc thầm, tối đọc to lại).

---

## Kho 1 — 60 câu shadowing (nhại y hệt ngữ điệu, thu âm, nghe lại)

> Tuần 1–2 dùng câu 1–20 (ngắn), tuần 3–5 câu 21–40, tuần 6–8 câu 41–60 (dài hơn). Mỗi tối 3 câu.

**Ngắn — nhịp cơ bản (1–20)**
1. Let me check and get back to you.
2. I'm working on it right now.
3. That makes sense to me.
4. Could you say that again, please?
5. I'll be done by tomorrow.
6. It works on my machine.
7. Can you take a look at this?
8. I'm not sure, but I think so.
9. Let's talk about it after lunch.
10. Sorry, I was on mute.
11. I just pushed the code.
12. The build is failing again.
13. Give me five more minutes.
14. That's a good question.
15. I'll send it to you today.
16. Can we do a quick call?
17. It's almost ready.
18. I found the problem.
19. Thanks for your help.
20. No worries, take your time.

**Vừa — nối âm & trọng âm (21–40)**
21. Yesterday I finished the login screen, and today I'm working on the profile page.
22. I'm blocked on the API, so I'll work on something else for now.
23. The app crashes when the user taps the back button twice.
24. I couldn't reproduce the bug on my device, so I need more information.
25. Let me walk you through the changes I made.
26. This works, but I think we can make it cleaner.
27. Could you clarify what you mean by "the old flow"?
28. I'll look into it and get back to you this afternoon.
29. We should handle the case where the list is empty.
30. The root cause was a missing null check in the API response.
31. I left a few comments on your pull request.
32. Just to confirm, you want me to remove the old screen, right?
33. It took longer than I expected because of a breaking change.
34. Do you want me to fix it now, or after the release?
35. I ran into a weird error while setting up the project.
36. Let's schedule a meeting to talk about the requirements.
37. I'm going to refactor this component before adding the new feature.
38. The response is really slow, so maybe we should cache it.
39. I'll follow up with the design team about the new layout.
40. We ended up rewriting the whole navigation flow.

**Dài — nói 2–3 nhịp một hơi (41–60)**
41. Before I start coding, I usually read the ticket carefully and check the design first.
42. If the API isn't ready by Friday, we'll have to mock the data and test with that.
43. One challenge I faced was a performance issue with long lists, so I used memoization to fix it.
44. I have about five years of experience, mostly with React and React Native.
45. In my last project, I was responsible for the whole checkout flow, from design to release.
46. The feature is working now, but I still need to write tests and update the documentation.
47. I think there's a trade-off here between performance and code readability.
48. Could everyone please review the PR today, so we can merge it before the release?
49. When I opened the app this morning, the home screen was blank, so I checked the logs first.
50. Let me share my screen and show you what happens when I tap the submit button.
51. We rolled out the new feature to ten percent of users, and so far there are no crashes.
52. I suggest we split this task into two parts, so we can finish the first part this sprint.
53. To be honest, I'm not familiar with that library, but I can learn it quickly.
54. The hardest part of this bug was that it only happened on old Android devices.
55. After the meeting, I'll write a summary and send it to everyone on the team.
56. My short-term goal is to become a senior developer, and my long-term goal is to go full-stack.
57. I didn't understand the requirement at first, so I asked the product manager to clarify it.
58. If you run into any problems with the setup, just ping me on Slack and I'll help you.
59. We found the root cause yesterday: the token expired, but the app never refreshed it.
60. Looking back, I think we should have written more tests before shipping that feature.

---

## Kho 2 — 56 đề nói với AI / tự nói 1 phút (mỗi tối T3–T4 lấy 1 đề, CN tuỳ hứng)

> Dán đề vào prompt 8.2 của [E6-hoc-lieu-tieng-anh.md](E6-hoc-lieu-tieng-anh.md) chỗ "describe my workday". Nói trước, nghe sửa sau.

**Công việc hằng ngày (1–16)**
1. Describe what you did at work today.
2. Talk about a bug you fixed recently.
3. Explain your current project to a new teammate.
4. Describe your typical workday from 9 to 6.
5. Talk about a task that took longer than expected. Why?
6. Explain what your app does, in simple words.
7. Describe the screen you're building this week.
8. Talk about your team: how many people, what they do.
9. Explain how you test your app before release.
10. Talk about a time the build or release failed.
11. Describe your favorite tool and why you like it.
12. Explain the difference between your last project and the current one.
13. Talk about something new you learned at work this month.
14. Describe a meeting you had recently. What was it about?
15. Explain what you do when you're stuck on a problem.
16. Talk about a piece of code you're proud of.

**Kỹ thuật — giải thích thành lời (17–32)**
17. Explain what React Native is to a non-developer.
18. Explain the difference between props and state.
19. Describe what happens when a user logs in to your app.
20. Explain what an API is, with one example from your work.
21. Explain why an app might be slow, and how to make it faster.
22. Describe how navigation works in your app.
23. Explain what git does, and why teams need it.
24. Explain what a merge conflict is and how you fix it.
25. Describe how you would build a simple to-do app.
26. Explain what "edge case" means, with an example.
27. Explain the difference between a bug and a feature request.
28. Describe how data goes from the server to the screen.
29. Explain what code review is and why it matters.
30. Explain what refactoring is, and when you do it.
31. Describe a performance problem you've seen and its fix.
32. Explain what testing is: unit test vs manual test.

**Bản thân & sự nghiệp (33–44)**
33. Introduce yourself in one minute (name, job, experience, goal).
34. Talk about why you became a developer.
35. Describe your career goal for the next two years.
36. Talk about your strengths as a developer.
37. Talk about a weakness and how you're improving it.
38. Describe the project you're most proud of (STAR: situation, task, action, result).
39. Talk about a time you disagreed with a teammate. What happened?
40. Talk about a mistake you made at work and what you learned.
41. Describe how you learn new technology.
42. Talk about why you're learning English.
43. Describe your dream job or company.
44. Answer: "Why should we hire you?"

**Đời thường — giữ cho vui (45–56)**
45. Describe your morning routine.
46. Talk about your weekend plans (or last weekend).
47. Describe your hometown and your parents' house.
48. Talk about your favorite food and where you eat lunch.
49. Describe the traffic on your way to work.
50. Talk about a movie or series you watched recently.
51. Describe your phone: what apps do you use most?
52. Talk about the weather this week (yes, classic!).
53. Describe your best friend or a close coworker.
54. Talk about something you want to buy and why.
55. Describe how you relax after work.
56. Talk about a place in Vietnam you want to visit.

---

## Kho 3 — 40 đề viết 3 câu cuối ngày (standup diary + biến thể)

> Luật cũ: đúng 3 câu, đơn giản. Mỗi ngày 1 đề, xoay vòng.

1. Hôm nay làm gì / vướng gì / mai làm gì (mẫu chuẩn — dùng lại mỗi khi lười).
2. Viết 3 câu về con bug khó chịu nhất hôm nay.
3. Viết 3 câu mô tả PR bạn vừa mở (What / Why / How to test).
4. Viết 3 câu nhắn Slack xin review PR một cách lịch sự.
5. Viết 3 câu báo sếp bạn cần thêm 1 ngày cho task.
6. Viết 3 câu mô tả 1 lỗi để report cho backend.
7. Viết 3 câu trả lời khi QA hỏi "bug này fix chưa?".
8. Viết 3 câu tóm tắt cuộc họp gần nhất.
9. Viết 3 câu giải thích tại sao build fail.
10. Viết 3 câu xin nghỉ phép 1 ngày.
11. Viết 3 câu cảm ơn đồng nghiệp đã giúp đỡ.
12. Viết 3 câu mô tả feature sắp làm cho người không biết code.
13. Viết 3 câu hỏi làm rõ requirement chưa rõ.
14. Viết 3 câu từ chối nhận thêm task vì đang bận (lịch sự).
15. Viết 3 câu mô tả app bạn đang làm cho nhà tuyển dụng.
16. Viết 3 câu về điều bạn học được hôm nay.
17. Viết 3 câu đề xuất cải thiện codebase.
18. Viết 3 câu mô tả trạng thái task: done những gì, còn gì.
19. Viết 3 câu trả lời "khi nào xong?" một cách trung thực.
20. Viết 3 câu comment code review góp ý nhẹ nhàng.
21. Viết 3 câu xin lỗi vì merge nhầm / làm hỏng gì đó.
22. Viết 3 câu giải thích workaround tạm thời bạn đang dùng.
23. Viết 3 câu mô tả kế hoạch ngày mai chi tiết.
24. Viết 3 câu về library mới bạn muốn thử và lý do.
25. Viết 3 câu báo cáo tuần: làm được gì tuần này.
26. Viết 3 câu chào mừng thành viên mới vào team.
27. Viết 3 câu hỏi ý kiến team về 2 giải pháp A/B.
28. Viết 3 câu mô tả một edge case vừa phát hiện.
29. Viết 3 câu cập nhật khách hàng/PM về tiến độ.
30. Viết 3 câu về mục tiêu tuần sau.
31. Viết 3 câu kể hôm nay bạn giúp ai việc gì.
32. Viết 3 câu mô tả cách bạn đã test feature trước khi giao.
33. Viết 3 câu giải thích tại sao chọn cách implement này.
34. Viết 3 câu nhắc deadline sắp tới cho team.
35. Viết 3 câu về một điều làm bạn bực mình hôm nay (xả stress bằng tiếng Anh!).
36. Viết 3 câu về một điều tốt xảy ra hôm nay.
37. Viết 3 câu mô tả issue trên GitHub (title + steps + expected).
38. Viết 3 câu hỏi backend về API mới (endpoint, payload, response).
39. Viết 3 câu tự đánh giá tuần này: tốt, chưa tốt, sẽ sửa.
40. Viết 3 câu bất kỳ về ngày hôm nay — chủ đề tự do.

---

## Kho 4 — 24 chủ đề mang tới lớp giao tiếp (T2 & T5 — 12 tuần không lặp)

> Điền vào template E6 §7. Chọn chủ đề bạn CÓ chuyện để kể — dễ nói gấp đôi.

1. My job: what I do every day as a developer.
2. A bug that made me crazy this week.
3. My morning routine (and my Mochi/Duolingo habit).
4. The app I'm building at work.
5. Why I'm learning English (my career goal).
6. My weekend at my parents' house.
7. The differences between working on web and mobile.
8. A coworker I like working with, and why.
9. My favorite YouTube channels (tech and non-tech).
10. What I eat for lunch near my office.
11. A technology I want to learn next (and AI).
12. My first day at my current company.
13. Remote work vs office work: which I prefer.
14. How I fix a bug: my step-by-step process.
15. The best advice I've received about work.
16. My plan for the next two years (senior → full-stack).
17. A time I made a mistake at work.
18. What makes a good developer, in my opinion.
19. My hometown vs the city I work in.
20. If I didn't work in IT, I would…
21. My experience learning English so far.
22. A project I'm proud of (mini STAR story).
23. How AI is changing my daily work.
24. My dream: where I want to be in five years.

---

## Kho 5 — 40 câu hỏi small talk / hỏi bạn cùng lớp (mỗi buổi lớp thủ sẵn 3 câu)

1. How was your day?
2. What do you do? / What do you study?
3. How long have you been learning English?
4. What do you usually do after work/class?
5. What did you do last weekend?
6. Do you have any plans for the weekend?
7. What kind of music do you listen to?
8. Have you watched anything good lately?
9. What's your favorite food?
10. Do you like coffee or tea?
11. Where are you from? What's it like there?
12. Do you play any sports?
13. What time do you usually wake up?
14. Are you a morning person or a night person?
15. What app do you use the most on your phone?
16. What's the best place you've ever traveled to?
17. Where do you want to travel next?
18. Do you prefer working alone or in a team?
19. What was your favorite subject at school?
20. What do you do when you feel stressed?
21. If you had a free day tomorrow, what would you do?
22. What's something you're good at?
23. What's something you want to learn?
24. Do you like reading? What kind of books?
25. What's your favorite season and why?
26. Do you cook? What can you make?
27. What's a small thing that made you happy this week?
28. Do you have pets? Do you want one?
29. What's your favorite way to spend a rainy day?
30. How do you get to work/school? How long does it take?
31. What would you do if you won the lottery?
32. Who do you talk to the most every day?
33. What's the most useful app on your phone?
34. Do you prefer texting or calling?
35. What's a habit you want to build?
36. What's a habit you want to quit?
37. What did you want to be when you were a kid?
38. What's the best thing about your job/studies?
39. What's the hardest part of learning English for you?
40. If you could live in another country, where would you go?

---

## Kho 6 — 12 hội thoại mini (đọc thầm lúc rảnh ở cty, tối đọc to cả 2 vai)

> Mỗi tuần 1–2 đoạn. Đọc to cả vai A lẫn B là một dạng luyện nói một mình rất tốt.

**1. Xin review PR**
- A: Hey, do you have a minute? Could you review my PR?
- B: Sure. Is it the one for the login screen?
- A: Yes. It's a small change, maybe ten minutes.
- B: OK, I'll take a look after lunch.
- A: Thanks! Let me know if anything looks weird.

**2. Standup**
- A: Harry, your turn.
- B: Yesterday I finished the profile screen. Today I'm going to start the settings page. No blockers.
- A: Nice. Is the profile screen ready for QA?
- B: Almost. I just need to fix one small layout issue.

**3. Báo bug cho backend**
- A: Hey, I think there's an issue with the orders endpoint.
- B: What's happening?
- A: It returns a 500 error when the list is empty.
- B: Ah, that shouldn't happen. Can you send me the request payload?
- A: Sure, I'll send it on Slack now.

**4. Không hiểu requirement**
- A: Quick question about the ticket. What does "old users" mean here?
- B: Users who signed up before January.
- A: Got it. And do we show them the new screen or the old one?
- B: The old one for now. We'll migrate them later.
- A: OK, that's clear now. Thanks!

**5. Xin thêm thời gian**
- A: How's the payment task going?
- B: Honestly, it's taking longer than I expected. The library has a breaking change.
- A: How much more time do you need?
- B: One more day should be enough. I'll finish it by tomorrow afternoon.
- A: OK, keep me updated.

**6. Họp — làm rõ và xác nhận**
- A: So we'll release on Friday. Any concerns?
- B: Just to confirm, we're releasing both iOS and Android, right?
- A: Yes, both.
- B: Then I need the new icons from design by Wednesday.
- A: Good point. I'll follow up with them today.

**7. Nhờ giúp đỡ**
- A: Sorry to bother you. I'm stuck on this navigation bug.
- B: No worries. What's it doing?
- A: When I go back from the detail screen, the app freezes.
- B: Hmm, can you show me? Let's look at it together.
- A: That would be great, thanks.

**8. Từ chối khéo**
- A: Can you take this extra ticket this sprint?
- B: I'd like to help, but I'm already full with the checkout flow.
- A: OK, what if we move it to next sprint?
- B: That works. I can start it first thing next sprint.

**9. Code review — góp ý**
- A: I left some comments on your PR. Overall it looks good.
- B: Thanks. About the second comment — why extract that function?
- A: We use the same logic in two places, so one function is easier to maintain.
- B: That makes sense. I'll update it today.

**10. Small talk đầu cuộc họp**
- A: Hey Harry, how was your weekend?
- B: Pretty relaxing. I went back to my parents' place. How about you?
- A: Nice. I just stayed home and watched a series.
- B: Which one? I'm looking for something new.

**11. Phỏng vấn — mở đầu**
- A: Thanks for coming, Harry. Tell me a bit about yourself.
- B: Sure. I'm a front-end developer with about five years of experience. I started with web in 2021, and I've focused on React Native since 2023.
- A: Great. What are you working on right now?
- B: A mobile app for [domain]. I'm responsible for the main user flows.

**12. Kết thúc ngày**
- A: I'm heading out. Anything you need from me before tomorrow?
- B: No, I'm good. Oh wait — did you push your latest changes?
- A: Yes, everything is on the develop branch.
- B: Perfect. See you tomorrow!

---

## Kho 7 — 60 từ vựng đời thường bổ sung (nạp Mochi khi hết 96 từ tech ở E6, hoặc trộn 50/50)

| # | Từ | Nghĩa | Ví dụ |
|---|---|---|---|
| 1 | actually | thật ra | Actually, I think it's a config issue. |
| 2 | probably | có lẽ | It's probably a cache problem. |
| 3 | exactly | chính xác | That's exactly what I mean. |
| 4 | basically | về cơ bản | Basically, the app has three screens. |
| 5 | recently | gần đây | I recently switched to a new library. |
| 6 | currently | hiện tại | I'm currently working on the settings page. |
| 7 | available | rảnh / sẵn có | Are you available at 3 p.m.? |
| 8 | busy | bận | Sorry, I'm busy right now. |
| 9 | ready | sẵn sàng | The build is ready for testing. |
| 10 | important | quan trọng | This is the most important part. |
| 11 | difficult / easy | khó / dễ | The fix was easier than I thought. |
| 12 | similar / different | giống / khác | These two bugs look similar. |
| 13 | improve | cải thiện | I want to improve my English. |
| 14 | prepare | chuẩn bị | I'm preparing for the demo. |
| 15 | explain | giải thích | Can you explain it again? |
| 16 | understand | hiểu | Now I understand the problem. |
| 17 | remember / forget | nhớ / quên | I forgot to push my code. |
| 18 | decide | quyết định | We decided to use the new design. |
| 19 | agree / disagree | đồng ý / không | I agree with your idea. |
| 20 | suggest | gợi ý | I suggest we test it first. |
| 21 | expect | mong đợi | I didn't expect that error. |
| 22 | happen | xảy ra | What happened to the server? |
| 23 | seem | có vẻ | It seems to work now. |
| 24 | maybe / perhaps | có thể | Maybe we should ask the team. |
| 25 | instead | thay vào đó | Use this function instead. |
| 26 | however | tuy nhiên | However, there's one problem. |
| 27 | because of | bởi vì | The delay was because of the API. |
| 28 | at least | ít nhất | At least the crash is fixed. |
| 29 | as soon as | ngay khi | I'll tell you as soon as it's done. |
| 30 | by the way | nhân tiện | By the way, the meeting moved to 4. |
| 31 | of course | tất nhiên | Of course, I can help. |
| 32 | to be honest | thật lòng mà nói | To be honest, I'm not sure. |
| 33 | in my opinion | theo tôi | In my opinion, option B is better. |
| 34 | for example | ví dụ | For example, the empty list case. |
| 35 | on time / late | đúng giờ / trễ | The release was on time. |
| 36 | early | sớm | I came in early today. |
| 37 | almost | gần như | I'm almost finished. |
| 38 | already | rồi | I already fixed that. |
| 39 | yet | chưa (câu phủ định/hỏi) | It's not done yet. |
| 40 | still | vẫn | I'm still waiting for the review. |
| 41 | again | lại | Can you run the build again? |
| 42 | together | cùng nhau | Let's debug it together. |
| 43 | quickly / slowly | nhanh / chậm | Please speak slowly. |
| 44 | carefully | cẩn thận | Read the error message carefully. |
| 45 | correctly | đúng cách | Is it configured correctly? |
| 46 | tired | mệt | I'm a bit tired today. |
| 47 | excited | hào hứng | I'm excited about the new project. |
| 48 | worried | lo lắng | I'm worried about the deadline. |
| 49 | confused | bối rối | I'm confused about this requirement. |
| 50 | confident | tự tin | I feel confident about the demo. |
| 51 | lunch break | giờ nghỉ trưa | Let's talk after the lunch break. |
| 52 | day off | ngày nghỉ | I'm taking a day off on Friday. |
| 53 | overtime | tăng ca | We worked overtime last week. |
| 54 | salary | lương | (biết để nghe, ít nói ở cty 😄) |
| 55 | coworker / teammate | đồng nghiệp | My teammates are friendly. |
| 56 | manager / lead | quản lý / trưởng nhóm | My lead reviews all PRs. |
| 57 | customer / user | khách / người dùng | Users reported the crash. |
| 58 | experience | kinh nghiệm | I have five years of experience. |
| 59 | opportunity | cơ hội | It's a good opportunity to learn. |
| 60 | goal | mục tiêu | My goal is to speak English at work. |

---

### Gợi ý vòng xoay (khỏi nghĩ)
- **Ngày làm việc thứ N** của bạn (đếm từ ngày bắt đầu): shadowing câu `3N-2, 3N-1, 3N` (Kho 1), nói đề `N` (Kho 2), viết đề `N` (Kho 3).
- Hết kho nào thì quay lại số 1 của kho đó — lần 2 sẽ thấy mình nói dễ hơn hẳn, đó chính là thước đo tiến bộ.
