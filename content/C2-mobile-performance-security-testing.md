# C2 — Performance · Security · Testing (Mobile/React Native)

> Đọc `B2-web-performance-security.md` và `A5-core-testing.md` trước cho phần nền dùng chung (Core Web Vitals, OWASP/XSS/JWT, Jest/RTL/MSW...). File này gom phần đặc thù React Native tách từ hai file đó.

---

## Mục lục

**Phần 1 — Performance (React Native)**
1. [Virtualization & bundle (RN)](#rn-list-bundle)
2. [Image & Font (RN)](#rn-image)
3. [App cache (RN)](#rn-cache)
4. [React Native Performance tổng quan](#rn-perf)
5. [Memory debug & profiling tools (RN)](#rn-profiling)

**Phần 2 — Security (Mobile/RN)**
6. [Mobile-specific security (RN)](#rn-security)

**Phần 3 — Testing (React Native)**
7. [React Native Testing Library](#rntl)
8. [Mock React Navigation, AsyncStorage](#rn-mock)
9. [E2E — Detox vs Maestro](#rn-e2e)
10. [Visual regression, performance & a11y testing (RN)](#rn-perf-a11y)

---

## PHẦN 1 — PERFORMANCE (REACT NATIVE)

<a id="rn-list-bundle"></a>
## 1. Virtualization & Bundle (RN)

### Virtualization cho list dài
- RN: `FlatList`, `FlashList`

### Phân tích bundle
- RN: `npx react-native-bundle-visualizer` hoặc Source Map Explorer

---

<a id="rn-image"></a>
## 2. Image & Font (RN)

### RN
- `expo-image` (recommended) — built-in cache, placeholder, blurhash, transition
- `react-native-fast-image` — cũ nhưng vẫn tốt
- Đúng size, đừng download 4K cho thumbnail
- CDN với image transform: Cloudinary, imgix, Cloudflare Images

### Font
- RN: `expo-font` hoặc `react-native-asset` link

---

<a id="rn-cache"></a>
## 3. App Cache (RN)

### App cache (RN)
- TanStack Query in-memory cache (default)
- Persist cache: `@tanstack/react-query-persist-client` + AsyncStorage/MMKV
- Image cache: lib (expo-image) hoặc Cloudflare Cache-Control

---

<a id="rn-perf"></a>
## 4. React Native Performance (chi tiết → file A3)

Tóm lại: **FlashList**, **Reanimated**, **Hermes**, **New Arch**, image lib chuẩn, ổn định props, profile thường xuyên.

---

<a id="rn-profiling"></a>
## 5. Memory Debug & Profiling Tools (RN)

### Debug memory
- RN: Xcode Memory Graph / Android Studio Profiler

### Profiling tools
- **Hermes Sampling Profiler** (RN JS)
- **Flashlight by Bam** (RN scoring)
- **Reassure** (component perf regression test)

---

## PHẦN 2 — SECURITY (MOBILE/RN)

<a id="rn-security"></a>
## 6. Mobile-specific (React Native)

### Secure storage
| Data | Storage |
|---|---|
| JWT, biometric token | `expo-secure-store` / `react-native-keychain` |
| User prefs | MMKV / AsyncStorage |
| Sensitive form | **never** persist |

```ts
import * as SecureStore from 'expo-secure-store'
await SecureStore.setItemAsync('token', jwt, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY })
const token = await SecureStore.getItemAsync('token')
```

### Network
- **HTTPS only**, hard fail HTTP
- **Certificate pinning** — chống MITM (TrustKit, `react-native-ssl-pinning`)
- Trong iOS: ATS (App Transport Security) bật mặc định

### Reverse engineering
- **Bundle obfuscation** — `react-native-obfuscating-transformer`, Hermes bytecode (khó decompile hơn)
- **Jailbreak/root detection** — `jail-monkey`
- **Anti-debugging** flags

### Biometric auth
- `expo-local-authentication` / `react-native-biometrics`
- Pattern: dùng để unlock secret trong Keychain, KHÔNG để auth chính

### Deep link safety
- Verify domain (universal links, app links)
- Validate params chặt
- Don't trust intent extras

### App permissions
- Chỉ xin khi cần (just-in-time)
- Giải thích lý do (Privacy strings iOS bắt buộc)

### Privacy
- iOS Privacy Manifest (2024+) bắt buộc khai báo SDK + lý do API
- Android Data Safety form
- GDPR consent flow

---

## PHẦN 3 — TESTING (REACT NATIVE)

<a id="rntl"></a>
## 7. React Native Testing Library

```bash
npm i -D @testing-library/react-native
```
```tsx
import { render, screen, fireEvent } from '@testing-library/react-native'

it('renders button', () => {
  render(<MyScreen />)
  fireEvent.press(screen.getByText('Submit'))
  expect(screen.getByText('Submitted!')).toBeOnTheScreen()
})
```

---

<a id="rn-mock"></a>
## 8. Mock React Navigation, AsyncStorage, etc

```ts
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() })
}))
```

---

<a id="rn-e2e"></a>
## 9. E2E — React Native — Detox vs Maestro

**Detox** (Wix) — battle-tested, gray-box, JS API
```js
describe('Login', () => {
  beforeAll(async () => { await device.launchApp() })
  it('logs in', async () => {
    await element(by.id('email')).typeText('a@b.c')
    await element(by.id('password')).typeText('pass1234')
    await element(by.id('login-btn')).tap()
    await expect(element(by.text('Welcome'))).toBeVisible()
  })
})
```
Cần setup native build, chạy chậm hơn.

**Maestro** ⭐ (recommended 2024+) — YAML, đơn giản, nhanh
```yaml
appId: com.myapp
---
- launchApp
- tapOn: "Email"
- inputText: "a@b.c"
- tapOn: "Password"
- inputText: "pass1234"
- tapOn: "Login"
- assertVisible: "Welcome"
```
Chạy: `maestro test login.yaml`. Hỗ trợ iOS + Android + Flutter + web.

---

<a id="rn-perf-a11y"></a>
## 10. Visual Regression, Performance & A11y Testing (RN)

### Visual regression
- **Loki** cho RN + Storybook

### Performance
- **Reassure** (RN) — đo render thời gian, fail nếu regress
```ts
import { measureRenders } from 'reassure'
measureRenders(<Component />, { scenario: async () => {...} })
```

### Accessibility
- RN: AccessibilityInfo API, manual screen reader (VoiceOver, TalkBack)

---

## References
- [React Native Security](https://reactnative.dev/docs/security)
- [Maestro](https://maestro.mobile.dev)
- [Detox](https://wix.github.io/Detox/)
