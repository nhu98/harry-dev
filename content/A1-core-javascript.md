# 01 — JavaScript Fundamentals (Detailed)

> Tổng hợp & mở rộng từ repo [30-Days-Of-JavaScript — Asabeneh Yetayeh](https://github.com/Asabeneh/30-Days-Of-JavaScript).
> **Style:** tutorial — mỗi day có giải thích chi tiết, nhiều ví dụ progressive (basic → advanced), common pitfalls và exercises (Level 1/2/3).
> **Bilingual VI/EN** — code/thuật ngữ giữ tiếng Anh, giải thích tiếng Việt.

---

## Mục lục

- [Day 1 — Introduction & Setup](#day-1)
- [Day 2 — Data Types](#day-2)
- [Day 3 — Booleans, Operators, Date](#day-3)
- [Day 4 — Conditionals](#day-4)
- [Day 5 — Arrays](#day-5)
- [Day 6 — Loops](#day-6)
- [Day 7 — Functions](#day-7)
- [Day 8 — Objects](#day-8)
- [Day 9 — Higher Order Functions](#day-9)
- [Day 10 — Sets & Maps](#day-10)
- [Day 11 — Destructuring & Spreading](#day-11)
- [Day 12 — Regular Expressions](#day-12)
- [Day 13 — Console Object Methods](#day-13)
- [Day 14 — Error Handling](#day-14)
- [Day 15 — Classes](#day-15)
- [Day 16 — JSON](#day-16)
- [Day 17 — Web Storages](#day-17)
- [Day 18 — Promises & Async](#day-18)
- [Day 19 — Closures](#day-19)
- [Day 20 — Writing Clean Code](#day-20)
- [Day 21 — DOM](#day-21)
- [Day 22 — Manipulating DOM Object](#day-22)
- [Day 23 — Event Listeners](#day-23)
- [Day 24–30 — Mini Projects](#day-24-30)
- [Bonus — Advanced JavaScript](#advanced-js)

---

# Day 1 — Introduction & Setup
<a id="day-1"></a>

## 1.1. JavaScript là gì?

**JavaScript (JS)** là ngôn ngữ scripting cấp cao, dynamic, multi-paradigm — được Brendan Eich tạo ra trong 10 ngày năm 1995 cho Netscape. Hiện nay JS chạy ở:

- **Browser** (Chrome V8, Firefox SpiderMonkey, Safari JavaScriptCore, Edge V8)
- **Server** (Node.js, Deno, Bun — đều dựa trên V8 hoặc JavaScriptCore)
- **Mobile** (React Native, NativeScript)
- **Desktop** (Electron, Tauri)
- **IoT, embedded** (Espruino, Johnny-Five)
- **Database** (MongoDB shell, CouchDB)

**Đặc điểm cốt lõi:**
| Đặc điểm | Giải thích |
|---|---|
| Single-threaded | 1 main thread chạy code, không block — dùng event loop để handle async |
| Dynamic typing | Biến không cần khai báo type, type kiểm khi runtime |
| Prototype-based | Kế thừa qua chain prototype, không phải class (class chỉ là sugar) |
| Interpreted + JIT compiled | V8 thông qua TurboFan/Sparkplug compile bytecode → machine code |
| First-class functions | Function là value — gán biến, pass arg, return được |
| Garbage collected | Không cần `free()`, GC tự dọn (mark-and-sweep + generational) |

**JavaScript vs ECMAScript (ES):**
- **ECMAScript** là **chuẩn (specification)** do ECMA International maintain (TC39 committee)
- **JavaScript** là **implementation** của chuẩn đó (cộng thêm Browser/Node API)
- Phiên bản: ES5 (2009), ES6/ES2015 (cột mốc lớn), ES2016, ES2017... ES2024
- Mỗi năm 1 release nhỏ

## 1.2. Cài đặt môi trường

### Browser console (cách nhanh nhất)
1. Mở Chrome → bấm `F12` hoặc `Cmd+Opt+I` (Mac) / `Ctrl+Shift+I` (Win)
2. Vào tab **Console**
3. Gõ `console.log('Hello, World!')` → Enter

### Code editor — VS Code (recommended)
- Download tại [code.visualstudio.com](https://code.visualstudio.com)
- Extensions nên cài:
  - **Prettier** — formatter
  - **ESLint** — linter
  - **Live Server** — auto reload HTML khi save
  - **JavaScript (ES6) snippets**
  - **Path Intellisense**
  - **GitLens** — Git super-charged

### Node.js (chạy JS ngoài browser)
- Download LTS tại [nodejs.org](https://nodejs.org)
- Verify: `node -v` và `npm -v`
- Chạy file: `node script.js`
- REPL interactive: `node` rồi gõ JS

### Package manager
- **npm** (mặc định với Node)
- **pnpm** ⭐ — nhanh, disk-efficient (recommend 2025+)
- **yarn** — feature-rich
- **bun** — siêu nhanh, tích hợp test runner

## 1.3. Console.log — output đầu tiên

```js
console.log('Hello, World!')
console.log('JavaScript', 'is', 'fun')          // multi-args
console.log('Sum:', 1 + 2)                       // 'Sum:' 3
console.log(`Tên: ${'Harry'}, tuổi: ${28}`)      // template literal
```

**Multiple arguments:**
```js
const name = 'Harry'
const age = 28
const country = 'Vietnam'
console.log(name, age, country)   // Harry 28 Vietnam
```

**Format specifier (giống printf):**
```js
console.log('Tên: %s, tuổi: %d', 'Harry', 28)   // %s string, %d number
console.log('Object: %o', {a: 1})                // %o object expandable
console.log('%cBig red', 'color: red; font-size: 30px')  // CSS styling
```

## 1.4. Comments — chú thích

```js
// Single-line comment (chú thích 1 dòng)

/*
  Multi-line comment
  (chú thích nhiều dòng)
*/

/**
 * JSDoc comment — dùng để document function/class
 * @param {string} name - tên người dùng
 * @returns {string} lời chào
 */
function greet(name) { return `Hi ${name}` }
```

**When to comment:**
- ✅ Giải thích **WHY** (tại sao chọn cách này), business logic, workaround
- ❌ KHÔNG comment **WHAT** (code đã nói) → code rõ ràng > comment

## 1.5. Cách nhúng JavaScript vào HTML

**1. Inline (không khuyến nghị — khó maintain)**
```html
<button onclick="alert('Hi!')">Click</button>
```

**2. Internal (script trong `<head>` hoặc `<body>`)**
```html
<!DOCTYPE html>
<html>
<head>
  <script>
    console.log('Internal script')
  </script>
</head>
<body>...</body>
</html>
```

**3. External — RECOMMENDED**
```html
<script src="app.js"></script>
<script src="app.js" defer></script>      <!-- ✅ load song song, exec sau parse HTML -->
<script src="app.js" async></script>       <!-- exec ngay khi load xong, ko đảm bảo order -->
<script type="module" src="app.js"></script> <!-- defer mặc định + ESM imports -->
```

**Sự khác biệt `defer` vs `async`:**
```
defer:
  HTML ─────────────parse─────────────────|─exec script─|
  Script ────download song song──────────|

async:
  HTML ────parse────|pause|─parse tiếp─|pause|─parse─|
  Script ──download──|exec|             |exec|
```

→ `defer` cho script phụ thuộc DOM, `async` cho script độc lập (analytics).

## 1.6. Variables — biến

Đặt tên biến (camelCase chuẩn JS):
- Bắt đầu bằng chữ cái, `_`, hoặc `$`
- Không bắt đầu bằng số
- Không trùng reserved keywords (`class`, `function`, `for`, `return`...)
- Case-sensitive (`Name` ≠ `name`)

```js
// 3 cách khai báo
var firstName = 'Harry'         // function-scoped, hoisted (legacy)
let age = 28                     // block-scoped, có thể reassign
const country = 'Vietnam'        // block-scoped, KHÔNG reassign

// Nhiều biến cùng lúc
let a = 1, b = 2, c = 3
const PI = 3.14159, E = 2.71828

// Chưa gán → undefined
let x
console.log(x)   // undefined
```

> 💡 **Best practice 2025+:** ưu tiên `const`, dùng `let` khi cần đổi giá trị, **tránh `var`**.

## 1.7. Data Types — tổng quan

JavaScript có **7 primitive types** + **object types**:

```js
typeof 'hello'           // 'string'
typeof 42                // 'number'
typeof 3n                // 'bigint'
typeof true              // 'boolean'
typeof undefined         // 'undefined'
typeof null              // 'object'  ⚠️ bug lịch sử
typeof Symbol('id')      // 'symbol'
typeof {}                // 'object'
typeof []                // 'object'   → dùng Array.isArray()
typeof function(){}      // 'function' (technically object)
```

## 1.8. Exercises — Day 1

**Level 1:**
1. Mở Chrome console, log "30 Days of JavaScript"
2. Sử dụng console.log thực hiện `arithmetic` operations: `8/4`, `9*3`, `15%4`, `2**5`
3. Khai báo 3 biến `firstName`, `lastName`, `country` và log ra

**Level 2:**
4. Tạo file `intro.html` + `intro.js`, link với nhau, log gì đó
5. Sử dụng template literal in ra `Tôi là Harry, tôi 28 tuổi`

**Level 3:**
6. Tìm BMI (Body Mass Index) từ chiều cao + cân nặng (`bmi = weight / (height * height)`)
7. Print: "Tên: ..., Email: ..., Phone: ..." dùng template literal

---

# Day 2 — Data Types
<a id="day-2"></a>

## 2.1. Primitive Types (chi tiết)

### 2.1.1. Number
Số nguyên + số thực — JS không tách int/float, dùng IEEE 754 64-bit float cho tất cả.

```js
const integer = 42
const float = 3.14
const negative = -100
const exponential = 1e3        // 1000
const hex = 0xff               // 255
const binary = 0b1010          // 10
const octal = 0o17             // 15

// Số đặc biệt
Infinity
-Infinity
NaN                            // Not a Number (kết quả phép sai: 0/0, 'abc' * 2)

// Giới hạn
Number.MAX_SAFE_INTEGER        // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER
Number.MAX_VALUE
Number.EPSILON                 // ~2.22e-16, dùng so sánh float

// Kiểm tra
Number.isInteger(42)           // true
Number.isFinite(Infinity)      // false
Number.isNaN(NaN)              // true
```

**Math operations:**
```js
Math.PI                        // 3.14159...
Math.E
Math.abs(-5)                   // 5
Math.round(4.7)                // 5
Math.floor(4.9)                // 4
Math.ceil(4.1)                 // 5
Math.trunc(4.9)                // 4 (cắt phần thập phân)
Math.max(1, 5, 3)              // 5
Math.min(...arr)               // dùng spread
Math.pow(2, 10)                // 1024
2 ** 10                        // 1024 (modern)
Math.sqrt(16)                  // 4
Math.cbrt(27)                  // 3
Math.random()                  // 0 ≤ x < 1
Math.floor(Math.random() * 100) // 0-99 random integer

// Logarithm, trigonometry
Math.log(10); Math.log10(100); Math.log2(8)
Math.sin(Math.PI / 2)
```

**Floating point precision (CẢNH BÁO):**
```js
0.1 + 0.2 === 0.3              // false! ⚠️
0.1 + 0.2                       // 0.30000000000000004

// Workaround
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON   // true
(0.1 + 0.2).toFixed(2)          // '0.30' (string!)
+(0.1 + 0.2).toFixed(2)         // 0.3 (unary + → number)
```

### 2.1.2. String

```js
const single = 'Hello'
const double = "Hello"
const template = `Hello, ${name}!`   // template literal

// Multi-line
const multi = `Line 1
Line 2
Line 3`

// Escape
'It\'s a string'
"She said \"hi\""
'tab\there'                    // \t
'line\nbreak'                  // \n
```

**Common string methods:**
```js
const s = 'JavaScript'

s.length                       // 10
s[0]                           // 'J'
s.charAt(0)                    // 'J'
s.at(-1)                       // 't' (negative index, ES2022)

s.toUpperCase()                // 'JAVASCRIPT'
s.toLowerCase()                // 'javascript'

s.indexOf('a')                 // 1 (first occurrence)
s.lastIndexOf('a')             // 3
s.includes('Script')           // true
s.startsWith('Java')           // true
s.endsWith('Script')           // true

s.slice(0, 4)                  // 'Java' (end exclusive)
s.slice(-6)                    // 'Script'
s.substring(0, 4)              // 'Java'  (không nhận negative)

s.replace('a', 'A')            // 'JAvaScript' (first)
s.replaceAll('a', 'A')         // 'JAvAScript'
s.replace(/a/g, 'A')           // 'JAvAScript' (regex global)

s.split('')                    // ['J','a','v','a','S','c','r','i','p','t']
'a,b,c'.split(',')             // ['a','b','c']

'  hi  '.trim()                // 'hi'
'  hi  '.trimStart()           // 'hi  '
'  hi  '.trimEnd()             // '  hi'

'abc'.padStart(6, '0')         // '000abc'
'5'.padStart(2, '0')           // '05'
'abc'.repeat(3)                // 'abcabcabc'

'a' + 'b'                      // 'ab' (concat)
`${a} ${b}`                    // template (preferred)
['a', 'b', 'c'].join('-')      // 'a-b-c'
```

**String là immutable:**
```js
let s = 'hello'
s[0] = 'H'                     // ❌ không có effect
s = 'H' + s.slice(1)           // ✅ tạo string mới
```

### 2.1.3. Boolean
2 giá trị: `true`, `false`.

**Truthy & Falsy:**
| Falsy (8 giá trị) | Mọi thứ khác → Truthy |
|---|---|
| `false` | `'0'` (string không rỗng) |
| `0`, `-0`, `0n` | `'false'` (string) |
| `''` (empty string) | `[]` (empty array!) |
| `null` | `{}` (empty object!) |
| `undefined` | `function(){}` |
| `NaN` | `Infinity` |

```js
Boolean(0)                     // false
Boolean('')                    // false
Boolean([])                    // true ⚠️
Boolean({})                    // true ⚠️
Boolean('false')               // true ⚠️ (string không rỗng)

!!value                        // shortcut convert sang boolean
```

### 2.1.4. Undefined vs Null

```js
let x                          // undefined (chưa gán)
function fn() {}
fn()                           // undefined (không return)
const obj = {}
obj.missing                    // undefined (key không tồn tại)

const y = null                 // null (cố ý gán "không có")

typeof undefined               // 'undefined'
typeof null                    // 'object'  ⚠️ bug từ 1995

null == undefined              // true (loose)
null === undefined             // false (strict)

// Default value pattern
function greet(name) {
  name = name ?? 'Guest'       // nullish coalescing (null hoặc undefined)
}
```

### 2.1.5. BigInt

```js
const big = 9007199254740993n          // suffix `n`
const big2 = BigInt('9007199254740993')

big + 1n                                // OK
big + 1                                 // TypeError ⚠️ không trộn BigInt với Number
typeof big                              // 'bigint'
```

Use case: blockchain, cryptography, ID lớn (Twitter snowflake), tính chính xác tuyệt đối.

### 2.1.6. Symbol

```js
const id = Symbol('id')              // description chỉ để debug
const id2 = Symbol('id')
id === id2                            // false — mỗi Symbol unique

const user = {}
user[id] = 'private'                 // dùng làm key "không đụng độ"
```

Use case: thêm property "private", well-known symbols (`Symbol.iterator`).

## 2.2. Reference Types (Object, Array, Function)

```js
const obj = { name: 'Harry' }
const arr = [1, 2, 3]
const fn = () => 1

typeof obj                            // 'object'
typeof arr                            // 'object'
Array.isArray(arr)                    // true ✅ cách đúng check array
typeof fn                             // 'function'
```

**Primitive vs Reference (rất quan trọng):**
```js
// Primitive — copy by VALUE
let a = 5
let b = a
b = 10
console.log(a)                        // 5 (a không đổi)

// Reference — copy by REFERENCE
let obj1 = { x: 1 }
let obj2 = obj1                       // cùng trỏ vào 1 object
obj2.x = 99
console.log(obj1.x)                   // 99! (obj1 cũng "đổi")

// Để copy thật sự
let obj3 = { ...obj1 }                // shallow copy
let obj4 = structuredClone(obj1)      // deep copy (modern)
```

## 2.3. Type Conversion (ép kiểu)

### 2.3.1. To Number
```js
Number('5')                    // 5
Number('5.5')                  // 5.5
Number('5px')                  // NaN
Number('')                     // 0
Number(' ')                    // 0
Number(true)                   // 1
Number(false)                  // 0
Number(null)                   // 0
Number(undefined)              // NaN
Number([])                     // 0
Number([5])                    // 5
Number([1, 2])                 // NaN
Number({})                     // NaN

parseInt('5.9px')              // 5 (chỉ lấy phần int đầu)
parseInt('0xff', 16)           // 255 (radix 16)
parseInt('10', 2)              // 2 (binary)
parseFloat('5.9px')            // 5.9

+'5'                           // 5 (unary plus — shortcut)
+'5.5'                         // 5.5
+'abc'                         // NaN
+true                          // 1
+''                            // 0
```

### 2.3.2. To String
```js
String(123)                    // '123'
String(true)                   // 'true'
String(null)                   // 'null'
String(undefined)              // 'undefined'
String([1,2,3])                // '1,2,3'
String({a:1})                  // '[object Object]'

(123).toString()               // '123'
(123).toString(2)              // '1111011' (binary)
(255).toString(16)             // 'ff' (hex)

`${123}`                       // '123' (template literal)
123 + ''                       // '123' (concat trick)
```

### 2.3.3. To Boolean
```js
Boolean(0)                     // false (xem bảng falsy ở trên)
!!value                        // shortcut

if (str) {}                    // implicit convert
```

## 2.4. Exercises — Day 2

**Level 1:**
1. Declare biến cho từng data type: string, number, boolean, null, undefined
2. Check type của các biến đó bằng `typeof`
3. Compare `Number.MAX_SAFE_INTEGER` và `Number.MIN_SAFE_INTEGER`

**Level 2:**
4. Khai báo `firstName`, `lastName`, `country`, `age`, `isMarried` rồi convert tất cả sang string
5. Check: `0.1 + 0.2 === 0.3` rồi giải thích
6. Tạo biến chứa empty string, check truthy/falsy

**Level 3:**
7. Tính diện tích, chu vi hình tròn (`A = πr²`, `C = 2πr`) với `r = 10`
8. Convert string `'10'` thành number 3 cách khác nhau

---

# Day 3 — Booleans, Operators, Date
<a id="day-3"></a>

## 3.1. Comparison Operators

| Operator | Mô tả | Ví dụ |
|---|---|---|
| `==` | loose equal (coerce) | `1 == '1'` → true |
| `===` | strict equal | `1 === '1'` → false |
| `!=` | loose not equal | `1 != '1'` → false |
| `!==` | strict not equal | `1 !== '1'` → true |
| `>`, `<`, `>=`, `<=` | so sánh độ lớn | `5 > 3` → true |

```js
// Coercion quirks
1 == '1'                       // true
0 == ''                        // true
0 == false                     // true
null == undefined              // true (đặc biệt)
null == 0                      // false (!!)
'2' < '12'                     // false (so sánh string lexicographic)
2 < 12                         // true
NaN === NaN                    // false → dùng Number.isNaN()
```

> ✅ **Khuyên:** luôn dùng `===` / `!==` trừ khi cố ý check `null/undefined`.

## 3.2. Logical Operators

```js
// AND — trả về first falsy hoặc last value
true && 'a'                    // 'a'
'a' && 'b'                     // 'b'
0 && 'b'                       // 0

// OR — trả về first truthy hoặc last value
false || 'b'                   // 'b'
'a' || 'b'                     // 'a'
0 || ''                        // '' (cả 2 falsy → last)

// NOT
!true                          // false
!''                            // true (empty string falsy)
!!value                        // boolean convert

// Nullish coalescing (??) — ES2020
null ?? 'default'              // 'default'
undefined ?? 'default'         // 'default'
0 ?? 'default'                 // 0 (KHÁC ||, không bypass falsy)
'' ?? 'default'                // ''
false ?? 'default'             // false

// Short-circuit evaluation
isLogged && showProfile()       // chỉ chạy showProfile nếu isLogged
user ?? loadDefault()           // chỉ chạy nếu user null/undefined
```

## 3.3. Arithmetic Operators

```js
5 + 2                          // 7
5 - 2                          // 3
5 * 2                          // 10
5 / 2                          // 2.5
5 % 2                          // 1 (modulo)
5 ** 2                         // 25 (exponentiation)

// Unary
let x = 5
++x                            // pre-increment → 6, x = 6
x++                            // post-increment → 6, x = 7 (sau)
--x; x--                       // tương tự

-x                             // negate
+x                             // convert to number

// Assignment shortcuts
x += 2                         // x = x + 2
x -= 2; x *= 2; x /= 2; x %= 2; x **= 2
x ??= 5                        // x = x ?? 5 (chỉ assign nếu x null/undefined)
x ||= 5                        // chỉ nếu falsy
x &&= 5                        // chỉ nếu truthy
```

**String concat với `+`:**
```js
'a' + 'b'                      // 'ab'
'5' + 1                        // '51' (string concat)
1 + '5'                        // '15'
1 + 2 + '3'                    // '33' (trái sang phải)
'1' + 2 + 3                    // '123'
```

## 3.4. Ternary Operator

```js
const status = age >= 18 ? 'adult' : 'minor'

// Nested (cẩn thận readable)
const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'F'

// Modern: switch-true pattern hoặc lookup table thường rõ hơn
```

## 3.5. Date Object

```js
const now = new Date()                       // hiện tại
const d1 = new Date(2026, 4, 22)             // May 22, 2026 (tháng 0-indexed!)
const d2 = new Date('2026-05-22T10:30:00')
const d3 = new Date(1704067200000)           // timestamp ms

// Getters
now.getFullYear()                            // 2026
now.getMonth()                               // 4 (May, 0-indexed!)
now.getDate()                                // 22 (day of month)
now.getDay()                                 // 0-6 (Sun-Sat, 0-indexed)
now.getHours()
now.getMinutes()
now.getSeconds()
now.getMilliseconds()
now.getTime()                                // ms since epoch
now.getTimezoneOffset()                      // phút lệch UTC

// Setters
now.setFullYear(2027)
now.setMonth(11)                             // December

// Format
now.toISOString()                            // '2026-05-22T10:30:00.000Z'
now.toLocaleDateString('vi-VN')              // '22/5/2026'
now.toLocaleTimeString('vi-VN')              // '10:30:00'
now.toLocaleString('vi-VN', {
  dateStyle: 'full',
  timeStyle: 'short'
})                                            // 'Thứ Sáu, 22 tháng 5, 2026 lúc 10:30'

// Static
Date.now()                                   // ms epoch hiện tại
Date.parse('2026-05-22')                     // ms

// Tính khoảng cách
const diff = d2 - d1                         // ms
const days = diff / (1000 * 60 * 60 * 24)
```

**Limitation của native Date:**
- API rối, timezone handle khó
- Không có method format chuẩn

**Modern alternative:**
- **date-fns** (functional, tree-shake tốt) ⭐
- **dayjs** (~2KB, API giống moment)
- **Temporal API** (proposal ES — sắp native)
- ❌ Tránh **moment** (deprecated, ~290KB)

```js
import { format, addDays, differenceInDays } from 'date-fns'
format(new Date(), 'dd/MM/yyyy')             // '22/05/2026'
addDays(new Date(), 7)                       // 1 tuần sau
differenceInDays(d2, d1)
```

## 3.6. Exercises — Day 3

**Level 1:**
1. Khai báo `firstName`, `lastName`, `country`, `city`, `age`, `isMarried`, `year`, in ra type + length từng cái

**Level 2:**
2. So sánh các giá trị: `4 > 3`, `4 >= 3`, `'10' < 9`, `null == undefined`
3. Tạo `Date` hiện tại, in ra format: `month/day/year hour:minute`

**Level 3:**
4. Viết script tính số ngày bạn đã sống (từ ngày sinh đến hôm nay)
5. Đoán output rồi verify:
   ```js
   console.log(4 > 3 > 2)          // false ((4>3)=true=1, 1>2=false)
   console.log(4 >= 3 >= 2)        // false
   console.log('10' < 9)           // false (string '10' compare số 9 → '10' → 10 < 9 → false)
   console.log('a' > 'b')          // false (char code 97 < 98)
   ```

---

# Day 4 — Conditionals
<a id="day-4"></a>

## 4.1. if / else if / else

```js
const age = 28

if (age < 18) {
  console.log('Minor')
} else if (age < 60) {
  console.log('Adult')
} else {
  console.log('Senior')
}
```

**Guard clause pattern (early return — cleaner):**
```js
// ❌ deeply nested
function process(user) {
  if (user) {
    if (user.active) {
      if (user.role === 'admin') {
        doAdmin()
      }
    }
  }
}

// ✅ guard
function process(user) {
  if (!user) return
  if (!user.active) return
  if (user.role !== 'admin') return
  doAdmin()
}
```

## 4.2. switch / case

```js
const day = 'Monday'

switch (day) {
  case 'Monday':
  case 'Tuesday':
  case 'Wednesday':
  case 'Thursday':
  case 'Friday':
    console.log('Weekday')
    break
  case 'Saturday':
  case 'Sunday':
    console.log('Weekend')
    break
  default:
    console.log('Invalid')
}

// Switch với expression (true) — phổ biến
const grade = 85
switch (true) {
  case grade >= 90: console.log('A'); break
  case grade >= 80: console.log('B'); break
  case grade >= 70: console.log('C'); break
  default: console.log('F')
}
```

> ⚠️ **Nhớ `break`** — không có thì fall-through xuống case kế (đôi khi cố ý).
> 💡 **Modern alternative:** lookup object thường gọn hơn switch.
```js
const messages = {
  pending: 'Đang chờ',
  approved: 'Đã duyệt',
  rejected: 'Từ chối'
}
const msg = messages[status] ?? 'Unknown'
```

## 4.3. Ternary chain (cẩn thận)

```js
const label = a ? 'A' : b ? 'B' : c ? 'C' : 'None'
// Tương đương:
let label
if (a) label = 'A'
else if (b) label = 'B'
else if (c) label = 'C'
else label = 'None'
```

## 4.4. Logical assignment + short-circuit

```js
// Short-circuit thay if đơn giản
isAuth && redirect()
user || (user = createGuest())
config.timeout ??= 5000
```

## 4.5. Exercises — Day 4

**Level 1:**
1. Hỏi user nhập số (`prompt`), nếu chẵn in "chẵn", lẻ in "lẻ"
2. Nhập tuổi, in tương ứng: dưới 18 "minor", 18-59 "adult", 60+ "senior"

**Level 2:**
3. Viết chương trình tính điểm: 80+ "A", 70+ "B", 60+ "C", 50+ "D", dưới "F"
4. Nhập tháng (1-12), in mùa (Spring, Summer, Autumn, Winter)

**Level 3:**
5. Cho 3 số, tìm số lớn nhất (không dùng Math.max)
6. Năm nhuận: chia hết 4 nhưng KHÔNG chia hết 100, hoặc chia hết 400 → in "leap year"

---

# Day 5 — Arrays
<a id="day-5"></a>

## 5.1. Tạo array

```js
// Literal (preferred)
const empty = []
const nums = [1, 2, 3]
const mixed = [1, 'hello', true, null, [1,2], {a:1}]

// Constructor
const a1 = new Array(3)                    // [empty × 3]
const a2 = new Array(1, 2, 3)              // [1,2,3]
const a3 = Array.of(3)                     // [3] (KHÁC new Array(3))
const a4 = Array.from('abc')               // ['a','b','c']
const a5 = Array.from({length: 5}, (_, i) => i * 2)  // [0,2,4,6,8]
const a6 = new Array(3).fill(0)            // [0,0,0]
const a7 = [...'abc']                      // ['a','b','c'] (spread)
```

## 5.2. Truy cập & độ dài

```js
const arr = ['a', 'b', 'c', 'd']
arr[0]                                      // 'a'
arr[arr.length - 1]                         // 'd'
arr.at(-1)                                  // 'd' (ES2022, hỗ trợ negative)
arr.length                                  // 4

arr.length = 2                              // CHẶT array → ['a','b']
arr.length = 10                             // mở rộng (sparse)
```

## 5.3. Add / Remove (mutate)

```js
const arr = [1, 2, 3]

// Cuối array
arr.push(4)                                 // [1,2,3,4], return new length
arr.push(5, 6)                              // [1,2,3,4,5,6]
arr.pop()                                   // [1,2,3,4,5], return 6

// Đầu array
arr.unshift(0)                              // [0,1,2,3,4,5], return new length
arr.shift()                                 // [1,2,3,4,5], return 0

// Giữa array
arr.splice(2, 1)                            // xóa 1 phần tử từ index 2 → [1,2,4,5]
arr.splice(2, 0, 'x', 'y')                  // chèn không xóa → [1,2,'x','y',4,5]
arr.splice(2, 2, 'z')                       // thay 2 phần tử thành 'z'

// Reverse, sort
arr.reverse()
arr.sort()                                  // ⚠️ default: string compare
arr.sort((a, b) => a - b)                   // numeric ascending
arr.sort((a, b) => b - a)                   // descending
```

## 5.4. Non-mutating (immutable — ưa dùng trong React)

```js
const arr = [1, 2, 3, 4, 5]

arr.slice(1, 3)                             // [2,3] (end exclusive, không mutate)
arr.concat([6, 7])                          // [1,2,3,4,5,6,7]
[...arr, 6, 7]                              // tương tự với spread
[0, ...arr]                                 // prepend

// ES2023 — immutable versions
arr.toSorted((a, b) => a - b)
arr.toReversed()
arr.toSpliced(1, 2, 'x')
arr.with(0, 99)                             // [99,2,3,4,5]
```

## 5.5. Tìm kiếm

```js
const arr = [10, 20, 30, 20, 10]

arr.indexOf(20)                             // 1 (first)
arr.lastIndexOf(20)                         // 3
arr.includes(30)                            // true
arr.indexOf(99)                             // -1 (không có)

arr.find(x => x > 15)                       // 20 (first match)
arr.findIndex(x => x > 15)                  // 1
arr.findLast(x => x > 15)                   // 20 (ES2023)
arr.findLastIndex(x => x > 15)              // 3

arr.some(x => x > 25)                       // true (có ít nhất 1)
arr.every(x => x > 5)                       // true (tất cả thoả)
```

## 5.6. Iteration & Transform

```js
const nums = [1, 2, 3, 4, 5]

// forEach — không return, không break được
nums.forEach((x, i) => console.log(i, x))

// map — transform, return array mới
nums.map(x => x * 2)                        // [2,4,6,8,10]
['a','b','c'].map((c, i) => `${i}:${c}`)    // ['0:a','1:b','2:c']

// filter — chọn lọc
nums.filter(x => x % 2 === 0)               // [2,4]

// reduce — gộp
nums.reduce((sum, x) => sum + x, 0)         // 15
nums.reduce((max, x) => x > max ? x : max, -Infinity)  // 5

// reduceRight — phải qua trái
nums.reduceRight((acc, x) => acc.concat(x), [])  // [5,4,3,2,1]

// flat — phẳng hoá
[1, [2, [3, [4]]]].flat()                   // [1, 2, [3, [4]]] (depth 1)
[1, [2, [3, [4]]]].flat(Infinity)           // [1,2,3,4]

// flatMap = map + flat(1)
[[1,2], [3,4]].flatMap(x => x)              // [1,2,3,4]
['hello world'].flatMap(s => s.split(' ')) // ['hello','world']
```

## 5.7. Method chaining (functional pipeline)

```js
const users = [
  { name: 'Harry', age: 28, active: true },
  { name: 'Anna',  age: 30, active: false },
  { name: 'Bob',   age: 22, active: true }
]

const activeNames = users
  .filter(u => u.active)
  .map(u => u.name.toUpperCase())
  .sort()
// ['BOB', 'HARRY']

const totalAge = users
  .filter(u => u.active)
  .reduce((sum, u) => sum + u.age, 0)
// 50
```

## 5.8. Spread & Rest

```js
// Spread (rải)
const a = [1, 2, 3]
const b = [...a, 4, 5]                      // [1,2,3,4,5]
const c = [...a, ...b]                      // concat
Math.max(...a)                              // 3

// Rest (gom)
const [first, ...rest] = [1, 2, 3, 4]       // first=1, rest=[2,3,4]
function sum(...nums) {                     // nhận unlimited args
  return nums.reduce((s, n) => s + n, 0)
}
sum(1, 2, 3, 4)                             // 10
```

## 5.9. Destructuring (sneak peek — Day 11)

```js
const [a, b, c] = [1, 2, 3]
const [x, , z] = [1, 2, 3]                  // skip middle
const [head, ...tail] = [1, 2, 3, 4]
const [m = 10] = []                         // default
```

## 5.10. Common patterns thực tế

```js
// 1. Unique
const unique = [...new Set([1, 2, 2, 3])]   // [1,2,3]

// 2. Group by
const grouped = users.reduce((acc, u) => {
  (acc[u.age] ??= []).push(u)
  return acc
}, {})

// ES2024
const grouped2 = Object.groupBy(users, u => u.age)

// 3. Sum / avg
const sum = arr.reduce((s, x) => s + x, 0)
const avg = sum / arr.length

// 4. Min / max
Math.max(...arr)
Math.min(...arr)

// 5. Count occurrences
const counts = arr.reduce((c, x) => { c[x] = (c[x] || 0) + 1; return c }, {})

// 6. Range
Array.from({length: 5}, (_, i) => i)        // [0,1,2,3,4]

// 7. Shuffle (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 8. Chunk array
function chunk(arr, size) {
  return Array.from({length: Math.ceil(arr.length / size)},
    (_, i) => arr.slice(i * size, i * size + size))
}
chunk([1,2,3,4,5,6,7], 3)                  // [[1,2,3],[4,5,6],[7]]
```

## 5.11. Exercises — Day 5

**Level 1:**
1. Khai báo array `webTechs = ['HTML', 'CSS', 'JS', 'React', 'Redux', 'Node', 'MongoDB']`
2. In `length`, `first`, `last`, `middle` element
3. Loop in từng cái
4. Sort theo alphabet

**Level 2:**
5. Có `['Facebook', 'Google', 'Microsoft', 'Apple', 'IBM', 'Oracle', 'Amazon']`. Sort, reverse, slice top 3
6. Tạo `countries = []` thêm 5 nước bằng `push`, xoá nước đầu, sort
7. Copy `webTechs` sang `copyTechs` mà không mutate gốc

**Level 3:**
8. Cho `ages = [19, 22, 19, 24, 20, 25, 26, 24, 25, 24]`:
   - Sort, tìm min, max
   - Median
   - Average
   - Range (max - min)
9. Slice 10 country đầu tiên từ array `countries`, slice country ở giữa
10. Chia array thành 2 nửa đều nhau

---

# Day 6 — Loops
<a id="day-6"></a>

## 6.1. for loop (classic)

```js
for (let i = 0; i < 5; i++) {
  console.log(i)
}

// Reverse
for (let i = arr.length - 1; i >= 0; i--) {}

// Step 2
for (let i = 0; i < 10; i += 2) {}

// Multiple variables
for (let i = 0, j = 10; i < j; i++, j--) {}
```

## 6.2. while / do-while

```js
let i = 0
while (i < 5) {
  console.log(i)
  i++
}

// do-while — chạy ít nhất 1 lần
let n
do {
  n = Math.floor(Math.random() * 10)
} while (n !== 5)
```

## 6.3. for...of (values — preferred cho array/iterable)

```js
const arr = [10, 20, 30]
for (const v of arr) console.log(v)

for (const c of 'abc') console.log(c)

const s = new Set([1, 2, 3])
for (const v of s) {}

const m = new Map([['a', 1], ['b', 2]])
for (const [k, v] of m) {}

// Lấy cả index
for (const [i, v] of arr.entries()) {
  console.log(i, v)
}
```

## 6.4. for...in (keys — cho object)

```js
const obj = { a: 1, b: 2, c: 3 }
for (const key in obj) {
  console.log(key, obj[key])
}

// ⚠️ KHÔNG dùng cho array (duyệt cả inherited prop)
const arr = [10, 20, 30]
Array.prototype.foo = 'inherited'
for (const i in arr) console.log(i)    // '0','1','2','foo' ⚠️

// ✅ Dùng for...of hoặc forEach cho array
```

## 6.5. forEach (không break được)

```js
arr.forEach((value, index, array) => {
  console.log(index, value)
})

// Không thể `break` hoặc `return` để dừng
// → muốn dừng, dùng for / for...of / some / every
```

## 6.6. break, continue, label

```js
for (let i = 0; i < 10; i++) {
  if (i === 5) break              // dừng hẳn
  if (i % 2 === 0) continue       // skip iteration này
  console.log(i)                  // 1, 3
}

// Labeled — break/continue nested loop
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer
  }
}
```

## 6.7. Iterators & Generators (advanced)

```js
// Iterator protocol
const arr = [1, 2, 3]
const iter = arr[Symbol.iterator]()
iter.next()                     // {value: 1, done: false}
iter.next()                     // {value: 2, done: false}
iter.next()                     // {value: 3, done: false}
iter.next()                     // {value: undefined, done: true}

// Generator function (function*)
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) yield i
}
for (const n of range(0, 10, 2)) console.log(n)   // 0,2,4,6,8
[...range(0, 5)]                // [0,1,2,3,4]
```

## 6.8. Exercises — Day 6

**Level 1:**
1. Viết for loop in từ 0 đến 10
2. Viết for loop in từ 10 về 0
3. Viết while in từ 0 đến 10
4. Sử dụng loop in tam giác sao (`*`):
   ```
   *
   **
   ***
   ****
   ```

**Level 2:**
5. In bảng cửu chương 2 (`2x1=2 ... 2x10=20`)
6. Tính tổng số chẵn từ 0-100, tổng số lẻ
7. Đếm số nguyên tố trong 0-100

**Level 3:**
8. FizzBuzz: 1-100, chia hết 3 in 'Fizz', 5 in 'Buzz', cả hai 'FizzBuzz'
9. Đảo ngược string không dùng `.reverse()`
10. Đếm tần suất ký tự trong string

---

# Day 7 — Functions
<a id="day-7"></a>

## 7.1. Function Declaration vs Expression vs Arrow

```js
// 1. Function Declaration (hoisted hoàn toàn)
function add(a, b) { return a + b }
add(1, 2)                       // 3 — gọi trước khai báo cũng OK

// 2. Function Expression (chỉ tên biến hoisted)
const sub = function(a, b) { return a - b }
// sub(1,2) trước dòng trên → ReferenceError

// Named function expression (useful cho debugger)
const fact = function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1)
}

// 3. Arrow Function (ES6+)
const mul = (a, b) => a * b
const square = x => x * x          // 1 param có thể bỏ ()
const noArg = () => 'hello'
const multiline = (a, b) => {
  const result = a + b
  return result                    // bắt buộc return tường minh
}
const returnObj = () => ({ a: 1 }) // wrap object trong ()
```

## 7.2. So sánh Regular vs Arrow

| | Regular function | Arrow function |
|---|---|---|
| `this` | Runtime binding (caller) | Lexical (kế thừa scope cha) |
| `arguments` | Có | Không (dùng `...rest`) |
| `new` (constructor) | Được | Không |
| Hoisting | Declaration hoisted | Không |
| Prototype | Có `.prototype` | Không |
| Method shorthand object | `{ fn() {} }` | `{ fn: () => {} }` |
| Generator | `function*` được | Không |

```js
const obj = {
  name: 'Harry',
  regular() { return this.name },              // 'Harry'
  arrow: () => this.name                        // undefined (this = window/global)
}

// `this` trong callback
class Counter {
  constructor() { this.count = 0 }
  startRegular() {
    setInterval(function() {
      this.count++                              // ❌ this = window
    }, 1000)
  }
  startArrow() {
    setInterval(() => {
      this.count++                              // ✅ this = instance (lexical)
    }, 1000)
  }
}
```

## 7.3. Parameters

### Default parameters
```js
function greet(name = 'Guest', greeting = 'Hi') {
  return `${greeting}, ${name}!`
}
greet()                          // 'Hi, Guest!'
greet('Harry')                   // 'Hi, Harry!'
greet(undefined, 'Hello')        // 'Hello, Guest!'
```

### Rest parameters
```js
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0)
}
sum(1, 2, 3, 4)                  // 10

// Combine với normal params
function send(method, url, ...headers) {
  console.log(headers)            // array
}
```

### `arguments` object (legacy, chỉ regular function)
```js
function legacy() {
  console.log(arguments)          // array-like (không phải array thật)
  console.log(arguments.length)
  const arr = [...arguments]      // convert sang array
}
// ❌ Không hoạt động trong arrow
```

## 7.4. Return value

```js
function add(a, b) { return a + b }
function noReturn() {}            // implicit return undefined
function multiReturn() {
  return [1, 2, 3]                // return array → destructure
}
const [a, b, c] = multiReturn()
```

## 7.5. Function là First-Class Citizens

JS xem function là value như mọi value khác:

```js
// 1. Gán biến
const f = function() {}

// 2. Truyền làm argument (callback)
[1,2,3].map(x => x * 2)

// 3. Return từ function (HOF)
function multiplier(n) {
  return x => x * n
}
const double = multiplier(2)
double(5)                         // 10

// 4. Lưu trong array, object
const handlers = {
  onClick: () => console.log('click'),
  onHover: () => console.log('hover')
}
```

## 7.6. IIFE (Immediately Invoked Function Expression)

```js
(function() {
  // Private scope — biến không leak ra ngoài
  const secret = 42
  console.log('IIFE')
})()

(() => {
  // Arrow IIFE
})()

// Async IIFE — top-level await thay thế ngày nay
;(async () => {
  const data = await fetch(url)
})()
```

## 7.7. Pure vs Impure Function

```js
// PURE — cùng input → cùng output, không side effect
const add = (a, b) => a + b

// IMPURE — phụ thuộc external, có side effect
let counter = 0
const incImpure = () => ++counter             // mutate external
const logImpure = (x) => { console.log(x); return x }   // side effect

// ✅ Lợi của pure: dễ test, dễ memoize, dễ parallelize
```

## 7.8. Recursion (đệ quy)

```js
// Factorial
function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

// Fibonacci (naive)
function fib(n) {
  if (n < 2) return n
  return fib(n - 1) + fib(n - 2)
}

// Sum array
function sumArr(arr) {
  if (arr.length === 0) return 0
  return arr[0] + sumArr(arr.slice(1))
}

// Flatten nested
function flatten(arr) {
  return arr.reduce((acc, x) =>
    Array.isArray(x) ? acc.concat(flatten(x)) : [...acc, x], [])
}
```

⚠️ Cẩn thận **stack overflow** với recursion sâu. JS không tối ưu tail-call (trừ Safari). Cho dài, dùng iteration.

## 7.9. Exercises — Day 7

**Level 1:**
1. Khai báo function `displayName` nhận 2 args và return tên đầy đủ
2. Function `addNumbers(a, b)`
3. Function `areaOfCircle(r)` return diện tích
4. Function `sumOfNumbers(n)` tính tổng 1+2+...+n
5. Function `sumOfOdds(n)` tổng số lẻ ≤ n

**Level 2:**
6. Function `userIdGenerator()` return ID random 7 ký tự
7. Function `reverseArray(arr)` — không dùng `.reverse()`
8. Function `capitalizeArray(arr)` — capitalize từng string trong array
9. Function `addItem(arr, item)` immutable

**Level 3:**
10. Function `factorial(n)` (đệ quy)
11. Function `isPrime(n)`
12. Function `sumOfArray(arr)`, `averageOfArray(arr)`
13. Function `evensAndOdds(n)` — đếm số chẵn lẻ từ 0-n
14. Function `sum(...nums)` (rest params)

---

# Day 8 — Objects
<a id="day-8"></a>

## 8.1. Tạo object

```js
// Object literal (preferred)
const user = {
  firstName: 'Harry',
  lastName: 'Huynh',
  age: 28,
  isMarried: false,
  skills: ['JS', 'React', 'RN'],
  address: {
    city: 'Saigon',
    country: 'Vietnam'
  }
}

// Empty
const empty = {}
const empty2 = new Object()
const empty3 = Object.create(null)             // không có prototype
```

## 8.2. Truy cập property

```js
// Dot notation
user.firstName

// Bracket notation (dùng khi key có ký tự đặc biệt hoặc dynamic)
user['firstName']
const key = 'age'
user[key]                                       // 28
user['first name']                              // nếu key có space
```

## 8.3. Thêm / Sửa / Xoá

```js
user.email = 'h@x.com'                          // thêm
user.age = 29                                    // sửa
delete user.isMarried                            // xoá
'email' in user                                  // true (kiểm tra key tồn tại)
user.hasOwnProperty('email')                     // true
Object.hasOwn(user, 'email')                     // true (ES2022 — preferred)
```

## 8.4. Method (function trong object)

```js
const user = {
  firstName: 'Harry',
  lastName: 'Huynh',

  // Shorthand method (ES6)
  fullName() {
    return `${this.firstName} ${this.lastName}`
  },

  // Traditional
  greet: function() {
    return `Hi, I'm ${this.firstName}`
  },

  // ❌ Arrow — `this` không phải obj
  greetArrow: () => `Hi, ${this.firstName}`   // undefined
}

user.fullName()                                 // 'Harry Huynh'
```

## 8.5. Computed property (dynamic key)

```js
const key = 'dynamicKey'
const obj = {
  [key]: 'value',
  [`prefix_${key}`]: 'value2',
  [Symbol('id')]: 'unique'
}
```

## 8.6. Shorthand & Spread

```js
// Property shorthand (key trùng tên biến)
const name = 'Harry'
const age = 28
const user = { name, age }                      // { name: 'Harry', age: 28 }

// Spread (shallow merge)
const updated = { ...user, age: 29 }            // override age
const merged = { ...defaultConfig, ...userConfig }  // userConfig override

// Rest
const { name: n, ...rest } = user
// n = 'Harry', rest = { age: 28 }
```

## 8.7. Object methods

```js
Object.keys(user)                               // ['name','age']
Object.values(user)                             // ['Harry', 28]
Object.entries(user)                            // [['name','Harry'], ['age',28]]
Object.fromEntries([['a',1],['b',2]])           // {a:1, b:2}

Object.assign({}, obj1, obj2)                   // merge → new object
Object.freeze(obj)                              // immutable shallow
Object.isFrozen(obj)
Object.seal(obj)                                // không add/delete key
Object.create(proto)                            // tạo object với prototype

Object.getPrototypeOf(obj)
Object.setPrototypeOf(obj, newProto)            // ⚠️ slow, tránh

// Iterate
for (const [k, v] of Object.entries(user)) {
  console.log(k, v)
}
```

## 8.8. Copy & Clone

```js
const original = { a: 1, b: { c: 2 } }

// Shallow copy
const shallow1 = { ...original }
const shallow2 = Object.assign({}, original)

shallow1.a = 99                                 // ✅ không ảnh hưởng original
shallow1.b.c = 99                               // ⚠️ ảnh hưởng original.b.c (cùng reference)

// Deep copy
const deep1 = structuredClone(original)         // ✅ modern, supported widely
const deep2 = JSON.parse(JSON.stringify(original))  // ⚠️ mất function, Date → string, undefined

// Library: lodash _.cloneDeep, immer produce
```

## 8.9. Optional chaining & Nullish coalescing

```js
const user = { profile: { name: 'Harry' } }

user.profile?.name                              // 'Harry'
user.address?.city                              // undefined (no error)
user.address?.city ?? 'N/A'                     // 'N/A'

// Array
arr?.[0]
fn?.()
```

## 8.10. Common patterns

```js
// 1. Default values
const config = { ...defaults, ...userInput }

// 2. Merge nested (KHÔNG dùng spread, cần deep merge lib)
import { merge } from 'lodash'
merge({}, obj1, obj2)

// 3. Pick / Omit
const { name, age } = user                      // pick
const { password, ...safe } = user              // omit password

// 4. Transform values
const upper = Object.fromEntries(
  Object.entries(user).map(([k, v]) => [k, String(v).toUpperCase()])
)

// 5. Group by
const grouped = Object.groupBy(users, u => u.role)  // ES2024

// 6. Check empty
Object.keys(obj).length === 0
```

## 8.11. Exercises — Day 8

**Level 1:**
1. Tạo object `dog` rỗng. Thêm property `name`, `legs`, `color`, `age`, `bark` (method bark return "woof woof")
2. Tạo `student` object với: `firstName`, `lastName`, `age`, `country`, `city`, `skills`, `getFullName` method
3. Có `users` object (xem repo), tìm user có >= 50 points

**Level 2:**
4. Tìm user có nhiều skill nhất
5. MongoDB - count online users, count logged in user, sort theo points
6. Tạo function `signUp(username, password)` — check trùng

**Level 3:**
7. Object `personAccount` với deposit & withdraw method (closure-like)
8. Tạo function `cleanText(text)` — bỏ %, $, #, ! từ text rồi return clean version
9. Function `mostFrequentWord(text)` từ paragraph

---

# Day 9 — Higher Order Functions
<a id="day-9"></a>

## 9.1. Khái niệm HOF

**HOF (Higher Order Function)** là function thoả 1 trong 2:
1. **Nhận** function làm tham số
2. **Trả về** function

```js
// 1. Nhận function
function callTwice(fn) {
  fn()
  fn()
}
callTwice(() => console.log('Hi'))

// 2. Return function (closure)
function multiplier(n) {
  return x => x * n
}
const double = multiplier(2)
const triple = multiplier(3)
double(5)                            // 10
triple(5)                            // 15
```

→ Nền tảng của **functional programming** trong JS.

## 9.2. Built-in HOF cho Array

### map — transform
```js
[1, 2, 3].map(x => x * 2)                      // [2,4,6]
[1, 2, 3].map((x, i) => `${i}: ${x}`)          // ['0: 1', '1: 2', '2: 3']

users.map(u => ({ id: u.id, name: u.name }))   // pick fields
strings.map(s => s.trim().toLowerCase())
```

### filter — chọn lọc
```js
[1, 2, 3, 4].filter(x => x % 2 === 0)          // [2,4]
users.filter(u => u.age >= 18)
strings.filter(Boolean)                         // bỏ falsy (empty, null)
arr.filter((x, i, self) => self.indexOf(x) === i)  // dedupe (chậm, dùng Set)
```

### reduce — gộp
```js
// Sum
[1,2,3,4].reduce((sum, x) => sum + x, 0)       // 10

// Max
[3, 1, 4, 1, 5].reduce((max, x) => x > max ? x : max)  // không init → arr[0]

// Count
[1,1,2,2,2,3].reduce((c, x) => { c[x] = (c[x] || 0) + 1; return c }, {})
// {1:2, 2:3, 3:1}

// Group by
users.reduce((g, u) => {
  (g[u.role] ??= []).push(u)
  return g
}, {})

// Flatten
[[1,2],[3,4]].reduce((acc, arr) => acc.concat(arr), [])
```

### forEach — side effect, no return
```js
arr.forEach(x => console.log(x))
arr.forEach((x, i, self) => { /* */ })
// ⚠️ không break được — dùng for/of nếu cần
```

### some / every
```js
[1, 2, 3].some(x => x > 2)             // true
[1, 2, 3].every(x => x > 0)            // true
```

### find / findIndex
```js
users.find(u => u.id === 5)
users.findIndex(u => u.role === 'admin')
```

### sort (mutate!)
```js
const nums = [3, 1, 4, 1, 5]
nums.sort()                            // ⚠️ default lexicographic
nums.sort((a, b) => a - b)             // ascending
nums.sort((a, b) => b - a)             // descending

users.sort((a, b) => a.age - b.age)
strings.sort((a, b) => a.localeCompare(b))  // i18n-safe

// Immutable
const sorted = [...arr].sort()
const sorted2 = arr.toSorted()         // ES2023
```

### flatMap
```js
[[1,2], [3], [4,5]].flatMap(x => x)             // [1,2,3,4,5]
['hello world', 'foo bar'].flatMap(s => s.split(' '))
// ['hello','world','foo','bar']
```

## 9.3. Method chaining (functional pipeline)

```js
const result = users
  .filter(u => u.active)
  .map(u => ({ name: u.name, score: u.points }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
```

→ Đọc trên xuống dưới như câu chuyện. Mỗi bước rõ ràng.

## 9.4. Function Composition

```js
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)

const addOne = x => x + 1
const double = x => x * 2
const square = x => x * x

const fn = pipe(addOne, double, square)
fn(3)                                  // ((3+1)*2)^2 = 64
```

## 9.5. Currying

```js
// Function chỉ nhận 1 arg, return function nhận arg tiếp
const add = a => b => c => a + b + c
add(1)(2)(3)                           // 6

// Partial application
const addTax = rate => price => price * (1 + rate)
const vn = addTax(0.1)
vn(100)                                // 110
vn(200)                                // 220
```

## 9.6. Callback patterns

```js
// Event listener
btn.addEventListener('click', e => {})

// setTimeout
setTimeout(() => console.log('hi'), 1000)

// Async with callback (Node-style, legacy)
fs.readFile('file', (err, data) => {})

// Promise (modern thay callback)
fetch(url).then(r => r.json())
```

## 9.7. Exercises — Day 9

**Level 1:**
1. Có `countries` array, dùng `forEach` in từng cái
2. Dùng `map` capitalize từng country
3. Dùng `filter` lấy nước chứa 'land' trong tên
4. Dùng `reduce` đếm tổng số ký tự của tất cả country

**Level 2:**
5. Tìm country dài nhất tên
6. Sort `numbers = [-5, -2, 1, 0, 3, -1]` theo absolute value
7. Map products thành tên + giá có thuế

**Level 3:**
8. Function `categorize(scores)` chia thành A, B, C, F
9. Pipeline: filter active users → sort by points desc → take top 5 → map to {name, rank}
10. Tự viết `myMap`, `myFilter`, `myReduce`

---

# Day 10 — Sets & Maps
<a id="day-10"></a>

## 10.1. Set — collection of unique values

```js
const s = new Set()
s.add(1); s.add(2); s.add(2); s.add(3)
s                                       // Set(3) {1, 2, 3}
s.size                                   // 3
s.has(2)                                 // true
s.delete(2)
s.clear()

// From iterable
const fromArr = new Set([1, 2, 2, 3])
const fromStr = new Set('hello')         // Set {'h','e','l','o'}

// Iterate
for (const v of s) {}
s.forEach(v => {})

// Convert
const arr = [...s]
const arr2 = Array.from(s)

// Set operations (manual hoặc ES2025 methods)
const a = new Set([1, 2, 3])
const b = new Set([2, 3, 4])

const union = new Set([...a, ...b])                 // {1,2,3,4}
const intersect = new Set([...a].filter(x => b.has(x)))  // {2,3}
const diff = new Set([...a].filter(x => !b.has(x)))      // {1}

// ES2025+ Set methods
a.union(b)
a.intersection(b)
a.difference(b)
a.symmetricDifference(b)
a.isSubsetOf(b)
a.isSupersetOf(b)
a.isDisjointFrom(b)
```

**Use case:**
- Dedupe array: `[...new Set(arr)]`
- Check existence O(1) thay vì `arr.includes()` O(n)
- Tags, categories không trùng

## 10.2. Map — key-value với key bất kỳ

```js
const m = new Map()
m.set('a', 1)
m.set(42, 'number key')
m.set({}, 'object key')                 // unique reference
m.set(true, 'bool key')

m.get('a')                              // 1
m.has('a')                              // true
m.delete('a')
m.size
m.clear()

// From entries
const m2 = new Map([['a', 1], ['b', 2]])
const m3 = new Map(Object.entries(obj))

// Iterate (insertion order!)
for (const [k, v] of m) {}
for (const k of m.keys()) {}
for (const v of m.values()) {}
m.forEach((v, k) => {})

// To array / object
[...m]                                  // [['a',1],['b',2]]
[...m.keys()]
Object.fromEntries(m)                   // {a:1, b:2}
```

## 10.3. Map vs Object

| | Map | Object |
|---|---|---|
| Key type | bất kỳ | string, symbol |
| Default key | không có | có (`__proto__`...) |
| Iteration | insertion order, iterable | `for...in` cẩn thận inherited |
| Size | `.size` O(1) | `Object.keys(o).length` O(n) |
| Perf (frequent add/remove) | tốt hơn | ổn |
| JSON support | không trực tiếp | có |
| Use case | dynamic data, cache | structured data, JSON |

**Khi nào Map:**
- Key không phải string (object, function)
- Cần add/remove nhiều
- Cần iterate theo order chèn
- Cần `.size` thường xuyên

**Khi nào Object:**
- Structured data có schema
- Tương tác JSON
- `key` luôn là string biết trước

## 10.4. WeakSet & WeakMap

```js
// WeakMap — key MUST be object, không prevent GC
const cache = new WeakMap()
let user = { id: 1 }
cache.set(user, 'metadata')
user = null                             // → entry tự bị GC

// WeakSet — chỉ chứa object, không enumerate
const visited = new WeakSet()
visited.add(node)
```

**Use case:**
- Cache metadata gắn với object — không leak memory
- Đánh dấu object đã xử lý
- Private data trong class (trước khi có `#private` field)

## 10.5. Exercises — Day 10

**Level 1:**
1. Tạo `Set` chứa số 1-10
2. Tạo `Map` chứa thông tin country (name → capital)
3. Dedupe array dùng Set

**Level 2:**
4. Tìm union, intersection, difference của 2 Set
5. Có array of objects, tạo Map indexed by id

**Level 3:**
6. Implement LRU cache bằng Map (insertion order Map ⭐)
7. Đếm tần suất ký tự bằng Map

---

# Day 11 — Destructuring & Spreading
<a id="day-11"></a>

## 11.1. Array Destructuring

```js
const arr = [1, 2, 3, 4, 5]

const [a, b] = arr                              // a=1, b=2
const [, , c] = arr                             // skip 2 đầu → c=3
const [first, ...rest] = arr                    // first=1, rest=[2,3,4,5]
const [x = 10, y = 20] = [1]                    // x=1, y=20 (default)

// Swap
let p = 1, q = 2
;[p, q] = [q, p]                                // p=2, q=1

// Return multiple values
function minMax(arr) {
  return [Math.min(...arr), Math.max(...arr)]
}
const [min, max] = minMax([1, 5, 3])

// Nested
const [[a1, a2], [b1, b2]] = [[1, 2], [3, 4]]
```

## 11.2. Object Destructuring

```js
const user = {
  firstName: 'Harry',
  lastName: 'Huynh',
  age: 28,
  address: { city: 'Saigon', country: 'VN' }
}

const { firstName, age } = user

// Rename
const { firstName: name } = user                // name = 'Harry'

// Default
const { email = 'no email' } = user

// Combine
const { firstName: name2, email: mail = 'n/a' } = user

// Nested
const { address: { city, country } } = user

// Rest
const { firstName: f, ...others } = user
// f = 'Harry', others = { lastName, age, address }

// Dynamic key
const key = 'firstName'
const { [key]: value } = user
```

## 11.3. Function Parameters

```js
// Object param với default
function createUser({ name = 'Guest', age = 0, role = 'user' } = {}) {
  return { name, age, role }
}
createUser({ name: 'Harry', age: 28 })

// Array param
function pair([a, b]) { return a + b }
pair([1, 2])                                    // 3

// API client pattern
async function api({ url, method = 'GET', headers = {}, body }) {
  // ...
}
api({ url: '/users', method: 'POST', body: data })
```

## 11.4. Spread Operator (rải)

```js
// Array
const a = [1, 2, 3]
const b = [...a, 4, 5]                          // [1,2,3,4,5]
const c = [...a, ...b]                          // concat
Math.max(...a)                                  // pass array → args

// Object
const u1 = { name: 'Harry' }
const u2 = { ...u1, age: 28 }                   // { name, age }
const merged = { ...defaults, ...userInput }    // user override

// String → array
const chars = [...'hello']                      // ['h','e','l','l','o']

// Iterable
const set = new Set([1, 2, 3])
[...set]                                         // [1,2,3]
```

## 11.5. Rest Operator (gom)

```js
// Function params
function sum(...nums) {
  return nums.reduce((s, n) => s + n, 0)
}
sum(1, 2, 3, 4)                                 // 10

// Destructuring
const [first, ...rest] = [1, 2, 3, 4]
const { a, ...others } = { a:1, b:2, c:3 }
```

## 11.6. Common patterns

```js
// 1. Copy (shallow)
const arrCopy = [...arr]
const objCopy = { ...obj }

// 2. Merge
const merged = { ...obj1, ...obj2 }             // shallow
import { merge } from 'lodash'
const deepMerged = merge({}, obj1, obj2)        // deep

// 3. Convert NodeList / arguments → array
[...document.querySelectorAll('div')]
function fn() { const args = [...arguments] }

// 4. Conditional spread (rất hữu ích trong React props)
const props = {
  ...(isActive && { className: 'active' }),
  ...(disabled && { disabled: true })
}

// 5. Remove key
const { unwanted, ...rest } = obj

// 6. Update nested immutably
const newState = {
  ...state,
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      name: 'new'
    }
  }
}
// → consider immer for cleaner code
```

## 11.7. Exercises — Day 11

**Level 1:**
1. Destructure `const arr = [1,2,3,4,5]` thành a, b, rest
2. Destructure object `{name, age, city}` skip age

**Level 2:**
3. Function `sortDesc(...nums)` sort args giảm dần
4. Function `mergeObjects(...objs)` merge tất cả

**Level 3:**
5. Function `pick(obj, keys)` lấy ra subset object
6. Function `omit(obj, keys)` ngược lại

---

# Day 12 — Regular Expressions
<a id="day-12"></a>

## 12.1. Tạo regex

```js
// Literal
const re1 = /hello/i

// Constructor (dùng khi pattern động)
const re2 = new RegExp('hello', 'i')
const word = 'hello'
const re3 = new RegExp(`\\b${word}\\b`, 'gi')   // escape \\ trong string

// Flags
// g — global (tìm tất cả)
// i — ignore case
// m — multiline (^ $ match từng dòng)
// s — dotAll (. cũng match \n)
// u — unicode
// y — sticky
// d — indices (ES2022 — trả vị trí match)
```

## 12.2. Methods

```js
const re = /hello/i

// test — boolean
re.test('Hello world')                          // true

// exec — match info (1 lần)
re.exec('hello hello')                          // ['hello', index:0, ...]

// String methods
'Hello World'.match(/world/i)                   // ['World', index:6]
'Hello World'.match(/\w+/g)                     // ['Hello','World'] (all)
'Hello World'.matchAll(/(\w+)/g)                // iterator với group
'Hello'.replace(/l/g, 'L')                      // 'HeLLo'
'Hello'.replaceAll('l', 'L')                    // 'HeLLo'
'a,b;c d'.split(/[,;\s]+/)                      // ['a','b','c','d']
'Hello'.search(/llo/)                           // 2 (index)
```

## 12.3. Character classes

```
\d   digit          [0-9]
\D   not digit
\w   word char      [A-Za-z0-9_]
\W   not word
\s   whitespace     [ \t\n\r\f\v]
\S   not whitespace
.    any except \n  (any with s flag)

[abc]      a, b, hoặc c
[^abc]     KHÔNG phải a, b, c
[a-z]      a đến z
[A-Z0-9]   combine

\b   word boundary
\B   not word boundary
^    start of string (or line with m)
$    end of string  (or line with m)
```

## 12.4. Quantifiers

```
*      0+
+      1+
?      0 hoặc 1 (optional)
{n}    đúng n
{n,}   ít nhất n
{n,m}  từ n đến m

Lazy (non-greedy): *? +? ?? {n,m}?
```

```js
/a+/.test('aaa')                                // true
/colou?r/.test('color')                         // true
/\d{3}-\d{4}/.test('123-4567')                  // true
/.+?/.exec('abcabc')                            // ['a'] (lazy → ít nhất 1, dừng sớm)
```

## 12.5. Groups & Alternation

```js
// Group ()
'2026-05-22'.match(/(\d{4})-(\d{2})-(\d{2})/)
// ['2026-05-22', '2026', '05', '22']

// Named group (?<name>...)
const m = '2026-05-22'.match(/(?<y>\d{4})-(?<mo>\d{2})-(?<d>\d{2})/)
m.groups                                         // {y:'2026', mo:'05', d:'22'}

// Non-capturing (?:...)
/(?:abc)+/.test('abcabc')                       // true, không tạo group

// Alternation |
/cat|dog|bird/.test('I have a dog')             // true

// Backreference \1
/(\w+)\s\1/.test('hello hello')                 // true (lặp lại group 1)
```

## 12.6. Common patterns

```js
// Email (basic — đầy đủ rất phức tạp)
const email = /^[\w.-]+@[\w-]+(\.[\w-]+)+$/

// URL
const url = /^https?:\/\/[\w.-]+(:\d+)?(\/.*)?$/

// Phone (Việt Nam)
const phone = /^(\+84|0)(3|5|7|8|9)\d{8}$/

// Strong password (≥8, có chữ hoa, thường, số)
const pwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

// Date YYYY-MM-DD
const date = /^\d{4}-\d{2}-\d{2}$/

// IPv4
const ipv4 = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/

// Slug
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Hex color
const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

// Whitespace only
const blank = /^\s*$/

// HTML tag
const tag = /<\/?[a-z][^>]*>/gi
```

## 12.7. Replace với function

```js
'hello world'.replace(/\b\w/g, c => c.toUpperCase())
// 'Hello World'

'$5.99 and $10.00'.replace(/\$(\d+\.\d{2})/g, (match, price) => {
  return '$' + (parseFloat(price) * 1.1).toFixed(2)
})
// '$6.59 and $11.00'

// camelCase → kebab-case
'fooBar'.replace(/[A-Z]/g, c => '-' + c.toLowerCase())
// 'foo-bar'
```

## 12.8. Exercises — Day 12

**Level 1:**
1. Test xem string có chứa số không
2. Replace tất cả space bằng dash

**Level 2:**
3. Extract tất cả số từ string
4. Validate email với regex

**Level 3:**
5. Word frequency: đếm từ trong paragraph (clean punctuation rồi count)
6. Find longest word in string
7. Replace `{{var}}` trong template với giá trị từ object

---

# Day 13 — Console Object Methods
<a id="day-13"></a>

## 13.1. Logging methods

```js
console.log('basic')                            // bình thường
console.warn('warning')                          // ⚠️ icon vàng
console.error('error')                           // ❌ icon đỏ + stack trace
console.info('info')                             // ℹ️ (giống log thường)
console.debug('debug')                           // hidden bởi default DevTools level
```

## 13.2. console.table

```js
const users = [
  { name: 'Harry', age: 28, role: 'dev' },
  { name: 'Anna',  age: 30, role: 'designer' }
]
console.table(users)
console.table(users, ['name', 'role'])          // chỉ chọn cột
```

Render đẹp như spreadsheet trong DevTools.

## 13.3. console.group / groupCollapsed / groupEnd

```js
console.group('User Info')
console.log('Name: Harry')
console.log('Age: 28')
  console.group('Address')
  console.log('City: SG')
  console.groupEnd()
console.groupEnd()
```

## 13.4. console.time / timeEnd / timeLog

```js
console.time('fetch')
await fetch(url)
console.timeLog('fetch', 'after first call')
await processData()
console.timeEnd('fetch')                        // → fetch: 234ms
```

## 13.5. console.count / countReset

```js
function track() { console.count('called') }
track(); track(); track()
// called: 1, called: 2, called: 3
console.countReset('called')
```

## 13.6. console.trace

```js
function a() { b() }
function b() { console.trace('how did I get here?') }
a()
// In ra full stack trace
```

## 13.7. console.assert

```js
const x = 5
console.assert(x === 10, 'x must be 10!', { x })
// Chỉ in nếu condition FALSE
```

## 13.8. console.dir

```js
const el = document.body
console.log(el)                                 // HTML element view
console.dir(el)                                 // object view với tất cả properties
```

## 13.9. Styled output (browser)

```js
console.log(
  '%cBig red %cgreen',
  'color: red; font-size: 30px',
  'color: green; font-size: 20px'
)

// Inline image (browser)
console.log('%c ', `
  background: url(https://...) no-repeat;
  background-size: contain;
  padding: 50px 100px;
`)
```

## 13.10. console.clear

```js
console.clear()
```

## 13.11. Exercises — Day 13

**Level 1-3:**
- Log array of users bằng console.table
- Time 3 cách sort khác nhau
- Group log calls of a function

---

# Day 14 — Error Handling
<a id="day-14"></a>

## 14.1. try / catch / finally

```js
try {
  riskyOp()
} catch (err) {
  console.error(err.message)
  console.error(err.name)
  console.error(err.stack)
} finally {
  cleanup()                                     // luôn chạy (cả khi return hoặc throw)
}

// Optional catch binding (ES2019)
try {} catch {}                                 // không cần (err)
```

## 14.2. Throw

```js
throw new Error('Something went wrong')
throw new TypeError('Expected number')
throw new RangeError('Out of range')
throw new SyntaxError('Bad syntax')
throw new ReferenceError('Variable not found')

// Có thể throw bất cứ value gì (nhưng nên throw Error)
throw 'string'                                  // ❌ không có stack
throw { code: 404, message: 'Not found' }       // ⚠️ không phải Error
```

## 14.3. Built-in Error types

| Type | Khi xảy ra |
|---|---|
| `Error` | base — generic |
| `TypeError` | sai type (`null.foo`, `123()`) |
| `RangeError` | giá trị ngoài range (`new Array(-1)`) |
| `ReferenceError` | dùng biến không tồn tại |
| `SyntaxError` | code không parse được |
| `URIError` | `decodeURI` invalid |
| `EvalError` | eval (rare) |
| `AggregateError` | gộp nhiều error (Promise.any) |

## 14.4. Custom Error class

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

class NetworkError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'NetworkError'
    this.status = status
  }
}

try {
  throw new ValidationError('Required', 'email')
} catch (e) {
  if (e instanceof ValidationError) {
    console.log('Field:', e.field)
  } else {
    throw e                                     // re-throw nếu không xử lý được
  }
}
```

## 14.5. Async error handling

```js
// async/await
async function load() {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new NetworkError(`HTTP ${res.status}`, res.status)
    return await res.json()
  } catch (e) {
    if (e instanceof NetworkError) return null
    throw e
  }
}

// Promise
fetch(url)
  .then(r => r.json())
  .catch(e => console.error(e))
  .finally(() => hideSpinner())

// Promise.all — fail fast
try {
  const [a, b] = await Promise.all([p1, p2])
} catch (e) { /* nếu bất kỳ p nào fail */ }

// Promise.allSettled — không throw
const results = await Promise.allSettled([p1, p2])
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value)
  else console.error(r.reason)
})
```

## 14.6. Global error handlers

```js
// Browser
window.addEventListener('error', e => {
  console.log('Error:', e.error, e.message, e.filename, e.lineno)
})
window.addEventListener('unhandledrejection', e => {
  console.log('Unhandled rejection:', e.reason)
  e.preventDefault()                            // chặn log default
})

// Node.js
process.on('uncaughtException', err => {})
process.on('unhandledRejection', (reason, promise) => {})

// React
class ErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  componentDidCatch(error, info) {
    Sentry.captureException(error, { extra: info })
  }
  render() {
    return this.state.hasError ? <Fallback /> : this.props.children
  }
}
```

## 14.7. Error patterns

**1. Result type (functional, tránh throw):**
```js
function parseJSON(str) {
  try { return { ok: true, value: JSON.parse(str) } }
  catch (e) { return { ok: false, error: e } }
}

const r = parseJSON('{bad}')
if (r.ok) use(r.value)
else handle(r.error)
```

**2. Retry với exponential backoff:**
```js
async function retry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try { return await fn() }
    catch (e) {
      if (i === retries - 1) throw e
      await new Promise(r => setTimeout(r, delay * 2 ** i))
    }
  }
}
```

**3. Defensive:**
```js
function safeAccess(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj)
}
```

## 14.8. Exercises — Day 14

**Level 1:**
1. Try/catch với code throw lỗi
2. Custom error `InvalidInputError`

**Level 2:**
3. Function `safeDiv(a, b)` throw nếu b=0
4. Retry function với 3 lần

**Level 3:**
5. Wrap async function với error handler middleware
6. Implement `Promise.allSettled` polyfill

---

# Day 15 — Classes
<a id="day-15"></a>

## 15.1. Class syntax

```js
class Animal {
  // Field (modern)
  species = 'unknown'
  #age = 0                                      // private field (ES2022)
  static count = 0                               // static field

  constructor(name, age) {
    this.name = name
    this.#age = age
    Animal.count++
  }

  // Method (prototype)
  speak() {
    return `${this.name} makes a sound`
  }

  // Getter
  get age() { return this.#age }

  // Setter
  set age(v) {
    if (v < 0) throw new Error('Negative age')
    this.#age = v
  }

  // Static method
  static create(name) {
    return new Animal(name, 0)
  }

  // Private method
  #internal() {}
}

const a = new Animal('Rex', 3)
a.speak()
a.age                                            // 3 (qua getter)
a.age = 4
Animal.count                                     // 1
Animal.create('Cat')
// a.#age → SyntaxError (private)
```

## 15.2. Inheritance (`extends`, `super`)

```js
class Dog extends Animal {
  constructor(name, age, breed) {
    super(name, age)                            // gọi parent constructor
    this.breed = breed
  }

  speak() {
    return `${super.speak()} — Woof!`           // gọi parent method
  }

  // Override
  fetch() { return `${this.name} fetches ball` }
}

const d = new Dog('Rex', 3, 'Husky')
d instanceof Dog                                 // true
d instanceof Animal                              // true
d.speak()                                        // 'Rex makes a sound — Woof!'
```

## 15.3. Abstract class pattern (JS không có abstract native)

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('Cannot instantiate abstract')
    }
  }
  area() { throw new Error('Must implement area()') }
}

class Circle extends Shape {
  constructor(r) { super(); this.r = r }
  area() { return Math.PI * this.r ** 2 }
}
```

## 15.4. Mixin pattern

```js
const Serializable = {
  toJSON() { return JSON.stringify(this) }
}
const Loggable = {
  log() { console.log(this) }
}

class User {
  constructor(name) { this.name = name }
}
Object.assign(User.prototype, Serializable, Loggable)

new User('Harry').toJSON()
```

## 15.5. Class vs Function constructor

Class chỉ là **syntactic sugar** trên prototype:

```js
// Class
class Cat {
  constructor(name) { this.name = name }
  meow() { return 'meow' }
}

// Tương đương
function Cat(name) { this.name = name }
Cat.prototype.meow = function() { return 'meow' }
```

→ Cùng cơ chế prototype, chỉ khác syntax.

## 15.6. When NOT to use class

```js
// ❌ Class thừa thãi cho data + 1 method
class UserUtils {
  static formatName(u) { return `${u.first} ${u.last}` }
}

// ✅ Plain function
export const formatName = u => `${u.first} ${u.last}`

// ❌ Class cho state đơn giản
class Counter {
  constructor() { this.n = 0 }
  inc() { this.n++ }
}

// ✅ Closure
function counter() {
  let n = 0
  return { inc: () => ++n, get: () => n }
}
```

> 💡 Trong React/RN ngày nay, **hooks** thay class component. Class chỉ dùng cho ErrorBoundary và một số legacy.

## 15.7. Exercises — Day 15

**Level 1:**
1. Class `Person` với name, age, country + greet method
2. Class `Animal` parent + `Dog` extends

**Level 2:**
3. Class `Statistics` với data array, methods: count, sum, mean, median, mode, range, var, std
4. Class `BankAccount` với deposit, withdraw, getBalance

**Level 3:**
5. Class `Stack` (LIFO) — push, pop, peek, isEmpty, size
6. Class `Queue` (FIFO)
7. Class `LinkedList` (singly)

---

# Day 16 — JSON
<a id="day-16"></a>

## 16.1. JSON là gì

**JSON** (JavaScript Object Notation) — format text trao đổi dữ liệu, syntax giống object literal nhưng strict hơn:

```json
{
  "name": "Harry",
  "age": 28,
  "active": true,
  "skills": ["JS", "React"],
  "address": { "city": "Saigon", "country": "VN" },
  "nullable": null
}
```

**Rules:**
- Key luôn double-quoted `"..."`
- String double quote (không single)
- Không có comment
- Không có trailing comma
- Không có `undefined`, `function`, `Symbol`
- Number không có `NaN`, `Infinity` (sẽ thành `null` khi stringify)

## 16.2. JSON.stringify (object → string)

```js
const obj = { name: 'Harry', age: 28 }

JSON.stringify(obj)                             // '{"name":"Harry","age":28}'
JSON.stringify(obj, null, 2)                    // pretty-print 2 spaces
JSON.stringify(obj, null, '\t')                 // tab indent

// Filter keys
JSON.stringify(obj, ['name'])                   // '{"name":"Harry"}'

// Replacer function (transform giá trị)
JSON.stringify(obj, (key, value) => {
  if (key === 'password') return undefined      // omit
  if (typeof value === 'number') return value * 2
  return value
})

// toJSON method (custom serialize)
class Date2 {
  toJSON() { return this.iso }
}
```

**Limitation khi stringify:**
```js
JSON.stringify(undefined)                       // undefined (KHÔNG phải string!)
JSON.stringify({a: undefined, b: () => {}, c: Symbol()})
// '{}' — undefined, function, Symbol bị BỎ
JSON.stringify(NaN)                             // 'null'
JSON.stringify(new Date())                      // ISO string
JSON.stringify({a: 1n})                         // ❌ TypeError BigInt
JSON.stringify(circular)                        // ❌ TypeError circular reference
```

## 16.3. JSON.parse (string → object)

```js
JSON.parse('{"name":"Harry","age":28}')

// Reviver function (transform khi parse)
const obj = JSON.parse(json, (key, value) => {
  if (key === 'createdAt') return new Date(value)
  return value
})

// Error handling — invalid JSON throws
try {
  JSON.parse('{bad}')
} catch (e) {
  console.error('Invalid JSON:', e.message)
}
```

## 16.4. Pattern thực tế

```js
// 1. Deep clone (legacy — không support function, Date, undefined)
const clone = JSON.parse(JSON.stringify(obj))
// Modern:
const clone2 = structuredClone(obj)

// 2. LocalStorage (string only)
localStorage.setItem('user', JSON.stringify(user))
const user = JSON.parse(localStorage.getItem('user') ?? 'null')

// 3. API request/response
const res = await fetch('/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
const json = await res.json()

// 4. Compare objects
JSON.stringify(a) === JSON.stringify(b)         // ⚠️ unreliable (key order, types)
// → dùng lodash isEqual hoặc dequal lib
```

## 16.5. JSON Schema & validation

Modern: dùng **Zod** để define schema + parse + infer TS type:
```ts
import { z } from 'zod'
const User = z.object({
  name: z.string(),
  age: z.number().int().positive(),
  email: z.string().email()
})

const data = User.parse(JSON.parse(jsonStr))    // throw nếu invalid
type UserType = z.infer<typeof User>            // tự sinh TS type
```

## 16.6. Exercises — Day 16

**Level 1-3:**
1. Convert object → JSON string pretty
2. Parse JSON từ API, hiển thị
3. Persist & load object qua localStorage
4. Validate JSON data với schema (Zod)

---

# Day 17 — Web Storages
<a id="day-17"></a>

## 17.1. localStorage / sessionStorage API

API giống nhau, chỉ khác lifetime:

```js
// SET
localStorage.setItem('user', JSON.stringify(user))

// GET
const user = JSON.parse(localStorage.getItem('user') ?? 'null')

// REMOVE
localStorage.removeItem('user')

// CLEAR all
localStorage.clear()

// Length
localStorage.length

// Get key by index
localStorage.key(0)

// Loop
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  const value = localStorage.getItem(key)
}
```

⚠️ Tất cả lưu là **string** — nhớ `JSON.stringify` / `JSON.parse`.

## 17.2. So sánh storage

| | localStorage | sessionStorage | Cookie | IndexedDB | Cache API |
|---|---|---|---|---|---|
| Size | 5–10MB | 5–10MB | 4KB | 50%+ disk | tùy browser |
| Persist | đến khi clear | đến tab đóng | có expiry | lâu dài | lâu dài |
| Gửi mỗi request | ❌ | ❌ | ✅ tự động | ❌ | ❌ |
| API | sync | sync | sync (parse string) | async, transactional | async (Promise) |
| Cross-tab | ✅ | ❌ | ✅ | ✅ | ✅ |
| Use case | settings, theme | wizard, draft | auth, CSRF | offline data, blob | SW cache |

## 17.3. Cookie API (legacy)

```js
// Set
document.cookie = 'name=Harry; max-age=86400; path=/; Secure; SameSite=Lax'

// Get all (1 string)
document.cookie                                 // 'name=Harry; theme=dark'

// Parse helper
function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(c => c.startsWith(name + '='))
    ?.split('=')[1]
}

// Delete (set expiry past)
document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
```

> 🔒 **Auth cookie nên là HttpOnly** (set server-side, JS không đọc được).

## 17.4. Storage event (cross-tab sync)

```js
window.addEventListener('storage', e => {
  console.log(e.key, e.oldValue, e.newValue, e.url)
})
// Trigger khi tab KHÁC đổi localStorage (cùng origin)
```

## 17.5. IndexedDB (cho data lớn, offline)

```js
const req = indexedDB.open('myDB', 1)
req.onupgradeneeded = e => {
  const db = e.target.result
  db.createObjectStore('users', { keyPath: 'id' })
}
req.onsuccess = e => {
  const db = e.target.result
  const tx = db.transaction('users', 'readwrite')
  const store = tx.objectStore('users')
  store.add({ id: 1, name: 'Harry' })
}
```

API verbose → dùng wrapper:
- **idb** (Jake Archibald) ⭐
- **Dexie.js**
- **RxDB**

## 17.6. Security best practice

| Data | Storage |
|---|---|
| JWT access token | memory only (state) hoặc httpOnly cookie |
| Refresh token | httpOnly Secure SameSite cookie hoặc Keychain (RN) |
| User prefs (theme, lang) | localStorage |
| Form draft (1 phiên) | sessionStorage |
| Sensitive (CC, SSN) | KHÔNG bao giờ persist client |

> ⚠️ XSS có thể đọc localStorage. Đừng lưu token nhạy cảm ở đó.

## 17.7. Exercises — Day 17

**Level 1-3:**
1. Lưu user info vào localStorage, đọc khi reload
2. Theme toggle với localStorage persist
3. Form auto-save vào sessionStorage
4. Sync giữa nhiều tab với storage event

---

# Day 18 — Promises & Async
<a id="day-18"></a>

## 18.1. Promise là gì

**Promise** = đối tượng đại diện cho **kết quả tương lai** của 1 operation async. 3 state:
- `pending` — đang chờ
- `fulfilled` — thành công (resolved)
- `rejected` — thất bại
- Sau fulfilled/rejected = **settled** (không đổi nữa)

## 18.2. Tạo Promise

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = Math.random() > 0.5
    if (success) resolve('data')
    else reject(new Error('failed'))
  }, 1000)
})
```

**Static helpers:**
```js
Promise.resolve(42)                             // promise đã fulfilled với 42
Promise.reject(new Error('x'))                  // đã rejected
```

## 18.3. Consume Promise — .then / .catch / .finally

```js
p
  .then(value => `Result: ${value}`)            // return → next .then nhận
  .then(s => console.log(s))
  .catch(err => console.error(err))             // bắt mọi reject trong chain
  .finally(() => hideLoader())                  // luôn chạy (cleanup)
```

**Chaining rules:**
- `.then(fn)` return value → next `.then` nhận value đó
- `.then(fn)` return promise → next `.then` chờ promise đó
- throw trong `.then` → skip xuống `.catch`

```js
fetch('/api')
  .then(res => {
    if (!res.ok) throw new Error('HTTP error')
    return res.json()                            // promise, next .then nhận data
  })
  .then(data => save(data))
  .catch(err => alert(err.message))
```

## 18.4. async / await — sugar trên Promise

```js
async function load() {
  try {
    const res = await fetch('/api')
    if (!res.ok) throw new Error('HTTP error')
    const data = await res.json()
    return data                                  // tự wrap thành Promise
  } catch (err) {
    console.error(err)
  } finally {
    hideLoader()
  }
}

// async function LUÔN return Promise
load().then(data => console.log(data))
```

**Top-level await** (ES2022, ESM):
```js
// app.js (type: module)
const data = await fetch(url).then(r => r.json())
```

## 18.5. Concurrency patterns

### Sequential (chậm — khi không phụ thuộc nhau)
```js
for (const url of urls) {
  const r = await fetch(url)                    // chờ từng cái
}
```

### Parallel ⭐
```js
const results = await Promise.all(urls.map(u => fetch(u)))
```

### Promise.all — fail-fast
Mọi promise resolve → trả array. **1 fail → toàn bộ reject ngay.**
```js
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
])
```

### Promise.allSettled — chờ tất cả, không throw
```js
const results = await Promise.allSettled([p1, p2, p3])
// [{status:'fulfilled',value:1}, {status:'rejected',reason:Error}, ...]
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value)
  else console.error(r.reason)
})
```

### Promise.race — cái nào xong/fail trước thắng
```js
// Timeout pattern
const result = await Promise.race([
  fetch(url),
  new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
])
```

### Promise.any — cái nào fulfill trước thắng (ignore reject)
```js
const first = await Promise.any([
  fetch('https://api1.com'),
  fetch('https://api2.com'),
  fetch('https://api3.com')
])                                              // server nào nhanh nhất
```

## 18.6. Event Loop & Microtask

```js
console.log(1)
setTimeout(() => console.log(2), 0)             // macrotask
Promise.resolve().then(() => console.log(3))    // microtask
console.log(4)

// Output: 1, 4, 3, 2
```

**Quy tắc:** mỗi tick chạy hết microtask queue → 1 macrotask → render.

- **Microtask:** `Promise.then`, `queueMicrotask`, `MutationObserver`
- **Macrotask:** `setTimeout`, `setInterval`, I/O, `setImmediate` (Node)

## 18.7. Common pitfalls

```js
// ❌ Quên await
async function fn() {
  const data = fetch('/api')                    // không await → data = Promise pending
  console.log(data)                             // Promise <pending>
}

// ❌ forEach + async (await không hoạt động)
arr.forEach(async x => await save(x))           // chạy parallel KHÔNG await
// → dùng for...of nếu cần sequential, hoặc Promise.all map

// ❌ Không catch
async function unsafe() {
  await fetch('/bad')                           // nếu reject → unhandled rejection
}

// ❌ Catch swallowing error
.catch(e => {})                                  // log đi!

// ❌ Mixing then/await
async function fn() {
  return fetch(url).then(r => r.json())         // OK nhưng inconsistent
}

// ✅ async-only
async function fn() {
  const r = await fetch(url)
  return r.json()
}
```

## 18.8. AbortController (cancel async)

```js
const ctrl = new AbortController()
fetch(url, { signal: ctrl.signal })
  .then(r => r.json())
  .catch(e => {
    if (e.name === 'AbortError') console.log('cancelled')
  })

// Cancel sau 3s
setTimeout(() => ctrl.abort(), 3000)

// Timeout helper (modern)
const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
```

## 18.9. Exercises — Day 18

**Level 1:**
1. Tạo promise resolve sau 2s với 'hello'
2. Chain 3 promise, mỗi cái delay 1s

**Level 2:**
3. Convert callback-style API thành Promise (`promisify`)
4. Implement retry với promise + exponential backoff

**Level 3:**
5. Implement `Promise.all` polyfill
6. Implement `Promise.race` polyfill
7. Implement `mapLimit(arr, limit, fn)` — chạy concurrent có giới hạn

---

# Day 19 — Closures
<a id="day-19"></a>

## 19.1. Closure là gì

**Closure** là khi 1 function **"ghi nhớ" scope** nơi nó được tạo, ngay cả khi gọi ở scope khác.

```js
function outer() {
  const message = 'Hello from outer'
  return function inner() {
    console.log(message)                        // truy cập biến của outer
  }
}

const fn = outer()                              // outer xong, nhưng `message` vẫn sống
fn()                                             // 'Hello from outer'
```

→ `inner` close over `message`.

## 19.2. Tại sao quan trọng

1. **Data privacy** (encapsulation trước khi có `#private`)
2. **Stateful function** (counter, generator)
3. **Module pattern**
4. **Currying & partial application**
5. **Event handler giữ context**
6. **Memoization, throttle, debounce**

## 19.3. Counter pattern

```js
function createCounter() {
  let count = 0
  return {
    inc: () => ++count,
    dec: () => --count,
    get: () => count,
    reset: () => { count = 0 }
  }
}

const c = createCounter()
c.inc(); c.inc(); c.inc()
c.get()                                          // 3
c.dec()
c.get()                                          // 2
c.count                                          // undefined (private!)
```

## 19.4. Module pattern (pre-ES6 modules)

```js
const Cart = (function() {
  // Private
  let items = []
  function total() {
    return items.reduce((s, i) => s + i.price, 0)
  }

  // Public API
  return {
    add: i => items.push(i),
    remove: id => { items = items.filter(i => i.id !== id) },
    list: () => [...items],                     // copy, không expose ref
    getTotal: total
  }
})()

Cart.add({ id: 1, price: 100 })
Cart.list()
Cart.getTotal()
```

## 19.5. Currying

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...more) => curried(...args, ...more)
  }
}

const add3 = curry((a, b, c) => a + b + c)
add3(1, 2, 3)                                   // 6
add3(1)(2)(3)                                   // 6
add3(1, 2)(3)                                   // 6
```

**Partial application:**
```js
const greet = (greeting, name) => `${greeting}, ${name}!`
const sayHi = greet.bind(null, 'Hi')            // partial first arg
sayHi('Harry')                                   // 'Hi, Harry!'
```

## 19.6. Memoization (cache function result)

```js
function memo(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

const slowFib = n => n < 2 ? n : slowFib(n-1) + slowFib(n-2)
const fastFib = memo(slowFib)                   // ⚠️ vẫn slow vì inner call gọi slowFib

// Recursive memo đúng cách:
function fib(n, cache = new Map()) {
  if (cache.has(n)) return cache.get(n)
  const r = n < 2 ? n : fib(n-1, cache) + fib(n-2, cache)
  cache.set(n, r)
  return r
}
```

## 19.7. Debounce & Throttle

```js
function debounce(fn, ms = 300) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), ms)
  }
}

function throttle(fn, ms = 300) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last >= ms) {
      last = now
      fn.apply(this, args)
    }
  }
}

const onSearch = debounce(q => fetch(`/search?q=${q}`), 300)
window.addEventListener('scroll', throttle(handleScroll, 100))
```

## 19.8. Common bug — closure in loop

```js
// ❌ var (function-scoped) → tất cả share 1 i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// Output: 3, 3, 3

// ✅ let (block-scoped) → mỗi iteration scope mới
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0)
}
// Output: 0, 1, 2

