import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.greeting}>Good Morning 👋</Text>

        <Text style={styles.name}>
          Welcome to Pristine Eye Care
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
            <Text style={styles.boxText}>Eye Test</Text>
          </Pressable>

          <Pressable style={styles.box}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.boxText}>Appointments</Text>
          </Pressable>

          <Pressable style={styles.box}>
            <Text style={styles.icon}>🛍️</Text>
            <Text style={styles.boxText}>Shop</Text>
          </Pressable>

          <Pressable style={styles.box}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.boxText}>Branches</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY = "#B3000F";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  content: {
    padding: 20,
  },

  greeting: {
    fontSize: 18,
    color: "#666",
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: PRIMARY,
    marginTop: 8,
    marginBottom: 25,
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
    marginTop: 10,
    fontSize: 16,
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
    fontWeight: "700",
    fontSize: 16,
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
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  box: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 28,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
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
    marginTop: 30,
    marginBottom: 20,
  },
});