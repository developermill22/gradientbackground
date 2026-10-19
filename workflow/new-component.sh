#!/usr/bin/env bash
# Creates a new component project with the series conventions already in place.
# Usage: workflow/new-component.sh <ProjectName> [parent-folder]
set -euo pipefail

NAME="${1:?Usage: new-component.sh <ProjectName> [parent-folder]}"
HERE="$(cd "$(dirname "$0")" && pwd)"
PARENT="${2:-$(cd "$HERE/../.." && pwd)}"
DEST="$PARENT/$NAME"

if [ -e "$DEST" ]; then
  echo "Folder already exists: $DEST" >&2
  exit 1
fi

echo "Creating $DEST from the Expo SDK 57 bare template"
cd "$PARENT"
npx --yes create-expo-app@latest "$NAME" --template bare-minimum@sdk-57 --no-install

cd "$DEST"
cp "$HERE/templates/CLAUDE.md" "$HERE/templates/AGENTS.md" .
mkdir -p patches src/components src/constants docs
cp "$HERE/templates/patches/"* patches/

npm install --save-dev patch-package

# Xcode 26.2 fix: drop SWIFT_RETURNS_RETAINED from the RuntimeScheduler constructors,
# then record it as a patch for whichever expo-modules-jsi version was installed.
HEADER=node_modules/expo-modules-jsi/apple/Sources/ExpoModulesJSI-Cxx/include/RuntimeScheduler.h
if grep -q "SWIFT_RETURNS_RETAINED RuntimeScheduler(" "$HEADER"; then
  sed -i '' 's/SWIFT_RETURNS_RETAINED RuntimeScheduler(/RuntimeScheduler(/' "$HEADER"
  npx patch-package expo-modules-jsi
else
  echo "expo-modules-jsi no longer needs the Xcode 26.2 patch; skipping it."
  rm -f patches/README.md
fi

# patch-package reapplies the fix after every install.
node -e '
const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json", "utf8"));
p.scripts = { ...p.scripts, postinstall: "patch-package" };
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
'

git init -q 2>/dev/null || true
git add -A
git commit -qm "Start $NAME from the component series template" || true

echo
echo "Ready: $DEST"
echo "In Langflow, set the Project Folder node of each flow to: $DEST"
