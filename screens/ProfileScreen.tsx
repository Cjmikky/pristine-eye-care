import React, {
  useCallback,
  useState,
} from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  auth,
  db,
} from "../firebase/config";

import {
  useTheme,
  ThemeColors,
} from "../context/ThemeContext";

const PRIMARY = "#B3000F";

type CustomerProfile = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  accountActivated?: boolean;
  passwordSet?: boolean;
  authUid?: string;
  uid?: string;
};

export default function ProfileScreen() {
  const {
    colors,
  } = useTheme();

  const styles =
    createStyles(colors);

  const [
    profile,
    setProfile,
  ] = useState<CustomerProfile | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  /*
   * ========================================
   * LOAD CUSTOMER PROFILE
   * ========================================
   */

  const loadProfile =
    async (
      showLoader = true
    ) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const currentUser =
          auth.currentUser;

        if (!currentUser) {
          setProfile(null);

          Alert.alert(
            "Profile Unavailable",
            "Please sign in again to view your profile."
          );

          return;
        }

        console.log(
          "===================================="
        );

        console.log(
          "LOADING PROFILE SCREEN"
        );

        console.log(
          "Firebase UID:",
          currentUser.uid
        );

        console.log(
          "===================================="
        );

        let profileData:
          | CustomerProfile
          | null = null;

        /*
         * ========================================
         * SEARCH 1
         * Existing customer activation flow
         *
         * Existing customer records use authUid.
         * ========================================
         */

        const usersRef =
          collection(
            db,
            "users"
          );

        const authUidQuery =
          query(
            usersRef,
            where(
              "authUid",
              "==",
              currentUser.uid
            )
          );

        const authUidSnapshot =
          await getDocs(
            authUidQuery
          );

        if (
          !authUidSnapshot.empty
        ) {
          const customerDoc =
            authUidSnapshot.docs[0];

          profileData = {
            id:
              customerDoc.id,

            ...(customerDoc.data() as Omit<
              CustomerProfile,
              "id"
            >),
          };

          console.log(
            "Profile found using authUid."
          );

          console.log(
            "Document:",
            customerDoc.id
          );
        }

        /*
         * ========================================
         * SEARCH 2
         * New signup flow
         *
         * SignupScreen saves users/{user.uid}.
         * ========================================
         */

        if (!profileData) {
          const directDoc =
            await getDoc(
              doc(
                db,
                "users",
                currentUser.uid
              )
            );

          if (
            directDoc.exists()
          ) {
            profileData = {
              id:
                directDoc.id,

              ...(directDoc.data() as Omit<
                CustomerProfile,
                "id"
              >),
            };

            console.log(
              "Profile found using document ID."
            );

            console.log(
              "Document:",
              directDoc.id
            );
          }
        }

        /*
         * ========================================
         * SEARCH 3
         * Legacy uid field fallback
         * ========================================
         */

        if (!profileData) {
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
            const customerDoc =
              uidSnapshot.docs[0];

            profileData = {
              id:
                customerDoc.id,

              ...(customerDoc.data() as Omit<
                CustomerProfile,
                "id"
              >),
            };

            console.log(
              "Profile found using uid field."
            );

            console.log(
              "Document:",
              customerDoc.id
            );
          }
        }

        /*
         * ========================================
         * PROFILE NOT FOUND
         * ========================================
         */

        if (!profileData) {
          console.log(
            "Customer profile not found."
          );

          setProfile(null);

          return;
        }

        console.log(
          "Profile data:",
          profileData
        );

        console.log(
          "===================================="
        );

        setProfile(
          profileData
        );
      } catch (error) {
        console.log(
          "Profile loading error:",
          error
        );

        Alert.alert(
          "Unable to Load Profile",
          "We couldn't load your profile information. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  /*
   * ========================================
   * LOAD WHEN PROFILE TAB OPENS
   * ========================================
   */

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  /*
   * ========================================
   * PULL TO REFRESH
   * ========================================
   */

  const handleRefresh =
    async () => {
      setRefreshing(true);

      await loadProfile(
        false
      );
    };

  /*
   * ========================================
   * CUSTOMER INITIALS
   * ========================================
   */

  const getInitials =
    () => {
      const name =
        profile?.fullName?.trim();

      if (!name) {
        return "PE";
      }

      const parts =
        name.split(/\s+/);

      if (
        parts.length === 1
      ) {
        return parts[0]
          .charAt(0)
          .toUpperCase();
      }

      return (
        parts[0]
          .charAt(0) +
        parts[
          parts.length - 1
        ].charAt(0)
      ).toUpperCase();
    };

  /*
   * ========================================
   * LOADING
   * ========================================
   */

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={PRIMARY}
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * ========================================
   * PROFILE NOT FOUND
   * ========================================
   */

  if (!profile) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.emptyContainer
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor={
                PRIMARY
              }
              colors={[
                PRIMARY,
              ]}
            />
          }
        >
          <View
            style={
              styles.emptyIconContainer
            }
          >
            <Ionicons
              name="person-outline"
              size={48}
              color={PRIMARY}
            />
          </View>

          <Text
            style={
              styles.emptyTitle
            }
          >
            Profile Not Available
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            We couldn't find your customer
            profile. Pull down to try again.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /*
   * ========================================
   * PROFILE SCREEN
   * ========================================
   */

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
            tintColor={
              PRIMARY
            }
            colors={[
              PRIMARY,
            ]}
          />
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
          <Text
            style={
              styles.title
            }
          >
            My Profile
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Your Pristine Eye Care account
            information.
          </Text>
        </View>

        {/* ================================= */}
        {/* PROFILE CARD */}
        {/* ================================= */}

        <View
          style={
            styles.profileCard
          }
        >
          <View
            style={
              styles.avatar
            }
          >
            <Text
              style={
                styles.avatarText
              }
            >
              {getInitials()}
            </Text>
          </View>

          <Text
            style={
              styles.customerName
            }
          >
            {profile.fullName ||
              "Pristine Customer"}
          </Text>

          <View
            style={
              styles.statusContainer
            }
          >
            <Ionicons
              name={
                profile.accountActivated ===
                true
                  ? "checkmark-circle"
                  : "time-outline"
              }
              size={17}
              color={
                profile.accountActivated ===
                true
                  ? "#159447"
                  : "#C88700"
              }
            />

            <Text
              style={[
                styles.statusText,
                {
                  color:
                    profile.accountActivated ===
                    true
                      ? "#159447"
                      : "#C88700",
                },
              ]}
            >
              {profile.accountActivated ===
              true
                ? "Account Active"
                : "Account Pending"}
            </Text>
          </View>
        </View>

        {/* ================================= */}
        {/* PERSONAL INFORMATION */}
        {/* ================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Personal Information
        </Text>

        <View
          style={
            styles.detailsCard
          }
        >
          <ProfileRow
            icon="person-outline"
            label="Full Name"
            value={
              profile.fullName ||
              "Not provided"
            }
            colors={
              colors
            }
          />

          <View
            style={
              styles.divider
            }
          />

          <ProfileRow
            icon="call-outline"
            label="Phone Number"
            value={
              profile.phone ||
              "Not provided"
            }
            colors={
              colors
            }
          />

          <View
            style={
              styles.divider
            }
          />

          <ProfileRow
            icon="mail-outline"
            label="Email Address"
            value={
              profile.email ||
              "Not provided"
            }
            colors={
              colors
            }
          />
        </View>

        {/* ================================= */}
        {/* ACCOUNT INFORMATION */}
        {/* ================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Account
        </Text>

        <View
          style={
            styles.detailsCard
          }
        >
          <ProfileRow
            icon="shield-checkmark-outline"
            label="Account Status"
            value={
              profile.accountActivated ===
              true
                ? "Active"
                : "Pending Activation"
            }
            colors={
              colors
            }
          />

          <View
            style={
              styles.divider
            }
          />

          <ProfileRow
            icon="key-outline"
            label="Password"
            value={
              profile.passwordSet ===
              true
                ? "Password Created"
                : "Not Set"
            }
            colors={
              colors
            }
          />
        </View>

        {/* ================================= */}
        {/* SECURITY */}
        {/* ================================= */}

        <View
          style={
            styles.securityCard
          }
        >
          <View
            style={
              styles.securityIcon
            }
          >
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={PRIMARY}
            />
          </View>

          <View
            style={
              styles.securityContent
            }
          >
            <Text
              style={
                styles.securityTitle
              }
            >
              Your information is protected
            </Text>

            <Text
              style={
                styles.securityText
              }
            >
              Your account information is
              securely managed by Pristine
              Eye Care.
            </Text>
          </View>
        </View>

        <Text
          style={
            styles.footer
          }
        >
          Pristine Eye Care • Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/*
 * ========================================
 * PROFILE ROW
 * ========================================
 */

function ProfileRow({
  icon,
  label,
  value,
  colors,
}: {
  icon:
    React.ComponentProps<
      typeof Ionicons
    >["name"];

  label: string;

  value: string;

  colors: ThemeColors;
}) {
  const styles =
    createStyles(colors);

  return (
    <View
      style={
        styles.profileRow
      }
    >
      <View
        style={
          styles.rowIcon
        }
      >
        <Ionicons
          name={icon}
          size={21}
          color={PRIMARY}
        />
      </View>

      <View
        style={
          styles.rowContent
        }
      >
        <Text
          style={
            styles.rowLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.rowValue
          }
          selectable
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/*
 * ========================================
 * STYLES
 * ========================================
 */

const createStyles = (
  colors: ThemeColors
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 25,
      paddingBottom: 45,
    },

    header: {
      marginBottom: 22,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
    },

    subtitle: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 20,
      color:
        colors.secondaryText,
    },

    /*
     * PROFILE
     */

    profileCard: {
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 20,
      alignItems: "center",
      paddingVertical: 26,
      paddingHorizontal: 20,
      marginBottom: 28,
    },

    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor:
        colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: PRIMARY,
      marginBottom: 14,
    },

    avatarText: {
      color: PRIMARY,
      fontSize: 29,
      fontWeight: "800",
    },

    customerName: {
      color: colors.text,
      fontSize: 21,
      fontWeight: "800",
      textAlign: "center",
    },

    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 9,
    },

    statusText: {
      fontSize: 13,
      fontWeight: "700",
      marginLeft: 5,
    },

    /*
     * SECTIONS
     */

    sectionTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 11,
    },

    detailsCard: {
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 17,
      paddingHorizontal: 16,
      marginBottom: 25,
    },

    profileRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 17,
    },

    rowIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor:
        colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 13,
    },

    rowContent: {
      flex: 1,
    },

    rowLabel: {
      color:
        colors.secondaryText,
      fontSize: 12,
      marginBottom: 4,
    },

    rowValue: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
    },

    divider: {
      height: 1,
      backgroundColor:
        colors.border,
    },

    /*
     * SECURITY
     */

    securityCard: {
      flexDirection: "row",
      backgroundColor:
        colors.primaryLight,
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        colors.border,
      padding: 16,
      marginTop: 3,
    },

    securityIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor:
        colors.card,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    securityContent: {
      flex: 1,
    },

    securityTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
      marginBottom: 5,
    },

    securityText: {
      color:
        colors.secondaryText,
      fontSize: 12,
      lineHeight: 18,
    },

    footer: {
      textAlign: "center",
      color:
        colors.secondaryText,
      fontSize: 11,
      marginTop: 28,
    },

    /*
     * LOADING / EMPTY
     */

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    loadingText: {
      color:
        colors.secondaryText,
      fontSize: 14,
      marginTop: 12,
    },

    emptyContainer: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 30,
    },

    emptyIconContainer: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor:
        colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },

    emptyTitle: {
      color: colors.text,
      fontSize: 21,
      fontWeight: "800",
      textAlign: "center",
    },

    emptyText: {
      color:
        colors.secondaryText,
      fontSize: 14,
      lineHeight: 21,
      textAlign: "center",
      marginTop: 8,
    },
  });