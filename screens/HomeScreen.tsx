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
import Ionicons from "@expo/vector-icons/Ionicons";

import { auth, db } from "../firebase/config";
import { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Dashboard"
>;

const PRIMARY = "#B3000F";

export default function HomeScreen({
  navigation,
}: Props) {
  const [userName, setUserName] =
    useState("Loading...");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning 👋";
    }

    if (hour < 17) {
      return "Good Afternoon ☀️";
    }

    if (hour < 20) {
      return "Good Evening 🌇";
    }

    return "Good Night 🌙";
  };

  const loadUser = async () => {
    try {
      const currentUser =
        auth.currentUser;

      if (!currentUser) {
        setUserName("Guest");
        return;
      }

      const docRef = doc(
        db,
        "users",
        currentUser.uid
      );

      const docSnap =
        await getDoc(docRef);

      if (docSnap.exists()) {
        const data =
          docSnap.data();

        setUserName(
          data.fullName || "User"
        );
      } else {
        setUserName(
          currentUser.email || "User"
        );
      }
    } catch (error) {
      console.log(
        "Load user error:",
        error
      );

      setUserName("User");
    } finally {
      setLoading(false);
    }
  };

  const handleNotifications = () => {
    navigation.navigate(
      "Notifications" as never
    );
  };

  const handleBookAppointment = () => {
    navigation.navigate(
      "Appointments" as never
    );
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

              navigation.replace(
                "Login"
              );
            } catch (error) {
              console.log(
                "Logout error:",
                error
              );

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
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View
            style={styles.headerInfo}
          >
            <Text
              style={styles.greeting}
            >
              {getGreeting()}
            </Text>

            {loading ? (
              <ActivityIndicator
                color={PRIMARY}
                style={
                  styles.loadingIndicator
                }
              />
            ) : (
              <Text
                style={styles.welcome}
              >
                Welcome back,
                <Text
                  style={styles.userName}
                >
                  {" "}
                  {userName}
                </Text>
              </Text>
            )}
          </View>

          {/* HEADER ACTIONS */}

          <View
            style={styles.headerActions}
          >
            {/* NOTIFICATIONS */}

            <Pressable
              style={
                styles.notificationButton
              }
              onPress={
                handleNotifications
              }
            >
              <Ionicons
                name="notifications-outline"
                size={25}
                color={PRIMARY}
              />

              <View
                style={
                  styles.notificationBadge
                }
              >
                <Text
                  style={
                    styles.notificationBadgeText
                  }
                >
                  !
                </Text>
              </View>
            </Pressable>

            {/* LOGOUT */}

            <Pressable
              style={
                styles.logoutButton
              }
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={16}
                color="#FFFFFF"
              />

              <Text
                style={styles.logoutText}
              >
                Logout
              </Text>
            </Pressable>
          </View>
        </View>

        {/* NEXT APPOINTMENT */}

        <View style={styles.card}>
          <Text
            style={styles.cardTitle}
          >
            Next Appointment
          </Text>

          <Text
            style={styles.cardText}
          >
            No upcoming appointment.
          </Text>

          <Pressable
            style={styles.cardButton}
            onPress={
              handleBookAppointment
            }
          >
            <Text
              style={
                styles.cardButtonText
              }
            >
              Book Appointment
            </Text>
          </Pressable>
        </View>

        {/* QUICK ACTIONS */}

        <Text
          style={styles.sectionTitle}
        >
          Quick Actions
        </Text>

        <View style={styles.grid}>
          {/* EYE TEST */}

          <Pressable
            style={styles.box}
            onPress={() =>
              navigation.navigate(
                "Eye Test" as never
              )
            }
          >
            <Ionicons
              name="eye-outline"
              size={34}
              color={PRIMARY}
            />

            <Text
              style={styles.boxText}
            >
              Eye Test
            </Text>
          </Pressable>

          {/* APPOINTMENTS */}

          <Pressable
            style={styles.box}
            onPress={
              handleBookAppointment
            }
          >
            <Ionicons
              name="calendar-outline"
              size={34}
              color={PRIMARY}
            />

            <Text
              style={styles.boxText}
            >
              Appointments
            </Text>
          </Pressable>
        </View>

        {/* VERSION */}

        <Text
          style={styles.footer}
        >
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
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 30,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerInfo: {
    flex: 1,
    paddingRight: 6,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 6,
  },

  welcome: {
    fontSize: 18,
    color: "#777777",
    lineHeight: 24,
  },

  userName: {
    color: PRIMARY,
    fontWeight: "700",
  },

  loadingIndicator: {
    alignSelf: "flex-start",
    marginTop: 8,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 0,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: "#FFF0F1",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },

  logoutButton: {
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 11,
  },

  card: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    padding: 22,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  cardText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
  },

  cardButton: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
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
    color: "#222222",
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  box: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  boxText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },

  footer: {
    textAlign: "center",
    color: "#888888",
    marginTop: 40,
    marginBottom: 20,
    fontSize: 14,
  },
});