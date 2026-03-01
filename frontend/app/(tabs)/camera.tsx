import backArrow from "@/assets/images/icons/backArrow.png";
import history from "@/assets/images/icons/history.png";
import picture from "@/assets/images/icons/picture.png";
import scan from "@/assets/images/icons/scan.png";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  text: string;
  focused: boolean;
  onPress: () => void;
}

const LanguageSelector = ({ text, focused, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center justify-center py-4 px-6 w-30 h-auto ${
        focused ? "bg-[#3B1E54] rounded-full" : ""
      }`}
    >
      <Text className={`text-lg ${focused ? "text-white" : "text-black"} font-bold`}>
        {text}
      </Text>
    </Pressable>
  );
};

export default function Upload() {
  const [permission, requestPermission] = useCameraPermissions();
  const [selected, setSelected] = useState<string | null>("English");
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white mb-4">Camera permission required</Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-purple-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        skipProcessing: false,
      });
      if (photo.width < 1000) {
        alert("Move closer to the document");
      }
      console.log(photo.uri);
      router.push("/upload/bill-review");
    } catch (error) {
      console.log("Camera error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera fills entire screen */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onCameraReady={() => setIsCameraReady(true)}
      />

      {/* Top overlay — back arrow + language selector */}
      <View style={styles.topOverlay}>
        <Link href="/(tabs)">
          <Image source={backArrow} className="w-9 h-6" />
        </Link>
        <View className="items-center mt-4">
          <View className="rounded-full bg-[#D9D9D9] flex-row overflow-hidden">
            <LanguageSelector text="English" focused={selected === "English"} onPress={() => setSelected("English")} />
            <LanguageSelector text="Sinhala" focused={selected === "Sinhala"} onPress={() => setSelected("Sinhala")} />
            <LanguageSelector text="Tamil"   focused={selected === "Tamil"}   onPress={() => setSelected("Tamil")} />
          </View>
        </View>
      </View>

      {/* Bottom overlay — controls */}
      <View style={styles.bottomOverlay}>
        <View className="bg-[#3B1E54] rounded-full flex-row px-10 py-2 items-center">
          <View className="flex-col items-center">
            <Image source={history} className="size-8" />
            <Text className="text-md font-bold text-white">History</Text>
          </View>

          <View className="flex-col items-center px-20">
            <View className="rounded-full h-16 w-16 bottom-8 absolute bg-[#D9D9D9] justify-center items-center">
              <TouchableOpacity onPress={takePicture}>
                <Image source={scan} className="size-8" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-col items-center">
            <Image source={picture} className="size-8" />
            <Text className="text-md font-bold text-white">Import</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 32,
    zIndex: 10,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
});