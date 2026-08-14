import React, { useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import Ionicons from "@expo/vector-icons/Ionicons";

import Logo from "../components/Logo";
import InputField from "../components/InputField";

import {
  RootStackParamList,
} from "../navigation/AppNavigator";

import {
  auth,
  db,
} from "../firebase/config";

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    "EnterPassword"
  >;

const PRIMARY = "#B3000F";

/*
 * ========================================
 * INTERNAL FIREBASE AUTH IDENTIFIER
 * ========================================
 *
 * The customer logs in with their phone
 * number.
 *
 * Firebase Email/Password Authentication
 * internally uses:
 *
 * 08038948686@pristine-auth.local
 *
 * This identifier is never shown to
 * the customer.
 */

const getFirebaseAuthIdentifier = (
  phoneNumber: string
) => {
  return `${phoneNumber}@pristine-auth.local`;
};

export default function EnterPasswordScreen({
  navigation,
  route,
}: Props) {
  const {
    phoneNumber,
  } = route.params;

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  /*
   * ========================================
   * LOGIN
   * ========================================
   */

  const handleLogin =
    async () => {
      if (loading) {
        return;
      }

      /*
       * ==============================
       * PASSWORD VALIDATION
       * ==============================
       */

      if (!password.trim()) {
        Alert.alert(
          "Password Required",
          "Please enter your password."
        );

        return;
      }

      try {
        setLoading(true);

        console.log(
          "===================================="
        );

        console.log(
          "CUSTOMER PASSWORD LOGIN"
        );

        console.log(
          "Phone:",
          phoneNumber
        );

        console.log(
          "===================================="
        );

        /*
         * ==============================
         * FIND CUSTOMER
         * ==============================
         */

        const usersRef =
          collection(
            db,
            "users"
          );

        const customerQuery =
          query(
            usersRef,
            where(
              "phone",
              "==",
              phoneNumber
            )
          );

        const snapshot =
          await getDocs(
            customerQuery
          );

        console.log(
          "Customer found:",
          !snapshot.empty
        );

        /*
         * ==============================
         * CUSTOMER NOT FOUND
         * ==============================
         */

        if (snapshot.empty) {
          Alert.alert(
            "Account Not Found",
            "We could not find your Pristine Eye Care account."
          );

          return;
        }

        /*
         * ==============================
         * GET CUSTOMER
         * ==============================
         */

        const customerDoc =
          snapshot.docs[0];

        const customer =
          customerDoc.data();

        console.log(
          "Customer document:",
          customerDoc.id
        );

        console.log(
          "Customer data:",
          customer
        );

        /*
         * ==============================
         * CHECK ACCOUNT ACTIVATION
         * ==============================
         */

        const passwordSet =
          customer.passwordSet ===
          true;

        const accountActivated =
          customer.accountActivated ===
          true;

        console.log(
          "Password set:",
          passwordSet
        );

        console.log(
          "Account activated:",
          accountActivated
        );

        /*
         * ==============================
         * NOT ACTIVATED
         * ==============================
         */

        if (
          !passwordSet ||
          !accountActivated
        ) {
          Alert.alert(
            "Account Not Activated",
            "Your account has not been activated yet. Please create your password first.",
            [
              {
                text: "Continue",
                onPress: () => {
                  navigation.replace(
                    "CreatePassword",
                    {
                      phoneNumber,
                    }
                  );
                },
              },
            ]
          );

          return;
        }

        /*
         * ==============================
         * INTERNAL FIREBASE IDENTIFIER
         * ==============================
         */

        const authIdentifier =
          getFirebaseAuthIdentifier(
            phoneNumber
          );

        console.log(
          "Using phone-based Firebase authentication."
        );

        /*
         * ==============================
         * FIREBASE LOGIN
         * ==============================
         */

        await signInWithEmailAndPassword(
          auth,
          authIdentifier,
          password
        );

        console.log(
          "===================================="
        );

        console.log(
          "CUSTOMER LOGIN SUCCESS"
        );

        console.log(
          "Phone:",
          phoneNumber
        );

        console.log(
          "Firebase authentication successful."
        );

        console.log(
          "===================================="
        );

        /*
         * ==============================
         * DASHBOARD
         * ==============================
         */

        navigation.replace(
          "Dashboard"
        );
      } catch (error: any) {
        console.log(
          "===================================="
        );

        console.log(
          "PASSWORD LOGIN ERROR"
        );

        console.log(
          "Code:",
          error?.code
        );

        console.log(
          "Message:",
          error?.message
        );

        console.log(
          "===================================="
        );

        let message =
          "Unable to sign in. Please try again.";

        /*
         * ==============================
         * FIREBASE ERROR HANDLING
         * ==============================
         */

        switch (
          error?.code
        ) {
          case "auth/invalid-credential":

          case "auth/wrong-password":

          case "auth/user-not-found":

            message =
              "Incorrect password. Please try again.";

            break;

          case "auth/too-many-requests":

            message =
              "Too many unsuccessful attempts. Please wait a while and try again.";

            break;

          case "auth/network-request-failed":

            message =
              "Unable to connect to the server. Please check your internet connection.";

            break;

          case "auth/user-disabled":

            message =
              "This account has been disabled. Please contact Pristine Eye Care.";

            break;

          case "auth/invalid-email":

            message =
              "We could not authenticate this account. Please contact Pristine Eye Care.";

            break;

          default:

            message =
              "Unable to sign in. Please check your password and try again.";
        }

        Alert.alert(
          "Login Failed",
          message
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * ========================================
   * SCREEN
   * ========================================
   */

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <KeyboardAvoidingView
        style={
          styles.keyboardContainer
        }
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* BACK BUTTON */}

          <Pressable
            style={
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
            disabled={loading}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={PRIMARY}
            />

            <Text
              style={
                styles.backText
              }
            >
              Back
            </Text>
          </Pressable>

          {/* LOGO */}

          <View
            style={
              styles.logoContainer
            }
          >
            <Logo />
          </View>

          {/* TITLE */}

          <Text
            style={styles.title}
          >
            Welcome Back
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Enter your password to access
            your Pristine Eye Care account.
          </Text>

          {/* PHONE */}

          <View
            style={
              styles.phoneContainer
            }
          >
            <Ionicons
              name="phone-portrait-outline"
              size={20}
              color={PRIMARY}
            />

            <View
              style={
                styles.phoneInfo
              }
            >
              <Text
                style={
                  styles.phoneLabel
                }
              >
                Registered Phone Number
              </Text>

              <Text
                style={
                  styles.phoneNumber
                }
              >
                {phoneNumber}
              </Text>
            </View>
          </View>

          {/* PASSWORD */}

          <InputField
            placeholder="Enter Password"
            secureTextEntry
            value={password}
            onChangeText={
              setPassword
            }
            editable={!loading}
          />

          {/* FORGOT PASSWORD */}

          <Pressable
            onPress={() =>
              navigation.navigate(
                "ForgotPassword"
              )
            }
            disabled={loading}
          >
            <Text
              style={[
                styles.forgotPassword,
                loading &&
                  styles.disabledText,
              ]}
            >
              Forgot Password?
            </Text>
          </Pressable>

          {/* SIGN IN */}

          <Pressable
            onPress={
              handleLogin
            }
            disabled={loading}
            style={[
              styles.loginButton,
              loading &&
                styles.loginButtonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={
                  styles.loginButtonText
                }
              >
                Sign In
              </Text>
            )}
          </Pressable>

          {/* SECURITY MESSAGE */}

          <Text
            style={
              styles.securityText
            }
          >
            Your password is securely
            managed by Pristine Eye Care.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/*
 * ========================================
 * STYLES
 * ========================================
 */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#FFFFFF",
    },

    keyboardContainer: {
      flex: 1,
    },

    content: {
      flexGrow: 1,
      justifyContent:
        "center",
      paddingHorizontal: 28,
      paddingVertical: 25,
    },

    backButton: {
      flexDirection:
        "row",
      alignItems:
        "center",
      alignSelf:
        "flex-start",
      paddingVertical: 8,
      paddingRight: 12,
      marginBottom: 10,
    },

    backText: {
      marginLeft: 6,
      color: PRIMARY,
      fontSize: 15,
      fontWeight: "600",
    },

    logoContainer: {
      alignItems:
        "center",
      marginTop: 5,
      marginBottom: 12,
    },

    title: {
      fontSize: 30,
      fontWeight: "700",
      color: PRIMARY,
      textAlign:
        "center",
      marginTop: 8,
    },

    subtitle: {
      fontSize: 15,
      color: "#666666",
      textAlign:
        "center",
      marginTop: 10,
      marginBottom: 22,
      lineHeight: 22,
    },

    phoneContainer: {
      flexDirection:
        "row",
      alignItems:
        "center",
      backgroundColor:
        "#FFF5F5",
      borderRadius: 12,
      padding: 15,
      marginBottom: 20,
    },

    phoneInfo: {
      marginLeft: 10,
      flex: 1,
    },

    phoneLabel: {
      color: "#777777",
      fontSize: 12,
      marginBottom: 3,
    },

    phoneNumber: {
      color: "#222222",
      fontSize: 16,
      fontWeight: "700",
    },

    forgotPassword: {
      color: PRIMARY,
      textAlign:
        "right",
      marginTop: 12,
      fontSize: 14,
      fontWeight: "600",
    },

    disabledText: {
      opacity: 0.5,
    },

    loginButton: {
      height: 52,
      borderRadius: 12,
      backgroundColor:
        PRIMARY,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 24,
    },

    loginButtonDisabled: {
      opacity: 0.75,
    },

    loginButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },

    securityText: {
      textAlign:
        "center",
      color: "#999999",
      fontSize: 12,
      lineHeight: 18,
      marginTop: 22,
      paddingHorizontal: 15,
    },
  });