import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function TestFirebaseScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("Not tested");

  const testFirestore = async () => {
    try {
      setLoading(true);
      setResult("Testing...");

      const snapshot = await getDocs(collection(db, "test"));

      const message = `Firestore Connected!\n\nDocuments Found: ${snapshot.size}`;

      setResult(message);

      Alert.alert("Success", message);
    } catch (error: any) {
      console.log("Firestore Error:", error);

      const message =
        error?.message || "Unknown Firestore Error";

      setResult(message);

      Alert.alert("Firestore Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>
          Firebase Connection Test
        </Text>

        <Text style={styles.description}>
          This will test whether Firestore can connect from the installed APK.
        </Text>

        <Pressable
          style={styles.button}
          onPress={testFirestore}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            Test Firestore
          </Text>
        </Pressable>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#B3000F"
            style={{ marginTop: 25 }}
          />
        )}

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>
            Result
          </Text>

          <Text style={styles.result}>
            {result}
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const PRIMARY = "#B3000F";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
  },

  description: {
    marginTop: 15,
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    lineHeight: 24,
  },

  button: {
    backgroundColor: PRIMARY,
    marginTop: 35,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 17,
  },

  resultCard: {
    marginTop: 35,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },

  result: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
});