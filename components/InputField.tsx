import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}

export default function InputField({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  ...rest
}: Props) {
  const [showPassword, setShowPassword] =
    useState(false);

  const isPasswordField = secureTextEntry;

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          isPasswordField && styles.passwordInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#888888"
        secureTextEntry={
          isPasswordField
            ? !showPassword
            : false
        }
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        selectionColor="#B3000F"
        cursorColor="#B3000F"
        underlineColorAndroid="transparent"
        {...rest}
      />

      {isPasswordField && (
        <Pressable
          style={styles.eyeButton}
          onPress={() =>
            setShowPassword(
              (current) => !current
            )
          }
          hitSlop={10}
        >
          <Ionicons
            name={
              showPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={23}
            color="#777777"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    marginTop: 16,
  },

  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    color: "#222222",
    fontSize: 16,
    marginTop: 0,
  },

  passwordInput: {
    paddingRight: 52,
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    height: 56,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});