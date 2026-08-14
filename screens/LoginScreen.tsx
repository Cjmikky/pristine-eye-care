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
  getDocsFromCache,
  getDocsFromServer,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import Ionicons from "@expo/vector-icons/Ionicons";

import Logo from "../components/Logo";
import InputField from "../components/InputField";

import {
  RootStackParamList,
} from "../navigation/AppNavigator";

import {
  db,
} from "../firebase/config";

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    "Login"
  >;

const PRIMARY = "#B3000F";

/*
 * ========================================
 * FIRESTORE SERVER LOOKUP
 * ========================================
 *
 * The server is always checked first.
 *
 * IMPORTANT:
 *
 * Signup is only opened when Firestore
 * successfully confirms that the customer
 * does not exist.
 */

const getCustomerFromServer =
  async (
    phoneNumber: string
  ): Promise<
    QuerySnapshot<DocumentData>
  > => {
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

    console.log(
      "Checking Firestore server..."
    );

    const snapshot =
      await getDocsFromServer(
        customerQuery
      );

    console.log(
      "Firestore server search completed successfully."
    );

    return snapshot;
  };

/*
 * ========================================
 * FIRESTORE LOCAL CACHE LOOKUP
 * ========================================
 *
 * Used only if the server cannot be reached.
 *
 * IMPORTANT:
 *
 * If the customer is not in cache, we DO NOT
 * assume that the customer does not exist.
 */

const getCustomerFromCache =
  async (
    phoneNumber: string
  ): Promise<
    QuerySnapshot<DocumentData>
  > => {
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

    console.log(
      "Checking Firestore local cache..."
    );

    const snapshot =
      await getDocsFromCache(
        customerQuery
      );

    console.log(
      "Firestore local cache search completed."
    );

    return snapshot;
  };

