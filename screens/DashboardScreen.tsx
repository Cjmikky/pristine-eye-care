import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

const PRIMARY = "#B3000F";

export default function DashboardScreen() {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning 👋";
    if (hour < 17) return "Good Afternoon ☀️";
    if (hour < 20) return "Good Evening 🌇";

    return "Good Night 🌙";
  };

  // Temporary hardcoded name.
  // We'll fetch this from Firebase in the next step.
  const userName = "Chijioke Kelvin Wiche";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.greeting}>
          {getGreeting()}
        </Text>

        <Text style={styles.welcome}>
          Welcome back,
          <Text style={styles.userName}> {userName}</Text>
        </Text>

        {/* Appointment Card */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Next Appointment
          </Text>

          <Text style={styles.cardText}>
            No upcoming appointment.
          </Text>

          <Pressable style={styles.cardButton}>
            <Text style={styles.cardButtonText}>
              Book Appointment
            </Text>
          </Pressable>
        </View>

        {/* Quick Actions */}

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.grid}>
          <Pressable style={styles.box}>
            <Text style={styles.icon}>👓</Text>

            <Text style={styles.boxText}>
              Eye Test
            </Text>
          </Pressable>

          <Pressable style={styles.box}>
            <Text style={styles.icon}>📅</Text>

            <Text style={styles.boxText}>
              Appointments
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  content: {
    padding: 20,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },

  welcome: {
    fontSize: 18,
    color: "#777",
    marginBottom: 20,
    flexWrap: "wrap",
  },

  userName: {
    color: PRIMARY,
    fontWeight: "700",
  },

  card: {
    backgroundColor: PRIMARY,
    borderRadius: 18,
    padding: 22,
  },

  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  cardText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 10,
  },

  cardButton: {
    marginTop: 20,
    backgroundColor: "#FFF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  cardButtonText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "700",
  },

  sectionTitle: {
    marginTop: 35,
    marginBottom: 18,
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  grid: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  box: {
    width: "45%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: "center",
    elevation: 3,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  icon: {
    fontSize: 34,
  },

  boxText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  footer: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    marginBottom: 20,
    fontSize: 14,
  },
});