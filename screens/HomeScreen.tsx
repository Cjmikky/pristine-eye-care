import React, {
  useEffect,
  useState,
} from "react";

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

import {
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";

import {
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  auth,
  db,
} from "../firebase/config";

import {
  BottomTabParamList,
} from "../navigation/BottomNavigator";

import {
  useTheme,
} from "../context/ThemeContext";

type Props =
  BottomTabScreenProps<
    BottomTabParamList,
    "Home"
  >;

const PRIMARY = "#B3000F";

export default function HomeScreen({
  navigation,
}: Props) {
  const {
    isDark,
  } = useTheme();

  const colors = {
    background: isDark
      ? "#121212"
      : "#F8F8F8",

    card: isDark
      ? "#1E1E1E"
      : "#FFFFFF",

    text: isDark
      ? "#FFFFFF"
      : "#222222",

    secondaryText: isDark
      ? "#BBBBBB"
      : "#666666",

    mutedText: isDark
      ? "#999999"
      : "#777777",

    border: isDark
      ? "#333333"
      : "#EEEEEE",

    primaryLight: isDark
      ? "#351519"
      : "#FFF0F1",

    softBackground: isDark
      ? "#181818"
      : "#FAFAFA",
  };

  const [
    userName,
    setUserName,
  ] = useState("Loading...");

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const getGreeting = () => {
    const hour =
      new Date().getHours();

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
      setLoading(true);

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

  /*
   * ==========================================
   * NOTIFICATIONS
   * ==========================================
   *
   * Notifications is a root-stack screen,
   * not a bottom-tab screen.
   */
  const handleNotifications = () => {
    const parent =
      navigation.getParent();

    parent?.navigate(
      "Notifications" as never
    );
  };

  const handleBookAppointment = () => {
    navigation.navigate(
      "Appointments"
    );
  };

  const handleEyeTest = () => {
    navigation.navigate(
      "Eye Test"
    );
  };

  const handleCustomerCare = () => {
    const parent =
      navigation.getParent();

    parent?.navigate(
      "Customer Care" as never
    );
  };

  const handleUpcomingEvent = () => {
    const parent =
      navigation.getParent();

    parent?.navigate(
      "UpcomingEvent" as never
    );
  };

  const handleChat = () => {
    const parent =
      navigation.getParent();

    parent?.navigate(
      "Chat" as never
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

              const parent =
                navigation.getParent();

              parent?.navigate(
                "Login" as never
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
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      {/* ==========================================
          SCROLLABLE CONTENT
          ========================================== */}

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
              style={[
                styles.greeting,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
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
                style={[
                  styles.welcome,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Welcome back,
                <Text
                  style={[
                    styles.userName,
                    {
                      color:
                        PRIMARY,
                    },
                  ]}
                >
                  {" "}
                  {userName}
                </Text>
              </Text>
            )}
          </View>

          <View
            style={styles.headerActions}
          >
            {/* NOTIFICATION BUTTON */}

            <Pressable
              style={[
                styles.notificationButton,
                {
                  backgroundColor:
                    colors.primaryLight,
                },
              ]}
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

            {/* LOGOUT BUTTON */}

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

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                PRIMARY,
            },
          ]}
        >
          <View
            style={
              styles.appointmentHeader
            }
          >
            <View>
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
            </View>

            <View
              style={
                styles.appointmentIcon
              }
            >
              <Ionicons
                name="calendar-outline"
                size={28}
                color="#FFFFFF"
              />
            </View>
          </View>

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

        {/* UPCOMING EVENT */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Upcoming Event
        </Text>

        <Pressable
          style={[
            styles.eventCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
          onPress={
            handleUpcomingEvent
          }
        >
          <View
            style={[
              styles.eventDate,
              {
                backgroundColor:
                  colors.primaryLight,
              },
            ]}
          >
            <Text
              style={[
                styles.eventMonth,
                {
                  color:
                    PRIMARY,
                },
              ]}
            >
              AUG
            </Text>

            <Text
              style={[
                styles.eventDay,
                {
                  color:
                    PRIMARY,
                },
              ]}
            >
              24
            </Text>
          </View>

          <View
            style={styles.eventInfo}
          >
            <Text
              style={[
                styles.eventTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Free Eye Screening
            </Text>

            <View
              style={styles.eventMeta}
            >
              <Ionicons
                name="time-outline"
                size={15}
                color={
                  colors.mutedText
                }
              />

              <Text
                style={[
                  styles.eventMetaText,
                  {
                    color:
                      colors.mutedText,
                  },
                ]}
              >
                9:00 AM - 3:00 PM
              </Text>
            </View>

            <View
              style={styles.eventMeta}
            >
              <Ionicons
                name="location-outline"
                size={15}
                color={
                  colors.mutedText
                }
              />

              <Text
                style={[
                  styles.eventMetaText,
                  {
                    color:
                      colors.mutedText,
                  },
                ]}
              >
                Pristine Eye Care
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color={
              colors.mutedText
            }
          />
        </Pressable>

        {/* QUICK ACTIONS */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Quick Actions
        </Text>

        <View style={styles.grid}>
          <Pressable
            style={[
              styles.box,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={handleEyeTest}
          >
            <Ionicons
              name="eye-outline"
              size={34}
              color={PRIMARY}
            />

            <Text
              style={[
                styles.boxText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Eye Test
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.box,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
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
              style={[
                styles.boxText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Appointments
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.box,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
                marginTop: 14,
              },
            ]}
            onPress={
              handleCustomerCare
            }
          >
            <Ionicons
              name="headset-outline"
              size={34}
              color={PRIMARY}
            />

            <Text
              style={[
                styles.boxText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Customer Care
            </Text>
          </Pressable>
        </View>

        {/* VERSION */}

        <Text
          style={[
            styles.footer,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Version 1.0.0
        </Text>
      </ScrollView>

      {/* ==========================================
          FIXED CHAT BUTTON
          
          IMPORTANT:
          This is OUTSIDE the ScrollView.
          It will therefore remain fixed while
          the Home screen is being scrolled.
          ========================================== */}

      <Pressable
        style={styles.chatButton}
        onPress={handleChat}
      >
        <Ionicons
          name="chatbubble-ellipses"
          size={26}
          color="#FFFFFF"
        />

        <View
          style={styles.chatBadge}
        >
          <Text
            style={styles.chatBadgeText}
          >
            1
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 110,
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
    marginBottom: 6,
  },

  welcome: {
    fontSize: 18,
    lineHeight: 24,
  },

  userName: {
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
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 11,
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
    borderRadius: 18,
    padding: 22,
  },

  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  cardText: {
    color: "#FFFFFF",
    fontSize: 15,
    marginTop: 8,
    opacity: 0.9,
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
    fontSize: 15,
    fontWeight: "700",
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 20,
    fontWeight: "700",
  },

  eventCard: {
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  eventDate: {
    width: 55,
    height: 62,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  eventMonth: {
    fontSize: 10,
    fontWeight: "800",
  },

  eventDay: {
    fontSize: 25,
    fontWeight: "800",
    marginTop: 1,
  },

  eventInfo: {
    flex: 1,
    marginLeft: 13,
  },

  eventTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 7,
  },

  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  eventMetaText: {
    marginLeft: 5,
    fontSize: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  box: {
    width: "47%",
    borderRadius: 16,
    paddingVertical: 25,
    alignItems: "center",
    borderWidth: 1,
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
  },

  /*
   * ==========================================
   * FIXED CHAT BUTTON
   * ==========================================
   */

  chatButton: {
    position: "absolute",
    right: 20,
    bottom: 20,

    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: PRIMARY,

    alignItems: "center",
    justifyContent: "center",

    elevation: 10,

    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    zIndex: 100,
  },

  chatBadge: {
    position: "absolute",
    top: 1,
    right: 0,

    width: 18,
    height: 18,
    borderRadius: 9,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",
  },

  chatBadgeText: {
    color: PRIMARY,
    fontSize: 10,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    marginTop: 35,
    marginBottom: 20,
    fontSize: 14,
  },
});