import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission() {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      "appointment-reminders",
      {
        name: "Appointment Reminders",
        importance:
          Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      }
    );
  }

  return true;
}

function parseAppointmentDateTime(
  appointmentDate: string,
  appointmentTime: string
) {
  const date = new Date(appointmentDate);

  const timeMatch =
    appointmentTime.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

  if (!timeMatch) {
    throw new Error(
      `Invalid appointment time: ${appointmentTime}`
    );
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

export async function scheduleAppointmentReminders(
  appointmentDate: string,
  appointmentTime: string,
  service: string
) {
  const appointmentDateTime =
    parseAppointmentDateTime(
      appointmentDate,
      appointmentTime
    );

  const now = new Date();

  const reminders = [
    {
      id: "2-days",
      offset: 2 * 24 * 60 * 60 * 1000,
      title: "Appointment Reminder",
      body: `Your ${service} appointment is in 2 days.`,
    },
    {
      id: "1-day",
      offset: 24 * 60 * 60 * 1000,
      title: "Appointment Tomorrow",
      body: `Your ${service} appointment is tomorrow at ${appointmentTime}.`,
    },
    {
      id: "2-hours",
      offset: 2 * 60 * 60 * 1000,
      title: "Appointment Reminder",
      body: `Your ${service} appointment is in 2 hours at ${appointmentTime}.`,
    },
  ];

  const scheduledIds: string[] = [];

  for (const reminder of reminders) {
    const triggerDate = new Date(
      appointmentDateTime.getTime() -
        reminder.offset
    );

    if (triggerDate <= now) {
      continue;
    }

    const notificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.body,
          sound: "default",
          data: {
            type: "appointment-reminder",
            reminder: reminder.id,
            appointmentDate,
            appointmentTime,
            service,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });

    scheduledIds.push(notificationId);
  }

  return scheduledIds;
}