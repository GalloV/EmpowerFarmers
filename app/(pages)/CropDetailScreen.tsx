import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams } from "expo-router";
import { useAuthRequest } from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { Link } from "expo-router"; // Import the Link component for navigation

const GOOGLE_CLIENT_ID =
  "117838464217-c3car0drrpt12mc4euk1fln59s8kr93i.apps.googleusercontent.com";

const redirectUri = AuthSession.makeRedirectUri({
  // Ensures compatibility with Expo Go
});

const CropDetailScreen = () => {
  const [loading, setLoading] = useState(false);
  const { crop } = useLocalSearchParams();
  const parsedCrop = crop && typeof crop === "string" ? JSON.parse(crop) : null;

  const [request, response, promptAsync] = useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
    redirectUri: AuthSession.makeRedirectUri(),
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Access Token:", response.authentication?.accessToken);
    }
  }, [response]);

  const signInWithGoogle = async () => {
    const result = await promptAsync();
    if (result?.type === "success") {
      return result.authentication?.accessToken;
    } else {
      Alert.alert("Error", "Google sign-in failed!");
      return null;
    }
  };

  const saveCropObjectToFile = async () => {
    const jsonString = JSON.stringify(parsedCrop, null, 2);
    const fileUri = FileSystem.documentDirectory + "cropData.json";

    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return fileUri;
  };

  const uploadToGoogleDrive = async (accessToken: string, fileUri: string) => {
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const metadata = {
      name: "cropData.json",
      mimeType: "application/json",
      parents: ["root"],
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", new Blob([fileBase64], { type: "application/json" }));

    try {
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Crop data uploaded to Google Drive!");
      } else {
        Alert.alert("Error", "Failed to upload crop data.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong: " + (error as Error).message);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const token = await signInWithGoogle();
      if (!token) return setLoading(false);

      const fileUri = await saveCropObjectToFile();
      await uploadToGoogleDrive(token, fileUri);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Display crop details */}
      {parsedCrop && (
        <ScrollView style={styles.cropDetails}>
          <Text style={styles.cropName}>{parsedCrop.name}</Text>
          <Text style={styles.cropDescription}>{parsedCrop.description}</Text>
          {parsedCrop.images && parsedCrop.images.length > 0 ? (
            <View style={styles.imageList}>
              <Text style={styles.imageListTitle}>Images:</Text>
              {parsedCrop.images.map((image: string, index: number) => (
                <Text key={index} style={styles.imageItem}>
                  {image}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noImagesText}>
              No images yet,{" "}
              <Link
                href={{ pathname: "/photoexamplescreen", params: { crop } }}
                style={styles.link}
              >
                proceed to the data collection.
              </Link>
            </Text>
          )}
        </ScrollView>
      )}

      {/* Upload Button */}
      <Pressable
        style={styles.uploadButton}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Send to Google Drive</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  cropDetails: {
    width: "100%",
    marginBottom: 20,
  },
  cropName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cropDescription: {
    fontSize: 16,
    marginBottom: 15,
  },
  imageList: {
    marginBottom: 20,
  },
  imageListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageItem: {
    fontSize: 14,
    color: "#555",
    marginTop: 20,
  },
  noImagesText: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
    fontStyle: "italic",
  },
  link: {
    color: "#4CAF50",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default CropDetailScreen;
