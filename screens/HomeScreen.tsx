import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/config";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Dashboard"
>;

const PRIMARY = "#B3000F";

export default function DashboardScreen({
  navigation,
}: Props) {
  const [userName, setUserName] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning 👋";
    if (hour < 17) return "Good Afternoon ☀️";
    if (hour < 20) return "Good Evening 🌇";

    return "Good Night 🌙";
  };

  const loadUser = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setUserName("Guest");
        return;
      }

      const docRef = doc(db, "users", currentUser.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setUserName(data.fullName || "User");
      } else {
        setUserName(currentUser.email || "User");
      }
    } catch (error) {
      console.log(error);
      setUserName("User");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);

              navigation.replace("Login");
            } catch (error) {
              console.log(error);

              Alert.alert(
                "Error",
                "Unable to logout."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}
            </Text>

            {loading ? (
              <ActivityIndicator
                color={PRIMARY}
                style={{ marginTop: 10 }}
              />
            ) : (
              <Text style={styles.welcome}>
                Welcome back,
                <Text style={styles.userName}>
                  {" "}
                  {userName}
                </Text>
              </Text>
            )}
          </View>

          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Next Appointment
          </Text>

          <Text style={styles.cardText}>
            No upcoming appointment.
          </Text>

          <Pressable style={styles.cardButton}>
            <Text style={styles.cardButtonText}>
              Book Appointment
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.grid}>
          <Pressable style={styles.box}>
            <Text style={styles.icon}>👓</Text>

            <Text style={styles.boxText}>
              Eye Test
            </Text>
          </Pressable>

          <Pressable style={styles.box}>
            <Text style={styles.icon}>📅</Text>

            <Text style={styles.boxText}>
              Appointments
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  content: {
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },

  welcome: {
    fontSize: 18,
    color: "#777",
  },

  userName: {
    color: PRIMARY,
    fontWeight: "700",
  },

  logoutButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  logoutText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  card: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    padding: 22,
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  cardText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 10,
  },

  cardButton: {
    marginTop: 20,
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  cardButtonText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "700",
  },

  sectionTitle: {
    marginTop: 35,
    marginBottom: 18,
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  box: {
    width: "45%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  icon: {
    fontSize: 34,
  },

  boxText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  footer: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    marginBottom: 20,
    fontSize: 14,
  },
});