// ✅ IIFE trick (cũ)
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 0)
  })(i)
}
```

## 19.9. Memory leak risk

Closure giữ reference đến scope → biến không bị GC.
```js
function leaky() {
  const big = new Array(1000000).fill('x')      // 1M strings
  return () => console.log(big[0])              // closure giữ `big` mãi
}
const f = leaky()                                // 1MB+ không free
```

→ Cleanup reference khi xong:
```js
f = null                                         // → big có thể GC
```

## 19.10. Exercises — Day 19

**Level 1:**
1. `personAccount` với private balance, methods deposit, withdraw, getBalance
2. Function tạo random ID stateful (đếm số đã tạo)

**Level 2:**
3. Implement memoize cho fibonacci
4. Tạo throttle + debounce util

**Level 3:**
5. Implement Observer pattern bằng closure (subscribe/emit)
6. Implement chain `.add(1).add(2).get()` bằng closure

---

# Day 20 — Writing Clean Code
<a id="day-20"></a>

## 20.1. Naming Conventions

### Variables & functions — camelCase
```js
// ✅
let firstName = 'Harry'
let userCount = 100
function calculateTotal() {}

// ❌
let first_name = 'Harry'         // snake_case (Python style)
let FirstName = 'Harry'          // PascalCase (Class only)
let fn = 'Harry'                 // không rõ nghĩa
```

### Constants — UPPER_SNAKE_CASE
```js
const MAX_RETRIES = 3
const API_BASE_URL = 'https://api.example.com'
const PI = 3.14159
```

### Classes & Constructors — PascalCase
```js
class UserAccount {}
function ColorPicker() {}        // legacy constructor
```

### Boolean — `is/has/can/should` prefix
```js
const isLoading = true
const hasPermission = false
const canEdit = true
const shouldRetry = false
```

### Function — verb + noun
```js
function getUser() {}
function calculateTax() {}
function validateEmail() {}
function fetchPosts() {}

