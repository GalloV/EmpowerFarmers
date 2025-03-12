import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { useCrops } from "./CropProvider";

const logo = require("../assets/images/pagesassets/logo.png");

interface Crop {
  name: string;
  description: string;
  done: boolean;
  images: string[];
  picturesNeeded: number;
}

const HomeScreen = () => {
  const { crops } = useCrops();
  const [numColumns, setNumColumns] = useState(2);
  const { crop } = useLocalSearchParams();

  // Initialize parsedCrop as an empty object following the Crop interface
  const parsedCrop: Crop =
    crop && typeof crop === "string"
      ? JSON.parse(crop)
      : {
          name: "",
          description: "",
          done: false,
          images: [],
          picturesNeeded: 2,
        };

  const renderCropItem = ({
    item,
  }: {
    item: { name: string; description: string; images: Array<any> };
  }) => {
    // Determine the color for the circle based on the number of images
    let circleColor = "red"; // Default is red (no images)
    const requiredImages = parsedCrop.picturesNeeded; // For example, let's assume 5 images are needed

    if (item.images.length === requiredImages) {
      circleColor = "green"; // Green if the number of images is equal to the required number
    } else if (item.images.length < requiredImages && item.images.length > 0) {
      circleColor = "yellow"; // Yellow if the number of images is less than the required number
    }

    return (
      <Pressable
        style={styles.cropCard}
        onPress={() =>
          router.push({
            pathname: "/CropDetailScreen",
            params: {
              crop: JSON.stringify(item),
            },
          })
        }
      >
        <Text style={styles.cropName}>{item.name}</Text>
        <Text style={styles.cropDescription}>{item.description}</Text>

        {/* Circle indicator */}
        <View style={[styles.statusCircle, { backgroundColor: circleColor }]} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerItem}>
          {/* Add Menu Icon (just a box or placeholder text for now) */}
          <Text style={styles.menuIcon}>☰</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerTitle}>Home</Text>
        </View>
        <View style={styles.headerItem}>
          <Image source={logo} style={styles.image} resizeMode="contain" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.dataCollection}>
          <Pressable
            style={styles.collectButton}
            onPress={() => router.push("/readiness-check")}
          >
            <Text style={styles.collectButtonText}>Start Data Collection</Text>
          </Pressable>
        </View>
        <View style={styles.previousData}>
          <FlatList
            key={numColumns}
            data={crops}
            keyExtractor={(item) => item.name}
            renderItem={renderCropItem}
            contentContainerStyle={styles.cropList}
            numColumns={numColumns}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    height: "15%",
    alignItems: "center",
    borderBottomColor: "#CAC8C7",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  headerItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  menuIcon: {
    fontSize: 24,
    color: "#E36F19", // Or any color you like for the menu icon
  },
  image: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontFamily: "Itim",
    fontSize: 24,
    color: "#E36F19",
    backgroundColor: "white",
    padding: 5,
  },
  content: {
    backgroundColor: "yellow",
    height: "85%",
  },
  dataCollection: {
    backgroundColor: "white",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  collectButton: {
    backgroundColor: "#E36F19",
    padding: 15,
    borderRadius: 27,
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  collectButtonText: {
    fontSize: 19,
    fontFamily: "Itim",
    color: "white",
  },
  previousData: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cropList: {
    padding: 10,
  },
  cropCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    width: 160,
    height: 160,
    margin: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cropName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  cropDescription: {
    fontSize: 13,
    color: "#777",
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default HomeScreen;
