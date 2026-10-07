# A5 — Testing & Quality (dùng chung)

> Nguyên tắc testing dùng chung cho cả web + mobile: Jest, RTL, MSW, Playwright/Cypress, TDD, coverage, tooling, Git/CI. Phần React Native (RNTL, Detox, Maestro...) đã tách sang `C2-mobile-performance-security-testing.md`.

---

## Mục lục

1. [Testing Pyramid](#pyramid)
2. [Unit testing với Jest](#jest)
3. [Component testing — React Testing Library](#rtl)
4. [Mocking strategies](#mocking)
5. [Integration testing](#integration)
6. [E2E testing — Cypress, Playwright](#e2e)
7. [TDD & BDD](#tdd)
8. [Snapshot testing](#snapshot)
9. [Test coverage](#coverage)
10. [Visual regression](#visual)
11. [Performance & accessibility testing](#perf-a11y)
12. [Code quality tooling](#tooling)
13. [Git workflow & CI](#git-ci)

---

<a id="pyramid"></a>
## 1. Testing Pyramid

```
        /\
       /E2E\        ← ít, chậm, đắt, brittle
      /-----\
     /  Int  \      ← vừa
    /---------\
   /   Unit    \    ← nhiều, nhanh, rẻ
  /-------------\
```

**Quy tắc 70/20/10** (truyền thống). Hiện nay nhiều team nghiêng **"Testing Trophy"** (Kent C. Dodds):
```
  E2E
  Integration ←⭐ nhiều nhất
  Unit
  Static (TS, ESLint)
```
→ Integration test cho confidence cao nhất / chi phí hợp lý.

---

<a id="jest"></a>
## 2. Unit Testing với Jest

```bash
npm i -D jest @types/jest ts-jest
```

```ts
// math.ts
export const sum = (a: number, b: number) => a + b

// math.test.ts
import { sum } from './math'

describe('sum', () => {
  it('cộng 2 số dương', () => {
    expect(sum(1, 2)).toBe(3)
  })

  it.each([
    [1, 2, 3],
    [0, 0, 0],
    [-1, 1, 0],
  ])('sum(%i, %i) = %i', (a, b, expected) => {
    expect(sum(a, b)).toBe(expected)
  })
})
```

### Lifecycle hooks
```ts
beforeAll(() => { /* setup once */ })
afterAll(() => { /* teardown once */ })
beforeEach(() => { /* before each test */ })
afterEach(() => { /* cleanup after each */ })
```

### Matchers thường dùng
```ts
expect(v).toBe(5)                  // ===
expect(obj).toEqual({a:1})         // deep equal
expect(arr).toContain(2)
expect(arr).toHaveLength(3)
expect(obj).toHaveProperty('user.name', 'Harry')
expect(fn).toThrow('error msg')
expect(s).toMatch(/regex/)
expect(num).toBeGreaterThan(5)
expect(num).toBeCloseTo(0.3)       // float
expect(promise).resolves.toBe(...)
expect(promise).rejects.toThrow()
expect(mock).toHaveBeenCalledTimes(2)
expect(mock).toHaveBeenCalledWith('a', 1)
```

### Async
```ts
it('async', async () => {
  const data = await fetchData()
  expect(data).toEqual({...})
})
// hoặc
it('resolves', () => expect(fetchData()).resolves.toEqual({...}))
```

### Test runner alternative
- **Vitest** (compat Jest API, nhanh hơn nhiều cho Vite/ESM)
- **Bun test** (siêu nhanh, built-in)

---

<a id="rtl"></a>
## 3. Component Testing — React Testing Library

**Philosophy:** "Test cách user dùng app, không test implementation detail."

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

it('tăng counter khi click', async () => {
  const user = userEvent.setup()
  render(<Counter />)

  expect(screen.getByText('0')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /increment/i }))

  expect(screen.getByText('1')).toBeInTheDocument()
})
```

### Queries (theo thứ tự ưu tiên)
1. `getByRole` ⭐ best — phản ánh a11y
2. `getByLabelText` — form
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByAltText`
7. `getByTitle`
8. `getByTestId` — last resort

**Variants:**
- `getBy*` — fail nếu không tìm thấy
- `queryBy*` — null nếu không có (dùng cho assert vắng)
- `findBy*` — async, retry đến khi xuất hiện

```tsx
expect(screen.queryByText('Loading')).not.toBeInTheDocument()
const item = await screen.findByText('Loaded data')
```

### Test hooks
```tsx
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

it('counter increments', () => {
  const { result } = renderHook(() => useCounter())
  act(() => result.current.inc())
  expect(result.current.count).toBe(1)
})
```

---

<a id="mocking"></a>
## 4. Mocking Strategies

### Mock function
```ts
const fn = jest.fn()
fn.mockReturnValue(10)
fn.mockResolvedValue({ data: 1 })   // promise
fn.mockRejectedValue(new Error())
fn.mockImplementation(x => x * 2)
expect(fn).toHaveBeenCalled()
```

### Mock module
```ts
// __mocks__/axios.ts
export default { get: jest.fn(), post: jest.fn() }

// hoặc inline
jest.mock('axios')
import axios from 'axios'
;(axios.get as jest.Mock).mockResolvedValue({ data: ... })
```

### Partial mock
```ts
jest.mock('./service', () => ({
  ...jest.requireActual('./service'),
  expensiveCall: jest.fn().mockReturnValue(1)
}))
```

### Spy
```ts
const spy = jest.spyOn(console, 'log').mockImplementation()
foo()
expect(spy).toHaveBeenCalledWith('hi')
spy.mockRestore()
```

### Timers
```ts
jest.useFakeTimers()
jest.advanceTimersByTime(1000)
jest.runAllTimers()
jest.useRealTimers()
```

### MSW (Mock Service Worker) — recommended cho API
Intercept network ở mức network layer, dùng được cho cả test + dev.
```ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.get('/api/users', () => HttpResponse.json([{ id: 1, name: 'Harry' }]))
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

<a id="integration"></a>
## 5. Integration Testing

Test nhiều unit kết hợp, mock chỉ ở boundary (API, DB).
```tsx
it('login flow', async () => {
  const user = userEvent.setup()
  render(<App />)        // toàn app, real store, mock API qua MSW

  await user.type(screen.getByLabelText(/email/i), 'a@b.c')
  await user.type(screen.getByLabelText(/password/i), 'pass1234')
  await user.click(screen.getByRole('button', { name: /login/i }))

  expect(await screen.findByText(/welcome/i)).toBeInTheDocument()
})
```

---

<a id="e2e"></a>
## 6. E2E Testing

### Web — Playwright (recommended) hoặc Cypress
```ts
// Playwright
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('a@b.c')
  await page.getByLabel('Password').fill('pass1234')
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByText('Welcome')).toBeVisible()
})
```
**Playwright vs Cypress:**
| | Playwright | Cypress |
|---|---|---|
| Browser | Chromium, Firefox, WebKit | Chromium, Firefox |
| Parallel | native | paid for cloud |
| Multi-tab/window | ✅ | ❌ |
| iframe | ✅ | hạn chế |
| Speed | nhanh hơn | ổn |
| DX (UI) | tốt | tốt hơn cho beginner |

> E2E cho React Native (Detox vs Maestro) → xem `C2-mobile-performance-security-testing.md`.

---

<a id="tdd"></a>
## 7. TDD & BDD

### TDD (Test-Driven Development) — Red → Green → Refactor
1. 🔴 Viết test fail (red)
2. 🟢 Viết code TỐI THIỂU để pass (green)
3. ♻️ Refactor (giữ test pass)

**Lợi:** thiết kế tốt hơn, regression safety, doc sống.
**Hại:** chậm ban đầu, test brittle nếu test wrong abstraction.

### BDD (Behavior-Driven) — Given-When-Then
```gherkin
Feature: Login
  Scenario: Valid credentials
    Given I am on the login page
    When I enter "a@b.c" and "pass1234"
    Then I should see "Welcome"
```
Tools: **Cucumber**, **Jest-Cucumber**. RTL test cũng có thể viết theo Given-When-Then bằng comment.

---

<a id="snapshot"></a>
## 8. Snapshot Testing

```ts
it('matches snapshot', () => {
  const tree = render(<Button>Click</Button>).toJSON()
  expect(tree).toMatchSnapshot()
})
```
Update: `jest -u`.

⚠️ **Lạm dụng = test giấy:** dev cứ chạy `-u`, mất ý nghĩa. Dùng snapshot chỉ cho:
- Component đơn giản, output stable
- Inline snapshot (`toMatchInlineSnapshot`) — review dễ trong PR
- Tránh snapshot toàn page

---

<a id="coverage"></a>
## 9. Test Coverage

```bash
jest --coverage
```
Báo cáo 4 metric: **Lines**, **Statements**, **Functions**, **Branches**.

**Mục tiêu thực tế:**
- 80% là điểm rất tốt (không phải 100%)
- Cover **critical path** trước (login, payment, auth)
- Không obsess: 100% coverage không nghĩa là không bug

```json
// jest.config.js
coverageThreshold: {
  global: { branches: 70, functions: 80, lines: 80, statements: 80 }
}
```

---

<a id="visual"></a>
## 10. Visual Regression Testing

- **Chromatic** (Storybook) — capture mỗi story
- **Percy**
- **Playwright screenshot** built-in
```ts
await expect(page).toHaveScreenshot('home.png')
```

---

<a id="perf-a11y"></a>
## 11. Performance & Accessibility Testing

### Performance
- **Lighthouse CI** trong pipeline

### Accessibility
- **jest-axe** — chạy aXe trong unit test
```ts
import { axe } from 'jest-axe'
const { container } = render(<App />)
expect(await axe(container)).toHaveNoViolations()
```
- **Storybook a11y addon**
- Browser: aXe DevTools, Lighthouse a11y

---

<a id="tooling"></a>
## 12. Code Quality Tooling

### TypeScript
- `strict: true` luôn bật
- `noUncheckedIndexedAccess`, `noImplicitOverride`
- Type narrowing với `as const`, discriminated union

### ESLint
```bash
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```
Plugin RN: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-native`.

Rule quan trọng:
- `react-hooks/exhaustive-deps`
- `react-hooks/rules-of-hooks`
- `no-unused-vars`
- `no-console` (warn)

### Prettier
```json
{ "semi": false, "singleQuote": true, "trailingComma": "all", "printWidth": 100 }
```
Tách `.prettierrc` + `.eslintrc` (đừng để ESLint format — chậm). Dùng `eslint-config-prettier` để tắt rule conflict.

### Husky + lint-staged
```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```
Pre-commit hook tự lint + format file đang thay đổi.

### Commit convention
**Conventional Commits**:
```
feat(auth): add login screen
fix(navigation): handle deep link crash
refactor(api): extract base client
chore: bump deps
docs: update README
test: add e2e for checkout
perf: memoize feed list
```
+ **commitlint** + **changesets** / **semantic-release** cho auto changelog & versioning.

---

<a id="git-ci"></a>
## 13. Git Workflow & CI

### Branching
- **GitFlow** — master, develop, feature/*, release/*, hotfix/* (nặng)
- **GitHub Flow** — main + short-lived feature branch (recommended)
- **Trunk-Based** — commit thẳng main, feature flag (high-perf team)

### PR best practices
- Nhỏ (< 400 lines diff)
- Mô tả: WHY > WHAT, screenshot nếu UI
- Self-review trước khi request reviewer
- 1 PR = 1 mục đích

### CI pipeline (GitHub Actions example)
```yaml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test --coverage
      - uses: codecov/codecov-action@v4
```

### Pipeline steps recommended
1. Install deps (cached)
2. Lint
3. Typecheck
4. Unit + integration test (coverage)
5. Build
6. E2E (preview deploy)
7. Bundle size check (size-limit, bundlewatch)
8. Lighthouse / accessibility check
9. Deploy (staging auto, prod gated)

---

## References
- [Testing Library](https://testing-library.com)
- [Jest docs](https://jestjs.io)
- [Playwright](https://playwright.dev)
- [Kent C. Dodds — Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [MSW](https://mswjs.io)