// Tránh:
function user() {}               // không rõ get/set/check
function data() {}               // mơ hồ
```

## 20.2. Function nhỏ, 1 việc (Single Responsibility)

```js
// ❌ làm nhiều việc
function processOrder(order) {
  // validate
  if (!order.items.length) throw new Error('empty')
  // calculate
  const total = order.items.reduce((s, i) => s + i.price * i.qty, 0)
  // apply tax
  const tax = total * 0.1
  // save
  db.orders.insert({ ...order, total, tax })
  // send email
  mail.send(order.email, 'Order confirmed')
  // log
  logger.info('order processed', order.id)
}

// ✅ tách
function validateOrder(order) {
  if (!order.items.length) throw new Error('empty')
}
function calculateOrderTotal(order) {
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0)
  return { subtotal, tax: subtotal * 0.1, total: subtotal * 1.1 }
}
async function saveOrder(order) {
  return db.orders.insert(order)
}
async function notifyOrder(order) {
  return mail.send(order.email, 'Order confirmed')
}

async function processOrder(order) {
  validateOrder(order)
  const totals = calculateOrderTotal(order)
  const saved = await saveOrder({ ...order, ...totals })
  await notifyOrder(saved)
  logger.info('order processed', saved.id)
  return saved
}
```

## 20.3. Tránh nested deeply — Guard Clause

```js
// ❌ 4 level nest
function send(user) {
  if (user) {
    if (user.active) {
      if (user.email) {
        if (user.preferences.notifications) {
          mail.send(user.email)
        }
      }
    }
  }
}

