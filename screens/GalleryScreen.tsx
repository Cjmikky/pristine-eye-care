import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useTheme } from "../context/ThemeContext";

const PRIMARY = "#B3000F";

export default function GalleryScreen() {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="images-outline"
            size={48}
            color={PRIMARY}
          />
        </View>

        <Text style={styles.title}>
          Gallery
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            COMING SOON
          </Text>
        </View>

        <Text style={styles.message}>
          Our gallery is currently being
          prepared.
        </Text>

        <Text style={styles.description}>
          Soon you'll be able to explore
          eye care information, clinic
          photos, educational materials,
          and other useful resources from
          Pristine Eye Care.
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

    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 35,
    },

    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 14,
    },

    badge: {
      backgroundColor: PRIMARY,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 20,
    },

    badgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.5,
    },

    message: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 10,
    },

    description: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.secondaryText,
      textAlign: "center",
    },
  });