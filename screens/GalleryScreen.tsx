import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  db,
} from "../firebase/config";

import {
  ThemeColors,
  useTheme,
} from "../context/ThemeContext";

const PRIMARY = "#B3000F";

type GalleryItem = {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  createdAt?: any;
};

const ALL_CATEGORY = "All";

export default function GalleryScreen() {
  const {
    colors,
  } = useTheme();

  const styles =
    createStyles(colors);

  const [
    galleryItems,
    setGalleryItems,
  ] = useState<GalleryItem[]>([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    ALL_CATEGORY
  );

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<GalleryItem | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    loadError,
    setLoadError,
  ] = useState(false);

  /*
   * ========================================
   * LOAD GALLERY
   * ========================================
   */

  const loadGallery =
    async (
      showLoader = true
    ) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setLoadError(false);

        console.log(
          "===================================="
        );

        console.log(
          "LOADING GALLERY"
        );

        console.log(
          "===================================="
        );

        const snapshot =
          await getDocs(
            collection(
              db,
              "gallery"
            )
          );

        const items: GalleryItem[] =
          snapshot.docs
            .map(
              (
                galleryDoc
              ) => {
                const data =
                  galleryDoc.data();

                return {
                  id:
                    galleryDoc.id,

                  title:
                    String(
                      data.title ||
                        "Pristine Eye Care"
                    ),

                  description:
                    data.description
                      ? String(
                          data.description
                        )
                      : "",

                  category:
                    String(
                      data.category ||
                        "General"
                    ),

                  imageUrl:
                    String(
                      data.imageUrl ||
                        ""
                    ),

                  createdAt:
                    data.createdAt,
                };
              }
            )
            .filter(
              (item) =>
                item.imageUrl
                  .trim()
                  .length >
                0
            );

        /*
         * ========================================
         * NEWEST FIRST
         * ========================================
         */

        items.sort(
          (
            a,
            b
          ) => {
            const aTime =
              a.createdAt
                ?.toMillis?.() ||
              a.createdAt
                ?.seconds ||
              0;

            const bTime =
              b.createdAt
                ?.toMillis?.() ||
              b.createdAt
                ?.seconds ||
              0;

            return (
              bTime -
              aTime
            );
          }
        );

        console.log(
          "Gallery items loaded:",
          items.length
        );

        console.log(
          "===================================="
        );

        setGalleryItems(
          items
        );
      } catch (
        error
      ) {
        console.log(
          "===================================="
        );

        console.log(
          "GALLERY LOAD ERROR"
        );

        console.log(
          error
        );

        console.log(
          "===================================="
        );

        setLoadError(
          true
        );
      } finally {
        setLoading(
          false
        );

        setRefreshing(
          false
        );
      }
    };

  /*
   * ========================================
   * LOAD WHEN GALLERY TAB OPENS
   * ========================================
   */

  useFocusEffect(
    useCallback(
      () => {
        loadGallery();
      },
      []
    )
  );

  /*
   * ========================================
   * REFRESH
   * ========================================
   */

  const handleRefresh =
    async () => {
      setRefreshing(
        true
      );

      await loadGallery(
        false
      );
    };

  /*
   * ========================================
   * CATEGORIES
   * ========================================
   */

  const categories = [
    ALL_CATEGORY,
    ...Array.from(
      new Set(
        galleryItems.map(
          (
            item
          ) =>
            item.category
        )
      )
    ),
  ];

  /*
   * ========================================
   * FILTERED ITEMS
   * ========================================
   */

  const filteredItems =
    selectedCategory ===
    ALL_CATEGORY
      ? galleryItems
      : galleryItems.filter(
          (
            item
          ) =>
            item.category ===
            selectedCategory
        );

  /*
   * ========================================
   * LOADING
   * ========================================
   */

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.container
        }
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={
              PRIMARY
            }
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading gallery...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * ========================================
   * SCREEN
   * ========================================
   */

  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
            tintColor={
              PRIMARY
            }
            colors={[
              PRIMARY,
            ]}
          />
        }
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.headerIcon
            }
          >
            <Ionicons
              name="images-outline"
              size={26}
              color={
                PRIMARY
              }
            />
          </View>

          <View
            style={
              styles.headerContent
            }
          >
            <Text
              style={
                styles.title
              }
            >
              Gallery
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Explore Pristine Eye Care,
              eye health information,
              events and educational
              resources.
            </Text>
          </View>
        </View>

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {loadError && (
          <View
            style={
              styles.errorCard
            }
          >
            <Ionicons
              name="cloud-offline-outline"
              size={27}
              color={
                PRIMARY
              }
            />

            <View
              style={
                styles.errorContent
              }
            >
              <Text
                style={
                  styles.errorTitle
                }
              >
                Unable to load gallery
              </Text>

              <Text
                style={
                  styles.errorText
                }
              >
                Check your connection
                and pull down to try
                again.
              </Text>
            </View>
          </View>
        )}

        {/* ================================= */}
        {/* EMPTY GALLERY */}
        {/* ================================= */}

        {!loadError &&
          galleryItems.length ===
            0 && (
            <View
              style={
                styles.emptyCard
              }
            >
              <View
                style={
                  styles.emptyIconContainer
                }
              >
                <Ionicons
                  name="images-outline"
                  size={45}
                  color={
                    PRIMARY
                  }
                />
              </View>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                Gallery Coming Soon
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Photos, eye care
                information,
                educational resources
                and updates from
                Pristine Eye Care will
                appear here.
              </Text>
            </View>
          )}

        {/* ================================= */}
        {/* GALLERY CONTENT */}
        {/* ================================= */}

        {galleryItems.length >
          0 && (
          <>
            {/* CATEGORIES */}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.categoriesContainer
              }
            >
              {categories.map(
                (
                  category
                ) => {
                  const selected =
                    selectedCategory ===
                    category;

                  return (
                    <Pressable
                      key={
                        category
                      }
                      onPress={() =>
                        setSelectedCategory(
                          category
                        )
                      }
                      style={[
                        styles.categoryButton,

                        selected &&
                          styles.categoryButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,

                          selected &&
                            styles.categoryTextSelected,
                        ]}
                      >
                        {
                          category
                        }
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </ScrollView>

            {/* IMAGE COUNT */}

            <View
              style={
                styles.galleryInfo
              }
            >
              <Text
                style={
                  styles.galleryCount
                }
              >
                {filteredItems.length}{" "}
                {filteredItems.length ===
                1
                  ? "Photo"
                  : "Photos"}
              </Text>
            </View>

            {/* GRID */}

            <View
              style={
                styles.galleryGrid
              }
            >
              {filteredItems.map(
                (
                  item
                ) => (
                  <Pressable
                    key={
                      item.id
                    }
                    style={
                      styles.galleryCard
                    }
                    onPress={() =>
                      setSelectedImage(
                        item
                      )
                    }
                  >
                    <Image
                      source={{
                        uri:
                          item.imageUrl,
                      }}
                      style={
                        styles.galleryImage
                      }
                      resizeMode="cover"
                    />

                    <View
                      style={
                        styles.imageOverlay
                      }
                    >
                      <View
                        style={
                          styles.categoryBadge
                        }
                      >
                        <Text
                          style={
                            styles.categoryBadgeText
                          }
                        >
                          {
                            item.category
                          }
                        </Text>
                      </View>

                      <Text
                        style={
                          styles.imageTitle
                        }
                        numberOfLines={
                          2
                        }
                      >
                        {
                          item.title
                        }
                      </Text>
                    </View>
                  </Pressable>
                )
              )}
            </View>

            {filteredItems.length ===
              0 && (
              <View
                style={
                  styles.filteredEmpty
                }
              >
                <Ionicons
                  name="images-outline"
                  size={38}
                  color={
                    colors.secondaryText
                  }
                />

                <Text
                  style={
                    styles.filteredEmptyText
                  }
                >
                  No photos are
                  available in this
                  category yet.
                </Text>
              </View>
            )}
          </>
        )}

        {/* ================================= */}
        {/* FOOTER */}
        {/* ================================= */}

        <Text
          style={
            styles.footer
          }
        >
          Pristine Eye Care • Gallery
        </Text>
      </ScrollView>

      {/* ================================= */}
      {/* FULL SCREEN IMAGE */}
      {/* ================================= */}

      <Modal
        visible={
          selectedImage !==
          null
        }
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() =>
          setSelectedImage(
            null
          )
        }
      >
        <View
          style={
            styles.modalContainer
          }
        >
          {/* CLOSE */}

          <Pressable
            style={
              styles.closeButton
            }
            onPress={() =>
              setSelectedImage(
                null
              )
            }
          >
            <Ionicons
              name="close"
              size={28}
              color="#FFFFFF"
            />
          </Pressable>

          {selectedImage && (
            <>
              <Image
                source={{
                  uri:
                    selectedImage.imageUrl,
                }}
                style={
                  styles.fullImage
                }
                resizeMode="contain"
              />

              <View
                style={
                  styles.modalDetails
                }
              >
                <View
                  style={
                    styles.modalCategory
                  }
                >
                  <Text
                    style={
                      styles.modalCategoryText
                    }
                  >
                    {
                      selectedImage.category
                    }
                  </Text>
                </View>

                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  {
                    selectedImage.title
                  }
                </Text>

                {selectedImage.description ? (
                  <Text
                    style={
                      styles.modalDescription
                    }
                  >
                    {
                      selectedImage.description
                    }
                  </Text>
                ) : null}
              </View>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/*
 * ========================================
 * STYLES
 * ========================================
 */

const createStyles = (
  colors: ThemeColors
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 25,
      paddingBottom: 45,
    },

    /*
     * ========================================
     * HEADER
     * ========================================
     */

    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 25,
    },

    headerIcon: {
      width: 50,
      height: 50,
      borderRadius: 15,
      backgroundColor:
        colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 13,
    },

    headerContent: {
      flex: 1,
    },

    title: {
      fontSize: 28,
      fontWeight: "800",
      color:
        colors.text,
    },

    subtitle: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 19,
      color:
        colors.secondaryText,
    },

    /*
     * ========================================
     * CATEGORIES
     * ========================================
     */

    categoriesContainer: {
      paddingRight: 10,
      marginBottom: 20,
    },

    categoryButton: {
      paddingHorizontal: 17,
      height: 39,
      borderRadius: 20,
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 9,
    },

    categoryButtonSelected: {
      backgroundColor:
        PRIMARY,
      borderColor:
        PRIMARY,
    },

    categoryText: {
      fontSize: 13,
      fontWeight: "700",
      color:
        colors.secondaryText,
    },

    categoryTextSelected: {
      color:
        "#FFFFFF",
    },

    galleryInfo: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 13,
    },

    galleryCount: {
      color:
        colors.secondaryText,
      fontSize: 13,
      fontWeight: "600",
    },

    /*
     * ========================================
     * GRID
     * ========================================
     */

    galleryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
    },

    galleryCard: {
      width: "48%",
      aspectRatio: 0.82,
      borderRadius: 17,
      overflow: "hidden",
      marginBottom: 14,
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        colors.border,
      position:
        "relative",
    },

    galleryImage: {
      width: "100%",
      height: "100%",
      backgroundColor:
        colors.primaryLight,
    },

    imageOverlay: {
      position:
        "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 11,
      paddingTop: 30,
      paddingBottom: 11,
      backgroundColor:
        "rgba(0,0,0,0.55)",
    },

    categoryBadge: {
      alignSelf:
        "flex-start",
      backgroundColor:
        PRIMARY,
      borderRadius: 10,
      paddingHorizontal: 7,
      paddingVertical: 3,
      marginBottom: 6,
    },

    categoryBadgeText: {
      color: "#FFFFFF",
      fontSize: 9,
      fontWeight: "800",
    },

    imageTitle: {
      color: "#FFFFFF",
      fontSize: 13,
      lineHeight: 17,
      fontWeight: "800",
    },

    /*
     * ========================================
     * EMPTY
     * ========================================
     */

    emptyCard: {
      minHeight: 350,
      backgroundColor:
        colors.card,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 20,
      paddingHorizontal: 30,
      alignItems: "center",
      justifyContent: "center",
    },

    emptyIconContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor:
        colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },

    emptyTitle: {
      color:
        colors.text,
      fontSize: 20,
      fontWeight: "800",
      textAlign: "center",
    },

    emptyText: {
      color:
        colors.secondaryText,
      fontSize: 14,
      lineHeight: 21,
      textAlign: "center",
      marginTop: 9,
    },

    filteredEmpty: {
      alignItems: "center",
      paddingVertical: 45,
      paddingHorizontal: 30,
    },

    filteredEmptyText: {
      color:
        colors.secondaryText,
      textAlign: "center",
      fontSize: 14,
      lineHeight: 20,
      marginTop: 10,
    },

    /*
     * ========================================
     * ERROR
     * ========================================
     */

    errorCard: {
      flexDirection: "row",
      backgroundColor:
        colors.primaryLight,
      borderWidth: 1,
      borderColor:
        colors.border,
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
    },

    errorContent: {
      flex: 1,
      marginLeft: 12,
    },

    errorTitle: {
      color:
        colors.text,
      fontSize: 15,
      fontWeight: "800",
    },

    errorText: {
      marginTop: 4,
      color:
        colors.secondaryText,
      fontSize: 12,
      lineHeight: 18,
    },

    /*
     * ========================================
     * LOADING
     * ========================================
     */

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    loadingText: {
      marginTop: 12,
      color:
        colors.secondaryText,
      fontSize: 14,
    },

    /*
     * ========================================
     * MODAL
     * ========================================
     */

    modalContainer: {
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.96)",
      justifyContent:
        "center",
    },

    closeButton: {
      position: "absolute",
      top: 50,
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor:
        "rgba(255,255,255,0.15)",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },

    fullImage: {
      width: "100%",
      height: "65%",
    },

    modalDetails: {
      paddingHorizontal: 22,
      paddingTop: 18,
      paddingBottom: 25,
    },

    modalCategory: {
      alignSelf:
        "flex-start",
      backgroundColor:
        PRIMARY,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      marginBottom: 10,
    },

    modalCategoryText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "800",
    },

    modalTitle: {
      color: "#FFFFFF",
      fontSize: 21,
      lineHeight: 27,
      fontWeight: "800",
    },

    modalDescription: {
      marginTop: 8,
      color: "#D4D4D4",
      fontSize: 14,
      lineHeight: 21,
    },

    /*
     * ========================================
     * FOOTER
     * ========================================
     */

    footer: {
      textAlign: "center",
      color:
        colors.secondaryText,
      fontSize: 11,
      marginTop: 25,
    },
  });