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
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword } from "firebase/auth";

import Logo from "../components/Logo";
import InputField from "../components/InputField";
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
    if (loading) {
      return;
    }

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

    try {
      setLoading(true);

      console.log("====================================");
      console.log("LOGIN ATTEMPT");
      console.log("====================================");

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log("LOGIN SUCCESS");

      /*
       * Navigate immediately after successful authentication.
       * No OK button or manual confirmation is required.
       */
      navigation.replace("Dashboard");
    } catch (error: any) {
      console.log("====================================");
      console.log("FIREBASE LOGIN ERROR");
      console.log("Code:", error?.code);
      console.log("====================================");

      let message =
        "Unable to sign in. Please check your email and password.";

      switch (error?.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          message =
            "Incorrect email or password. Please try again.";
          break;

        case "auth/invalid-email":
          message =
            "Please enter a valid email address.";
          break;

        case "auth/network-request-failed":
          message =
            "Unable to connect to the server. Please check your internet connection and try again.";
          break;

        case "auth/too-many-requests":
          message =
            "Too many unsuccessful attempts. Please wait a while and try again.";
          break;

        case "auth/user-disabled":
          message =
            "This account has been disabled. Please contact support.";
          break;

        default:
          message =
            "Something went wrong while signing in. Please try again.";
      }

      Alert.alert(
        "Login Failed",
        message
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
            editable={!loading}
          />

          {/* PASSWORD */}

          <InputField
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
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

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={[
              styles.loginButton,
              loading &&
                styles.loginButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={styles.loginButtonText}
              >
                Sign In
              </Text>
            )}
          </Pressable>

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

  loginButton: {
    marginTop: 22,
    height: 52,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonDisabled: {
    opacity: 0.75,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
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