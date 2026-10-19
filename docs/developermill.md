# 11 Bottom Navigation Bar Styles in Expo, With No Animation Library

The bottom navigation bar is the part of a mobile app people touch most. It's also where many apps look the same. This post builds one `BottomNavBar` component for React Native that renders **eleven styles**: minimal, glass, floating, neumorphic, gradient, an iOS-style dock and more. It does this without Reanimated or any other animation library, and every animation runs on the native thread.

Each style is a plain config object, so a twelfth style means adding data, not writing a new component.

| # | Style | Look |
| --- | --- | --- |
| 01 | Minimal Clean | White bar, sliding dot under the active tab |
| 02 | Glassmorphism | Floating frosted-glass bar over a gradient |
| 03 | Floating (Detached) | Inset bar with a bump behind an inline Create button |
| 04 | Neumorphism | Soft extruded slab made with two opposite shadows |
| 05 | Pill Highlight | Tinted pill that slides behind the active tab |
| 06 | Center FAB | Raised floating action button in the middle |
| 07 | Gradient Bold | Full-width three-colour gradient bar |
| 08 | Outline Icons | Outline glyphs that stay outlined, with a sliding underline |
| 09 | Tab with Indicator | Line along the top edge of the active tab |
| 10 | Curved Background | Floating rounded gradient bar with an underline |
| 11 | Dock Style (iOS Inspired) | Translucent floating dock |

## Stack

- Expo SDK 57, React Native 0.86, plain JavaScript
- `expo-blur` for the glass surfaces
- `expo-linear-gradient` for the gradient surfaces
- `expo-haptics` for tap feedback
- `@react-native-vector-icons/ionicons` for icons
- Built-in `Animated` with `useNativeDriver: true`

## Install

```sh
npx expo install expo-blur expo-linear-gradient expo-haptics @react-native-vector-icons/ionicons
```

`npx expo install` picks the versions that match your SDK. `@expo/vector-icons` is being deprecated, so this project uses `@react-native-vector-icons/ionicons`. Its default import loads the font at runtime through `expo-font`, so no native font setup is needed. Add it to the `plugins` array in `app.json`, and rebuild your dev client because these are native packages.

## Project structure

| File | Role |
| --- | --- |
| `src/constants/bottomNav.js` | Tab definitions and the 11 variant configs |
| `src/components/BottomNavBar.js` | Docked or floating layout, shadows, haptics, press handling |
| `src/components/NavTab.js` | A single tab, plus the center "Create" button |
| `src/components/NavIndicator.js` | The sliding dot, pill, underline or top line |
| `src/components/NavSurface.js` | Plain, frosted-glass or gradient background |
| `src/components/NavPreviewCard.js` | Demo tile that shows a live bar inside a phone frame |

## A style is just data

Each variant is described with a few fields:

```js
{
  id: 'pill',
  title: 'Pill Highlight',
  tabs: [HOME, EXPLORE, PROJECTS, SAVED, PROFILE],
  layout: 'docked',        // 'docked' | 'floating'
  surface: 'plain',        // 'plain' | 'glass' | 'gradient' | 'neumorph'
  indicator: 'pill',       // 'none' | 'dot' | 'pill' | 'underline' | 'topLine'
  iconStyle: 'filled',     // 'filled' swaps to the filled glyph when active
  colors: { background: '#FFFFFF', active: '#5B4CF0', inactive: '#8A8FA3', indicator: '#ECE9FF' },
}
```

A tab's `icon` is an Ionicons base name. The filled glyph is `icon` and the outline glyph is `${icon}-outline`, so one name covers both states. A tab marked `action: true` is a "Create" button. It calls `onAction` and never becomes the selected tab. The `center` field draws it as an `'inline'` circle or a `'raised'` FAB.

## Usage

`BottomNavBar` is a controlled component:

```jsx
const [tab, setTab] = useState('home');

<BottomNavBar
  variant={NAV_VARIANTS[4]}   // Pill Highlight
  activeKey={tab}
  onChange={setTab}
  onAction={() => openComposer()}
/>
```

`bottomInset` is optional and defaults to the device's safe-area bottom inset, so the bar clears the home indicator. Wrap your app in `SafeAreaProvider`.

## Keeping every animation on the native driver

The native driver can animate `opacity` and `transform`, but not `color`. A typical tab bar animates the icon colour, so this one does something else.

**Cross-faded layers.** Each tab draws its icon and label twice, stacked on top of each other: an outline icon and label in the inactive colour, and a filled icon and bold label in the active colour. One `progress` value from 0 to 1 cross-fades the two layers:

```js
const fadeOut = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

<Animated.View style={[styles.layer, { opacity: fadeOut }]}>
  <Ionicons name={outline} size={22} color={colors.inactive} />
</Animated.View>
<Animated.View style={[styles.layer, { opacity: progress }]}>
  <Ionicons name={activeIcon} size={22} color={colors.active} />
</Animated.View>
```

The same `progress` value also scales the active icon to 1.08 and lifts it 2 px. A separate spring squeezes the tab to 0.88 while your finger is down. Everything is `opacity`, `scale` or `translateY`, so it all stays on the native thread.

**A sliding indicator.** The indicator is exactly one tab slot wide. The row measures its width with `onLayout`, and the indicator springs with `translateX: index * slotWidth`. On the first layout it jumps straight into place so it doesn't fly in from the left, and after that it springs:

```js
if (!placed.current) {
  x.setValue(toValue);
  placed.current = true;
  return;
}
Animated.spring(x, { toValue, friction: 8, tension: 90, useNativeDriver: true }).start();
```

The dot, pill, underline and top line are all the same moving slot with a different shape inside it.

## Surfaces

- **Glass** layers a `BlurView` under a translucent tint and a thin white border.
- **Gradient** is a horizontal `LinearGradient` that fills the bar and is clipped to its corner radius.
- **Neumorphism** has no special surface. It wraps the bar in two nested views with opposite shadows, a dark one to the bottom right and a light one to the top left. Together they make the soft extruded look.
- **Floating** bars sit 16 px in from the screen edges with a 28 px radius and a deeper shadow. Docked bars sit on the bottom edge with a light upward shadow.

## Haptics and accessibility

- Switching tabs plays a selection haptic. Tapping Create plays a medium impact.
- Tapping the tab that's already active does nothing.
- The bar has `accessibilityRole="tabbar"`. Each tab is a `tab` with `accessibilityState={{ selected }}`, so screen readers announce which tab is selected.
- Every tab fills an equal share of the row and is at least 56 px tall, above the 48 px minimum tap target.

## Gotchas

- **Android blur:** `BlurView` blurs on Android only when it gets a `BlurTargetView` through `blurTarget` and a `blurMethod` such as `'dimezisBlurView'`. Without them, Android draws a semi-transparent view. The glass styles still look right there because they use a translucent tint as a fallback.
- **Android shadows:** elevation shadows only render on views with a solid background, so plain and neumorphic bars set `backgroundColor` on the outer view.
- **Two labels:** the active label is absolutely positioned over the inactive one, so the bold text doesn't change the tab's width.

## Design tips

- Keep it to 4–5 items.
- Make the active state obvious.
- Use one icon style throughout.
- Make tap targets at least 48×48.
- Add small touches: press feedback, a sliding indicator, haptics.
