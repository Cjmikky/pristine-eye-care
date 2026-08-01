import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({
  title,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "#B3000F",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },

  text: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});