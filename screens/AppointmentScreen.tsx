import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const PRIMARY = "#B3000F";

const SERVICES = [
  "General Eye Examination",
  "Comprehensive Eye Test",
  "Cataract Consultation",
  "Glaucoma Screening",
  "Vision Screening",
];

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

export default function AppointmentScreen() {
  const [selectedService, setSelectedService] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const getDateString = (daysFromToday: number) => {
    const date = new Date();

    date.setDate(
      date.getDate() + daysFromToday
    );

    return date.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert(
        "Login Required",
        "Please log in before booking an appointment."
      );

      return;
    }

    if (!selectedService) {
      Alert.alert(
        "Select Service",
        "Please select the type of eye care service you need."
      );

      return;
    }

    if (!selectedDate) {
      Alert.alert(
        "Select Date",
        "Please select your preferred appointment date."
      );

      return;
    }

    if (!selectedTime) {
      Alert.alert(
        "Select Time",
        "Please select your preferred appointment time."
      );

      return;
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(db, "appointments"),
        {
          patientId: user.uid,
          patientEmail: user.email || "",

          service: selectedService,

          appointmentDate: selectedDate,

          appointmentTime: selectedTime,

          notes: notes.trim(),

          status: "pending",

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp(),
        }
      );

      Alert.alert(
        "Appointment Submitted",
        "Your appointment request has been submitted successfully. Pristine Eye Care will review your request.",
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedService("");
              setSelectedDate("");
              setSelectedTime("");
              setNotes("");
            },
          },
        ]
      );
    } catch (error) {
      console.error(
        "Appointment submission error:",
        error
      );

      Alert.alert(
        "Booking Failed",
        "We couldn't submit your appointment. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Book Appointment
          </Text>

          <Text style={styles.subtitle}>
            Schedule a visit with Pristine Eye Care
          </Text>
        </View>

        {/* SERVICE */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What do you need?
          </Text>

          <Text style={styles.requiredText}>
            Select a service
          </Text>

          <View style={styles.optionsContainer}>
            {SERVICES.map((service) => {
              const selected =
                selectedService === service;

              return (
                <Pressable
                  key={service}
                  onPress={() =>
                    setSelectedService(service)
                  }
                  style={[
                    styles.option,
                    selected &&
                      styles.optionSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.radio,
                      selected &&
                        styles.radioSelected,
                    ]}
                  >
                    {selected && (
                      <View
                        style={
                          styles.radioInner
                        }
                      />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.optionText,
                      selected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {service}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* DATE */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Preferred Date
          </Text>

          <View style={styles.dateContainer}>
            {[1, 2, 3, 4, 5].map(
              (days) => {
                const date =
                  getDateString(days);

                const selected =
                  selectedDate === date;

                return (
                  <Pressable
                    key={date}
                    onPress={() =>
                      setSelectedDate(date)
                    }
                    style={[
                      styles.dateButton,
                      selected &&
                        styles.dateButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        selected &&
                          styles.dateTextSelected,
                      ]}
                    >
                      {date}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>
        </View>

        {/* TIME */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Preferred Time
          </Text>

          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => {
              const selected =
                selectedTime === time;

              return (
                <Pressable
                  key={time}
                  onPress={() =>
                    setSelectedTime(time)
                  }
                  style={[
                    styles.timeButton,
                    selected &&
                      styles.timeButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selected &&
                        styles.timeTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* NOTES */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Additional Notes
          </Text>

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Tell us anything we should know..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={styles.notesInput}
          />
        </View>

        {/* SUMMARY */}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Appointment Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Service
            </Text>

            <Text style={styles.summaryValue}>
              {selectedService || "Not selected"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Date
            </Text>

            <Text style={styles.summaryValue}>
              {selectedDate || "Not selected"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Time
            </Text>

            <Text style={styles.summaryValue}>
              {selectedTime || "Not selected"}
            </Text>
          </View>
        </View>

        {/* SUBMIT */}

        <Pressable
          style={[
            styles.submitButton,
            submitting &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={styles.submitText}
            >
              Confirm Appointment
            </Text>
          )}
        </Pressable>

        <Text style={styles.notice}>
          Your appointment will remain pending
          until it is reviewed and confirmed by
          Pristine Eye Care.
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
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 25,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#222222",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#888888",
    lineHeight: 20,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222222",
    marginBottom: 12,
  },

  requiredText: {
    fontSize: 13,
    color: "#777777",
    marginBottom: 10,
  },

  optionsContainer: {
    gap: 10,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  optionSelected: {
    borderColor: PRIMARY,
    backgroundColor: "#FFF5F6",
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#AAAAAA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  radioSelected: {
    borderColor: PRIMARY,
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },

  optionText: {
    flex: 1,
    fontSize: 14,
    color: "#444444",
    fontWeight: "600",
  },

  optionTextSelected: {
    color: PRIMARY,
    fontWeight: "700",
  },

  dateContainer: {
    gap: 9,
  },

  dateButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },

  dateButtonSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  dateText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#444444",
  },

  dateTextSelected: {
    color: "#FFFFFF",
  },

  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  timeButton: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  timeButtonSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444444",
  },

  timeTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  notesInput: {
    minHeight: 120,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 14,
    color: "#333333",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 20,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222222",
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 7,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#888888",
    marginRight: 15,
  },

  summaryValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "#333333",
    fontWeight: "700",
  },

  submitButton: {
    backgroundColor: PRIMARY,
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  notice: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    color: "#999999",
    paddingHorizontal: 10,
  },
});