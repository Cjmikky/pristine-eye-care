import React from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  RootStackParamList,
} from "../navigation/AppNavigator";

import {
  useTheme,
} from "../context/ThemeContext";

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    "Notifications"
  >;

const PRIMARY = "#B3000F";

export default function NotificationsScreen({
  navigation,
}: Props) {
  const {
    isDark,
  } = useTheme();

  const colors = {
    background: isDark
      ? "#121212"
      : "#F8F8F8",

    card: isDark
      ? "#1E1E1E"
      : "#FFFFFF",

    text: isDark
      ? "#FFFFFF"
      : "#222222",

    secondaryText: isDark
      ? "#BBBBBB"
      : "#777777",

    mutedText: isDark
      ? "#999999"
      : "#888888",

    border: isDark
      ? "#333333"
      : "#EEEEEE",

    primaryLight: isDark
      ? "#351519"
      : "#FFF0F1",
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      {/* HEADER */}

      <View
        style={[
          styles.header,
          {
            backgroundColor:
              colors.card,
            borderBottomColor:
              colors.border,
          },
        ]}
      >
        <Pressable
          style={[
            styles.backButton,
            {
              backgroundColor:
                colors.primaryLight,
            },
          ]}
          onPress={handleBack}
          android_ripple={{
            color: isDark
              ? "#4A2025"
              : "#F5D5D8",
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={PRIMARY}
          />
        </Pressable>

        <View
          style={styles.headerTextContainer}
        >
          <Text
            style={[
              styles.title,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Notifications
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Important updates from Pristine Eye Care
          </Text>
        </View>
      </View>

      {/* EMPTY STATE */}

      <View style={styles.emptyContainer}>
        <View
          style={[
            styles.emptyIconContainer,
            {
              backgroundColor:
                colors.primaryLight,
            },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={48}
            color={PRIMARY}
          />
        </View>

        <Text
          style={[
            styles.emptyTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          No notifications
        </Text>

        <Text
          style={[
            styles.emptyText,
            {
              color:
                colors.mutedText,
            },
          ]}
        >
          You don't have any new notifications
          at the moment.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    minHeight: 105,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
    paddingBottom: 80,
  },

  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 310,
  },
});