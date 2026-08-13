import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const PRIMARY = "#B3000F";

export default function CustomerCareScreen() {
  const handleCall = async () => {
    const phoneNumber = "tel:+2348000000000";

    try {
      await Linking.openURL(phoneNumber);
    } catch (error) {
      Alert.alert(
        "Unable to Call",
        "We could not open the phone dialer."
      );
    }
  };

  const handleEmail = async () => {
    const emailUrl =
      "mailto:support@pristineeyecare.com";

    try {
      await Linking.openURL(emailUrl);
    } catch (error) {
      Alert.alert(
        "Unable to Email",
        "We could not open your email application."
      );
    }
  };

  const handleChat = () => {
    Alert.alert(
      "Customer Care Chat",
      "Chat support will be available here shortly."
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Customer Care
            </Text>

            <Text style={styles.subtitle}>
              We're here to help you.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="headset-outline"
              size={28}
              color={PRIMARY}
            />
          </View>
        </View>

        {/* SUPPORT CARD */}

        <View style={styles.supportCard}>
          <View style={styles.supportIcon}>
            <Ionicons
              name="heart-outline"
              size={30}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.supportTitle}>
            How can we help?
          </Text>

          <Text style={styles.supportText}>
            Our customer care team is available to
            assist you with appointments, eye tests,
            results and other enquiries.
          </Text>
        </View>

        {/* CONTACT OPTIONS */}

        <Text style={styles.sectionTitle}>
          Contact Us
        </Text>

        {/* CALL */}

        <Pressable
          style={styles.contactCard}
          onPress={handleCall}
        >
          <View style={styles.contactIcon}>
            <Ionicons
              name="call-outline"
              size={24}
              color={PRIMARY}
            />
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>
              Call Customer Care
            </Text>

            <Text style={styles.contactSubtitle}>
              Speak directly with our support team
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#999999"
          />
        </Pressable>

        {/* CHAT */}

        <Pressable
          style={styles.contactCard}
          onPress={handleChat}
        >
          <View style={styles.contactIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={PRIMARY}
            />
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>
              Chat With Us
            </Text>

            <Text style={styles.contactSubtitle}>
              Send us a message
            </Text>
          </View>

          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />

            <Text style={styles.onlineText}>
              Online
            </Text>
          </View>
        </Pressable>

        {/* EMAIL */}

        <Pressable
          style={styles.contactCard}
          onPress={handleEmail}
        >
          <View style={styles.contactIcon}>
            <Ionicons
              name="mail-outline"
              size={24}
              color={PRIMARY}
            />
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>
              Email Support
            </Text>

            <Text style={styles.contactSubtitle}>
              support@pristineeyecare.com
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#999999"
          />
        </Pressable>

        {/* OPENING HOURS */}

        <Text style={styles.sectionTitle}>
          Opening Hours
        </Text>

        <View style={styles.hoursCard}>
          <View style={styles.hoursRow}>
            <Text style={styles.day}>
              Monday - Friday
            </Text>

            <Text style={styles.time}>
              8:00 AM - 5:00 PM
            </Text>
          </View>

          <View style={styles.hoursDivider} />

          <View style={styles.hoursRow}>
            <Text style={styles.day}>
              Saturday
            </Text>

            <Text style={styles.time}>
              9:00 AM - 2:00 PM
            </Text>
          </View>

          <View style={styles.hoursDivider} />

          <View style={styles.hoursRow}>
            <Text style={styles.day}>
              Sunday
            </Text>

            <Text style={styles.closed}>
              Closed
            </Text>
          </View>
        </View>

        {/* LOCATION */}

        <Text style={styles.sectionTitle}>
          Visit Us
        </Text>

        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <Ionicons
              name="location-outline"
              size={25}
              color={PRIMARY}
            />
          </View>

          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>
              Pristine Eye Care
            </Text>

            <Text style={styles.locationText}>
              Contact us for clinic location and
              directions.
            </Text>
          </View>
        </View>

        {/* FOOTER */}

        <Text style={styles.footer}>
          Pristine Eye Care
        </Text>

        <Text style={styles.footerSubtitle}>
          Your vision. Our priority.
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
    paddingTop: 30,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: PRIMARY,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#666666",
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFF0F1",
    alignItems: "center",
    justifyContent: "center",
  },

  supportCard: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },

  supportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  supportTitle: {
    marginTop: 14,
    fontSize: 21,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  supportText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: "#FFFFFF",
    opacity: 0.9,
    textAlign: "center",
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 13,
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
  },

  contactCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  contactIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#FFF0F1",
    alignItems: "center",
    justifyContent: "center",
  },

  contactInfo: {
    flex: 1,
    marginLeft: 13,
  },

  contactTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },

  contactSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#777777",
  },

  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF7EE",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 15,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#2E8B57",
    marginRight: 5,
  },

  onlineText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2E8B57",
  },

  hoursCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    elevation: 2,
  },

  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  day: {
    fontSize: 13,
    color: "#555555",
  },

  time: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222222",
  },

  closed: {
    fontSize: 13,
    fontWeight: "700",
    color: PRIMARY,
  },

  hoursDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 13,
  },

  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  locationIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#FFF0F1",
    alignItems: "center",
    justifyContent: "center",
  },

  locationInfo: {
    flex: 1,
    marginLeft: 13,
  },

  locationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222222",
  },

  locationText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#777777",
  },

  footer: {
    marginTop: 35,
    textAlign: "center",
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "700",
  },

  footerSubtitle: {
    marginTop: 4,
    textAlign: "center",
    color: "#999999",
    fontSize: 12,
  },
});