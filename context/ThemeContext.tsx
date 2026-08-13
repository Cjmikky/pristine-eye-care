import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  primaryLight: string;
  inputBackground: string;
  tabBar: string;
};

type ThemeContextType = {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => void;
  setThemeMode: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const LIGHT_COLORS: ThemeColors = {
  background: "#F8F8F8",
  card: "#FFFFFF",
  text: "#222222",
  secondaryText: "#777777",
  border: "#E5E5E5",
  primaryLight: "#FFF5F6",
  inputBackground: "#FFFFFF",
  tabBar: "#FFFFFF",
};

const DARK_COLORS: ThemeColors = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  secondaryText: "#B8B8B8",
  border: "#333333",
  primaryLight: "#35171A",
  inputBackground: "#1E1E1E",
  tabBar: "#181818",
};

const STORAGE_KEY = "@pristine_theme_mode";

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] =
    useState<ThemeMode>("light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme =
          await AsyncStorage.getItem(STORAGE_KEY);

        if (
          savedTheme === "light" ||
          savedTheme === "dark"
        ) {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.error(
          "Unable to load saved theme:",
          error
        );
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (
    newTheme: ThemeMode
  ) => {
    try {
      setThemeState(newTheme);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        newTheme
      );
    } catch (error) {
      console.error(
        "Unable to save theme:",
        error
      );
    }
  };

  const setThemeMode = (
    newTheme: ThemeMode
  ) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(
      theme === "light"
        ? "dark"
        : "light"
    );
  };

  const isDark = theme === "dark";

  const colors = useMemo(
    () =>
      isDark
        ? DARK_COLORS
        : LIGHT_COLORS,
    [isDark]
  );

  const value = useMemo(
    () => ({
      theme,
      isDark,
      colors,
      setTheme,
      setThemeMode,
      toggleTheme,
    }),
    [
      theme,
      isDark,
      colors,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}