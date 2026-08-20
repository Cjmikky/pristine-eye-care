import React, { useEffect, useState } from "react";
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

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

import {
  useTheme,
  ThemeColors,
} from "../context/ThemeContext";

import {
  requestNotificationPermission,
  scheduleAppointmentReminders,
} from "../utils/appointmentNotifications";

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

type AppointmentData = {
  id: string;
  patientId: string;
  patientEmail: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: string;
  createdAt: any;
  updatedAt: any;
};

export default function AppointmentScreen() {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  const [showForm, setShowForm] = useState(false);

  const [appointment, setAppointment] =
    useState<AppointmentData | null>(null);

  const [loadingAppointment, setLoadingAppointment] =
    useState(true);

  const [selectedService, setSelectedService] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedTime, setSelectedTime] =
    useState("");

  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setAppointment(null);
      setLoadingAppointment(false);
      return;
    }

    setLoadingAppointment(true);

    const appointmentQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      appointmentQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setAppointment(null);
          setLoadingAppointment(false);
          return;
        }

        const appointments: AppointmentData[] =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<
              AppointmentData,
              "id"
            >),
          }));

        appointments.sort((a, b) => {
          const aTime =
            a.createdAt?.toMillis?.() ||
            a.createdAt?.seconds ||
            0;

          const bTime =
            b.createdAt?.toMillis?.() ||
            b.createdAt?.seconds ||
            0;

          return bTime - aTime;
        });

        setAppointment(appointments[0]);

        setLoadingAppointment(false);
      },
      (error) => {
        console.error(
          "Real-time appointment listener error:",
          error
        );

        setLoadingAppointment(false);

        Alert.alert(
          "Unable to Load Appointment",
          "We couldn't load your appointment information. Please check your connection and try again."
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const getDateString = (
    daysFromToday: number
  ) => {
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

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(db, "appointments"),
        {
          patientId: user.uid,

          patientEmail:
            user.email || "",

          service:
            selectedService,

          appointmentDate:
            selectedDate,

          appointmentTime:
            selectedTime,

          notes:
            notes.trim(),

          status:
            "pending",

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      /*
       * Request notification permission and
       * schedule the appointment reminders.
       *
       * The reminders are stored locally on
       * the patient's phone, so the patient's
       * phone does not need to remain connected
       * to the laptop.
       */
      try {
        const notificationPermission =
          await requestNotificationPermission();

        if (notificationPermission) {
          await scheduleAppointmentReminders(
            selectedDate,
            selectedTime,
            selectedService
          );
        } else {
          console.log(
            "Notification permission was not granted."
          );
        }
      } catch (notificationError) {
        /*
         * Notification failure should not make
         * the appointment booking fail because
         * the appointment has already been saved
         * successfully to Firebase.
         */
        console.error(
          "Appointment reminder scheduling error:",
          notificationError
        );
      }

      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");

      setShowForm(false);

      Alert.alert(
        "Appointment Submitted",
        "Your appointment request has been submitted successfully. Pristine Eye Care will review your request."
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

  const getStatusText = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "confirmed":
        return "Confirmed";

      case "cancelled":
      case "canceled":
        return "Cancelled";

      case "completed":
        return "Completed";

      case "pending":
      default:
        return "Pending";
    }
  };

  const getStatusStyle = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "confirmed":
        return styles.statusConfirmed;

      case "cancelled":
      case "canceled":
        return styles.statusCancelled;

      case "completed":
        return styles.statusCompleted;

      case "pending":
      default:
        return styles.statusPending;
    }
  };

  const getStatusMessageTitle = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "confirmed":
        return "Appointment Confirmed";

      case "cancelled":
      case "canceled":
        return "Appointment Cancelled";

      case "completed":
        return "Appointment Completed";

      case "pending":
      default:
        return "Appointment Pending";
    }
  };

  const getStatusMessage = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "confirmed":
        return "Your appointment has been confirmed by Pristine Eye Care. Please arrive on time for your visit.";

      case "cancelled":
      case "canceled":
        return "This appointment has been cancelled. You can book another appointment if needed.";

      case "completed":
        return "Your appointment has been marked as completed by Pristine Eye Care.";

      case "pending":
      default:
        return "Your appointment request has been submitted successfully and is currently awaiting review by Pristine Eye Care.";
    }
  };

  if (!showForm) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={
            styles.responseContent
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              My Appointment
            </Text>

            <Text
              style={styles.subtitle}
            >
              View your appointment details
              and booking status.
            </Text>
          </View>

          {loadingAppointment ? (
            <View
              style={
                styles.loadingContainer
              }
            >
              <ActivityIndicator
                size="large"
                color={PRIMARY}
              />

              <Text
                style={
                  styles.loadingText
                }
              >
                Loading appointment...
              </Text>
            </View>
          ) : appointment ? (
            <>
              <View
                style={
                  styles.appointmentCard
                }
              >
                <View
                  style={
                    styles.appointmentHeader
                  }
                >
                  <View
                    style={
                      styles.appointmentTitleContainer
                    }
                  >
                    <Text
                      style={
                        styles.cardLabel
                      }
                    >
                      Appointment
                    </Text>

                    <Text
                      style={
                        styles.cardTitle
                      }
                    >
                      {
                        appointment.service
                      }
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      getStatusStyle(
                        appointment.status
                      ),
                    ]}
                  >
                    <Text
                      style={
                        styles.statusText
                      }
                    >
                      {getStatusText(
                        appointment.status
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <View
                    style={
                      styles.detailIcon
                    }
                  >
                    <Text>
                      📅
                    </Text>
                  </View>

                  <View
                    style={
                      styles.detailContent
                    }
                  >
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      Date
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }
                    >
                      {
                        appointment.appointmentDate
                      }
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.detailRow
                  }
                >
                  <View
                    style={
                      styles.detailIcon
                    }
                  >
                    <Text>
                      🕐
                    </Text>
                  </View>

                  <View
                    style={
                      styles.detailContent
                    }
                  >
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      Time
                    </Text>

                    <Text
                      style={
                        styles.detailValue
                      }
                    >
                      {
                        appointment.appointmentTime
                      }
                    </Text>
                  </View>
                </View>

                {appointment.notes ? (
                  <View
                    style={
                      styles.notesSection
                    }
                  >
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      Additional Notes
                    </Text>

                    <Text
                      style={
                        styles.notesText
                      }
                    >
                      {
                        appointment.notes
                      }
                    </Text>
                  </View>
                ) : null}
              </View>

              <View
                style={
                  styles.infoCard
                }
              >
                <Text
                  style={
                    styles.infoTitle
                  }
                >
                  {getStatusMessageTitle(
                    appointment.status
                  )}
                </Text>

                <Text
                  style={
                    styles.infoText
                  }
                >
                  {getStatusMessage(
                    appointment.status
                  )}
                </Text>
              </View>
            </>
          ) : (
            <View
              style={
                styles.emptyCard
              }
            >
              <Text
                style={
                  styles.emptyIcon
                }
              >
                📅
              </Text>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Appointment Yet
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                You haven't booked an
                appointment yet. Schedule
                your eye care visit with
                Pristine Eye Care.
              </Text>
            </View>
          )}

          <Pressable
            style={
              styles.bookButton
            }
            onPress={() => {
              setSelectedService("");
              setSelectedDate("");
              setSelectedTime("");
              setNotes("");
              setShowForm(true);
            }}
          >
            <Text
              style={
                styles.bookButtonText
              }
            >
              {appointment
                ? "Book Another Appointment"
                : "Book Appointment"}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <Pressable
          style={
            styles.backButton
          }
          onPress={() => {
            if (!submitting) {
              setShowForm(false);
            }
          }}
          disabled={submitting}
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            ← Back to Appointment
          </Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>
            Book Appointment
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Schedule a visit with
            Pristine Eye Care
          </Text>
        </View>

        <View
          style={styles.section}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            What do you need?
          </Text>

          <Text
            style={
              styles.requiredText
            }
          >
            Select a service
          </Text>

          <View
            style={
              styles.optionsContainer
            }
          >
            {SERVICES.map(
              (service) => {
                const selected =
                  selectedService ===
                  service;

                return (
                  <Pressable
                    key={service}
                    onPress={() =>
                      setSelectedService(
                        service
                      )
                    }
                    disabled={
                      submitting
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
              }
            )}
          </View>
        </View>

        <View
          style={styles.section}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Preferred Date
          </Text>

          <View
            style={
              styles.dateContainer
            }
          >
            {[1, 2, 3, 4, 5].map(
              (days) => {
                const date =
                  getDateString(
                    days
                  );

                const selected =
                  selectedDate ===
                  date;

                return (
                  <Pressable
                    key={date}
                    onPress={() =>
                      setSelectedDate(
                        date
                      )
                    }
                    disabled={
                      submitting
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

        <View
          style={styles.section}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Preferred Time
          </Text>

          <View
            style={styles.timeGrid}
          >
            {TIME_SLOTS.map(
              (time) => {
                const selected =
                  selectedTime ===
                  time;

                return (
                  <Pressable
                    key={time}
                    onPress={() =>
                      setSelectedTime(
                        time
                      )
                    }
                    disabled={
                      submitting
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
              }
            )}
          </View>
        </View>

        <View
          style={styles.section}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Additional Notes
          </Text>

          <TextInput
            value={notes}
            onChangeText={
              setNotes
            }
            placeholder="Tell us anything we should know..."
            placeholderTextColor={
              colors.secondaryText
            }
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            editable={!submitting}
            style={
              styles.notesInput
            }
          />
        </View>

        <View
          style={
            styles.summaryCard
          }
        >
          <Text
            style={
              styles.summaryTitle
            }
          >
            Appointment Summary
          </Text>

          <View
            style={
              styles.summaryRow
            }
          >
            <Text
              style={
                styles.summaryLabel
              }
            >
              Service
            </Text>

            <Text
              style={
                styles.summaryValue
              }
            >
              {selectedService ||
                "Not selected"}
            </Text>
          </View>

          <View
            style={
              styles.summaryRow
            }
          >
            <Text
              style={
                styles.summaryLabel
              }
            >
              Date
            </Text>

            <Text
              style={
                styles.summaryValue
              }
            >
              {selectedDate ||
                "Not selected"}
            </Text>
          </View>

          <View
            style={
              styles.summaryRow
            }
          >
            <Text
              style={
                styles.summaryLabel
              }
            >
              Time
            </Text>

            <Text
              style={
                styles.summaryValue
              }
            >
              {selectedTime ||
                "Not selected"}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.submitButton,
            submitting &&
              styles.submitButtonDisabled,
          ]}
          onPress={
            handleSubmit
          }
          disabled={
            submitting
          }
        >
          {submitting ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <Text
              style={
                styles.submitText
              }
            >
              Confirm Appointment
            </Text>
          )}
        </Pressable>

        <Text
          style={styles.notice}
        >
          Your appointment will
          remain pending until it
          is reviewed and confirmed
          by Pristine Eye Care.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (
  colors: ThemeColors
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    responseContent: {
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 40,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },

    header: {
      marginBottom: 25,
    },

    title: {
      fontSize: 27,
      fontWeight: "800",
      color: colors.text,
    },

    subtitle: {
      marginTop: 6,
      fontSize: 14,
      color: colors.secondaryText,
      lineHeight: 20,
    },

    loadingContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingVertical: 45,
      alignItems: "center",
      justifyContent: "center",
    },

    loadingText: {
      marginTop: 12,
      color: colors.secondaryText,
      fontSize: 14,
    },

    appointmentCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    appointmentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    },

    appointmentTitleContainer: {
      flex: 1,
      paddingRight: 10,
    },

    cardLabel: {
      fontSize: 12,
      color: colors.secondaryText,
      fontWeight: "600",
      marginBottom: 5,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      maxWidth: 220,
    },

    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
    },

    statusPending: {
      backgroundColor: "#FFF4D6",
    },

    statusConfirmed: {
      backgroundColor: "#E7F8ED",
    },

    statusCancelled: {
      backgroundColor: "#FDE8E8",
    },

    statusCompleted: {
      backgroundColor: "#E8F0FF",
    },

    statusText: {
      fontSize: 11,
      fontWeight: "800",
      color: "#555555",
      textTransform: "uppercase",
    },

    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 13,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    detailIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    detailContent: {
      flex: 1,
    },

    detailLabel: {
      fontSize: 12,
      color: colors.secondaryText,
      marginBottom: 3,
    },

    detailValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "700",
    },

    notesSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 8,
      paddingTop: 15,
    },

    notesText: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 21,
      color: colors.secondaryText,
    },

    infoCard: {
      backgroundColor:
        colors.primaryLight,
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },

    infoTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: PRIMARY,
      marginBottom: 7,
    },

    infoText: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.secondaryText,
    },

    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingHorizontal: 25,
      paddingVertical: 40,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },

    emptyIcon: {
      fontSize: 42,
      marginBottom: 12,
    },

    emptyTitle: {
      fontSize: 19,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8,
    },

    emptyText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.secondaryText,
      textAlign: "center",
    },

    bookButton: {
      backgroundColor: PRIMARY,
      borderRadius: 13,
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },

    bookButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
    },

    backButton: {
      marginBottom: 20,
    },

    backButtonText: {
      color: PRIMARY,
      fontSize: 14,
      fontWeight: "700",
    },

    section: {
      marginBottom: 25,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 12,
    },

    requiredText: {
      fontSize: 13,
      color: colors.secondaryText,
      marginBottom: 10,
    },

    optionsContainer: {
      gap: 10,
    },

    option: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 15,
      paddingVertical: 15,
    },

    optionSelected: {
      borderColor: PRIMARY,
      backgroundColor:
        colors.primaryLight,
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
      color: colors.text,
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
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
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
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
    },

    timeTextSelected: {
      color: "#FFFFFF",
      fontWeight: "700",
    },

    notesInput: {
      minHeight: 120,
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 15,
      fontSize: 14,
      color: colors.text,
    },

    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },

    summaryTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.text,
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
      color: colors.secondaryText,
      marginRight: 15,
    },

    summaryValue: {
      flex: 1,
      textAlign: "right",
      fontSize: 13,
      color: colors.text,
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
      color: colors.secondaryText,
      paddingHorizontal: 10,
    },
  });