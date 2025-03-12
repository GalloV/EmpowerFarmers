import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useNavigation, router } from "expo-router";

const logo = require("../../assets/images/pagesassets/logo.png");

const ReadinessCheck = () => {
  const navigation = useNavigation();

  // Create a ref for the animated value
  const rotation = useRef(new Animated.Value(0)).current;

  // Function to start the pendulum animation
  useEffect(() => {
    // Create the pendulum effect (rotate back and forth once)
    Animated.sequence([
      Animated.timing(rotation, {
        toValue: -0.5, // Rotate to 0.5 (first direction)
        duration: 1000, // 1 second
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: 0, // Rotate to -0.5 (second direction)
        duration: 1000, // 1 second
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, [rotation]);

  // Interpolate the rotation value to get the degrees of rotation
  const rotate = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-15deg", "15deg"], // You can adjust the rotation degree to be subtle
  });

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.closeButton}
        onPress={() =>
          navigation.reset({ index: 0, routes: [{ name: "index" as never }] })
        }
      >
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <View style={styles.centerContainer}>
        {/* Animated Image with the rotation effect */}
        <Animated.Image
          source={logo}
          style={[styles.image, { transform: [{ rotate: rotate }] }]}
          resizeMode="contain"
        />
      </View>

      <Pressable
        style={styles.startButton}
        onPress={() => router.push("/meteorologicalcheck")}
      >
        <Text style={styles.startButtonText}>Start the Process</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
  },
  closeText: {
    fontSize: 24,
    color: "black",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    backgroundColor: "white",
    borderRadius: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  startButton: {
    backgroundColor: "#E36F19",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    marginBottom: 30,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: "Itim",
    color: "white",
  },
});

export default ReadinessCheck;
