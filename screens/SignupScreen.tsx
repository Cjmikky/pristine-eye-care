import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import Logo from "../components/Logo";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import { auth, db } from "../firebase/config";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validation", "Please enter your email.");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Validation", "Please enter your phone number.");
      return;
    }

    if (!password) {
      Alert.alert("Validation", "Please enter a password.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Validation",
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Validation",
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      console.log("========== STARTING SIGNUP ==========");

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      console.log("========== SIGNUP SUCCESS ==========");
      console.log(userCredential.user);
      console.log("====================================");

      const user = userCredential.user;

      console.log("STEP 1 - User created successfully");

      console.log("STEP 2 - Writing user to Firestore");

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        createdAt: serverTimestamp(),
      });

      console.log("STEP 3 - Firestore write completed");

      Alert.alert(
        "Success",
        "Account created successfully!"
      );

      console.log("STEP 4 - Navigating to Dashboard");

      navigation.replace("Dashboard");
    } catch (error: any) {
      console.log("========== FIREBASE ERROR ==========");
      console.log(error);
      console.log("CODE:", error?.code);
      console.log("MESSAGE:", error?.message);
      console.log("STACK:", error?.stack);
      console.log("====================================");

      Alert.alert(
        "Signup Failed",
        `Code: ${error?.code ?? "Unknown"}\n\nMessage: ${
          error?.message ?? "Unknown error"
        }`
      );
    } finally {
      console.log("STEP 5 - Finally block reached");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Logo />

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join Pristine Eye Care and manage your appointments with ease.
          </Text>

          <InputField
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <InputField
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <InputField
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <InputField
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <InputField
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <PrimaryButton
            title={
              loading
                ? "Creating Account..."
                : "Create Account"
            }
            onPress={handleSignup}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?
            </Text>

            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.link}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#B3000F",
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 22,
  },

  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    color: "#666",
    fontSize: 15,
  },

  link: {
    marginLeft: 6,
    color: "#B3000F",
    fontWeight: "700",
    fontSize: 15,
  },
});