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
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Logo from "../components/Logo";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

          <Text style={styles.title}>Create Account</Text>

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
            value={email}
            onChangeText={setEmail}
          />

          <InputField
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
          />

          <InputField
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton
            title="Create Account"
            onPress={() => navigation.replace("Dashboard")}
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