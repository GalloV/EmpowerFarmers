import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const goodCondition = require("../../assets/images/pagesassets/goodCondition.png");
const MeteorologicalCheckScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text
          style={{
            textAlign: "center",
            color: "#333",
            fontSize: 24,
            fontFamily: "Itim",
            marginHorizontal: 5,
          }}
        >
          Are you in the right meteorological conditions to take good pictures?
        </Text>
      </View>

      <View style={styles.imagePlaceholder}>
        <Image
          source={goodCondition}
          style={{ width: 330, height: 330 }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.navigationContainer}>
        <Pressable style={styles.navButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#E36F19" />
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Itim",
              color: "#E36F19",
              marginHorizontal: 5,
            }}
          >
            Back
          </Text>
        </Pressable>

        <Pressable
          style={[styles.navButton, styles.nextnavButton]}
          onPress={() => router.push("/cropselectionscreen")}
        >
          <Text
            style={{
              fontSize: 24,
              fontFamily: "Itim",
              color: "white",
              marginHorizontal: 5,
            }}
          >
            Next
          </Text>
          <AntDesign name="arrowright" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  questionContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  questionText: {
    fontFamily: "Itim",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  imagePlaceholder: {
    width: "100%",
    height: "40%",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 200,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  navButton: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  nextnavButton: {
    backgroundColor: "#E36F19",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});

export default MeteorologicalCheckScreen;
