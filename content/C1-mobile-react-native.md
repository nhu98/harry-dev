# C1 — React Native chuyên sâu (Mobile)

> Đọc `A3-core-react.md` trước (phần React dùng chung: fundamentals, hooks, state, forms, data fetching). File này chỉ chứa phần đặc thù React Native — bilingual VI/EN.

---

## Mục lục

1. [React Native Specifics](#rn-specifics)
2. [Navigation (React Navigation)](#navigation)
3. [Styling trong RN](#styling)
4. [Animation](#animation)
5. [Native Modules & Bridging](#native-modules)
6. [Performance trong RN](#rn-perf)
7. [Build, Release, OTA](#release)

---

<a id="rn-specifics"></a>
## 1. React Native Specifics

### Rendering — không có DOM
**VI:** Trong **React Native** không có DOM, mà render qua native views (UIView trên iOS, ViewGroup trên Android) qua **bridge** (cũ) hoặc **JSI** (mới).

### Core components mapping
| Web | React Native |
|---|---|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` (mọi text PHẢI trong Text) |
| `<img>` | `<Image>` hoặc `expo-image` |
| `<input>` | `<TextInput>` |
| `<button>` | `<Pressable>` / `<TouchableOpacity>` |
| `<ul>` long list | `<FlatList>` / `<SectionList>` / `<FlashList>` (Shopify) |
| `<form>` | manual (no native form) |
| CSS file | StyleSheet object hoặc NativeWind |
| `onClick` | `onPress` |
| `display: flex` (mặc định block) | mặc định **flex column** |

### Platform module
```jsx
import { Platform } from 'react-native'
Platform.OS              // 'ios' | 'android' | 'web' (RN-Web)
Platform.select({ ios: 20, android: 16 })
Platform.Version
```

### Dimensions & SafeArea
```jsx
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')
// Tốt hơn: useWindowDimensions (responsive ngay khi xoay)
import { useWindowDimensions } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
<SafeAreaView edges={['top','bottom']}>...</SafeAreaView>
```

### KeyboardAvoidingView
```jsx
<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
  <TextInput />
</KeyboardAvoidingView>
```

### New Architecture (2024+)
- **JSI** (JavaScript Interface): thay bridge, gọi native sync, không serialize JSON
- **TurboModules**: native module lazy load
- **Fabric**: render layer mới, đồng bộ với React 18 concurrent
- **Hermes**: JS engine (default), startup nhanh, bundle nhỏ
- **Codegen**: tự gen native specs từ TS

Bật: `newArchEnabled=true` trong gradle.properties / Podfile.

### Expo vs Bare RN
| | Expo | Bare RN |
|---|---|---|
| Setup | rất nhanh | trung |
| Native code | giới hạn (development build cho custom native) | full control |
| OTA updates | EAS Update built-in | tự setup (CodePush) |
| Build cloud | EAS Build | tự CI (Fastlane) |
| Khuyến nghị | hầu hết app mới | cần native heavy |

### Forms trong RN (React Hook Form)
**Trong RN** dùng `Controller`:
```tsx
<Controller
  control={control}
  name="email"
  render={({ field }) => <TextInput value={field.value} onChangeText={field.onChange} />}
/>
```

---

<a id="navigation"></a>
## 2. Navigation (React Navigation v7)

```tsx
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen name="Tabs" component={TabsNav} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Chi tiết' }} />
    </Stack.Navigator>
  )
}

function TabsNav() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

// Trong screen
navigation.navigate('Detail', { id: 42 })
navigation.goBack()
navigation.replace('Login')
navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
```

**Typed routes (TS):**
```ts
type RootStackParamList = {
  Tabs: undefined
  Detail: { id: number }
  Login: undefined
}
type DetailProps = NativeStackScreenProps<RootStackParamList, 'Detail'>
```

**Deep linking:**
```ts
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Detail: 'detail/:id'
    }
  }
}
<NavigationContainer linking={linking}>...</NavigationContainer>
```

> Đối thủ: **Expo Router** (file-based, giống Next.js) — đang phổ biến lên cho project mới.

---

<a id="styling"></a>
## 3. Styling trong RN

### StyleSheet (built-in)
```tsx
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', color: '#111' }
})
<View style={styles.container}>...
<View style={[styles.container, isActive && styles.active]}>
```

### NativeWind (Tailwind cho RN — recommended)
```tsx
<View className="flex-1 p-4 bg-white dark:bg-neutral-900">
  <Text className="text-lg font-semibold">Hello</Text>
