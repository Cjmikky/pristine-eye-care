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
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
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
    "CreatePassword"
  >;

const PRIMARY = "#B3000F";

/*
 * ========================================
 * INTERNAL FIREBASE AUTH IDENTIFIER
 * ========================================
 *
 * Firebase Email/Password Authentication
 * requires an email-shaped identifier.
 *
 * The customer does NOT provide an email.
 *
 * The phone number is converted internally
 * into a private Firebase authentication
 * identifier.
 *
 * Example:
 *
 * 08038948686
 *
 * becomes:
 *
 * 08038948686@pristine-auth.local
 */

const getFirebaseAuthIdentifier = (
  phoneNumber: string
) => {
  return `${phoneNumber}@pristine-auth.local`;
};

export default function CreatePasswordScreen({
  navigation,
  route,
}: Props) {
  const {
    phoneNumber,
  } = route.params;

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  /*
   * ========================================
   * CREATE PASSWORD
   * ========================================
   */

  const handleCreatePassword =
    async () => {
      if (loading) {
        return;
      }

      /*
       * ==============================
       * PASSWORD VALIDATION
       * ==============================
       */

      if (!password) {
        Alert.alert(
          "Password Required",
          "Please create a password."
        );

        return;
      }

      if (password.length < 6) {
        Alert.alert(
          "Password Requirement",
          "Password must contain at least 6 characters."
        );

        return;
      }

      if (!/[A-Z]/.test(password)) {
        Alert.alert(
          "Password Requirement",
          "Password must contain at least one uppercase letter."
        );

        return;
      }

      if (!/[a-z]/.test(password)) {
        Alert.alert(
          "Password Requirement",
          "Password must contain at least one lowercase letter."
        );

        return;
      }

      if (!/[0-9]/.test(password)) {
        Alert.alert(
          "Password Requirement",
          "Password must contain at least one number."
        );

        return;
      }

      if (!confirmPassword) {
        Alert.alert(
          "Confirm Password",
          "Please confirm your password."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        Alert.alert(
          "Passwords Do Not Match",
          "Please make sure both passwords are the same."
        );

        return;
      }

      try {
        setLoading(true);

        console.log(
          "===================================="
        );

        console.log(
          "ACCOUNT ACTIVATION"
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

        if (snapshot.empty) {
          Alert.alert(
            "Account Not Found",
            "We could not find your Pristine Eye Care customer record."
          );

          return;
        }

        const customerDoc =
          snapshot.docs[0];

        const customer =
          customerDoc.data();

        /*
         * ==============================
         * CHECK ACTIVATION
         * ==============================
         */

        if (
          customer.passwordSet ===
            true ||
          customer.accountActivated ===
            true
        ) {
          Alert.alert(
            "Account Already Activated",
            "This account has already been activated. Please enter your password.",
            [
              {
                text: "Continue",
                onPress: () => {
                  navigation.replace(
                    "EnterPassword",
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

        let firebaseUser;

        /*
         * ==============================
         * CREATE FIREBASE ACCOUNT
         * ==============================
         */

        try {
          const credential =
            await createUserWithEmailAndPassword(
              auth,
              authIdentifier,
              password
            );

          firebaseUser =
            credential.user;

          console.log(
            "Firebase authentication account created."
          );

          console.log(
            "Firebase UID:",
            firebaseUser.uid
          );
        } catch (
          firebaseError: any
        ) {
          console.log(
            "Firebase creation error:",
            firebaseError?.code
          );

          /*
           * If the Firebase account already
           * exists, try to authenticate it.
           */

          if (
            firebaseError?.code ===
            "auth/email-already-in-use"
          ) {
            try {
              const credential =
                await signInWithEmailAndPassword(
                  auth,
                  authIdentifier,
                  password
                );

              firebaseUser =
                credential.user;

              console.log(
                "Existing Firebase authentication account authenticated."
              );
            } catch (
              existingError: any
            ) {
              console.log(
                "Existing Firebase account error:",
                existingError?.code
              );

              Alert.alert(
                "Account Already Activated",
                "This account already has a password. Please return to login and enter your password.",
                [
                  {
                    text: "Go to Login",
                    onPress: () => {
                      navigation.replace(
                        "Login"
                      );
                    },
                  },
                ]
              );

              return;
            }
          } else {
            throw firebaseError;
          }
        }

        /*
         * ==============================
         * UPDATE CUSTOMER RECORD
         * ==============================
         */

        await updateDoc(
          doc(
            db,
            "users",
            customerDoc.id
          ),
          {
            passwordSet: true,

            accountActivated:
              true,

            authUid:
              firebaseUser.uid,

            accountActivatedAt:
              serverTimestamp(),
          }
        );

        console.log(
          "===================================="
        );

        console.log(
          "ACCOUNT ACTIVATION SUCCESSFUL"
        );

        console.log(
          "Customer:",
          customerDoc.id
        );

        console.log(
          "passwordSet: true"
        );

        console.log(
          "accountActivated: true"
        );

        console.log(
          "authUid:",
          firebaseUser.uid
        );

        console.log(
          "===================================="
        );

        /*
         * ==============================
         * SUCCESS
         * ==============================
         */

        Alert.alert(
          "Account Verified Successfully",
          "Your Pristine Eye Care account has been activated successfully.",
          [
            {
              text: "Continue",
              onPress: () => {
                navigation.replace(
                  "Dashboard"
                );
              },
            },
          ]
        );
      } catch (error: any) {
        console.log(
          "===================================="
        );

        console.log(
          "ACCOUNT ACTIVATION ERROR"
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
          "We could not activate your account. Please try again.";

        switch (
          error?.code
        ) {
          case "auth/network-request-failed":
            message =
              "Unable to connect to the server. Please check your internet connection.";
            break;

          case "auth/weak-password":
            message =
              "The password is too weak. Please choose a stronger password.";
            break;

          case "auth/invalid-email":
            message =
              "Unable to create your account. Please contact Pristine Eye Care.";
            break;

          default:
            break;
        }

        Alert.alert(
          "Account Setup Failed",
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
      style={styles.container}
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
            Create Your Password
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            We found your existing
            Pristine Eye Care account.
            Create a password to activate
            your access to the app.
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
            placeholder="Create Password"
            secureTextEntry
            value={password}
            onChangeText={
              setPassword
            }
            editable={!loading}
          />

          {/* PASSWORD RULES */}

          <View
            style={
              styles.rulesContainer
            }
          >
            <PasswordRule
              valid={
                password.length >= 6
              }
              text="At least 6 characters"
            />

            <PasswordRule
              valid={
                /[A-Z]/.test(password)
              }
              text="At least one uppercase letter"
            />

            <PasswordRule
              valid={
                /[a-z]/.test(password)
              }
              text="At least one lowercase letter"
            />

            <PasswordRule
              valid={
                /[0-9]/.test(password)
              }
              text="At least one number"
            />
          </View>

          {/* CONFIRM PASSWORD */}

          <InputField
            placeholder="Confirm Password"
            secureTextEntry
            value={
              confirmPassword
            }
            onChangeText={
              setConfirmPassword
            }
            editable={!loading}
          />

          {/* PASSWORD MATCH */}

          {confirmPassword.length >
            0 && (
            <PasswordRule
              valid={
                password ===
                confirmPassword
              }
              text="Passwords match"
            />
          )}

          {/* CREATE PASSWORD */}

          <Pressable
            onPress={
              handleCreatePassword
            }
            disabled={loading}
            style={[
              styles.createButton,
              loading &&
                styles.createButtonDisabled,
            ]}
          >
            {loading ? (
              <View
                style={
                  styles.loadingContainer
                }
              >
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.loadingText
                  }
                >
                  Activating...
                </Text>
              </View>
            ) : (
              <Text
                style={
                  styles.createButtonText
                }
              >
                Create Password
              </Text>
            )}
          </Pressable>

          {/* SECURITY MESSAGE */}

          <Text
            style={
              styles.securityText
            }
          >
            Your account information is
            protected and securely managed
            by Pristine Eye Care.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/*
 * ========================================
 * PASSWORD RULE
 * ========================================
 */

function PasswordRule({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <View
      style={
        styles.ruleRow
      }
    >
      <Ionicons
        name={
          valid
            ? "checkmark-circle"
            : "ellipse-outline"
        }
        size={19}
        color={
          valid
            ? "#008A4B"
            : "#999999"
        }
      />

      <Text
        style={[
          styles.ruleText,
          valid &&
            styles.ruleTextValid,
        ]}
      >
        {text}
      </Text>
    </View>
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
      fontSize: 28,
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

    rulesContainer: {
      marginTop: 2,
      marginBottom: 10,
    },

    ruleRow: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 7,
    },

    ruleText: {
      marginLeft: 8,
      color: "#999999",
      fontSize: 13,
    },

    ruleTextValid: {
      color: "#008A4B",
      fontWeight: "600",
    },

    createButton: {
      height: 52,
      borderRadius: 12,
      backgroundColor:
        PRIMARY,
      alignItems:
        "center",
      justifyContent:
        "center",
      marginTop: 18,
    },

    createButtonDisabled: {
      opacity: 0.75,
    },

    createButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },

    loadingContainer: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    loadingText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "600",
      marginLeft: 8,
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