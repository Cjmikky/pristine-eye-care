import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

const PRIMARY = "#B3000F";

export default function ProfileScreen() {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.icon}>👤</Text>

        <Text style={styles.title}>
          My Profile
        </Text>

        <Text style={styles.subtitle}>
          Your profile information and account settings will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
    },

    icon: {
      fontSize: 70,
      marginBottom: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: "700",
      color: PRIMARY,
    },

    subtitle: {
      marginTop: 15,
      textAlign: "center",
      color: colors.secondaryText,
      fontSize: 16,
      lineHeight: 24,
    },
  });