// ✅ guard clauses, early return
function send(user) {
  if (!user) return
  if (!user.active) return
  if (!user.email) return
  if (!user.preferences?.notifications) return
  mail.send(user.email)
}
```

## 20.4. Magic numbers/strings → named constants

```js
// ❌
if (user.age >= 18) {}
setTimeout(fn, 86400000)
if (status === 'p') {}

// ✅
const ADULT_AGE = 18
const ONE_DAY_MS = 24 * 60 * 60 * 1000
const STATUS = { PENDING: 'p', APPROVED: 'a', REJECTED: 'r' }

if (user.age >= ADULT_AGE) {}
setTimeout(fn, ONE_DAY_MS)
if (status === STATUS.PENDING) {}
```

## 20.5. Comments — WHY not WHAT

```js
// ❌ comment WHAT (code đã nói)
// loop through users
for (const user of users) {}

// increment count
count++

// ✅ comment WHY
// Stripe webhook may retry — dedupe by event_id
if (await isProcessed(event.id)) return

// User Agent check needed because iOS 14 has buggy IntersectionObserver
if (isIOS14()) usePolyfill()

// FIXME(harry, 2026-05): workaround for backend bug API-1234
```

## 20.6. DRY (Don't Repeat Yourself) — nhưng không over-abstract

```js
// ❌ duplicate
function getUserName(u) { return `${u.first} ${u.last}` }
function getAdminName(a) { return `${a.first} ${a.last}` }
function getCustomerName(c) { return `${c.first} ${c.last}` }

