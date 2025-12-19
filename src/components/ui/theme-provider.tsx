import { createContext, useContext, useEffect, useState } from "react"
import { themeApi } from "../../lib/tauri"; // Import themeApi

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)


export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme || defaultTheme;
    return savedTheme;
  });

  useEffect(() => {
    const fetchAndSetInitialTheme = async () => {
      const savedTheme = await themeApi.get();
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      } else {
        await themeApi.set(defaultTheme);
        setThemeState(defaultTheme);
      }
    };
    fetchAndSetInitialTheme();
  }, [defaultTheme]); // themeApi is not a dependency of this effect

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    let actualTheme: "light" | "dark";
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      actualTheme = systemTheme;
    } else {
      root.classList.add(theme)
      actualTheme = theme;
    }

    // 更新 Android 状态栏样式
    const updateStatusBar = async () => {
      try {
        // 检查是否在 Android 环境中
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('android')) {
          // 直接调用 Android 的 JavaScript 接口
          if (window.AndroidStatusBar) {
            window.AndroidStatusBar.setStyle(actualTheme === 'dark');
            console.log('✅ Status bar style updated to:', actualTheme);
          } else {
            console.log('⚠️ AndroidStatusBar interface not available yet');
          }
        }
      } catch (error) {
        console.log('Status bar update failed:', error);
      }
    };

    updateStatusBar();
  }, [theme])

  const setTheme = async (theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    await themeApi.set(theme);
    setThemeState(theme);
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
