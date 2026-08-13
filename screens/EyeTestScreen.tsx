import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";
import { useTheme } from "../context/ThemeContext";

const PRIMARY = "#B3000F";

type EyeTestResult = {
  id: string;
  testType: string;
  result: string;
  status: string;
  date: string;
  leftEye: string;
  rightEye: string;
  notes?: string;
};

export default function EyeTestScreen() {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  const [tests, setTests] = useState<EyeTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEyeTests();
  }, []);

  const loadEyeTests = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setTests([]);
        return;
      }

      const testsRef = collection(
        db,
        "users",
        currentUser.uid,
        "eyeTests"
      );

      const testsQuery = query(
        testsRef,
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(testsQuery);

      const results: EyeTestResult[] =
        snapshot.docs.map((testDoc) => {
          const data = testDoc.data();

          return {
            id: testDoc.id,
            testType: data.testType || "Eye Test",
            result: data.result || "Not available",
            status: data.status || "Pending",
            date: data.date || "Date unavailable",
            leftEye: data.leftEye || "N/A",
            rightEye: data.rightEye || "N/A",
            notes: data.notes || "",
          };
        });

      setTests(results);
    } catch (error) {
      console.log("Load eye tests error:", error);

      Alert.alert(
        "Unable to load results",
        "We could not retrieve your eye test results. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const latestResult =
    tests.length > 0 ? tests[0] : null;

  const handleViewResult = (
    test: EyeTestResult
  ) => {
    Alert.alert(
      test.testType,
      `Result: ${test.result}\n\nLeft Eye: ${test.leftEye}\nRight Eye: ${test.rightEye}\n\nStatus: ${test.status}${
        test.notes
          ? `\n\nNotes: ${test.notes}`
          : ""
      }`
    );
  };

  const handleViewLatestResult = () => {
    if (!latestResult) {
      Alert.alert(
        "No Result Available",
        "You do not have an eye test result available yet."
      );

      return;
    }

    handleViewResult(latestResult);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>
              Eye Tests
            </Text>

            <Text style={styles.subtitle}>
              View your eye test results and history.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="eye-outline"
              size={28}
              color={PRIMARY}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={PRIMARY}
            />

            <Text style={styles.loadingText}>
              Loading your eye test results...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.testCountCard}>
              <View style={styles.testCountIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={PRIMARY}
                />
              </View>

              <View style={styles.testCountInfo}>
                <Text style={styles.testCountLabel}>
                  Tests Completed
                </Text>

                <Text style={styles.testCountValue}>
                  {tests.length}
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.viewResultCard}
              onPress={handleViewLatestResult}
            >
              <View style={styles.viewResultIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={25}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.viewResultInfo}>
                <Text style={styles.viewResultTitle}>
                  View Result
                </Text>

                <Text style={styles.viewResultDescription}>
                  {latestResult
                    ? "View your latest eye test result."
                    : "View your eye test result when available."}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={23}
                color="#FFFFFF"
              />
            </Pressable>

            <Text style={styles.sectionTitle}>
              Latest Result
            </Text>

            {latestResult ? (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultIconContainer}>
                    <Ionicons
                      name="eye"
                      size={25}
                      color={PRIMARY}
                    />
                  </View>

                  <View style={styles.resultHeaderText}>
                    <Text style={styles.resultTitle}>
                      {latestResult.testType}
                    </Text>

                    <Text style={styles.resultDate}>
                      {latestResult.date}
                    </Text>
                  </View>

                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />

                    <Text style={styles.statusText}>
                      {latestResult.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.mainResult}>
                  <Text style={styles.resultLabel}>
                    Vision Result
                  </Text>

                  <Text style={styles.resultValue}>
                    {latestResult.result}
                  </Text>

                  <Text style={styles.resultDescription}>
                    Your latest eye test result.
                  </Text>
                </View>

                <View style={styles.eyeResults}>
                  <View style={styles.eyeResult}>
                    <Text style={styles.eyeLabel}>
                      Left Eye
                    </Text>

                    <Text style={styles.eyeValue}>
                      {latestResult.leftEye}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.eyeResult}>
                    <Text style={styles.eyeLabel}>
                      Right Eye
                    </Text>

                    <Text style={styles.eyeValue}>
                      {latestResult.rightEye}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.viewButton}
                  onPress={() =>
                    handleViewResult(latestResult)
                  }
                >
                  <Ionicons
                    name="document-text-outline"
                    size={19}
                    color={PRIMARY}
                  />

                  <Text style={styles.viewButtonText}>
                    View Result
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={PRIMARY}
                  />
                </Pressable>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="eye-outline"
                    size={40}
                    color={PRIMARY}
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  No Eye Test Results
                </Text>

                <Text style={styles.emptyText}>
                  You don't have any eye test
                  results yet. Your result will
                  appear here after your eye test
                  has been completed.
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>
              Test History
            </Text>

            <View style={styles.historyCard}>
              {tests.length > 0 ? (
                tests.map((test) => (
                  <Pressable
                    key={test.id}
                    style={styles.historyItem}
                    onPress={() =>
                      handleViewResult(test)
                    }
                  >
                    <View style={styles.historyIcon}>
                      <Ionicons
                        name="document-text-outline"
                        size={22}
                        color={PRIMARY}
                      />
                    </View>

                    <View style={styles.historyInfo}>
                      <Text style={styles.historyTitle}>
                        {test.testType}
                      </Text>

                      <Text style={styles.historyDate}>
                        {test.date}
                      </Text>
                    </View>

                    <View style={styles.historyResult}>
                      <Text
                        style={styles.historyResultValue}
                      >
                        {test.result}
                      </Text>

                      <Text
                        style={styles.historyResultStatus}
                      >
                        {test.status}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.secondaryText}
                    />
                  </Pressable>
                ))
              ) : (
                <View style={styles.noHistory}>
                  <Ionicons
                    name="document-outline"
                    size={28}
                    color={colors.secondaryText}
                  />

                  <Text style={styles.noHistoryText}>
                    No previous tests
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.infoCard}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={PRIMARY}
              />

              <Text style={styles.infoText}>
                Eye test results are for screening
                purposes and should not replace a
                professional eye examination.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 35,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28,
    },

    headerTextContainer: {
      flex: 1,
      paddingRight: 15,
    },

    title: {
      fontSize: 28,
      fontWeight: "700",
      color: PRIMARY,
    },

    subtitle: {
      marginTop: 7,
      fontSize: 14,
      color: colors.secondaryText,
    },

    headerIcon: {
      width: 50,
      height: 50,
      borderRadius: 15,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },

    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 80,
    },

    loadingText: {
      marginTop: 12,
      color: colors.secondaryText,
      fontSize: 14,
    },

    testCountCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
    },

    testCountIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },

    testCountInfo: {
      marginLeft: 13,
    },

    testCountLabel: {
      color: colors.secondaryText,
      fontSize: 13,
    },

    testCountValue: {
      color: PRIMARY,
      fontSize: 25,
      fontWeight: "800",
      marginTop: 2,
    },

    viewResultCard: {
      backgroundColor: PRIMARY,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 28,
      elevation: 3,
      shadowColor: "#000000",
      shadowOpacity: 0.12,
      shadowRadius: 6,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },

    viewResultIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor:
        "rgba(255,255,255,0.16)",
      alignItems: "center",
      justifyContent: "center",
    },

    viewResultInfo: {
      flex: 1,
      marginLeft: 13,
    },

    viewResultTitle: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
    },

    viewResultDescription: {
      color: "#FFFFFF",
      opacity: 0.82,
      fontSize: 12,
      marginTop: 4,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 14,
    },

    resultCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 3,
      shadowColor: "#000000",
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },

    resultHeader: {
      flexDirection: "row",
      alignItems: "center",
    },

    resultIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },

    resultHeaderText: {
      flex: 1,
      marginLeft: 12,
    },

    resultTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },

    resultDate: {
      marginTop: 4,
      fontSize: 12,
      color: colors.secondaryText,
    },

    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#EAF7EE",
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 20,
    },

    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#2E8B57",
      marginRight: 5,
    },

    statusText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#2E8B57",
    },

    mainResult: {
      marginTop: 22,
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 15,
      paddingVertical: 18,
    },

    resultLabel: {
      fontSize: 13,
      color: colors.secondaryText,
    },

    resultValue: {
      marginTop: 4,
      fontSize: 38,
      fontWeight: "800",
      color: PRIMARY,
    },

    resultDescription: {
      marginTop: 3,
      fontSize: 12,
      color: colors.secondaryText,
      textAlign: "center",
    },

    eyeResults: {
      flexDirection: "row",
      marginTop: 18,
      backgroundColor: colors.background,
      borderRadius: 14,
      paddingVertical: 15,
    },

    eyeResult: {
      flex: 1,
      alignItems: "center",
    },

    eyeLabel: {
      fontSize: 12,
      color: colors.secondaryText,
    },

    eyeValue: {
      marginTop: 5,
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    divider: {
      width: 1,
      backgroundColor: colors.border,
    },

    viewButton: {
      marginTop: 18,
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: PRIMARY,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    viewButtonText: {
      color: PRIMARY,
      fontSize: 14,
      fontWeight: "700",
    },

    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 25,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
    },

    emptyIcon: {
      width: 75,
      height: 75,
      borderRadius: 38,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },

    emptyTitle: {
      marginTop: 15,
      fontSize: 19,
      fontWeight: "700",
      color: colors.text,
    },

    emptyText: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: colors.secondaryText,
      textAlign: "center",
    },

    historyCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
    },

    historyItem: {
      minHeight: 75,
      padding: 8,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    historyIcon: {
      width: 43,
      height: 43,
      borderRadius: 12,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },

    historyInfo: {
      flex: 1,
      marginLeft: 12,
    },

    historyTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

    historyDate: {
      marginTop: 4,
      fontSize: 12,
      color: colors.secondaryText,
    },

    historyResult: {
      alignItems: "flex-end",
      marginRight: 8,
    },

    historyResultValue: {
      fontSize: 15,
      fontWeight: "700",
      color: PRIMARY,
    },

    historyResultStatus: {
      marginTop: 3,
      fontSize: 11,
      color: "#2E8B57",
      fontWeight: "600",
    },

    noHistory: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 25,
    },

    noHistoryText: {
      marginTop: 6,
      color: colors.secondaryText,
      fontSize: 13,
    },

    infoCard: {
      marginTop: 20,
      backgroundColor: colors.primaryLight,
      borderRadius: 14,
      padding: 15,
      flexDirection: "row",
      alignItems: "flex-start",
      borderWidth: 1,
      borderColor: colors.border,
    },

    infoText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 12,
      lineHeight: 18,
      color: colors.secondaryText,
    },
  });