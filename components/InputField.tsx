import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";

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
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#888888"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      selectionColor="#B3000F"
      cursorColor="#B3000F"
      underlineColorAndroid="transparent"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFFFF",

    color: "#222222",      // <-- makes typed text visible
    fontSize: 16,
  },
});