// ✅ DRY
function getFullName({ first, last }) { return `${first} ${last}` }

// ⚠️ KHÔNG over-abstract — đôi khi rep > wrong abstraction
// Rule of Three: 3 lần dup mới abstract
```

## 20.7. YAGNI (You Aren't Gonna Need It)

```js
// ❌ build cho future hypothetical
function format(value, options = {
  locale: 'en',
  currency: 'USD',
  precision: 2,
  groupSeparator: ',',
  decimalSeparator: '.',
  symbol: true,
  symbolPosition: 'before'
  // ... 20 options chưa ai dùng
}) {}

// ✅ build cho hiện tại, refactor khi cần
function formatPrice(value) {
  return `$${value.toFixed(2)}`
}
```

## 20.8. Format tự động — Prettier + ESLint

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}

// .eslintrc
{
  "extends": ["eslint:recommended", "prettier"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn"
  }
}
```

+ Husky pre-commit hook tự format trước khi commit.

## 20.9. Code Smells (signs cần refactor)

- **Long function** (>30 lines) → tách
- **Long parameter list** (>3) → dùng object param
- **Duplicate code**
- **Large class** (God class)
- **Long conditional** → strategy pattern hoặc lookup
- **Comment giải thích code phức tạp** → rename, tách function
- **Dead code** (không gọi) → xoá
- **Nested ternary**
- **Inconsistent naming**

