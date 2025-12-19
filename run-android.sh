#!/bin/bash

# 设置 Java 17 为当前会话的 JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

echo "使用 Java 版本:"
java -version

echo ""
echo "📋 复制自定义 Android 文件..."
cd src-tauri && ./copy-android-files.sh && cd ..

echo ""
echo "🚀 启动 Android 开发模式..."
npm run tauri android dev
