import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

const PRIMARY = "#B3000F";

export default function UpcomingEventScreen({
  navigation,
}: any) {
  const event = {
    title: "Free Eye Screening",
    date: "August 24, 2026",
    time: "9:00 AM - 3:00 PM",
    location: "Pristine Eye Care",
    description:
      "Join us for a free eye screening event. Our eye care professionals will provide basic vision screening and help identify possible vision problems that may require further professional examination.",
  };

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    const parent = navigation?.getParent?.();

    if (parent?.canGoBack?.()) {
      parent.goBack();
      return;
    }

    console.log("No previous screen available.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={12}
            android_ripple={{
              color: "#EEEEEE",
              borderless: true,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#222222"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Upcoming Event
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* EVENT BANNER */}

        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons
              name="eye"
              size={52}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.bannerTitle}>
            {event.title}
          </Text>

          <Text style={styles.bannerSubtitle}>
            Your vision deserves the best care.
          </Text>
        </View>

        {/* EVENT DETAILS */}

        <View style={styles.card}>
          <Text style={styles.eventTitle}>
            {event.title}
          </Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="calendar-outline"
                size={21}
                color={PRIMARY}
              />
            </View>

            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>
                Date
              </Text>

              <Text style={styles.detailValue}>
                {event.date}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="time-outline"
                size={21}
                color={PRIMARY}
              />
            </View>

            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>
                Time
              </Text>

              <Text style={styles.detailValue}>
                {event.time}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="location-outline"
                size={21}
                color={PRIMARY}
              />
            </View>

            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>
                Location
              </Text>

              <Text style={styles.detailValue}>
                {event.location}
              </Text>
            </View>
          </View>
        </View>

        {/* ABOUT EVENT */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            About This Event
          </Text>

          <Text style={styles.description}>
            {event.description}
          </Text>
        </View>

        {/* WHAT TO EXPECT */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What to Expect
          </Text>

          <View style={styles.expectCard}>
            <View style={styles.expectItem}>
              <View style={styles.checkIcon}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.expectText}>
                Basic vision screening
              </Text>
            </View>

            <View style={styles.expectItem}>
              <View style={styles.checkIcon}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.expectText}>
                Professional eye care guidance
              </Text>
            </View>

            <View
              style={[
                styles.expectItem,
                styles.lastExpectItem,
              ]}
            >
              <View style={styles.checkIcon}>
                <Ionicons
                  name="checkmark"
                  size={16}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.expectText}>
                Early identification of possible
                vision problems
              </Text>
            </View>
          </View>
        </View>

        {/* NOTICE */}

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={PRIMARY}
          />

          <Text style={styles.noticeText}>
            This event is announced by Pristine Eye
            Care. Screening does not replace a full
            professional eye examination.
          </Text>
        </View>

        {/* INTEREST BUTTON */}

        <Pressable
          style={styles.actionButton}
          onPress={() => {
            console.log(
              "Event registration will be connected later."
            );
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.actionButtonText}>
            I'm Interested
          </Text>
        </Pressable>

        {/* FOOTER */}

        <Text style={styles.footer}>
          Pristine Eye Care
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
    paddingBottom: 35,
  },

  header: {
    height: 65,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222222",
  },

  headerSpacer: {
    width: 42,
  },

  banner: {
    backgroundColor: PRIMARY,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: "center",
  },

  bannerIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  bannerSubtitle: {
    color: "#FFFFFF",
    opacity: 0.85,
    fontSize: 14,
    marginTop: 7,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -18,
    borderRadius: 18,
    padding: 20,
    elevation: 4,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  eventTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#222222",
    marginBottom: 20,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  detailIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#FFF0F1",
    alignItems: "center",
    justifyContent: "center",
  },

  detailInfo: {
    flex: 1,
    marginLeft: 12,
  },

  detailLabel: {
    fontSize: 11,
    color: "#888888",
    marginBottom: 3,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },

  section: {
    marginHorizontal: 20,
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666666",
  },

  expectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
  },

  expectItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  lastExpectItem: {
    marginBottom: 0,
  },

  checkIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  expectText: {
    flex: 1,
    fontSize: 14,
    color: "#555555",
    lineHeight: 21,
    paddingTop: 2,
  },

  notice: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: "#FFF7F7",
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  noticeText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 12,
    lineHeight: 18,
    color: "#777777",
  },

  actionButton: {
    marginHorizontal: 20,
    marginTop: 25,
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    marginTop: 25,
    color: "#999999",
    fontSize: 12,
  },
});