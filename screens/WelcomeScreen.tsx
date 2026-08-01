import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Logo from "../components/Logo";
import PrimaryButton from "../components/PrimaryButton";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Welcome"
>;

export default function WelcomeScreen({
  navigation,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo />

        <Text style={styles.title}>
          Welcome to
        </Text>

        <Text style={styles.brand}>
          Pristine Eye Care
        </Text>

        <Text style={styles.subtitle}>
          Center for Prime Sight and Style
        </Text>

        <PrimaryButton
          title="Get Started"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = "#B3000F";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },

  content: {
    paddingHorizontal: 30,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    color: "#555",
    marginTop: 20,
  },

  brand: {
    fontSize: 34,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
  },
});