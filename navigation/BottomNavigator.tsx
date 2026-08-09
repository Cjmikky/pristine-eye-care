import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
import EyeTestScreen from "../screens/EyeTestScreen";
import GalleryScreen from "../screens/GalleryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const PRIMARY = "#B3000F";

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#888888",

        /*
         * Make the bottom navigation occupy
         * the entire available width.
         */
        tabBarStyle: {
          height: 65,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          elevation: 8,
        },

        /*
         * Each tab gets equal space.
         *
         * 5 tabs = 20% each.
         */
        tabBarItemStyle: {
          flex: 1,
          width: "20%",
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 1,
        },

        tabBarIconStyle: {
          marginBottom: -2,
        },

        tabBarIcon: ({ color, size }) => {
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
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      {/* APPOINTMENTS */}
      <Tab.Screen
        name="Appointments"
        component={AppointmentScreen}
      />

      {/* EYE TEST */}
      <Tab.Screen
        name="Eye Test"
        component={EyeTestScreen}
      />

      {/* GALLERY */}
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}