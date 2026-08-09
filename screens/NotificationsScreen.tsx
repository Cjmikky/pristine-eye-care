import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Notifications from "expo-notifications";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  doc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

const PRIMARY = "#B3000F";

type Broadcast = {
  id: string;
  title: string;
  message: string;
  status: "sent" | "scheduled";
  createdAt?: Timestamp;
  scheduledAt?: Timestamp;
};

type NotificationItem = Broadcast & {
  read: boolean;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /*
   * Register this phone for push notifications.
   */
  const registerForPushNotifications =
    async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.log(
            "No authenticated user found."
          );
          return;
        }

        /*
         * Android notification channel.
         */
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync(
            "default",
            {
              name: "Pristine Eye Care",
              importance:
                Notifications.AndroidImportance
                  .MAX,
              vibrationPattern: [
                0,
                250,
                250,
                250,
              ],
              sound: "default",
              lockscreenVisibility:
                Notifications.AndroidNotificationVisibility.PUBLIC,
            }
          );
        }

        /*
         * Check existing permission.
         */
        const {
          status: existingStatus,
        } =
          await Notifications.getPermissionsAsync();

        let finalStatus =
          existingStatus;

        /*
         * Ask the patient for permission
         * if it has not already been granted.
         */
        if (existingStatus !== "granted") {
          const {
            status,
          } =
            await Notifications.requestPermissionsAsync();

          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.log(
            "Notification permission was not granted."
          );

          return;
        }

        /*
         * Get Expo push token.
         */
        const tokenData =
          await Notifications.getExpoPushTokenAsync(
            {
              projectId:
                "86092ca8-ac0b-4783-8df9-1f13b315c7a4",
            }
          );

        const pushToken =
          tokenData.data;

        console.log(
          "Expo Push Token:",
          pushToken
        );

        /*
         * Store the token against the
         * authenticated patient.
         *
         * Example:
         * users/{userId}
         */
        await setDoc(
          doc(db, "users", user.uid),
          {
            pushToken,
            pushTokenUpdatedAt:
              Timestamp.now(),
          },
          {
            merge: true,
          }
        );

        console.log(
          "Push token saved successfully."
        );
      } catch (error) {
        console.error(
          "Push notification registration error:",
          error
        );
      }
    };

  /*
   * Listen for broadcasts from Firestore.
   */
  const loadNotifications = () => {
    const user = auth.currentUser;

    if (!user) {
      setNotifications([]);
      setLoading(false);

      return () => {};
    }

    const broadcastsQuery =
      query(
        collection(db, "broadcasts"),
        where("status", "in", [
          "sent",
          "scheduled",
        ]),
        orderBy("createdAt", "desc")
      );

    const unsubscribe =
      onSnapshot(
        broadcastsQuery,
        (snapshot) => {
          const now = new Date();

          const list: NotificationItem[] =
            snapshot.docs
              .map((document) => {
                const data =
                  document.data() as Omit<
                    Broadcast,
                    "id"
                  >;

                return {
                  id: document.id,
                  ...data,
                  read: false,
                };
              })
              .filter((broadcast) => {
                if (
                  broadcast.status ===
                  "scheduled"
                ) {
                  if (
                    !broadcast.scheduledAt
                  ) {
                    return false;
                  }

                  const scheduledDate =
                    broadcast.scheduledAt.toDate();

                  return (
                    scheduledDate <= now
                  );
                }

                return true;
              });

          setNotifications(list);
          setLoading(false);
          setRefreshing(false);
        },
        (error) => {
          console.error(
            "Notification listener error:",
            error
          );

          setLoading(false);
          setRefreshing(false);
        }
      );

    return unsubscribe;
  };

  useEffect(() => {
    /*
     * Register the phone.
     */
    registerForPushNotifications();

    /*
     * Load Firestore notifications.
     */
    const unsubscribe =
      loadNotifications();

    /*
     * Listen for notifications while
     * the app is open.
     */
    const notificationSubscription =
      Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log(
            "Push notification received:",
            notification
          );
        }
      );

    /*
     * Listen when the patient taps
     * a notification.
     */
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log(
            "Notification opened:",
            response
          );
        }
      );

    return () => {
      unsubscribe();

      notificationSubscription.remove();

      responseSubscription.remove();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const markAsRead = async (
    notification: NotificationItem
  ) => {
    try {
      setNotifications(
        (current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  };

  const formatDate = (
    value?: Timestamp
  ) => {
    if (!value) {
      return "";
    }

    try {
      return value
        .toDate()
        .toLocaleString();
    } catch {
      return "";
    }
  };

  const renderNotification = ({
    item,
  }: {
    item: NotificationItem;
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          markAsRead(item)
        }
        style={[
          styles.notificationCard,
          !item.read &&
            styles.unreadCard,
        ]}
      >
        <View
          style={styles.iconContainer}
        >
          <Text style={styles.icon}>
            📢
          </Text>
        </View>

        <View
          style={
            styles.notificationContent
          }
        >
          <View
            style={styles.titleRow}
          >
            <Text
              style={
                styles.notificationTitle
              }
              numberOfLines={2}
            >
              {item.title}
            </Text>

            {!item.read && (
              <View
                style={
                  styles.unreadDot
                }
              />
            )}
          </View>

          <Text
            style={
              styles.notificationMessage
            }
          >
            {item.message}
          </Text>

          <Text
            style={
              styles.notificationDate
            }
          >
            {formatDate(
              item.createdAt
            )}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={PRIMARY}
        />

        <Text
          style={styles.loadingText}
        >
          Loading notifications...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Notifications
          </Text>

          <Text
            style={styles.subtitle}
          >
            Important updates from
            Pristine Eye Care
          </Text>
        </View>

        {unreadCount > 0 && (
          <View
            style={styles.countBadge}
          >
            <Text
              style={styles.countText}
            >
              {unreadCount}
            </Text>
          </View>
        )}
      </View>

      {notifications.length ===
      0 ? (
        <FlatList
          data={[]}
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor={PRIMARY}
            />
          }
          ListEmptyComponent={
            <View
              style={
                styles.emptyState
              }
            >
              <Text
                style={
                  styles.emptyIcon
                }
              >
                🔔
              </Text>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No notifications
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                You don't have any
                new notifications
                at the moment.
              </Text>
            </View>
          }
          renderItem={() => null}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={
            renderNotification
          }
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor={PRIMARY}
            />
          }
        />
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F6F7F9",
    },

    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#F6F7F9",
    },

    loadingText: {
      marginTop: 12,
      color: "#777",
      fontSize: 14,
    },

    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      backgroundColor: "#FFFFFF",
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    title: {
      fontSize: 26,
      fontWeight: "800",
      color: "#222",
    },

    subtitle: {
      marginTop: 5,
      fontSize: 13,
      color: "#888",
    },

    countBadge: {
      minWidth: 32,
      height: 32,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: PRIMARY,
      alignItems: "center",
      justifyContent: "center",
    },

    countText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },

    list: {
      padding: 16,
      paddingBottom: 30,
    },

    notificationCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      borderWidth: 1,
      borderColor: "#EEEEEE",
    },

    unreadCard: {
      borderColor: "#FFD6D9",
      backgroundColor: "#FFF9FA",
    },

    iconContainer: {
      width: 46,
      height: 46,
      borderRadius: 12,
      backgroundColor: "#FFF0F1",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    icon: {
      fontSize: 22,
    },

    notificationContent: {
      flex: 1,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },

    notificationTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "800",
      color: "#333",
      paddingRight: 8,
    },

    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: PRIMARY,
      marginTop: 5,
    },

    notificationMessage: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 20,
      color: "#555",
    },

    notificationDate: {
      marginTop: 9,
      fontSize: 10,
      color: "#999",
    },

    emptyState: {
      flex: 1,
      minHeight: 500,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
    },

    emptyIcon: {
      fontSize: 48,
      marginBottom: 15,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: "#444",
    },

    emptyText: {
      marginTop: 7,
      textAlign: "center",
      fontSize: 13,
      lineHeight: 20,
      color: "#999",
    },
  });