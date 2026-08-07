import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";

const PRIMARY = "#B3000F";

export default function EyeTestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.icon}>👁</Text>

        <Text style={styles.title}>
          Eye Tests
        </Text>

        <Text style={styles.subtitle}>
          Vision tests and eye health tools will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
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
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
  },
});