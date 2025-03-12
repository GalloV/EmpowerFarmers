import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const cropphotoexample = require("../../assets/images/pagesassets/cropphotoexample.png");

const ExamplePhotoScreen = () => {
  const router = useRouter();
  const { crop } = useLocalSearchParams();
  const parsedCrop = crop && typeof crop === "string" ? JSON.parse(crop) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Try to take the best picture basing yourself on this example
      </Text>
      <View style={styles.exampleImage}>
        <AntDesign name="arrowdown" size={40} color="#E36F19" />
        <Image
          source={cropphotoexample}
          style={{ width: 300, height: 300 }}
          resizeMode="contain"
        />
      </View>

      <Pressable
        style={styles.captureButton}
        onPress={() =>
          router.push({
            pathname: "/takepictureofcrop",
            params: { crop },
          })
        }
      >
        <AntDesign name="camera" size={24} color="white" />
        <Text style={styles.buttonText}>
          Take the pictures for {parsedCrop.name}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 50,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Itim",
  },
  exampleImage: {
    width: "100%",
    height: "63%",
    backgroundColor: "",
    borderRadius: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 100,
  },
  camera: { width: "80%", height: 300, marginBottom: 20 },
  captureButton: {
    backgroundColor: "#E36F19",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: "white", fontSize: 18, marginLeft: 10 },
});

export default ExamplePhotoScreen;
