# Patches

## `expo-modules-jsi+<version>.patch`

Removes `SWIFT_RETURNS_RETAINED` from the two `expo::RuntimeScheduler` constructors
in `RuntimeScheduler.h`.

**Why:** Swift's ClangImporter only accepts `returns_retained` on *constructors* of a
`SWIFT_SHARED_REFERENCE` type from Swift 6.3 (Xcode 26.4) onward. On Xcode 26.2 /
Swift 6.2.3 it fails the `Build ExpoModulesJSI xcframework` phase with:

```
'RuntimeScheduler' cannot be annotated with either SWIFT_RETURNS_RETAINED or
SWIFT_RETURNS_UNRETAINED because it is not returning a SWIFT_SHARED_REFERENCE type
```

The message is misleading — the type *is* imported as a shared reference. A free
function returning `RuntimeScheduler *` with the same annotation compiles fine on
this toolchain; only the constructor form is rejected.

**Why it is safe:** Swift 6.2 already imports these constructors as `+1`. Verified by
constructing the scheduler from Swift with the annotation removed and reading the
private `refCount`, which is `1` immediately after construction — exactly the
ownership the annotation declares. So the patch changes nothing at runtime here; the
annotation is only needed to satisfy newer toolchains that require it explicitly.

**Remove this patch when:** upgrading to Xcode 26.4+ (Swift 6.3+), which is the
toolchain Expo SDK 57 officially targets. Delete the patch file and run
`rm -rf node_modules/expo-modules-jsi/apple/Products` before rebuilding.
