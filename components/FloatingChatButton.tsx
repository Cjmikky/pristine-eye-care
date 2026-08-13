import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  onPress: () => void;
};

const PRIMARY = "#B3000F";

export default function FloatingChatButton({
  onPress,
}: Props) {
  return (
    <View
      pointerEvents="box-none"
      style={styles.container}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Ionicons
          name="chatbubble-ellipses"
          size={26}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 82,
    zIndex: 100,
    elevation: 100,
  },

  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    elevation: 8,
  },

  buttonPressed: {
    transform: [
      {
        scale: 0.94,
      },
    ],
    opacity: 0.85,
  },
});