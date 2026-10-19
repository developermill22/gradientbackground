@AGENTS.md

# Component series conventions

- Expo SDK 57 bare project (ios/ and android/ are checked in). React Native 0.86, plain JavaScript.
- One component per project. Data in src/constants, components in src/components, App.js stays a small demo screen.
- Styles with StyleSheet. Animation with built-in Animated and `useNativeDriver: true`; ask before adding an animation library.
- Install native packages with `npx expo install` so versions match the SDK. A new native package needs a native rebuild.
- Check the JS bundles with `npx expo export --platform ios --output-dir /tmp/expo-export-check` before starting a native build.
- To check only that iOS builds, use `npx expo run:ios --no-bundler`.
- Xcode 26.2 needs the expo-modules-jsi patch in patches/ (see patches/README.md) until Xcode is upgraded to 26.4+.
- Diagnose build errors with a minimal standalone reproduction before patching anything.
- Each component gets a developermill.com write-up in docs/developermill.md.
