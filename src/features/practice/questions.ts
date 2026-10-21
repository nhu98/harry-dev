/**
 * Hand-written practice questions, taken from the exercises in E12 (§8, §10.9, §11.7).
 * Add a question: append to the right set. Ids must stay stable (progress is keyed by id).
 */
import type { ChoiceQ, Question, TypedQ } from "./types";

const ch = (id: string, prompt: string, options: string[], answer: number, explain?: string): ChoiceQ => ({ kind: "choice", id, prompt, options, answer, explain });
const ty = (id: string, prompt: string, accept: string[], explain?: string): TypedQ => ({ kind: "typed", id, prompt, accept, explain });
const NONE = "(không cần)";

export const TENSES: Question[] = [
  ty("t1", "She usually (review) ___ my PR in the afternoon.", ["reviews"], "Thói quen, she → thêm s."),
  ty("t2", "I (fix) ___ that bug yesterday.", ["fixed"], "yesterday → quá khứ đơn."),
  ty("t3", "Look! The build (fail) ___ again.", ["is failing", "'s failing"], "Look! → đang xảy ra → hiện tại tiếp diễn."),
  ty("t4", "I (work) ___ here since 2024.", ["have worked", "'ve worked", "have been working"], "since → hiện tại hoàn thành."),
  ty("t5", "___ you (finish) ___ the task yet? (gõ 2 phần, cách nhau dấu cách)", ["have finished"], "yet → Have + V3."),
  ty("t6", "We (release) ___ version 2.0 last Friday.", ["released"], "last Friday → quá khứ đơn."),
  ty("t7", "Don't worry. I (send) ___ you the file now.", ["'ll send", "will send"], "Quyết định ngay lúc nói → will."),
  ty("t8", "He (not / like) ___ long meetings.", ["doesn't like", "does not like"], "he → doesn't + V nguyên mẫu."),
  ty("t9", "I (never / use) ___ Rails before.", ["have never used", "'ve never used"], "Kinh nghiệm → have never + V3."),
  ty("t10", "Right now we (wait) ___ for the API.", ["are waiting", "'re waiting"], "Right now → hiện tại tiếp diễn."),
  ty("t11", "It (take) ___ three days last time.", ["took"], "take → took."),
  ty("t12", "Next sprint, I (be going to / refactor) ___ the login screen.", ["am going to refactor", "'m going to refactor"], "Kế hoạch → be going to."),
  ty("t13", "___ you (see) ___ my message yesterday? (gõ 2 phần)", ["did see"], "Sau did dùng V nguyên mẫu."),
  ty("t14", "The app (crash) ___ when the network is slow.", ["crashes"], "Luôn xảy ra khi... → hiện tại đơn."),
  ty("t15", "I (just / push) ___ the fix.", ["have just pushed", "'ve just pushed"], "just → hiện tại hoàn thành."),
  ch("t16", "Câu nào đúng?", ["I didn't saw the email.", "I didn't see the email."], 1, "Sau didn't dùng V nguyên mẫu."),
  ch("t17", "Câu nào đúng?", ["He has finished the task.", "He have finished the task."], 0, "he → has."),
  ch("t18", "Câu nào đúng?", ["I am agree with you.", "I agree with you."], 1, "agree là động từ, không cần am."),
  ch("t19", "Câu nào đúng?", ["I have fixed it last night.", "I fixed it last night."], 1, "last night → quá khứ đơn."),
  ch("t20", "Câu nào đúng?", ["She works from home on Fridays.", "She work from home on Fridays."], 0, "she → works."),
  ch("t21", "Câu nào đúng?", ["I will to call you later.", "I will call you later."], 1, "will + V nguyên mẫu."),
  ch("t22", "Câu nào đúng?", ["Do you know the answer?", "Are you knowing the answer?"], 0, "know không chia tiếp diễn."),
  ch("t23", "Câu nào đúng?", ["I am working here for two years.", "I have worked here for two years."], 1, "for + vẫn còn làm → hiện tại hoàn thành."),
];

