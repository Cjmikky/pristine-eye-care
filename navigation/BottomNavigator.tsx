import React from "react";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
import EyeTestScreen from "../screens/EyeTestScreen";
import GalleryScreen from "../screens/GalleryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";

import {
  useTheme,
} from "../context/ThemeContext";

const PRIMARY = "#B3000F";

export type BottomTabParamList = {
  Home: undefined;
  Appointments: undefined;
  "Eye Test": undefined;
  Gallery: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Tab =
  createBottomTabNavigator<BottomTabParamList>();

export default function BottomNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor:
          PRIMARY,

        tabBarInactiveTintColor:
          colors.secondaryText,

        tabBarStyle: {
          height: 65,
          paddingTop: 6,
          paddingBottom: 8,

          backgroundColor:
            colors.tabBar,

          borderTopWidth: 1,

          borderTopColor:
            colors.border,

          elevation: 8,
        },

        tabBarItemStyle: {
          flex: 1,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 1,
        },

        tabBarIconStyle: {
          marginBottom: -2,
        },

        tabBarIcon: ({
          color,
          size,
        }) => {
          let iconName:
            | keyof typeof Ionicons.glyphMap
            | undefined;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;

            case "Appointments":
              iconName = "calendar";
              break;

            case "Eye Test":
              iconName = "eye";
              break;

            case "Gallery":
              iconName = "images";
              break;

            case "Profile":
              iconName = "person";
              break;

            case "Settings":
              iconName = "settings";
              break;

            default:
              iconName = "ellipse";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Appointments"
        component={AppointmentScreen}
      />

      <Tab.Screen
        name="Eye Test"
        component={EyeTestScreen}
      />

      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}