## 20.10. Best practices reminder

1. Cuộn ngược 6 tháng đọc code mình — vẫn hiểu không?
2. PR review nhỏ (<400 dòng) — dễ review hơn
3. Self-review trước khi gửi reviewer
4. Test cùng mỗi PR
5. Refactor liên tục (boy scout rule: để code sạch hơn lúc mới đến)

---

# Day 21 — DOM
<a id="day-21"></a>

## 21.1. DOM là gì

**DOM (Document Object Model)** là cây object đại diện cho HTML. Browser parse HTML → tạo DOM tree → JS truy cập/sửa qua API.

```
document
  └── html
       ├── head
       │    ├── title
       │    └── meta
       └── body
            ├── div
            │    ├── h1
            │    └── p
            └── footer
```

## 21.2. Selectors — tìm element

```js
// By ID (1 element)
document.getElementById('header')

// By class (HTMLCollection — live!)
document.getElementsByClassName('item')

// By tag (HTMLCollection)
document.getElementsByTagName('div')

// CSS selector — first match (Element | null)
document.querySelector('.item')
document.querySelector('#header')
document.querySelector('input[type="email"]')
document.querySelector('div > p.intro')

// CSS selector — all matches (NodeList — static)
document.querySelectorAll('div.item')

// From a specific element
const list = document.querySelector('.list')
list.querySelectorAll('li')

// Traversal
el.parentNode
el.parentElement
el.children                                     // HTMLCollection
el.childNodes                                   // NodeList (includes text/comment)
el.firstElementChild
el.lastElementChild
el.nextElementSibling
el.previousElementSibling
el.closest('.card')                             // tìm ancestor match selector
```

