import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword } from "firebase/auth";

import Logo from "../components/Logo";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";
import { auth } from "../firebase/config";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

const PRIMARY = "#B3000F";

export default function LoginScreen({
  navigation,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Validation",
        "Please enter your email."
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Validation",
        "Please enter your password."
      );
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      console.log("====================================");
      console.log("LOGIN ATTEMPT");
      console.log("Email:", email.trim());
      console.log("====================================");

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      console.log("====================================");
      console.log("LOGIN SUCCESS");
      console.log(userCredential.user);
      console.log("====================================");

      Alert.alert(
        "Success",
        "Login successful!"
      );

      navigation.replace("Dashboard");
    } catch (error: any) {
      console.log("====================================");
      console.log("FIREBASE LOGIN ERROR");
      console.log(error);
      console.log("Code:", error?.code);
      console.log("Message:", error?.message);
      console.log("Name:", error?.name);
      console.log("Stack:", error?.stack);
      console.log("====================================");

      Alert.alert(
        "Firebase Login Error",
        JSON.stringify(
          {
            code: error?.code,
            message: error?.message,
            name: error?.name,
          },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}

          <View style={styles.logoContainer}>
            <Logo />
          </View>

          {/* TITLE */}

          <Text style={styles.title}>
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Sign in to continue to Pristine Eye Care.
          </Text>

          {/* EMAIL */}

          <InputField
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          {/* PASSWORD */}

          <InputField
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* FORGOT PASSWORD */}

          <Pressable
            onPress={() =>
              navigation.navigate(
                "ForgotPassword"
              )
            }
            disabled={loading}
          >
            <Text
              style={[
                styles.forgot,
                loading &&
                  styles.disabledText,
              ]}
            >
              Forgot Password?
            </Text>
          </Pressable>

          {/* SIGN IN */}

          <PrimaryButton
            title={
              loading
                ? "Signing In..."
                : "Sign In"
            }
            onPress={handleLogin}
            disabled={loading}
          />

          {/* FOOTER */}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate("Signup")
              }
              disabled={loading}
            >
              <Text
                style={[
                  styles.link,
                  loading &&
                    styles.disabledText,
                ]}
              >
                Sign Up
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

  keyboardContainer: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 30,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 22,
  },

  forgot: {
    marginTop: 15,
    color: PRIMARY,
    textAlign: "right",
    fontWeight: "600",
  },

  disabledText: {
    opacity: 0.5,
  },

  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    color: "#666666",
    fontSize: 15,
  },

  link: {
    marginLeft: 6,
    color: PRIMARY,
    fontWeight: "700",
    fontSize: 15,
  },
});