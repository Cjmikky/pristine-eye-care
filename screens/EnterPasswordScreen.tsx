import React, {
  useEffect,
  useState,
} from "react";

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

import * as LocalAuthentication from "expo-local-authentication";

import * as SecureStore from "expo-secure-store";

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
 * SECURE STORE KEYS
 * ========================================
 */

const BIOMETRIC_ENABLED_KEY =
  "pristine_biometric_enabled";

const BIOMETRIC_EMAIL_KEY =
  "pristine_biometric_email";

const BIOMETRIC_PASSWORD_KEY =
  "pristine_biometric_password";

/*
 * ========================================
 * INTERNAL FIREBASE AUTH IDENTIFIER
 * ========================================
 *
 * The customer logs in using their phone
 * number.
 *
 * Firebase internally uses:
 *
 * 08038948686@pristine-auth.local
 *
 * This is never displayed to the customer.
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

  const [
    biometricLoading,
    setBiometricLoading,
  ] = useState(false);

  const [
    biometricAvailable,
    setBiometricAvailable,
  ] = useState(false);

  const [
    biometricEnabled,
    setBiometricEnabled,
  ] = useState(false);

  /*
   * ========================================
   * CHECK BIOMETRIC SUPPORT
   * ========================================
   */

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability =
    async () => {
      try {
        if (
          Platform.OS === "web"
        ) {
          return;
        }

        const hasHardware =
          await LocalAuthentication.hasHardwareAsync();

        const isEnrolled =
          await LocalAuthentication.isEnrolledAsync();

        const supportedTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();

        const hasFingerprint =
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType
              .FINGERPRINT
          );

        /*
         * We allow fingerprint specifically
         * on Android.
         *
         * On iOS, Face ID / Touch ID is also
         * supported.
         */

        const available =
          hasHardware &&
          isEnrolled &&
          (
            Platform.OS === "android"
              ? hasFingerprint
              : supportedTypes.length > 0
          );

        setBiometricAvailable(
          available
        );

        /*
         * Check whether this customer has
         * previously enabled biometric login.
         */

        const enabled =
          await SecureStore.getItemAsync(
            BIOMETRIC_ENABLED_KEY
          );

        const savedEmail =
          await SecureStore.getItemAsync(
            BIOMETRIC_EMAIL_KEY
          );

        /*
         * Only enable the button if the
         * saved biometric account belongs
         * to this phone number.
         */

        const expectedEmail =
          getFirebaseAuthIdentifier(
            phoneNumber
          );

        setBiometricEnabled(
          enabled === "true" &&
          savedEmail === expectedEmail
        );
      } catch (error) {
        console.log(
          "Biometric availability check failed:",
          error
        );

        setBiometricAvailable(
          false
        );

        setBiometricEnabled(
          false
        );
      }
    };

  /*
   * ========================================
   * SAVE BIOMETRIC CREDENTIALS
   * ========================================
   *
   * The password is stored only inside
   * SecureStore and protected by the device's
   * authentication mechanism.
   *
   * It is NEVER stored in AsyncStorage,
   * Firestore or plain text files.
   */

  const saveBiometricCredentials =
    async (
      authIdentifier: string,
      userPassword: string
    ) => {
      try {
        await SecureStore.setItemAsync(
          BIOMETRIC_EMAIL_KEY,
          authIdentifier
        );

        await SecureStore.setItemAsync(
          BIOMETRIC_PASSWORD_KEY,
          userPassword,
          {
            requireAuthentication:
              true,

            authenticationPrompt:
              "Authenticate to enable fingerprint login for Pristine Eye Care.",
          }
        );

        await SecureStore.setItemAsync(
          BIOMETRIC_ENABLED_KEY,
          "true"
        );

        setBiometricEnabled(
          true
        );

        console.log(
          "Biometric login enabled successfully."
        );

        return true;
      } catch (error) {
        console.log(
          "Failed to save biometric credentials:",
          error
        );

        /*
         * Clean up partially stored data.
         */

        try {
          await SecureStore.deleteItemAsync(
            BIOMETRIC_EMAIL_KEY
          );

          await SecureStore.deleteItemAsync(
            BIOMETRIC_PASSWORD_KEY
          );

          await SecureStore.deleteItemAsync(
            BIOMETRIC_ENABLED_KEY
          );
        } catch (
          cleanupError
        ) {
          console.log(
            "Biometric cleanup error:",
            cleanupError
          );
        }

        return false;
      }
    };

  /*
   * ========================================
   * BIOMETRIC LOGIN
   * ========================================
   */

  const handleBiometricLogin =
    async () => {
      if (
        biometricLoading ||
        loading
      ) {
        return;
      }

      try {
        setBiometricLoading(
          true
        );

        /*
         * Confirm that biometric hardware
         * is still available.
         */

        const hasHardware =
          await LocalAuthentication.hasHardwareAsync();

        const isEnrolled =
          await LocalAuthentication.isEnrolledAsync();

        if (
          !hasHardware ||
          !isEnrolled
        ) {
          Alert.alert(
            "Fingerprint Unavailable",
            "Please set up a fingerprint on your phone and try again."
          );

          return;
        }

        /*
         * Ask the device to authenticate.
         */

        const result =
          await LocalAuthentication.authenticateAsync(
            {
              promptMessage:
                "Sign in to Pristine Eye Care",

              promptDescription:
                "Use your fingerprint to securely sign in.",

              cancelLabel:
                "Cancel",

              disableDeviceFallback:
                false,

              requireConfirmation:
                true,

              biometricsSecurityLevel:
                "strong",
            }
          );

        if (
          !result.success
        ) {
          console.log(
            "Biometric authentication failed:",
            result.error
          );

          if (
            result.error ===
              "user_cancel" ||
            result.error ===
              "system_cancel" ||
            result.error ===
              "app_cancel"
          ) {
            return;
          }

          Alert.alert(
            "Fingerprint Login Failed",
            "Fingerprint authentication was not successful. Please try again or use your password."
          );

          return;
        }

        /*
         * ====================================
         * GET SECURE CREDENTIALS
         * ====================================
         */

        const savedEmail =
          await SecureStore.getItemAsync(
            BIOMETRIC_EMAIL_KEY
          );

        const savedPassword =
          await SecureStore.getItemAsync(
            BIOMETRIC_PASSWORD_KEY,
            {
              requireAuthentication:
                true,

              authenticationPrompt:
                "Authenticate to sign in to Pristine Eye Care.",
            }
          );

        if (
          !savedEmail ||
          !savedPassword
        ) {
          /*
           * The credentials may have been
           * invalidated because the user changed
           * their fingerprint settings.
           */

          await SecureStore.deleteItemAsync(
            BIOMETRIC_EMAIL_KEY
          );

          await SecureStore.deleteItemAsync(
            BIOMETRIC_PASSWORD_KEY
          );

          await SecureStore.deleteItemAsync(
            BIOMETRIC_ENABLED_KEY
          );

          setBiometricEnabled(
            false
          );

          Alert.alert(
            "Fingerprint Login Unavailable",
            "Your biometric login needs to be enabled again. Please sign in with your password."
          );

          return;
        }

        /*
         * Make sure the stored account belongs
         * to the current phone number.
         */

        const expectedEmail =
          getFirebaseAuthIdentifier(
            phoneNumber
          );

        if (
          savedEmail !==
          expectedEmail
        ) {
          Alert.alert(
            "Account Mismatch",
            "The saved fingerprint login belongs to another account. Please sign in with your password."
          );

          return;
        }

        /*
         * ====================================
         * FIREBASE LOGIN
         * ====================================
         */

        await signInWithEmailAndPassword(
          auth,
          savedEmail,
          savedPassword
        );

        console.log(
          "===================================="
        );

        console.log(
          "BIOMETRIC LOGIN SUCCESS"
        );

        console.log(
          "Phone:",
          phoneNumber
        );

        console.log(
          "===================================="
        );

        navigation.replace(
          "Dashboard"
        );
      } catch (error: any) {
        console.log(
          "===================================="
        );

        console.log(
          "BIOMETRIC LOGIN ERROR"
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
         * SecureStore can throw when the
         * biometric enrollment changes.
         */

        if (
          error?.message?.includes(
            "authentication"
          ) ||
          error?.message?.includes(
            "biometric"
          )
        ) {
          Alert.alert(
            "Fingerprint Login Failed",
            "Please use your password to sign in."
          );
        } else {
          Alert.alert(
            "Login Failed",
            "Unable to sign in with fingerprint. Please use your password."
          );
        }
      } finally {
        setBiometricLoading(
          false
        );
      }
    };

  /*
   * ========================================
   * PASSWORD LOGIN
   * ========================================
   */

  const handleLogin =
    async () => {
      if (loading) {
        return;
      }

      /*
       * PASSWORD VALIDATION
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
         * ====================================
         * FIND CUSTOMER
         * ====================================
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
         * CUSTOMER NOT FOUND
         */

        if (
          snapshot.empty
        ) {
          Alert.alert(
            "Account Not Found",
            "We could not find your Pristine Eye Care account."
          );

          return;
        }

        /*
         * ====================================
         * GET CUSTOMER
         * ====================================
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
         * ====================================
         * CHECK ACCOUNT ACTIVATION
         * ====================================
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
         * NOT ACTIVATED
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
         * ====================================
         * FIREBASE IDENTIFIER
         * ====================================
         */

        const authIdentifier =
          getFirebaseAuthIdentifier(
            phoneNumber
          );

        /*
         * ====================================
         * FIREBASE LOGIN
         * ====================================
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
         * ====================================
         * ENABLE BIOMETRIC LOGIN
         * ====================================
         *
         * We only ask if biometric hardware
         * is available.
         */

        if (
          biometricAvailable &&
          !biometricEnabled
        ) {
          Alert.alert(
            "Enable Fingerprint Login?",
            "Use your fingerprint next time to sign in faster and securely.",
            [
              {
                text: "Not Now",
                style: "cancel",

                onPress: () => {
                  navigation.replace(
                    "Dashboard"
                  );
                },
              },

              {
                text: "Enable",

                onPress:
                  async () => {
                    const saved =
                      await saveBiometricCredentials(
                        authIdentifier,
                        password
                      );

                    if (
                      !saved
                    ) {
                      Alert.alert(
                        "Fingerprint Setup Failed",
                        "Your account was signed in successfully, but fingerprint login could not be enabled."
                      );
                    }

                    navigation.replace(
                      "Dashboard"
                    );
                  },
              },
            ]
          );
        } else {
          /*
           * ==================================
           * DASHBOARD
           * ==================================
           */

          navigation.replace(
            "Dashboard"
          );
        }
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
         * FIREBASE ERROR HANDLING
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
            disabled={
              loading ||
              biometricLoading
            }
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
            style={
              styles.title
            }
          >
            Enter Your Password
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
            editable={
              !loading &&
              !biometricLoading
            }
          />

          {/* FORGOT PASSWORD */}

          <Pressable
            onPress={() =>
              navigation.navigate(
                "ForgotPassword"
              )
            }
            disabled={
              loading ||
              biometricLoading
            }
          >
            <Text
              style={[
                styles.forgotPassword,
                (
                  loading ||
                  biometricLoading
                ) &&
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
            disabled={
              loading ||
              biometricLoading
            }
            style={[
              styles.loginButton,
              (
                loading ||
                biometricLoading
              ) &&
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

          {/* BIOMETRIC LOGIN */}

          {biometricAvailable &&
            biometricEnabled && (
              <Pressable
                onPress={
                  handleBiometricLogin
                }
                disabled={
                  loading ||
                  biometricLoading
                }
                style={[
                  styles.biometricButton,
                  (
                    loading ||
                    biometricLoading
                  ) &&
                    styles.biometricButtonDisabled,
                ]}
              >
                {biometricLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={PRIMARY}
                  />
                ) : (
                  <>
                    <Ionicons
                      name={
                        Platform.OS ===
                        "ios"
                          ? "scan-outline"
                          : "finger-print-outline"
                      }
                      size={27}
                      color={PRIMARY}
                    />

                    <Text
                      style={
                        styles.biometricButtonText
                      }
                    >
                      Use Fingerprint
                    </Text>
                  </>
                )}
              </Pressable>
            )}

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

    biometricButton: {
      height: 52,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: PRIMARY,
      backgroundColor:
        "#FFF5F5",
      alignItems:
        "center",
      justifyContent:
        "center",
      flexDirection:
        "row",
      marginTop: 12,
    },

    biometricButtonDisabled: {
      opacity: 0.6,
    },

    biometricButtonText: {
      color: PRIMARY,
      fontSize: 16,
      fontWeight: "700",
      marginLeft: 9,
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