import React, {
  useState,
  useRef,
} from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

type Message = {
  id: string;
  text: string;
  sender: "patient" | "support";
  time: string;
};

const PRIMARY = "#B3000F";

const initialMessages: Message[] = [
  {
    id: "1",
    text:
      "Hello! Welcome to Pristine Eye Care. How can we help you today?",
    sender: "support",
    time: "Now",
  },
];

export default function ChatScreen({
  navigation,
}: any) {
  const [messages, setMessages] =
    useState<Message[]>(initialMessages);

  const [message, setMessage] =
    useState("");

  const sendMessage = () => {
    const trimmed =
      message.trim();

    if (!trimmed) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: "patient",
      time: "Now",
    };

    setMessages((current) => [
      ...current,
      newMessage,
    ]);

    setMessage("");
  };

  const renderMessage = ({
    item,
  }: {
    item: Message;
  }) => {
    const isPatient =
      item.sender === "patient";

    return (
      <View
        style={[
          styles.messageRow,
          isPatient &&
            styles.patientMessageRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isPatient
              ? styles.patientBubble
              : styles.supportBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isPatient &&
                styles.patientMessageText,
            ]}
          >
            {item.text}
          </Text>

          <Text
            style={[
              styles.messageTime,
              isPatient &&
                styles.patientMessageTime,
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
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
        keyboardVerticalOffset={0}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#222222"
            />
          </Pressable>

          <View
            style={styles.headerInfo}
          >
            <View
              style={styles.supportIcon}
            >
              <Ionicons
                name="headset"
                size={20}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text
                style={styles.headerTitle}
              >
                Pristine Support
              </Text>

              <View
                style={styles.onlineRow}
              >
                <View
                  style={styles.onlineDot}
                />

                <Text
                  style={styles.onlineText}
                >
                  Available to help
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CHAT */}

        <FlatList
          data={messages}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={renderMessage}
          contentContainerStyle={
            styles.messages
          }
          showsVerticalScrollIndicator={
            false
          }
        />

        {/* INPUT */}

        <View style={styles.inputArea}>
          <View
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#999999"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />

            <Pressable
              onPress={sendMessage}
              disabled={
                !message.trim()
              }
              style={[
                styles.sendButton,
                !message.trim() &&
                  styles.sendButtonDisabled,
              ]}
            >
              <Ionicons
                name="send"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  keyboardContainer: {
    flex: 1,
  },

  header: {
    height: 74,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  supportIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222222",
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#2E9B4B",
    marginRight: 5,
  },

  onlineText: {
    fontSize: 12,
    color: "#777777",
  },

  messages: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },

  messageRow: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  patientMessageRow: {
    alignItems: "flex-end",
  },

  messageBubble: {
    maxWidth: "82%",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 16,
  },

  supportBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
  },

  patientBubble: {
    backgroundColor: PRIMARY,
    borderTopRightRadius: 4,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
    color: "#333333",
  },

  patientMessageText: {
    color: "#FFFFFF",
  },

  messageTime: {
    fontSize: 10,
    color: "#999999",
    marginTop: 5,
    textAlign: "right",
  },

  patientMessageTime: {
    color: "#F5C8CC",
  },

  inputArea: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  inputContainer: {
    minHeight: 48,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 5,
    backgroundColor: "#FAFAFA",
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#222222",
    maxHeight: 100,
    paddingVertical: 8,
  },

  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },
});