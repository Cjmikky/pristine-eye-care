import React from "react";
import {
  StyleSheet,
  TextInput,
} from "react-native";

interface Props {
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
}: Props) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#888"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 16,
    backgroundColor: "#FFF",
  },
});