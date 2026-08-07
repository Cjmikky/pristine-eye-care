import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
import EyeTestScreen from "../screens/EyeTestScreen";
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
        tabBarInactiveTintColor: "#888",

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
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
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}