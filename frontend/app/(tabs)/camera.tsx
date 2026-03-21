import backArrow from "@/assets/images/icons/backArrow.png";
import picture from "@/assets/images/icons/picture.png";
import scan from "@/assets/images/icons/scan.png";
import CustomButton from "@/components/ui/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LangProps {
  text: string;
  focused: boolean;
  onPress: () => void;
}

const LanguageSelector = ({ text, focused, onPress }: LangProps) => {
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
  const { uploadType } = useLocalSearchParams<{ uploadType: string }>();
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
      router.push({
        pathname: "/upload/preview",
        params: { imageUri: photo.uri, language: selected, uploadType },
      });
    } catch (error) {
      console.log("Camera error:", error);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      router.push({
        pathname: "/upload/preview",
        params: { imageUri: result.assets[0].uri, language: selected, uploadType },
      });
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

      {/* 4-sided dark overlay — everything outside the scan frame is darkened
      <View style={styles.overlayTop}    pointerEvents="none" />
      <View style={styles.overlayBottom} pointerEvents="none" />
      <View style={styles.overlayLeft}   pointerEvents="none" />
      <View style={styles.overlayRight}  pointerEvents="none" /> */}

      {/* Scan frame — 4 corner brackets to guide document alignment */}
      <View style={styles.scanFrame} pointerEvents="none">
        {/* Top-left */}
        <View style={styles.cornerTopLeft}>
          <View style={styles.cornerLineH} />
          <View style={styles.cornerLineV} />
        </View>
        {/* Top-right — flip horizontal */}
        <View style={[styles.cornerTopRight, { transform: [{ scaleX: -1 }] }]}>
          <View style={styles.cornerLineH} />
          <View style={styles.cornerLineV} />
        </View>
        {/* Bottom-left — flip vertical */}
        <View style={[styles.cornerBottomLeft, { transform: [{ scaleY: -1 }] }]}>
          <View style={styles.cornerLineH} />
          <View style={styles.cornerLineV} />
        </View>
        {/* Bottom-right — flip both */}
        <View style={[styles.cornerBottomRight, { transform: [{ scaleX: -1 }, { scaleY: -1 }] }]}>
          <View style={styles.cornerLineH} />
          <View style={styles.cornerLineV} />
        </View>
      </View>

      {/* Bottom overlay — Upload From Gallery button + shutter */}
      <View style={styles.bottomOverlay}>
        {/* Upload From Gallery — CustomButton with gallery icon */}
        <View style={styles.galleryWrapper}>
          <CustomButton
            title="Upload From Gallery"
            onPress={pickFromGallery}
            style={styles.galleryButtonOuter}
            innerStyle={styles.galleryButtonInner}
            textStyle={styles.galleryButtonText}
          />
          {/* Gallery icon overlaid on the right side of the button */}
          <Image
            source={picture}
            style={styles.galleryIcon}
            resizeMode="contain"
          />
        </View>

        {/* Shutter button — floating circle below the gallery button */}
        <TouchableOpacity style={styles.shutterButton} onPress={takePicture} activeOpacity={0.85}>
          <Image source={scan} style={{ width: 32, height: 32 }} resizeMode="contain" />
        </TouchableOpacity>
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
    gap: 16,
  },
  // 4-sided viewfinder overlay — matches scanFrame: top 20%, bottom 22%, left 8%, right 8%
  overlayTop: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: "20%",
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 4,
  },
  overlayBottom: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: "22%",
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 4,
  },
  overlayLeft: {
    position: "absolute" as const,
    top: "20%",
    bottom: "22%",
    left: 0,
    width: "8%",
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 4,
  },
  overlayRight: {
    position: "absolute" as const,
    top: "20%",
    bottom: "22%",
    right: 0,
    width: "8%",
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 4,
  },
  // Scan frame — must match overlay values exactly
  scanFrame: {
    position: "absolute" as const,
    top: "20%",
    bottom: "23%",
    left: "8%",
    right: "8%",
    zIndex: 5,
  },
  cornerTopLeft: {
    position: "absolute" as const,
    width: 36,
    height: 36,
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    position: "absolute" as const,
    width: 36,
    height: 36,
    top: 0,
    right: 0,
  },
  cornerBottomLeft: {
    position: "absolute" as const,
    width: 36,
    height: 36,
    bottom: 0,
    left: 0,
  },
  cornerBottomRight: {
    position: "absolute" as const,
    width: 36,
    height: 36,
    bottom: 0,
    right: 0,
  },
  cornerLineH: {
    position: "absolute" as const,
    width: 36,
    height: 4,
    top: 0,
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  cornerLineV: {
    position: "absolute" as const,
    width: 4,
    height: 36,
    top: 0,
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 2,
  },

  galleryWrapper: {
    width: "85%",
    top: 5,
    position: "relative" as const,
    justifyContent: "center" as const,
  },
  galleryButtonOuter: {
    borderRadius: 50,
    width: "100%",
  },
  galleryButtonInner: {
    borderRadius: 50,
    paddingVertical: 18,
  },
  galleryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    marginRight: 32, // leave space for the icon on the right
  },
  galleryIcon: {
    position: "absolute",
    right: 55,
    width: 26,
    height: 26,
    tintColor: "#fff",
  },
  shutterButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
});