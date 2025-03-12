import { Image, Button, StyleSheet, Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

interface Crop {
  name: string;
  description: string;
  done: boolean;
  images: string[];
  picturesNeeded: number;
}

const ReviewScreen = () => {
  const router = useRouter();
  const { crop, picturesNeeded } = useLocalSearchParams(); // Get the crop object and pictures needed from the router params

  const parsedCrop: Crop =
    crop && typeof crop === "string" ? JSON.parse(crop) : null; // Parse the crop object
  const remainingPictures =
    parsedCrop?.picturesNeeded - parsedCrop?.images.length;

  const handleRetake = () => {
    router.back(); // Go back to CameraScreen to retake the picture
  };

  const handleSave = () => {
    console.log("Crop saved:", parsedCrop);
    // Handle saving the crop object (e.g., uploading or saving locally)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review your Crop: {parsedCrop?.name}</Text>
      {parsedCrop?.images.map((uri, index) => (
        <Image key={index} source={{ uri }} style={styles.image} />
      ))}
      <Text style={styles.remainingPicturesText}>
        Remaining pictures to take: {remainingPictures}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Retake" onPress={handleRetake} />
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
  remainingPicturesText: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default ReviewScreen;