## 21.3. NodeList vs HTMLCollection

| | NodeList | HTMLCollection |
|---|---|---|
| From | `querySelectorAll`, `childNodes` | `getElementsByClassName/TagName`, `.children` |
| Live | static (snapshot) | live (auto update khi DOM đổi) |
| forEach | ✅ có | ❌ phải convert |
| Array methods | dùng `Array.from(nl)` | dùng `Array.from(hc)` |

```js
const nl = document.querySelectorAll('.item')
nl.forEach(el => el.classList.add('active'))
[...nl].map(el => el.textContent)
```

## 21.4. Attribute & Property

```js
const link = document.querySelector('a')

// Attribute (HTML attribute — string)
link.getAttribute('href')
link.setAttribute('href', '/new')
link.removeAttribute('href')
link.hasAttribute('href')

// Property (DOM property — typed)
link.href                                       // resolved URL absolute
link.id
link.className                                  // string of all classes

// data-* attribute → dataset
// <div data-user-id="42" data-role="admin">
el.dataset.userId                               // '42' (camelCase!)
el.dataset.role                                 // 'admin'
el.dataset.newKey = 'value'                     // tạo data-new-key
```

## 21.5. classList API

```js
el.classList.add('active')
el.classList.add('foo', 'bar')                  // multiple
el.classList.remove('hidden')
el.classList.toggle('open')                     // có → bỏ, không → thêm
el.classList.toggle('open', isOpen)             // force state
el.classList.replace('old', 'new')
el.classList.contains('active')                 // boolean
el.className                                    // string
```

## 21.6. Style

```js
el.style.color = 'red'
el.style.backgroundColor = '#fff'               // camelCase!
el.style.setProperty('--theme', 'dark')          // CSS variable

// Read computed style
const cs = getComputedStyle(el)
cs.color
cs.getPropertyValue('--theme')
```

→ Nên đổi class thay vì style trực tiếp (separation of concern).

## 21.7. Content

```js
el.textContent = 'hello'                        // ✅ safe (escape HTML)
el.innerText = 'hello'                          // visible text (slower, layout)
el.innerHTML = '<b>bold</b>'                    // ⚠️ XSS risk nếu user data
el.outerHTML = '<div>replace whole element</div>'
```

## 21.8. Form values

```js
input.value
input.checked                                   // checkbox/radio
select.value
select.selectedIndex
textarea.value
formData = new FormData(formEl)                 // multipart-ready
[...formData.entries()]                          // [[key,val],...]
```

## 21.9. Exercises — Day 21

**Level 1-3:**
1. Select element bằng id, class, tag, querySelector
2. Đổi text, class, style của element
3. Đọc form input value khi user gõ

---

# Day 22 — Manipulating DOM Object
<a id="day-22"></a>

## 22.1. Create elements

```js
const div = document.createElement('div')
div.className = 'card'
div.textContent = 'Hello'
div.id = 'card-1'
div.setAttribute('role', 'article')
```

## 22.2. Insert / Remove

```js
// Append (cuối)
parent.appendChild(div)                         // legacy
parent.append(div, div2, 'text')                // multiple, accept string ✅ modern

// Prepend (đầu)
parent.prepend(div)

// Insert relative
parent.insertBefore(newEl, refEl)
refEl.before(newEl)                              // anh em trước
refEl.after(newEl)                               // sau
refEl.replaceWith(newEl)                         // thay

// insertAdjacentHTML (HTML string)
el.insertAdjacentHTML('beforebegin', '<span>before el</span>')
el.insertAdjacentHTML('afterbegin', '<span>first child</span>')
el.insertAdjacentHTML('beforeend', '<span>last child</span>')
el.insertAdjacentHTML('afterend', '<span>after el</span>')

// Remove
el.remove()                                      // modern ✅
parent.removeChild(el)                           // legacy
parent.innerHTML = ''                            // clear all (NHANH nhưng XSS-prone với content)
while (parent.firstChild) parent.removeChild(parent.firstChild)
```

## 22.3. Clone

```js
const clone = el.cloneNode(false)               // shallow (no children)
const deep = el.cloneNode(true)                 // deep (with descendants)
```

## 22.4. DocumentFragment (batch insert performance)

```js
const frag = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li')
  li.textContent = `Item ${i}`
  frag.appendChild(li)
}
list.appendChild(frag)                          // 1 reflow thay vì 1000
```

## 22.5. Modern alternatives

- **Template literal + innerHTML** (small, no user data):
```js
container.innerHTML = users.map(u => `
  <div class="user" data-id="${u.id}">
    <h3>${u.name}</h3>
    <p>${u.email}</p>
  </div>
`).join('')
```

- **Template element**:
```html
<template id="userTpl">
  <div class="user"><h3></h3><p></p></div>
</template>
```
```js
const tpl = document.getElementById('userTpl')
const node = tpl.content.cloneNode(true)
node.querySelector('h3').textContent = u.name
container.appendChild(node)
```

- **Frameworks** (React/Vue/Svelte) — declarative thay manipulate trực tiếp

## 22.6. Exercises — Day 22

1. Tạo list 10 item từ array
2. Add/remove item dynamic
3. Filter list theo input

---

# Day 23 — Event Listeners
<a id="day-23"></a>

## 23.1. addEventListener

```js
btn.addEventListener('click', handler)
btn.addEventListener('click', handler, false)  // bubble phase (default)
btn.addEventListener('click', handler, true)   // capture phase
btn.addEventListener('click', handler, {
  once: true,                                   // chỉ chạy 1 lần
  passive: true,                                // không preventDefault (scroll perf)
  capture: true,
  signal: ctrl.signal                            // cancel với AbortController
})

// Remove
btn.removeEventListener('click', handler)       // PHẢI cùng reference function
```

## 23.2. Event object

```js
function handler(e) {
  e.target                                      // element trigger event
  e.currentTarget                               // element gắn listener
  e.type                                        // 'click'
  e.preventDefault()                            // chặn default action
  e.stopPropagation()                           // chặn bubble lên
  e.stopImmediatePropagation()                  // + stop other listener same el
}
```

## 23.3. Event phases

```
   capture          bubble
  ┌────────────┐  ┌──────────┐
  │ window     │  │ window   │
  │  document  │  │ document │
  │   body     │  │   body   │
  │    div     │  │   div    │
  │     btn ◄─── target ────► btn │
  └────────────┘  └──────────┘
```

- **Capture**: window → target
- **Target**: tại element
- **Bubble**: target → window (default)

## 23.4. Event Delegation (performance ⭐)

```js
// ❌ N listener cho N item
items.forEach(item => item.addEventListener('click', handler))

// ✅ 1 listener trên parent
list.addEventListener('click', e => {
  const item = e.target.closest('.item')
  if (!item) return
  handle(item.dataset.id)
})
```

Lợi: 1 listener, tự handle item thêm/bớt dynamic.

## 23.5. Common events

**Mouse:**
- `click`, `dblclick`, `contextmenu` (right click)
- `mousedown`, `mouseup`
- `mousemove`
- `mouseenter` (no bubble) / `mouseleave`
- `mouseover` (bubble) / `mouseout`

**Keyboard:**
- `keydown`, `keyup`, `keypress` (deprecated)
- `e.key` ('a', 'Enter', 'ArrowUp'), `e.code` ('KeyA'), `e.ctrlKey`, `e.shiftKey`, `e.altKey`, `e.metaKey`

**Form:**
- `submit`, `reset`
- `change`, `input` (mỗi keystroke)
- `focus` / `blur` (no bubble), `focusin` / `focusout` (bubble)

**Window/Document:**
- `load`, `DOMContentLoaded`
- `resize`, `scroll`
- `beforeunload`, `unload`
- `online` / `offline`
- `visibilitychange`

**Touch (mobile):**
- `touchstart`, `touchmove`, `touchend`, `touchcancel`
- `pointerdown`, `pointermove`, `pointerup` (unify mouse + touch + pen) ⭐

**Drag & Drop:**
- `dragstart`, `drag`, `dragend`, `dragenter`, `dragleave`, `dragover`, `drop`

## 23.6. Custom Event

```js
// Emit
const event = new CustomEvent('userLogin', {
  detail: { userId: 42 },
  bubbles: true,
  cancelable: true
})
el.dispatchEvent(event)

// Listen
window.addEventListener('userLogin', e => {
  console.log(e.detail.userId)
})
```

## 23.7. preventDefault use case

```js
form.addEventListener('submit', e => {
  e.preventDefault()                            // chặn form GET/POST default
  // gửi qua fetch instead
})

link.addEventListener('click', e => {
  e.preventDefault()                            // chặn navigation
  navigate(link.href)
})

// Chặn ngữ cảnh:
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault()                          // chặn submit form
    doCustomAction()
  }
})
```

## 23.8. Common pattern

```js
// Debounce input
input.addEventListener('input', debounce(e => {
  search(e.target.value)
}, 300))

// Throttle scroll
window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true })

// Cleanup khi route change
const ctrl = new AbortController()
window.addEventListener('resize', handler, { signal: ctrl.signal })
// Sau:
ctrl.abort()                                    // remove tất cả listener
```

## 23.9. Exercises — Day 23

1. Form validate live (input event)
2. To-do list: thêm, xoá, mark done với event delegation
3. Modal đóng khi click outside (event bubble + closest)
4. Keyboard shortcut handler (Ctrl+S, Esc...)

---