</View>
```

### Tamagui — compile-time optimizer, cross-platform tokens
- Hỗ trợ RN + web, styled components, animation

### Restyle (Shopify)
- Theme + variant + responsive đầy đủ, TS-first

### Theming pattern
```tsx
const ThemeContext = createContext({ colors: {}, spacing: {} })
const useTheme = () => useContext(ThemeContext)
```

### Layout cheats
```tsx
flexDirection: 'row' | 'column'    // mặc định column (khác web)
justifyContent: 'flex-start' | 'center' | 'space-between'  // dọc theo main axis
alignItems: ...                     // dọc theo cross axis
gap: 8                              // ✅ RN 0.71+
```

---

<a id="animation"></a>
## 4. Animation

### Animated API (built-in)
```tsx
const fade = useRef(new Animated.Value(0)).current
useEffect(() => {
  Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }).start()
}, [])
<Animated.View style={{ opacity: fade }}>...
```

### **Reanimated 3** (recommended)
Chạy animation trên UI thread, không block JS thread.
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

const offset = useSharedValue(0)
const style = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }]
}))
return (
  <>
    <Animated.View style={[styles.box, style]} />
    <Button onPress={() => offset.value = withSpring(100)} />
  </>
)
```

### Gestures: **react-native-gesture-handler** + Reanimated
```tsx
const gesture = Gesture.Pan().onChange(e => { offset.value += e.changeX })
<GestureDetector gesture={gesture}><Animated.View style={style} /></GestureDetector>
```

### Layout animations
```tsx
import { LayoutAnimation } from 'react-native'
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
setItems([...items, newItem])
```
Reanimated cũng có `Layout`, `FadeIn`, `SlideInRight` — declarative đẹp.

### Lottie cho animation phức tạp
```tsx
import LottieView from 'lottie-react-native'
<LottieView source={require('./loading.json')} autoPlay loop />
```

---

<a id="native-modules"></a>
## 5. Native Modules & Bridging

Khi RN không có sẵn API: viết native module (Kotlin/Swift) hoặc dùng library cộng đồng (đa số trường hợp).

**Library phổ biến:**
- `react-native-mmkv` — storage siêu nhanh (thay AsyncStorage)
- `react-native-keychain` / `expo-secure-store` — lưu secrets
- `react-native-permissions` — permissions
- `react-native-camera` / `react-native-vision-camera` — camera
- `react-native-svg`
- `@react-native-firebase/*` — Firebase
- `react-native-image-picker`
- `react-native-fast-image` / `expo-image` — image cache & perf
- `react-native-screens` — bắt buộc cho navigation perf
- `react-native-bottom-sheet`

**Codegen + TurboModule (New Arch):** spec TS → tự gen Java/ObjC interface.

---

<a id="rn-perf"></a>
## 6. Performance trong RN

### List rendering — top issue
```tsx
// ❌ map array dài → render hết, lag
items.map(i => <Row {...i} />)

// ✅ FlatList — virtualization
<FlatList
  data={items}
  keyExtractor={i => i.id}
  renderItem={({ item }) => <Row item={item} />}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews
  getItemLayout={(_, i) => ({ length: 80, offset: 80*i, index: i })} // nếu height cố định
/>

// 🚀 FlashList (Shopify) — nhanh hơn nhiều
import { FlashList } from '@shopify/flash-list'
<FlashList data={items} estimatedItemSize={80} renderItem={...} />
```

### Image perf
- Dùng `expo-image` hoặc `react-native-fast-image` (cache disk + memory)
- Đúng size: resize server-side, dùng `cdn?w=400`
- `priority="low"` cho off-screen

### Re-render
- `React.memo(Component)` + ổn định props (`useCallback`)
- Selector cho store (Zustand: pass selector, Redux: `useSelector(shallow)`)
- Tách component nhỏ để re-render co cụm

### JS thread vs UI thread
- Animation: dùng `useNativeDriver: true` hoặc Reanimated worklet → chạy UI thread
- Heavy compute: chia chunk, `InteractionManager.runAfterInteractions()`, hoặc native module

### Startup
- Bật **Hermes** (default mới)
- Bật **New Arch** khi stable cho project
- Lazy load màn ít dùng (`React.lazy` + Suspense)
- Code-split với inline requires (`require()` trong function)
- Dùng **RAM bundle** / **Hermes precompiled**

### Profiling
- **Flipper** (deprecated dần) / **React DevTools Profiler**
- **Hermes Sampling Profiler** — cho JS
- **Xcode Instruments** / **Android Studio Profiler** — cho native
- **Why Did You Render** — debug re-render thừa

---

<a id="release"></a>
## 7. Build, Release, OTA

### Versioning
- `marketingVersion` (1.2.3) — user thấy
- `buildNumber` (CFBundleVersion / versionCode) — tăng mỗi upload store

### EAS Build (Expo)
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### OTA Updates
- **EAS Update** (Expo) — chỉ update JS bundle + asset, không cần qua store cho phần JS
- **CodePush** (Microsoft) — bare RN, sắp deprecated
- ⚠️ Chỉ OTA được phần JS, native code đổi → vẫn phải build lại

### CI/CD
- Fastlane (build, sign, upload)
- GitHub Actions / Bitrise / EAS
- Detox/Maestro cho E2E pre-release

### App Store / Play Store gotchas
- iOS: Privacy Manifest (2024), App Tracking Transparency
- Android: target SDK update theo deadline Google, large icon adaptive
- Crash reporting: Sentry / Firebase Crashlytics

---

## References
- [React Native docs](https://reactnative.dev)
- [Expo docs](https://docs.expo.dev)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
