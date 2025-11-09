import { createContext, useContext, useEffect, useState } from "react"

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
  storageKey = "vite-ui-theme", // 这个 storageKey 在 Electron 环境下会被 window.theme 忽略
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 初始加载时从 Electron 主进程获取主题
    const savedTheme = localStorage.getItem(storageKey) as Theme || defaultTheme;
    return savedTheme;
  });

  useEffect(() => {
    const fetchAndSetInitialTheme = async () => {
      const savedTheme = await window.theme.get();
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      } else {
        // 如果主进程没有保存主题，则使用默认主题并保存
        await window.theme.set(defaultTheme);
        setThemeState(defaultTheme);
      }
    };
    fetchAndSetInitialTheme();
  }, [defaultTheme]);

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const setTheme = async (theme: Theme) => {
    localStorage.setItem(storageKey, theme); // 仍然更新 localStorage 以保持与 shadcn/ui 行为一致
    await window.theme.set(theme); // 同时更新 Electron 主进程
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
