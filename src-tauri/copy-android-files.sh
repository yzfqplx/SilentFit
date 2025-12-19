#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}📋 Copying custom Android files...${NC}"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 源文件路径
CUSTOM_ANDROID_DIR="$SCRIPT_DIR/android"
MAIN_ACTIVITY_SRC="$CUSTOM_ANDROID_DIR/app/src/main/java/com/silent/fitnesstracker/MainActivity.kt"
THEMES_XML_SRC="$CUSTOM_ANDROID_DIR/app/src/main/res/values/themes.xml"
THEMES_V21_XML_SRC="$CUSTOM_ANDROID_DIR/app/src/main/res/values-v21/themes.xml"

# 目标文件路径
GEN_ANDROID_DIR="$SCRIPT_DIR/gen/android"
MAIN_ACTIVITY_DEST="$GEN_ANDROID_DIR/app/src/main/java/com/silent/fitnesstracker/MainActivity.kt"
THEMES_XML_DEST="$GEN_ANDROID_DIR/app/src/main/res/values/themes.xml"
THEMES_V21_XML_DEST="$GEN_ANDROID_DIR/app/src/main/res/values-v21/themes.xml"

# 检查 gen/android 目录是否存在
if [ ! -d "$GEN_ANDROID_DIR" ]; then
    echo -e "${YELLOW}⚠️  gen/android directory not found. Please run 'npm run tauri android init' first.${NC}"
    exit 1
fi

# 复制 MainActivity.kt
if [ -f "$MAIN_ACTIVITY_SRC" ]; then
    # 确保目标目录存在
    mkdir -p "$(dirname "$MAIN_ACTIVITY_DEST")"
    cp "$MAIN_ACTIVITY_SRC" "$MAIN_ACTIVITY_DEST"
    echo -e "${GREEN}✅ MainActivity.kt copied${NC}"
else
    echo -e "${RED}❌ MainActivity.kt not found at: $MAIN_ACTIVITY_SRC${NC}"
    exit 1
fi

# 复制 themes.xml
if [ -f "$THEMES_XML_SRC" ]; then
    mkdir -p "$(dirname "$THEMES_XML_DEST")"
    cp "$THEMES_XML_SRC" "$THEMES_XML_DEST"
    echo -e "${GREEN}✅ themes.xml copied${NC}"
else
    echo -e "${YELLOW}⚠️  themes.xml not found, skipping...${NC}"
fi

# 复制 themes.xml (v21)
if [ -f "$THEMES_V21_XML_SRC" ]; then
    mkdir -p "$(dirname "$THEMES_V21_XML_DEST")"
    cp "$THEMES_V21_XML_SRC" "$THEMES_V21_XML_DEST"
    echo -e "${GREEN}✅ themes.xml (v21) copied${NC}"
else
    echo -e "${YELLOW}⚠️  themes.xml (v21) not found, skipping...${NC}"
fi

echo -e "${GREEN}✨ Custom Android files copied successfully!${NC}"