export default function LoginScreen({
  navigation,
}: Props) {
  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
   * ========================================
   * PHONE INPUT
   * ========================================
   */

  const handlePhoneChange = (
    value: string
  ) => {
    const digitsOnly =
      value.replace(
        /\D/g,
        ""
      );

    setPhone(
      digitsOnly.slice(
        0,
        11
      )
    );
  };

  /*
   * ========================================
   * ROUTE CUSTOMER
   * ========================================
   *
   * Existing customer:
   *
   * accountActivated === true
   *      -> EnterPassword
   *
   * accountActivated === false
   *      -> CreatePassword
   */

  const routeCustomer =
    (
      customer: DocumentData,
      source: string
    ) => {
      console.log(
        "===================================="
      );

      console.log(
        `CUSTOMER FOUND FROM ${source}`
      );

      console.log(
        "Customer data:",
        customer
      );

      const accountActivated =
        customer.accountActivated ===
        true;

      const authUid =
        customer.authUid;

      console.log(
        "Account activated:",
        accountActivated
      );

      console.log(
        "Auth UID exists:",
        !!authUid
      );

      console.log(
        "Password set:",
        customer.passwordSet ===
          true
      );

      console.log(
        "===================================="
      );

      /*
       * ========================================
       * EXISTING + ACTIVATED
       * ========================================
       */

      if (
        accountActivated ===
        true
      ) {
        console.log(
          "CUSTOMER ALREADY ACTIVATED"
        );

        console.log(
          "Opening Enter Password screen."
        );

        navigation.navigate(
          "EnterPassword",
          {
            phoneNumber:
              phone.trim(),
          }
        );

        return;
      }

      /*
       * ========================================
       * EXISTING BUT NOT ACTIVATED
       * ========================================
       */

      console.log(
        "CUSTOMER NOT YET ACTIVATED"
      );

      console.log(
        "Opening Create Password screen."
      );

      navigation.navigate(
        "CreatePassword",
        {
          phoneNumber:
            phone.trim(),
        }
      );
    };

  /*
   * ========================================
   * CONTINUE
   * ========================================
   */

  const handleContinue =
    async () => {
      if (loading) {
        return;
      }

      const cleanedPhone =
        phone.trim();

      /*
       * ========================================
       * PHONE REQUIRED
       * ========================================
       */

      if (!cleanedPhone) {
        Alert.alert(
          "Phone Number Required",
          "Please enter your phone number."
        );

        return;
      }

      /*
       * ========================================
       * EXACTLY 11 DIGITS
       * ========================================
       */

      if (
        cleanedPhone.length !==
        11
      ) {
        Alert.alert(
          "Invalid Phone Number",
          "Please enter a valid 11-digit Nigerian phone number."
        );

        return;
      }

      /*
       * ========================================
       * MUST START WITH 0
       * ========================================
       */

      if (
        !cleanedPhone.startsWith(
          "0"
        )
      ) {
        Alert.alert(
          "Invalid Phone Number",
          "A Nigerian phone number should start with 0."
        );

        return;
      }

      try {
        setLoading(true);

        console.log(
          "===================================="
        );

        console.log(
          "PHONE NUMBER CHECK"
        );

        console.log(
          "Phone:",
          cleanedPhone
        );

        console.log(
          "===================================="
        );

        /*
         * ========================================
         * FIRST: FIRESTORE SERVER
         * ========================================
         */

        try {
          const serverSnapshot =
            await getCustomerFromServer(
              cleanedPhone
            );

          /*
           * ========================================
           * SERVER CONFIRMED CUSTOMER DOES NOT EXIST
           * ========================================
           *
           * This is the ONLY situation where
           * Signup is opened automatically.
           */

          if (
            serverSnapshot.empty
          ) {
            console.log(
              "===================================="
            );

            console.log(
              "FIRESTORE SERVER CONFIRMED"
            );

            console.log(
              "Customer does not exist."
            );

            console.log(
              "Opening Signup screen."
            );

            console.log(
              "===================================="
            );

            navigation.navigate(
              "Signup",
              {
                phoneNumber:
                  cleanedPhone,
              }
            );

            return;
          }

          /*
           * ========================================
           * CUSTOMER FOUND ON SERVER
           * ========================================
           */

          const customerDoc =
            serverSnapshot.docs[0];

          console.log(
            "Customer document:",
            customerDoc.id
          );

          routeCustomer(
            customerDoc.data(),
            "SERVER"
          );

          return;
        } catch (
          serverError: any
        ) {
          /*
           * ========================================
           * SERVER FAILED
           * ========================================
           */

          console.log(
            "===================================="
          );

          console.log(
            "FIRESTORE SERVER UNAVAILABLE"
          );

          console.log(
            "Code:",
            serverError?.code
          );

          console.log(
            "Message:",
            serverError?.message
          );

          console.log(
            "===================================="
          );

          /*
           * IMPORTANT:
           *
           * DO NOT OPEN SIGNUP.
           *
           * We don't know whether the customer
           * exists because the server failed.
           */

          console.log(
            "Server unavailable."
          );

          console.log(
            "Falling back to local Firestore cache..."
          );

          /*
           * ========================================
           * SECOND: LOCAL CACHE
           * ========================================
           */

          try {
            const cacheSnapshot =
              await getCustomerFromCache(
                cleanedPhone
              );

            /*
             * ========================================
             * CUSTOMER FOUND IN CACHE
             * ========================================
             */

            if (
              !cacheSnapshot.empty
            ) {
              const customerDoc =
                cacheSnapshot.docs[0];

              console.log(
                "===================================="
              );

              console.log(
                "CUSTOMER FOUND IN LOCAL CACHE"
              );

              console.log(
                "Customer document:",
                customerDoc.id
              );

              console.log(
                "===================================="
              );

              routeCustomer(
                customerDoc.data(),
                "LOCAL CACHE"
              );

              return;
            }

            /*
             * ========================================
             * CUSTOMER NOT IN CACHE
             * ========================================
             *
             * Still do NOT open Signup.
             */

            console.log(
              "Customer not found in local cache."
            );

            throw serverError;
          } catch (
            cacheError: any
          ) {
            /*
             * ========================================
             * SERVER + CACHE FAILED
             * ========================================
             */

            console.log(
              "===================================="
            );

            console.log(
              "FIRESTORE SERVER AND CACHE FAILED"
            );

            console.log(
              "Server error:",
              serverError?.code
            );

            console.log(
              "Cache error:",
              cacheError?.code
            );

            console.log(
              "===================================="
            );

            Alert.alert(
              "Connection Problem",
              "We could not connect to Pristine Eye Care right now. Please try again."
            );

            return;
          }
        }
      } catch (
        error: any
      ) {
        /*
         * ========================================
         * UNEXPECTED ERROR
         * ========================================
         */

        console.log(
          "===================================="
        );

        console.log(
          "PHONE CHECK ERROR"
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

        /*
         * NEVER open Signup from an error.
         */

        Alert.alert(
          "Connection Problem",
          "We could not connect to Pristine Eye Care right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  /*
   * ========================================
   * UI
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
            style={
              styles.title
            }
          >
            Welcome Back
          </Text>

          {/* SUBTITLE */}

          <Text
            style={
              styles.subtitle
            }
          >
            Enter your phone number to
            continue to Pristine Eye Care.
          </Text>

          {/* PHONE */}

          <InputField
            placeholder="Phone Number"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            value={phone}
            onChangeText={
              handlePhoneChange
            }
            editable={!loading}
          />

          {/* DIGIT COUNTER */}

          <Text
            style={
              styles.digitCounter
            }
          >
            {phone.length}/11 digits
          </Text>

          {/* CONTINUE BUTTON */}

          <Pressable
            onPress={
              handleContinue
            }
            disabled={
              loading
            }
            style={[
              styles.loginButton,
              loading &&
                styles.loginButtonDisabled,
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
                  Checking...
                </Text>
              </View>
            ) : (
              <Text
                style={
                  styles.loginButtonText
                }
              >
                Continue
              </Text>
            )}
          </Pressable>

          {/* INFORMATION */}

          <View
            style={
              styles.infoContainer
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={
                PRIMARY
              }
            />

            <Text
              style={
                styles.infoText
              }
            >
              Existing Pristine Eye Care
              customers can use their
              registered phone number to
              access their account.
            </Text>
          </View>

          {/* FORGOT PASSWORD */}

          <Pressable
            onPress={() =>
              navigation.navigate(
                "ForgotPassword"
              )
            }
            disabled={
              loading
            }
          >
            <Text
              style={[
                styles.forgot,
                loading &&
                  styles.disabledText,
              ]}
            >
              Forgot Password?
            </Text>
          </Pressable>

          {/* SIGN UP */}

          <View
            style={
              styles.footer
            }
          >
            <Text
              style={
                styles.footerText
              }
            >
              New to Pristine Eye Care?
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate(
                  "Signup",
                  {
                    phoneNumber:
                      phone,
                  }
                )
              }
              disabled={
                loading
              }
            >
              <Text
                style={[
                  styles.link,
                  loading &&
                    styles.disabledText,
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
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
      paddingVertical: 30,
    },

    logoContainer: {
      alignItems:
        "center",
      marginBottom: 8,
    },

    title: {
      fontSize: 30,
      fontWeight: "700",
      color: PRIMARY,
      textAlign:
        "center",
      marginTop: 10,
    },

    subtitle: {
      fontSize: 16,
      color: "#666666",
      textAlign:
        "center",
      marginTop: 10,
      marginBottom: 20,
      lineHeight: 22,
    },

    digitCounter: {
      alignSelf:
        "flex-end",
      marginTop: 4,
      marginRight: 4,
      color: "#999999",
      fontSize: 12,
    },

    loginButton: {
      marginTop: 18,
      height: 52,
      borderRadius: 12,
      backgroundColor:
        PRIMARY,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    loginButtonDisabled: {
      opacity: 0.75,
    },

    loginButtonText: {
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

    infoContainer: {
      flexDirection:
        "row",
      alignItems:
        "flex-start",
      backgroundColor:
        "#FFF5F5",
      borderRadius: 12,
      padding: 14,
      marginTop: 20,
    },

    infoText: {
      flex: 1,
      marginLeft: 10,
      color: "#666666",
      fontSize: 13,
      lineHeight: 19,
    },

    forgot: {
      marginTop: 18,
      color: PRIMARY,
      textAlign:
        "center",
      fontWeight:
        "600",
    },

    disabledText: {
      opacity: 0.5,
    },

    footer: {
      marginTop: 30,
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    footerText: {
      color: "#666666",
      fontSize: 15,
    },

    link: {
      marginLeft: 6,
      color: PRIMARY,
      fontWeight:
        "700",
      fontSize: 15,
    },
  });