export const FIX_PREP: Question[] = [
  ch("p1", "I'm passionate ___ mobile development.", ["about", "in", "for", NONE], 0),
  ch("p2", "It depends ___ the PO.", ["of", "on", "in", NONE], 1),
  ch("p3", "Can you handle ___ this bug?", ["with", "for", "about", NONE], 3, "handle không có giới từ."),
  ch("p4", "I learned a lot ___ my mentor.", ["from", "of", "with", NONE], 0),
  ch("p5", "My app is similar ___ yours.", ["with", "to", "as", NONE], 1),
  ch("p6", "I want to join ___ the meeting.", ["to", "in", "with", NONE], 3, "join không có giới từ."),
  ch("p7", "I'm addicted ___ checking my phone.", ["with", "to", "on", NONE], 1, "addicted to + V-ing."),
  ch("p8", "He introduced me ___ his team.", ["with", "for", "to", NONE], 2),
  ch("p9", "I live ___ District 7.", ["at", "in", "on", NONE], 1),
  ch("p10", "Let's go ___ outside.", ["to", "at", "in", NONE], 3, "go outside, go home: không có to."),
  ch("p11", "Can we discuss ___ this tomorrow?", ["about", "on", "for", NONE], 3, "discuss không có giới từ."),
  ch("p12", "I asked him ___ review my PR.", ["for", "to", "about", NONE], 1, "ask sb to V."),
  ch("p13", "I received a message ___ the PO.", ["of", "by", "from", NONE], 2),
  ch("p14", "I have a problem ___ the build.", ["with", "of", "about", NONE], 0),
];

export const FIX_WORDS: Question[] = [
  ch("w1", "The trip was really ___.", ["fun", "funny"], 0, "fun = vui, thú vị. funny = buồn cười."),
  ch("w2", "___ of my teammates are young.", ["Most", "Almost"], 0, "Most of + danh từ."),
  ch("w3", "I'm ___ finished.", ["most", "almost"], 1, "almost + tính từ, động từ."),
  ch("w4", "Yesterday I ___ a new phrase.", ["studied", "learned"], 1, "learn = học được, biết thêm."),
  ch("w5", "She sings very ___.", ["good", "well"], 1, "Trạng từ bổ nghĩa động từ → well."),
  ch("w6", "I need ___ laptop.", ["another", "other"], 0, "another + số ít."),
  ch("w7", "How ___ times did you call?", ["much", "many"], 1, "times đếm được → many."),
  ch("w8", "___ bugs are hard.", ["This", "These"], 1),
  ch("w9", "Nice to ___ you.", ["meet", "see"], 0, "Gặp lần đầu → meet."),
  ch("w10", "I'm ___ in long meetings.", ["bored", "boring"], 0, "-ed = cảm xúc của người."),
  ch("w11", "These jeans don't ___. They're too tight.", ["fit", "suit"], 0, "fit = vừa kích cỡ."),
  ch("w12", "___ is my problem.", ["Lazy", "Laziness"], 1, "Chủ ngữ cần danh từ."),
  ch("w13", "Everyone ___ happy.", ["is", "are"], 0, "every- đi với động từ số ít."),
  ch("w14", "I stayed ___ in the meeting.", ["silence", "silent"], 1, "stay + tính từ."),
];

export const FIX_VN: Question[] = [
  ch("v1", "Hôm nay Sài Gòn mưa.", ["Today Saigon rains.", "It's raining in Saigon today."], 1, "Thời tiết bắt đầu bằng It."),
  ch("v2", "App này có 10.000 người dùng.", ["This app has 10,000 users in it.", "There are 10,000 users on this app."], 1, "\"có\" = tồn tại → There are."),
  ch("v3", "Tôi mất 20 phút để đi làm.", ["I need 20 minutes to go to work.", "It takes me 20 minutes to get to work."], 1, "It takes sb + time + to V."),
  ch("v4", "Văn phòng cách nhà tôi 5 km.", ["My office is 5 km far from my house.", "My office is 5 km away from my place."], 1, "Có số → away from."),
  ch("v5", "Tôi muốn anh ấy review PR của tôi.", ["I want him to review my PR.", "I want he reviews my PR."], 0, "want sb to V."),
  ch("v6", "Tôi và bạn đi gym cùng nhau.", ["Me and my friend go to the gym together.", "My friend and I go to the gym together."], 1),
  ch("v7", "Viết test giúp tiết kiệm thời gian.", ["Writing tests saves time.", "Write tests save time."], 0, "V-ing làm chủ ngữ, động từ số ít."),
  ch("v8", "Tôi học đại học năm 2017.", ["I studied university in 2017.", "I started university in 2017."], 1, "Không nói study university."),
];

export const ARTICLE: Question[] = [
  ch("a1", "I'm ___ front-end developer.", ["a", "an", "the", NONE], 0, "Nghề nghiệp luôn có a/an."),
  ch("a2", "I need ___ API key.", ["a", "an", "the", NONE], 1, "API đọc /eɪ/ → an."),
  ch("a3", "She studies at ___ university in Saigon.", ["a", "an", "the", NONE], 0, "university đọc /ju/ → a."),
  ch("a4", "___ backend is down.", ["A", "An", "The", NONE], 2, "Chỉ có một, ai cũng biết."),
  ch("a5", "I waited for ___ hour.", ["a", "an", "the", NONE], 1, "h câm → an."),
  ch("a6", "I like ___ coffee.", ["a", "an", "the", NONE], 3, "Nói chung, không đếm được."),
  ch("a7", "This is ___ best solution.", ["a", "an", "the", NONE], 2, "So sánh nhất → the."),
  ch("a8", "Can you check ___ UI on iOS?", ["a", "an", "the", NONE], 2, "Cả hai đều biết UI nào."),
  ch("a9", "I use ___ React every day.", ["a", "an", "the", NONE], 3, "Tên riêng → không mạo từ."),
  ch("a10", "There is ___ SDK for this.", ["a", "an", "the", NONE], 1, "SDK đọc /es/ → an."),
];