# Day 24–30 — Mini Projects
<a id="day-24-30"></a>

> Các project trong repo gốc dùng để **củng cố** tất cả kiến thức từ Day 1-23. Mình tóm tắt mỗi project: yêu cầu, kiến thức áp dụng, cách triển khai gợi ý.

## Day 24 — Solar System

**Yêu cầu:** Render hệ mặt trời với CSS animation, các hành tinh xoay.

**Kiến thức áp dụng:**
- DOM (querySelector)
- CSS animation `@keyframes` rotation
- `position: absolute` + `transform-origin`
- requestAnimationFrame (option)

**Hint:**
```css
.planet {
  position: absolute;
  animation: orbit 5s linear infinite;
  transform-origin: 50% 50%;
}
@keyframes orbit {
  from { transform: rotate(0) translateX(100px) rotate(0) }
  to { transform: rotate(360deg) translateX(100px) rotate(-360deg) }
}
```

## Day 25–26 — World Countries Data Visualization

**Yêu cầu:** Fetch data các nước từ public API, render chart (population, languages...).

**Kiến thức áp dụng:**
- `fetch` + Promise
- Array methods: filter, map, reduce, sort
- DOM render
- Chart lib (Chart.js, D3.js)

**Hint:**
```js
const res = await fetch('https://restcountries.com/v3.1/all')
const countries = await res.json()

// Top 10 populated
const top10 = [...countries]
  .sort((a, b) => b.population - a.population)
  .slice(0, 10)

// Render bar chart
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: top10.map(c => c.name.common),
    datasets: [{ label: 'Population', data: top10.map(c => c.population) }]
  }
})
```

## Day 27 — Portfolio

**Yêu cầu:** Trang portfolio cá nhân, responsive, có dark mode toggle.

**Kiến thức áp dụng:**
- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- CSS Grid + Flexbox
- localStorage cho theme
- Smooth scroll cho anchor link
- Form contact (Formspree, Netlify Forms)

## Day 28 — Leaderboard

**Yêu cầu:** Hiển thị bảng xếp hạng, thêm/xoá user, sort theo điểm, persist.

**Kiến thức áp dụng:**
- Array sort
- localStorage persist
- DOM render dynamic
- Event delegation

```js
let users = JSON.parse(localStorage.getItem('users') ?? '[]')

function render() {
  const sorted = [...users].sort((a, b) => b.score - a.score)
  container.innerHTML = sorted.map((u, i) => `
    <tr>
      <td>${i + 1}</td><td>${u.name}</td><td>${u.score}</td>
      <td><button data-id="${u.id}" data-act="del">×</button></td>
    </tr>
  `).join('')
}

container.addEventListener('click', e => {
  if (e.target.dataset.act === 'del') {
    users = users.filter(u => u.id !== e.target.dataset.id)
    save(); render()
  }
})

function save() {
  localStorage.setItem('users', JSON.stringify(users))
}
```

## Day 29 — Animating characters

**Yêu cầu:** Animation character đi/chạy bằng Canvas hoặc SVG.

**Kiến thức áp dụng:**
- Canvas API (`getContext('2d')`)
- requestAnimationFrame (game loop)
- Sprite sheet
- Keyboard listener (arrow keys)

## Day 30 — Final Project

**Yêu cầu:** Tích hợp tất cả kiến thức để build app hoàn chỉnh.

**Gợi ý project:**
- To-do app với drag-drop, categories, due date
- Weather app với geolocation + fetch API
- Markdown editor live preview
- Pomodoro timer
- Quiz app
- Mini blog static
- Image gallery với filter, lightbox

**Recommendation:** Sau khi xong vanilla JS → **port sang React**, sau đó **React Native** để cảm nhận sự khác biệt giữa DOM trực tiếp và component framework, và web vs native.

---

# Bonus — Advanced JavaScript
<a id="advanced-js"></a>

> Phần nâng cao không có trong repo gốc nhưng quan trọng cho FE/RN developer.

## A1. Event Loop chi tiết

```
┌─────────────────────────────┐
│           Call Stack         │  ← chạy code đồng bộ
└─────────────────────────────┘
          ↑          ↓ (chứa frame)
┌─────────────────────────────┐
│         Microtask Queue      │  ← Promise.then, queueMicrotask, MutationObserver
└─────────────────────────────┘
          ↑          ↓
┌─────────────────────────────┐
│         Macrotask Queue      │  ← setTimeout, setInterval, I/O, UI event, fetch
└─────────────────────────────┘
          ↑          ↓
┌─────────────────────────────┐
│         Web APIs / I/O       │  ← browser-provided
└─────────────────────────────┘
```

**Mỗi tick:**
1. Run 1 task từ macrotask queue đến khi stack rỗng
2. Run **TẤT CẢ** microtask cho đến khi queue rỗng
3. (Web) Run render (rAF, style, layout, paint)
4. Lặp lại từ 1

**Hệ quả thực tế:**
```js
console.log('1')

setTimeout(() => console.log('2'), 0)
queueMicrotask(() => console.log('3'))
Promise.resolve().then(() => console.log('4'))

console.log('5')

// Output: 1, 5, 3, 4, 2
// Vì: sync 1,5 → microtask 3,4 → macrotask 2
```

> ⚠️ Long synchronous code block render. Chia nhỏ với `await`, `setTimeout(0)`, `scheduler.yield()`.

## A2. Module Systems

### ESM (ECMAScript Modules) — modern, default
```js
// export
export const x = 1
export function fn() {}
export default class Foo {}
export { a, b as renamed }
export * from './other'

// import
import Foo from './foo.js'                      // default
import { x, fn } from './foo.js'                // named
import { a as renamed } from './foo.js'
import * as all from './foo.js'
import './sideEffect.js'                        // chỉ run, không import gì

// Dynamic import (lazy)
const mod = await import('./feature.js')
```

### CommonJS (Node legacy)
```js
// export
module.exports = { x, fn }
module.exports.x = 1
exports.fn = () => {}

// import
const { x, fn } = require('./mod')
const mod = require('./mod')
```

### Khác biệt
| | ESM | CJS |
|---|---|---|
| Loading | static, parse-time | dynamic, run-time |
| Tree-shake | ✅ | ❌ |
| Top-level await | ✅ | ❌ |
| Cyclic dep | handled tốt hơn | có thể partial export |
| Default | future, modern | Node legacy |

## A3. `this` deep dive

5 rules theo thứ tự ưu tiên:

```js
// 1. arrow function — lexical (không bind, kế thừa scope cha)
const fn = () => this

// 2. new — instance mới
new Foo()                                       // this = new Foo()

// 3. explicit bind — call, apply, bind
fn.call(obj, a, b)                              // gọi với this = obj, args
fn.apply(obj, [a, b])
const bound = fn.bind(obj)                      // return function mới với this fixed

// 4. method call
obj.fn()                                        // this = obj

// 5. default
fn()                                            // strict: undefined; non-strict: window
```

**Common pitfalls:**
```js
const obj = {
  name: 'Harry',
  greet() { return this.name }
}
const fn = obj.greet
fn()                                            // undefined! (lost context)

// Fix
const bound = obj.greet.bind(obj)
bound()                                         // 'Harry'

// Or arrow
const obj2 = { name: 'Harry', greet: () => this.name }   // ⚠️ arrow → this = outer scope
```

## A4. Prototype chain

```js
const arr = [1, 2, 3]
arr.__proto__ === Array.prototype               // true
arr.__proto__.__proto__ === Object.prototype    // true
arr.__proto__.__proto__.__proto__ === null      // true

// Lookup: arr.x → arr instance → Array.prototype → Object.prototype → null

// Modern API (preferred over __proto__)
Object.getPrototypeOf(arr)
Object.setPrototypeOf(obj, proto)               // ⚠️ slow, tránh
Object.create(proto)                            // tạo object với prototype
```

**Class = prototype sugar:**
```js
class Animal {
  speak() {}
}
class Dog extends Animal {
  bark() {}
}

const d = new Dog()
d.bark === Dog.prototype.bark                   // true
d.speak === Animal.prototype.speak              // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype  // true
```

## A5. Symbol & Iterators

```js
// Make object iterable
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from
    const last = this.to
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}
for (const n of range) console.log(n)           // 1,2,3,4,5
[...range]                                       // [1,2,3,4,5]
```

## A6. Generators (function*)

```js
function* gen() {
  console.log('start')
  yield 1
  yield 2
  console.log('between')
  yield 3
  return 'done'
}

const g = gen()
g.next()                                        // 'start', {value:1, done:false}
g.next()                                        // {value:2, done:false}
g.next()                                        // 'between', {value:3, done:false}
g.next()                                        // {value:'done', done:true}

[...gen()]                                      // [1,2,3]  (return ignored)

// Infinite sequence
function* naturals() {
  let i = 1
  while (true) yield i++
}

// 2-way communication
function* dialog() {
  const name = yield 'What is your name?'
  yield `Hi, ${name}`
}
const d = dialog()
d.next().value                                  // 'What is your name?'
d.next('Harry').value                            // 'Hi, Harry'
```

## A7. Proxy & Reflect (meta-programming)

```js
const handler = {
  get(target, prop, receiver) {
    console.log('GET', prop)
    return Reflect.get(target, prop, receiver)
  },
  set(target, prop, value) {
    console.log('SET', prop, value)
    return Reflect.set(target, prop, value)
  },
  has(target, prop) {
    return Reflect.has(target, prop)
  },
  deleteProperty(target, prop) {
    return Reflect.deleteProperty(target, prop)
  }
}

const obj = new Proxy({ a: 1 }, handler)
obj.a                                            // 'GET a', 1
obj.b = 2                                        // 'SET b 2'
```

Use case: Vue 3 reactivity, MobX, validation, lazy load, default value.

## A8. WeakRef & FinalizationRegistry

```js
// Hold reference không prevent GC
const ref = new WeakRef(bigObj)
const value = ref.deref()                        // có thể là undefined nếu đã GC

// Callback khi GC
const registry = new FinalizationRegistry(heldValue => {
  console.log('Object collected:', heldValue)
})
registry.register(obj, 'metadata', obj)
```

> Edge case, hiếm dùng. Để hiểu memory model.

## A9. Tagged Template Literal

```js
function html(strings, ...values) {
  return strings.reduce((acc, str, i) =>
    acc + str + (values[i] ? escape(values[i]) : ''), ''
  )
}
const name = '<script>alert(1)</script>'
const safe = html`<p>Hello, ${name}!</p>`
// '<p>Hello, &lt;script&gt;alert(1)&lt;/script&gt;!</p>'

// Use case: styled-components, gql, sql tag
const query = sql`SELECT * FROM users WHERE id = ${userId}`
```

## A10. Common Gotchas Cheat Sheet

```js
// 1. Floating point
0.1 + 0.2                       // 0.30000000000000004
0.1 + 0.2 === 0.3               // false

// 2. typeof null
typeof null                     // 'object' (bug từ 1995)

// 3. NaN
NaN === NaN                     // false
Number.isNaN(NaN)               // true ✅

// 4. Array.length sparse
const arr = [1, 2, 3]
arr.length = 5
arr                             // [1,2,3, <empty>, <empty>]
arr.map(x => x * 2)             // [2,4,6, <empty>, <empty>]

// 5. Coercion
[] + []                         // '' (both convert to string)
[] + {}                         // '[object Object]'
{} + []                         // 0 in browser (parse as block!)
[1,2] + [3,4]                   // '1,23,4'

// 6. Truthy unexpected
Boolean([])                     // true
Boolean({})                     // true
Boolean('false')                // true
Boolean('0')                    // true

// 7. parseInt with leading 0
parseInt('08')                  // ES5: 0 (octal!), Modern: 8 ✅
parseInt('08', 10)              // ✅ always specify radix

// 8. forEach + async
arr.forEach(async x => await save(x))   // ⚠️ chạy parallel, không await được

// 9. for...in với array
for (const i in arr) {}         // duyệt cả inherited prop ⚠️
// ✅ dùng for...of hoặc forEach

// 10. var hoisting
console.log(x)                  // undefined (không error)
var x = 5
// vs let — ReferenceError (TDZ)

// 11. Hoisting function decl vs expr
sayHi()                         // OK
function sayHi() {}
sayBye()                        // TypeError: undefined is not a function
var sayBye = function() {}

// 12. Object key coercion
const o = {}
o[true] = 'bool'
o['true']                       // 'bool' (key → string)
o[1] = 'one'
o['1']                          // 'one'

// 13. setTimeout 0
console.log(1)
setTimeout(() => console.log(2), 0)
console.log(3)
// 1, 3, 2 — không đồng bộ, push vào queue

// 14. JSON limit
JSON.stringify({a: undefined, b: () => {}, c: Symbol()})  // '{}'
JSON.stringify(NaN)             // 'null'
JSON.stringify(Infinity)        // 'null'
```

## A11. Modern JS features cần biết (2022–2025)

```js
// ES2022
class.#private                                  // private fields
class.static {}                                 // static blocks
arr.at(-1)                                      // negative index
obj.hasOwn(prop)                                // safer than hasOwnProperty
await topLevel                                  // top-level await (ESM)
err.cause                                       // new Error('msg', { cause: original })

// ES2023
arr.toSorted(), toReversed(), toSpliced(), with()
arr.findLast(), findLastIndex()
Hashbang grammar `#!/usr/bin/env node`

// ES2024
Object.groupBy(arr, fn)                         // group by
Map.groupBy(arr, fn)
Promise.withResolvers()                         // { promise, resolve, reject }
ArrayBuffer.prototype.resize()
Atomics.waitAsync()
RegExp /v flag (set notation, string property)

// ES2025+
Iterator helpers (.map, .filter, .take on iterator)
Set methods (.union, .intersection, .difference)
Decorators (TC39 stage 3)
Temporal API (proposal — modern Date replacement)
Pipeline operator `|>`  (proposal)
Pattern matching (proposal)
```

## A12. References & Further Learning

**Tutorials:**
- [javascript.info](https://javascript.info) ⭐ — best free JS tutorial
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Asabeneh / 30-Days-Of-JavaScript](https://github.com/Asabeneh/30-Days-Of-JavaScript) — repo gốc

**Books:**
- **You Don't Know JS Yet** — Kyle Simpson (free GitHub)
- **Eloquent JavaScript** — Marijn Haverbeke (free online)
- **JavaScript: The Good Parts** — Douglas Crockford
- **Functional-Light JavaScript** — Kyle Simpson

**Challenges:**
- [BFE.dev](https://bigfrontend.dev) — FE specific (algo, system design)
- [GreatFrontEnd](https://www.greatfrontend.com)
- [LeetCode](https://leetcode.com) (algo)
- [JS Quizzes — Lydia Hallie](https://github.com/lydiahallie/javascript-questions)

**Videos:**
- **Fireship** — quick concepts
- **Lydia Hallie** — visual JS deep dive
- **Web Dev Simplified**
- **Jack Herrington** — patterns

**Communities:**
- [DEV.to JavaScript](https://dev.to/t/javascript)
- [r/javascript](https://reddit.com/r/javascript)
- [V8 blog](https://v8.dev/blog) — engine internals
- [TC39 proposals](https://github.com/tc39/proposals)

---

> **Lời kết:** JavaScript là ngôn ngữ phát triển nhanh, hãy luôn cập nhật proposal mới của TC39, đọc release note V8/Node, và quan trọng nhất là **viết code thực tế** — build project, đọc code người khác, contribute open source.
>
> Khi đã nắm chắc JS, các framework (React, Vue, Svelte) chỉ là tool — nguyên lý cốt lõi vẫn là JS.
>
> Chúc bạn học vui và xây được nhiều thứ! 🚀

