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
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Logo from "../components/Logo";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Sign in to continue to Pristine Eye Care.
          </Text>

          <InputField
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
          />

          <InputField
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgot}>
              Forgot Password?
            </Text>
          </Pressable>

          <PrimaryButton
            title="Sign In"
            onPress={() => navigation.replace("Dashboard")}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.link}>
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
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 22,
  },

  forgot: {
    marginTop: 15,
    color: "#B3000F",
    textAlign: "right",
    fontWeight: "600",
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