export const PREPOSITION: Question[] = [
  ch("r1", "I start work ___ 9 a.m.", ["in", "on", "at", "by"], 2),
  ch("r2", "The bug is ___ this file.", ["in", "on", "at", "by"], 0),
  ch("r3", "I posted it ___ Slack.", ["in", "on", "at", "by"], 1),
  ch("r4", "I go to work ___ motorbike.", ["in", "on", "at", "by"], 3, "by + phương tiện, không mạo từ."),
  ch("r5", "My birthday is ___ March.", ["in", "on", "at", "by"], 0),
  ch("r6", "We have a meeting ___ Monday.", ["in", "on", "at", "by"], 1),
  ch("r7", "I'm ___ a meeting now.", ["in", "on", "at", "by"], 0),
  ch("r8", "I study ___ night.", ["in", "on", "at", "by"], 2),
  ch("r9", "I'm waiting ___ the backend.", ["for", "to", "on", "at"], 0),
  ch("r10", "Can you look ___ my PR?", ["at", "on", "for", "to"], 0),
  ch("r11", "She got ___ the bus.", ["in", "on", "at", "by"], 1, "on + xe công cộng."),
  ch("r12", "He got ___ a taxi.", ["in", "on", "at", "by"], 0, "in + xe nhỏ."),
];

export const UNCOUNTABLE: Question[] = [
  ch("u1", "Thanks for your ___.", ["feedbacks", "feedback"], 1),
  ch("u2", "I have 5 years ___.", ["of experience", "experiences"], 0),
  ch("u3", "Can you give me ___?", ["an advice", "some advice"], 1),
  ch("u4", "The information ___ wrong.", ["is", "are"], 0),
  ch("u5", "I wrote a lot of ___ today.", ["codes", "code"], 1),
  ch("u6", "I made good ___ today.", ["progress", "progresses"], 0),
  ch("u7", "How ___ money do you need?", ["many", "much"], 1),
  ch("u8", "We bought some new ___.", ["furniture", "furnitures"], 0),
  ch("u9", "The news ___ good.", ["is", "are"], 0),
  ch("u10", "Tiếng Pháp là?", ["France", "French"], 1, "France là nước Pháp."),
];

export const WORDFORM: Question[] = [
  ch("f1", "She works very ___.", ["good", "well"], 1),
  ch("f2", "I've been tired ___.", ["late", "lately"], 1, "lately = gần đây."),
  ch("f3", "That sounds ___.", ["great", "greatly"], 0, "Linking verb + tính từ."),
  ch("f4", "The app is not ___ on small screens.", ["response", "responsive"], 1),
  ch("f5", "He ___ works. He's always on his phone.", ["hard", "hardly"], 1, "hardly = hầu như không."),
  ch("f6", "My parents have worked ___ for this family.", ["hard", "hardly"], 0),
  ch("f7", "The party was ___ to me.", ["surprised", "surprising"], 1, "-ing = tính chất của vật."),
  ch("f8", "We need a quick ___.", ["decide", "decision"], 1),
  ch("f9", "The code looks ___.", ["clean", "cleanly"], 0),
  ch("f10", "Họ của \"secure\": danh từ là?", ["secureness", "security"], 1),
];

export const PASSIVE: Question[] = [
  ch("s1", "They fixed the bug. →", ["The bug was fixed.", "The bug fixed.", "The bug is fix."], 0),
  ch("s2", "Someone has deployed the app. →", ["The app has deployed.", "The app has been deployed.", "The app was deploy."], 1),
  ch("s3", "We will release version 3 next week. →", ["Version 3 will released.", "Version 3 will be release.", "Version 3 will be released."], 2),
  ch("s4", "The team is testing the feature. →", ["The feature is testing.", "The feature is being tested.", "The feature being tested."], 1),
  ch("s5", "We can deploy it today. →", ["It can be deployed today.", "It can deployed today.", "It can be deploy today."], 0),
  ch("s6", "Sáng nay build bị hỏng.", ["The build broke this morning by someone.", "The build was broken this morning."], 1, "Bị động, không nói ai làm."),
];
