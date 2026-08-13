import React from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  useTheme,
} from "../context/ThemeContext";

const PRIMARY = "#B3000F";

export default function SettingsScreen() {
  const {
    theme,
    setTheme,
    isDark,
  } = useTheme();

  const backgroundColor =
    isDark ? "#121212" : "#F8F8F8";

  const cardColor =
    isDark ? "#1E1E1E" : "#FFFFFF";

  const textColor =
    isDark ? "#FFFFFF" : "#222222";

  const secondaryTextColor =
    isDark ? "#BBBBBB" : "#777777";

  const borderColor =
    isDark ? "#333333" : "#EEEEEE";

  const handleThemeChange = async (
    value: boolean
  ) => {
    await setTheme(
      value ? "dark" : "light"
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      <View style={styles.content}>
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.title,
                {
                  color: textColor,
                },
              ]}
            >
              Settings
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    secondaryTextColor,
                },
              ]}
            >
              Customize your app experience.
            </Text>
          </View>

          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor: isDark
                  ? "#2A181A"
                  : "#FFF0F1",
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={27}
              color={PRIMARY}
            />
          </View>
        </View>

        {/* APPEARANCE */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: textColor,
            },
          ]}
        >
          Appearance
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: cardColor,
              borderColor,
            },
          ]}
        >
          <View style={styles.settingRow}>
            <View
              style={[
                styles.settingIcon,
                {
                  backgroundColor: isDark
                    ? "#2A181A"
                    : "#FFF0F1",
                },
              ]}
            >
              <Ionicons
                name={
                  isDark
                    ? "moon-outline"
                    : "sunny-outline"
                }
                size={23}
                color={PRIMARY}
              />
            </View>

            <View
              style={styles.settingInfo}
            >
              <Text
                style={[
                  styles.settingTitle,
                  {
                    color: textColor,
                  },
                ]}
              >
                Dark Mode
              </Text>

              <Text
                style={[
                  styles.settingDescription,
                  {
                    color:
                      secondaryTextColor,
                  },
                ]}
              >
                {isDark
                  ? "Dark mode is currently enabled."
                  : "Use dark mode for a darker appearance."}
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={
                handleThemeChange
              }
              trackColor={{
                false: "#D0D0D0",
                true: "#D98A91",
              }}
              thumbColor={
                isDark
                  ? PRIMARY
                  : "#FFFFFF"
              }
            />
          </View>
        </View>

        {/* THEME OPTIONS */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: textColor,
            },
          ]}
        >
          Theme
        </Text>

        <View
          style={[
            styles.themeCard,
            {
              backgroundColor: cardColor,
              borderColor,
            },
          ]}
        >
          {/* LIGHT */}

          <Pressable
            style={[
              styles.themeOption,
              {
                borderColor:
                  theme === "light"
                    ? PRIMARY
                    : borderColor,
                backgroundColor:
                  theme === "light"
                    ? isDark
                      ? "#2A181A"
                      : "#FFF7F7"
                    : cardColor,
              },
            ]}
            onPress={() =>
              setTheme("light")
            }
          >
            <View
              style={[
                styles.themeIcon,
                {
                  backgroundColor:
                    "#FFF0F1",
                },
              ]}
            >
              <Ionicons
                name="sunny-outline"
                size={25}
                color={PRIMARY}
              />
            </View>

            <View
              style={styles.themeInfo}
            >
              <Text
                style={[
                  styles.themeTitle,
                  {
                    color: textColor,
                  },
                ]}
              >
                Light
              </Text>

              <Text
                style={[
                  styles.themeDescription,
                  {
                    color:
                      secondaryTextColor,
                  },
                ]}
              >
                Bright and clean
              </Text>
            </View>

            {theme === "light" && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={PRIMARY}
              />
            )}
          </Pressable>

          {/* DARK */}

          <Pressable
            style={[
              styles.themeOption,
              {
                marginTop: 12,
                borderColor:
                  theme === "dark"
                    ? PRIMARY
                    : borderColor,
                backgroundColor:
                  theme === "dark"
                    ? "#2A181A"
                    : cardColor,
              },
            ]}
            onPress={() =>
              setTheme("dark")
            }
          >
            <View
              style={[
                styles.themeIcon,
                {
                  backgroundColor:
                    "#2A181A",
                },
              ]}
            >
              <Ionicons
                name="moon-outline"
                size={25}
                color={PRIMARY}
              />
            </View>

            <View
              style={styles.themeInfo}
            >
              <Text
                style={[
                  styles.themeTitle,
                  {
                    color: textColor,
                  },
                ]}
              >
                Dark
              </Text>

              <Text
                style={[
                  styles.themeDescription,
                  {
                    color:
                      secondaryTextColor,
                  },
                ]}
              >
                Easier on the eyes at night
              </Text>
            </View>

            {theme === "dark" && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={PRIMARY}
              />
            )}
          </Pressable>
        </View>

        {/* CURRENT THEME */}

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: isDark
                ? "#21191A"
                : "#FFF7F7",
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={PRIMARY}
          />

          <Text
            style={[
              styles.infoText,
              {
                color:
                  secondaryTextColor,
              },
            ]}
          >
            Current theme:{" "}
            <Text
              style={{
                fontWeight: "700",
                color: textColor,
              }}
            >
              {isDark
                ? "Dark Mode"
                : "Light Mode"}
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 7,
    fontSize: 14,
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 13,
  },

  card: {
    borderRadius: 17,
    borderWidth: 1,
    padding: 17,
    marginBottom: 28,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  settingIcon: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  settingInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  settingDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  themeCard: {
    borderRadius: 17,
    borderWidth: 1,
    padding: 12,
  },

  themeOption: {
    minHeight: 72,
    borderRadius: 13,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  themeIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  themeInfo: {
    flex: 1,
    marginLeft: 12,
  },

  themeTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  themeDescription: {
    fontSize: 12,
    marginTop: 4,
  },

  infoCard: {
    marginTop: 22,
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 18,
  },
});