import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCrops } from "../CropProvider";
import { AntDesign } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const cropphotoexample = require("../../assets/images/pagesassets/cropphotoexample.png");

const CameraScreen = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [parsedCrop, setParsedCrop] = useState<any>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { crop } = useLocalSearchParams();
  const { updateCrop } = useCrops();

  useEffect(() => {
    if (crop && typeof crop === "string") {
      setParsedCrop(JSON.parse(crop));
    }
  }, [crop]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo && photo.uri) {
        setPhotoUri(photo.uri);
      }
    }
  }

  function handleSavePhoto() {
    if (photoUri && parsedCrop) {
      const updatedCrop = {
        ...parsedCrop,
        images: [...parsedCrop.images, photoUri],
      };
      setParsedCrop(updatedCrop);
      updateCrop(updatedCrop);
      console.log(updatedCrop.images);
      if (updatedCrop.images.length < updatedCrop.picturesNeeded) {
        setPhotoUri(null); // Reset photo URI to take more pictures
      } else {
        updatedCrop.done = true;
        router.push("/cropselectionscreen");
      }
    }
  }

  function handleRetake() {
    setPhotoUri(null); // Reset photo URI to retake the picture
  }

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.eggoverlay}>
            <View style={styles.eggShape} />
          </View>

          <View style={styles.overlay}>
            <Text style={styles.instructionText}>
              Try to take the best quality picture!
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <MaterialIcons name="lens" size={64} color="#E36F19" />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <View style={{ width: "80%" }}>
            <Text
              style={{
                textAlign: "center",
                color: "#333",
                fontSize: 20,
                fontFamily: "Itim",
              }}
            >
              Are you satisfied with the quality of the photo ?
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Image source={cropphotoexample} style={styles.previewImage} />
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          </View>

          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.button} onPress={handleRetake}>
              <AntDesign name="camera" size={24} color="white" />
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSavePhoto}>
              <AntDesign name="save" size={24} color="white" />
              <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eggShape: {
    width: 250,
    height: 350,
    backgroundColor: "transparent",
    borderRadius: 125,
    position: "absolute",
    top: "25%",
    alignSelf: "center",
    borderWidth: 500,
    borderColor: "rgba(0, 0, 0, 0)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  eggoverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E36F19",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#E36F19",
    padding: 10,
    borderRadius: 5,
    width: "35%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  captureButton: {
    padding: 10,
    borderRadius: 5,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default CameraScreen;
