#!/bin/bash

# 复制自定义的 Android 文件到构建目录

echo "📋 Copying custom Android files..."

# 定义源目录和目标目录
CUSTOM_DIR="android"
GEN_DIR="gen/android"

# 复制 MainActivity.kt
if [ -f "$CUSTOM_DIR/app/src/main/java/com/silent/fitnesstracker/MainActivity.kt" ]; then
    mkdir -p "$GEN_DIR/app/src/main/java/com/silent/fitnesstracker"
    cp "$CUSTOM_DIR/app/src/main/java/com/silent/fitnesstracker/MainActivity.kt" \
       "$GEN_DIR/app/src/main/java/com/silent/fitnesstracker/MainActivity.kt"
    echo "✅ Copied MainActivity.kt"
else
    echo "⚠️  MainActivity.kt not found in custom directory"
fi

# 复制主题文件
if [ -f "$CUSTOM_DIR/app/src/main/res/values/themes.xml" ]; then
    mkdir -p "$GEN_DIR/app/src/main/res/values"
    cp "$CUSTOM_DIR/app/src/main/res/values/themes.xml" \
       "$GEN_DIR/app/src/main/res/values/themes.xml"
    echo "✅ Copied themes.xml"
else
    echo "⚠️  themes.xml not found in custom directory"
fi

if [ -f "$CUSTOM_DIR/app/src/main/res/values-v21/themes.xml" ]; then
    mkdir -p "$GEN_DIR/app/src/main/res/values-v21"
    cp "$CUSTOM_DIR/app/src/main/res/values-v21/themes.xml" \
       "$GEN_DIR/app/src/main/res/values-v21/themes.xml"
    echo "✅ Copied themes.xml (v21)"
else
    echo "⚠️  themes.xml (v21) not found in custom directory"
fi

echo "✨ Custom Android files copied successfully!"
