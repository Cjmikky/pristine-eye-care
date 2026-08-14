import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  signOut,
} from "firebase/auth";

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
  /*
   * ========================================
   * THEME
   * ========================================
   */

  const {
    isDark,
    colors,
  } = useTheme();

  /*
   * ========================================
   * USER
   * ========================================
   */

  const [
    userName,
    setUserName,
  ] = useState("User");

  const [
    loadingUser,
    setLoadingUser,
  ] = useState(true);

  /*
   * ========================================
   * LOAD CUSTOMER PROFILE
   * ========================================
   */

  const loadUserData =
    async () => {
      try {
        setLoadingUser(true);

        const currentUser =
          auth.currentUser;

        if (!currentUser) {
          setUserName("User");
          return;
        }

        console.log(
          "===================================="
        );

        console.log(
          "LOADING CUSTOMER PROFILE"
        );

        console.log(
          "Firebase UID:",
          currentUser.uid
        );

        console.log(
          "===================================="
        );

        const usersRef =
          collection(
            db,
            "users"
          );

        /*
         * Search by authUid
         */

        const customerQuery =
          query(
            usersRef,
            where(
              "authUid",
              "==",
              currentUser.uid
            )
          );

        const snapshot =
          await getDocs(
            customerQuery
          );

        let userData: any = null;

        /*
         * ========================================
         * AUTH UID SEARCH
         * ========================================
         */

        if (
          !snapshot.empty
        ) {
          userData =
            snapshot.docs[0].data();

          console.log(
            "Customer document:",
            snapshot.docs[0].id
          );
        } else {
          /*
           * ========================================
           * FALLBACK UID SEARCH
           * ========================================
           */

          const uidQuery =
            query(
              usersRef,
              where(
                "uid",
                "==",
                currentUser.uid
              )
            );

          const uidSnapshot =
            await getDocs(
              uidQuery
            );

          if (
            !uidSnapshot.empty
          ) {
            userData =
              uidSnapshot.docs[0].data();

            console.log(
              "Customer document:",
              uidSnapshot.docs[0].id
            );
          }
        }

        /*
         * ========================================
         * CUSTOMER NOT FOUND
         * ========================================
         */

        if (!userData) {
          console.log(
            "Customer profile not found."
          );

          setUserName("User");

          return;
        }

        console.log(
          "Customer profile:",
          userData
        );

        /*
         * ========================================
         * FIRST NAME
         * ========================================
         */

        if (
          userData.fullName
        ) {
          const fullName =
            String(
              userData.fullName
            ).trim();

          const firstName =
            fullName
              .split(/\s+/)[0];

          if (
            firstName
          ) {
            setUserName(
              firstName
            );
          } else {
            setUserName(
              "User"
            );
          }
        } else {
          setUserName(
            "User"
          );
        }
      } catch (error) {
        console.log(
          "Failed to load customer profile:",
          error
        );

        setUserName(
          "User"
        );
      } finally {
        setLoadingUser(
          false
        );
      }
    };

  /*
   * ========================================
   * LOAD PROFILE
   * ========================================
   */

  useEffect(() => {
    loadUserData();
  }, []);

  /*
   * ========================================
   * GREETING
   * ========================================
   */

  const getGreeting =
    () => {
      const hour =
        new Date().getHours();

      if (hour < 12) {
        return "Good Morning";
      }

      if (hour < 17) {
        return "Good Afternoon";
      }

      return "Good Night";
    };

  /*
   * ========================================
   * LOGOUT
   * ========================================
   */

  const handleLogout =
    async () => {
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
            onPress:
              async () => {
                try {
                  await signOut(
                    auth
                  );

                  navigation
                    .getParent()
                    ?.navigate(
                      "Login" as never
                    );
                } catch (error) {
                  console.log(
                    "Logout error:",
                    error
                  );

                  Alert.alert(
                    "Logout Failed",
                    "Unable to logout. Please try again."
                  );
                }
              },
          },
        ]
      );
    };

  /*
   * ========================================
   * SCREEN
   * ========================================
   */

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      edges={[
        "top",
        "left",
        "right",
      ]}
    >
      {/* ================================= */}
      {/* STATUS BAR */}
      {/* ================================= */}

      <StatusBar
        barStyle={
          isDark
            ? "light-content"
            : "dark-content"
        }
        backgroundColor={
          colors.background
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        style={{
          backgroundColor:
            colors.background,
        }}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <View
          style={
            styles.header
          }
        >
          {/* GREETING */}

          <View
            style={
              styles.greetingContainer
            }
          >
            <View
              style={
                styles.greetingRow
              }
            >
              <Text
                style={[
                  styles.greeting,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {getGreeting()}
              </Text>

              <Text
                style={
                  styles.moon
                }
              >
                {isDark
                  ? "🌙"
                  : "☀️"}
              </Text>
            </View>

            {/* WELCOME */}

            {loadingUser ? (
              <ActivityIndicator
                size="small"
                color={PRIMARY}
                style={
                  styles.nameLoader
                }
              />
            ) : (
              <View
                style={
                  styles.welcomeRow
                }
              >
                <Text
                  style={[
                    styles.welcomeText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Welcome back,
                </Text>

                <Text
                  style={
                    styles.userName
                  }
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {" "}
                  {userName}
                </Text>
              </View>
            )}
          </View>

          {/* HEADER ACTIONS */}

          <View
            style={
              styles.headerActions
            }
          >
            {/* NOTIFICATIONS */}

            <Pressable
              style={[
                styles.notificationButton,
                {
                  backgroundColor:
                    colors.primaryLight,
                },
              ]}
              onPress={() =>
                navigation
                  .getParent()
                  ?.navigate(
                    "Notifications" as never
                  )
              }
            >
              <Ionicons
                name="notifications-outline"
                size={23}
                color={PRIMARY}
              />

              <View
                style={
                  styles.notificationBadge
                }
              >
                <Text
                  style={
                    styles.badgeText
                  }
                >
                  1
                </Text>
              </View>
            </Pressable>

            {/* LOGOUT */}

            <Pressable
              style={
                styles.logoutButton
              }
              onPress={
                handleLogout
              }
            >
              <Ionicons
                name="log-out-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.logoutText
                }
              >
                Logout
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ================================= */}
        {/* NEXT APPOINTMENT */}
        {/* ================================= */}

        <View
          style={
            styles.appointmentCard
          }
        >
          <View
            style={
              styles.appointmentTop
            }
          >
            <View
              style={
                styles.appointmentInfo
              }
            >
              <Text
                style={
                  styles.appointmentTitle
                }
              >
                Next Appointment
              </Text>

              <Text
                style={
                  styles.appointmentSubtitle
                }
              >
                No upcoming appointment.
              </Text>
            </View>

            <View
              style={
                styles.calendarIconContainer
              }
            >
              <Ionicons
                name="calendar-outline"
                size={34}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Pressable
            style={
              styles.bookButton
            }
            onPress={() =>
              navigation.navigate(
                "Appointments" as never
              )
            }
          >
            <Text
              style={
                styles.bookButtonText
              }
            >
              Book Appointment
            </Text>
          </Pressable>
        </View>

        {/* ================================= */}
        {/* UPCOMING EVENT */}
        {/* ================================= */}

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
          onPress={() =>
            navigation
              .getParent()
              ?.navigate(
                "UpcomingEvent" as never
              )
          }
        >
          <View
            style={[
              styles.dateBox,
              {
                backgroundColor:
                  colors.primaryLight,
              },
            ]}
          >
            <Text
              style={
                styles.dateMonth
              }
            >
              AUG
            </Text>

            <Text
              style={
                styles.dateDay
              }
            >
              24
            </Text>
          </View>

          <View
            style={
              styles.eventInfo
            }
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
              style={
                styles.eventDetail
              }
            >
              <Ionicons
                name="time-outline"
                size={17}
                color={
                  colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.eventDetailText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                9:00 AM - 3:00 PM
              </Text>
            </View>

            <View
              style={
                styles.eventDetail
              }
            >
              <Ionicons
                name="location-outline"
                size={17}
                color={
                  colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.eventDetailText,
                  {
                    color:
                      colors.secondaryText,
                  },
                ]}
              >
                Pristine Eye Care
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={25}
            color={
              colors.secondaryText
            }
          />
        </Pressable>

        {/* ================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================= */}

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

        <View
          style={
            styles.quickActions
          }
        >
          {/* EYE TEST */}

          <Pressable
            style={[
              styles.quickAction,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                "Eye Test" as never
              )
            }
          >
            <Ionicons
              name="eye-outline"
              size={42}
              color={PRIMARY}
            />

            <Text
              style={[
                styles.quickActionText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Eye Test
            </Text>
          </Pressable>

          {/* APPOINTMENTS */}

          <Pressable
            style={[
              styles.quickAction,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                "Appointments" as never
              )
            }
          >
            <Ionicons
              name="calendar-outline"
              size={42}
              color={PRIMARY}
            />

            <Text
              style={[
                styles.quickActionText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Appointments
            </Text>
          </Pressable>

          {/* GALLERY */}

          <Pressable
            style={[
              styles.quickAction,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                "Gallery" as never
              )
            }
          >
            <Ionicons
              name="images-outline"
              size={42}
              color={PRIMARY}
            />

            <Text
              style={[
                styles.quickActionText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Gallery
            </Text>
          </Pressable>

          {/* PROFILE */}

          <Pressable
            style={[
              styles.quickAction,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
            onPress={() =>
              navigation.navigate(
                "Profile" as never
              )
            }
          >
            <Ionicons
              name="person-outline"
              size={42}
              color={PRIMARY}
            />

            <Text
              style={[
                styles.quickActionText,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Profile
            </Text>
          </Pressable>
        </View>

        {/* ================================= */}
        {/* SECURITY */}
        {/* ================================= */}

        <Text
          style={[
            styles.securityText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Your Pristine Eye Care account
          is securely protected.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/*
 * ========================================
 * STATIC STYLES
 * ========================================
 *
 * Theme-dependent colours are intentionally
 * NOT placed here.
 */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 8,
      paddingTop: 10,
      paddingBottom: 30,
    },

    /*
     * HEADER
     */

    header: {
      position: "relative",
      width: "100%",
      marginBottom: 30,
      minHeight: 88,
    },

    greetingContainer: {
      width: "100%",
      paddingRight: 145,
    },

    greetingRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    greeting: {
      fontSize: 24,
      fontWeight: "700",
    },

    moon: {
      fontSize: 22,
      marginLeft: 5,
    },

    welcomeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      width: "100%",
    },

    welcomeText: {
      fontSize: 18,
      lineHeight: 24,
      flexShrink: 0,
    },

    userName: {
      color: PRIMARY,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "700",
      flexShrink: 1,
    },

    nameLoader: {
      alignSelf: "flex-start",
      marginTop: 12,
    },

    /*
     * HEADER ACTIONS
     */

    headerActions: {
      position: "absolute",
      top: 0,
      right: 0,
      flexDirection: "row",
      alignItems: "center",
    },

    notificationButton: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 6,
      position: "relative",
    },

    notificationBadge: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 17,
      height: 17,
      borderRadius: 9,
      backgroundColor: PRIMARY,
      alignItems: "center",
      justifyContent: "center",
    },

    badgeText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "700",
    },

    logoutButton: {
      height: 46,
      paddingHorizontal: 10,
      borderRadius: 11,
      backgroundColor: "#E00000",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    logoutText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "700",
      marginLeft: 4,
    },

    /*
     * APPOINTMENT
     */

    appointmentCard: {
      backgroundColor: "#D90000",
      borderRadius: 24,
      padding: 25,
      marginBottom: 34,
    },

    appointmentTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    appointmentInfo: {
      flex: 1,
    },

    appointmentTitle: {
      color: "#FFFFFF",
      fontSize: 23,
      fontWeight: "700",
    },

    appointmentSubtitle: {
      color: "#FFFFFF",
      fontSize: 16,
      marginTop: 10,
    },

    calendarIconContainer: {
      width: 58,
      height: 58,
      borderRadius: 15,
      backgroundColor: "#E52B2B",
      alignItems: "center",
      justifyContent: "center",
    },

    bookButton: {
      height: 54,
      borderRadius: 14,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
    },

    bookButtonText: {
      color: PRIMARY,
      fontSize: 17,
      fontWeight: "700",
    },

    /*
     * SECTIONS
     */

    sectionTitle: {
      fontSize: 23,
      fontWeight: "700",
      marginBottom: 15,
    },

    /*
     * EVENT
     */

    eventCard: {
      borderRadius: 20,
      borderWidth: 1,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 34,
    },

    dateBox: {
      width: 64,
      height: 68,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 15,
    },

    dateMonth: {
      color: PRIMARY,
      fontSize: 12,
      fontWeight: "700",
    },

    dateDay: {
      color: PRIMARY,
      fontSize: 27,
      fontWeight: "700",
      marginTop: 2,
    },

    eventInfo: {
      flex: 1,
    },

    eventTitle: {
      fontSize: 17,
      fontWeight: "700",
      marginBottom: 9,
    },

    eventDetail: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },

    eventDetailText: {
      fontSize: 13,
      marginLeft: 7,
    },

    /*
     * QUICK ACTIONS
     */

    quickActions: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    quickAction: {
      width: "48%",
      minHeight: 142,
      borderRadius: 20,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },

    quickActionText: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 14,
    },

    /*
     * SECURITY
     */

    securityText: {
      textAlign: "center",
      fontSize: 12,
      marginTop: 20,
      lineHeight: 18,
    },
  });