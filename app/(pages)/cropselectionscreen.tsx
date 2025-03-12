import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useCrops, Crop } from "../CropProvider";

const CropSelectionScreen = () => {
  const { crops } = useCrops();
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={() => router.replace("/")}>
        <AntDesign name="close" size={30} color="black" />
      </Pressable>
      <View style={styles.header}>
        <Text style={styles.question}>
          What Crops Do you want to start with?
        </Text>
      </View>

      <FlatList
        data={crops}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.cropItem,
              selectedCrop?.name === item.name ? styles.selectedCrop : {},
            ]}
            onPress={() => setSelectedCrop(item)}
          >
            <View>
              <Text style={styles.cropName}>{item.name}</Text>
              <Text style={styles.picturesNeeded}>
                {item.picturesNeeded} pictures needed
              </Text>
            </View>

            <View
              style={[
                styles.statusIndicator,
                item.done ? styles.done : styles.pending,
              ]}
            >
              {item.done && <AntDesign name="check" size={18} color="white" />}
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.navigationContainer}>
        <Pressable style={styles.navButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#E36F19" />
          <Text style={styles.navButtonText}>Back</Text>
        </Pressable>

        {/* Show Next button only if a crop is selected */}
        {selectedCrop && (
          <Pressable
            style={[styles.navButton, styles.nextButton]}
            onPress={() =>
              router.push({
                pathname: "/photoexamplescreen",
                params: {
                  crop: JSON.stringify(selectedCrop),
                },
              })
            }
          >
            <Text style={styles.nextnavButtonText}>Next</Text>
            <AntDesign name="arrowright" size={24} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  closeButton: {
    top: 2,
  },
  question: {
    textAlign: "center",
    color: "#2B241F",
    flex: 1,
    backgroundColor: "white",
    fontSize: 24,
    fontFamily: "Itim",
    marginHorizontal: 5,
  },
  cropItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  selectedCrop: {
    backgroundColor: "#FFD580",
  },
  cropName: {
    fontSize: 18,
    color: "#2B241F",
    fontFamily: "Itim",
  },
  picturesNeeded: {
    fontSize: 14,
    color: "#95918F",
    fontWeight: "bold",
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  done: {
    backgroundColor: "green",
  },
  pending: {
    backgroundColor: "gold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 20,
    marginTop: 20,
  },
  navButton: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#E36F19",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navButtonText: {
    fontSize: 24,
    fontFamily: "Itim",
    color: "#E36F19",
    marginHorizontal: 5,
  },
  nextnavButtonText: {
    fontSize: 24,
    fontFamily: "Itim",
    color: "white",
    marginHorizontal: 5,
  },
});

export default CropSelectionScreen;
