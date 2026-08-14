import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import CreatePasswordScreen from "../screens/CreatePasswordScreen";
import EnterPasswordScreen from "../screens/EnterPasswordScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ChatScreen from "../screens/ChatScreen";
import UpcomingEventScreen from "../screens/UpcomingEventScreen";

import BottomNavigator from "./BottomNavigator";

export type RootStackParamList = {
  Splash: undefined;

  Login: undefined;

  Signup:
    | {
        phoneNumber?: string;
      }
    | undefined;

  CreatePassword: {
    phoneNumber: string;
  };

  EnterPassword: {
    phoneNumber: string;
  };

  ForgotPassword: undefined;

  Dashboard: undefined;

  Notifications: undefined;

  Chat: undefined;

  UpcomingEvent: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Signup"
        component={SignupScreen}
      />

      <Stack.Screen
        name="CreatePassword"
        component={CreatePasswordScreen}
      />

      <Stack.Screen
        name="EnterPassword"
        component={EnterPasswordScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="Dashboard"
        component={BottomNavigator}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />

      <Stack.Screen
        name="Chat"
        component={ChatScreen}
      />

      <Stack.Screen
        name="UpcomingEvent"
        component={UpcomingEventScreen}
      />
    </Stack.Navigator>
  );
}