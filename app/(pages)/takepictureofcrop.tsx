// CameraScreen.tsx
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import axios from "axios";
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
import { useCrops,Crop } from "../CropProvider";
import { AntDesign } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImageManipulator from 'expo-image-manipulator';

const CameraScreen = () => {
  // 1️⃣ State & refs
  const [facing, setFacing] = useState<CameraType>("back");
  const [parsedCrop, setParsedCrop] = useState<Crop | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { crop } = useLocalSearchParams();
  const { updateCrop } = useCrops();

  useEffect(() => {
    if (crop && typeof crop === "string") {
      const c: Crop = JSON.parse(crop);
      setParsedCrop(c);
    }
  }, [crop]);

  // 3️⃣ Ensure camera permission
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera permission</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // 4️⃣ Toggle front/back
  function toggleCameraFacing() {
    setFacing((cur) => (cur === "back" ? "front" : "back"));
  }

  async function prepareImage(uri: string) {
    // Resize to max width of 800px and compress to 70% quality
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  }

  async function runInferenceBase64(imageUri: string) {
    const apiKey  = "o6n9K6mfX5gSzdojmv2p";
    const modelId = "sorghum-detection-umdpo-5emeo";
    const version = "1";
  
    // 1. Read and encode
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  
    // 2. POST raw Base64 with format=image
    const endpoint =
      `https://detect.roboflow.com/${modelId}/${version}?api_key=${apiKey}&confidence=0.1&format=image`;
  
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: base64,
    });
  
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} — ${await resp.text()}`);
    }
  
    // 3. Get the annotated image as a blob
    const blob = await resp.blob();
  
    // 4. Convert blob to a local URI
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      // You can now use base64data as the source for an Image component
      setPhotoUri(base64data);
    };
  }
  
  
  // 5️⃣ Inference against Roboflow
  const runInference = async (imageUri: string) => {
    try {
      const apiKey  = "o6n9K6mfX5gSzdojmv2p";
      const modelId = "empower-farmers/sorghum-detection-umdpo-5emeo";
      const version = "1";
      const endpoint =
        `https://detect.roboflow.com/${modelId}/${version}?api_key=${apiKey}`;
  
      // build the multipart form
      const form = new FormData();
      form.append("file", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
  
      // use fetch instead of axios
      const resp = await fetch(endpoint, {
        method: "POST",
        body: form,
      });
  
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} — ${await resp.text()}`);
      }
  
      const json = await resp.json();
      console.log("Roboflow response:", json);
      // → inspect json.predictions to count grains, etc.
    } catch (err: any) {
      console.error("Inference error:", err.message || err);
    }
  };
    
  // 6️⃣ Capture photo, display preview, and trigger inference
  async function takePicture() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync();
    if (photo.uri) {
      // 1. Shrink it
      const smallUri = await prepareImage(photo.uri);
      setPhotoUri(smallUri);
      // 2. Run inference on the smaller file
      await runInferenceBase64(smallUri);
    }
  }
  

  // 7️⃣ UI for retake / save into your data flow
  function handleRetake() {
    setPhotoUri(null);
  }

// 7️⃣b. Save & advance logic
function handleSavePhoto() {
  if (!photoUri || !parsedCrop) return;

  // build the updated crop
  const updatedCrop: Crop = {
    ...parsedCrop,
    images: [...parsedCrop.images, photoUri],
    done: parsedCrop.images.length + 1 >= parsedCrop.picturesNeeded,
  };

  setParsedCrop(updatedCrop);

  updateCrop(updatedCrop);

  if (!updatedCrop.done) {
    setPhotoUri(null);
  } else {
    router.replace("/cropselectionscreen");
  }
}


  // 8️⃣ Render
  return (
    <View style={styles.container}>
      {!photoUri ? (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.eggoverlay} />
          <View style={styles.overlay}>
            <Text style={styles.instructionText}>
              Align the sorghum panicle and press the shutter
            </Text>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <MaterialIcons name="flip-camera-ios" size={32} color="#fff" />
            </TouchableOpacity>
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
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <View style={styles.previewButtons}>
            <TouchableOpacity onPress={handleRetake} style={styles.button}>
              <AntDesign name="camera" size={24} color="white" />
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSavePhoto} style={styles.button}>
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
