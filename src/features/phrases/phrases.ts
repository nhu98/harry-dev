export type Phrase = { en: string; vi: string };
export type PhraseGroup = { title: string; hint: string; items: Phrase[] };

export const PHRASE_GROUPS: PhraseGroup[] = [
  {
    title: "Hỏi vì sao (business mindset)",
    hint: "Hỏi về user trước khi hỏi về code.",
    items: [
      { en: "Can I ask why we need this feature?", vi: "Cho tôi hỏi vì sao mình cần tính năng này?" },
      { en: "Who is this for? Free users, or paid users?", vi: "Tính năng này cho ai? User miễn phí hay trả phí?" },
      { en: "What problem does this solve for the user?", vi: "Nó giải quyết vấn đề gì cho user?" },
      { en: "How will we know it works? Do we track anything?", vi: "Làm sao biết nó hiệu quả? Mình có đo gì không?" },
      { en: "What is the biggest problem users complain about?", vi: "User than phiền gì nhiều nhất?" },
    ],
  },
  {
    title: "Đề xuất cách đơn giản hơn",
    hint: "Hỏi phép trước, rồi nói ngắn.",
    items: [
      { en: "I have a suggestion. Can I share it?", vi: "Tôi có một đề xuất. Chia sẻ được không?" },
      { en: "I think there is a simpler way. It gives most of the value with less work.", vi: "Tôi nghĩ có cách đơn giản hơn. Được phần lớn giá trị mà ít việc hơn." },
      { en: "What if we start with a small version first, and see how users react?", vi: "Hay mình làm bản nhỏ trước, xem user phản ứng thế nào?" },
      { en: "My concern is this. For example, ...", vi: "Điều tôi lo là chỗ này. Ví dụ, ..." },
    ],
  },
  {
    title: "Xác nhận đã hiểu đúng",
    hint: "Dùng nhiều nhất. Nói chậm.",
    items: [
      { en: "Let me make sure I understand. You want X, right?", vi: "Để tôi chắc là hiểu đúng. Bạn muốn X, đúng không?" },
      { en: "So the priority is A first, then B. Correct?", vi: "Vậy ưu tiên A trước, rồi B. Đúng chứ?" },
      { en: "Let me confirm what I understood, then I start.", vi: "Để tôi xác nhận lại điều đã hiểu, rồi mới bắt đầu." },
      { en: "Done when: the user taps X and sees Y.", vi: "Xong khi: user bấm X và thấy Y." },
      { en: "Not included in this task: ...", vi: "Không bao gồm trong task này: ..." },
    ],
  },
  {
    title: "Không hiểu / không nghe kịp",
    hint: "Hỏi lại luôn tốt hơn đoán.",
    items: [
      { en: "Sorry, could you say that again?", vi: "Xin lỗi, nói lại giúp tôi được không?" },
      { en: "Could you speak a little slower, please? My English is still improving.", vi: "Nói chậm hơn chút được không? Tiếng Anh tôi đang cải thiện." },
      { en: "I'm not sure I understand. Do you mean X or Y?", vi: "Tôi chưa chắc hiểu. Ý bạn là X hay Y?" },
      { en: "Could you type that in Slack? I want to be sure.", vi: "Bạn gõ lại trên Slack được không? Tôi muốn chắc chắn." },
      { en: "Good question. Let me think for a second.", vi: "Câu hỏi hay. Cho tôi nghĩ một chút." },
    ],
  },
  {
    title: "Daily standup",
    hint: "3 câu, ngày nào cũng giống nhau.",
    items: [
      { en: "Yesterday I finished X.", vi: "Hôm qua tôi xong X." },
      { en: "Today I'm working on Y.", vi: "Hôm nay tôi làm Y." },
      { en: "I'm blocked on Z. / No blockers.", vi: "Tôi đang kẹt ở Z. / Không kẹt gì." },
    ],
  },
  {
    title: "Báo tin xấu sớm",
    hint: "Sếp thích nghe sớm hơn là giấu.",
    items: [
      { en: "Heads up: this is taking longer than I expected.", vi: "Báo trước: việc này lâu hơn tôi nghĩ." },
      { en: "I found a problem. Here are two options: A or B. Which one do you prefer?", vi: "Tôi thấy một vấn đề. Có 2 lựa chọn: A hoặc B. Bạn thích cái nào?" },
      { en: "I made a mistake on X. I fixed it by Y.", vi: "Tôi làm sai ở X. Tôi đã sửa bằng Y." },
    ],
  },
  {
    title: "Demo / báo xong",
    hint: "Nói kết quả, nói edge case.",
    items: [
      { en: "This is done. Here is a quick demo.", vi: "Xong rồi. Đây là demo nhanh." },
      { en: "I tested it on iOS and Android. One edge case: ...", vi: "Tôi test trên iOS và Android. Một trường hợp biên: ..." },
      { en: "Can you try it and tell me if this is what you expected?", vi: "Bạn thử rồi cho tôi biết có đúng ý không?" },
    ],
  },
  {
    title: "Small talk với khách nước ngoài",
    hint: "Hỏi ngắn, phản ứng ngắn.",
    items: [
      { en: "Nice to finally meet you in person. How was your flight?", vi: "Rất vui cuối cùng được gặp trực tiếp. Chuyến bay thế nào?" },
      { en: "Is this your first time in Vietnam?", vi: "Lần đầu bạn đến Việt Nam à?" },
      { en: "Have you tried Vietnamese coffee? You should try it.", vi: "Thử cà phê Việt Nam chưa? Nên thử." },
      { en: "Do you want to try some local food? I know a good place.", vi: "Muốn thử món địa phương không? Tôi biết chỗ ngon." },
      { en: "Oh, nice! / Really? / That's great. / I see.", vi: "Ồ, hay! / Thật à? / Tuyệt. / Tôi hiểu." },
    ],
  },
];
