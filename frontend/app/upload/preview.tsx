import backArrow from "@/assets/images/icons/backArrow.png";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ImageStyle, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PreviewScreen() {
  const { imageUri, language, uploadType } = useLocalSearchParams<{
    imageUri: string;
    language: string;
    uploadType: string;
  }>();

  const insets = useSafeAreaInsets();

  const handleRetake = () => {
    router.back();
  };

  const handleUsePhoto = () => {
    router.push({
      pathname: "/upload/processing",
      params: { imageUri, language, uploadType },
    });
  };

  return (
    <View style={styles.container}>
      {/* Photo — constrained between the black bars */}
      {imageUri ? (
        <View style={styles.imageWindow}>
          <Image
            source={{ uri: imageUri }}
            style={styles.billImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No image captured</Text>
        </View>
      )}

      {/* Top black bar */}
      <View style={styles.overlayTop} pointerEvents="none" />
      {/* Bottom black bar */}
      <View style={styles.overlayBottom} pointerEvents="none" />

      {/* Top — back arrow (above the black bar) */}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={handleRetake} style={styles.backButton} activeOpacity={0.8}>
          <Image source={backArrow} style={styles.backArrowImg} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Bottom — Retake + Use Photo buttons */}
      <View style={[styles.bottomOverlay, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity style={styles.circleButton} onPress={handleRetake} activeOpacity={0.85}>
          <Text style={styles.retakeIcon}>↺</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.circleButton, styles.confirmButton]} onPress={handleUsePhoto} activeOpacity={0.85}>
          <Text style={styles.confirmIcon}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  imageWindow: ViewStyle;
  billImage: ImageStyle;
  noImage: ViewStyle;
  noImageText: TextStyle;
  overlayTop: ViewStyle;
  overlayBottom: ViewStyle;
  topOverlay: ViewStyle;
  backButton: ViewStyle;
  backArrowImg: ImageStyle;
  bottomOverlay: ViewStyle;
  circleButton: ViewStyle;
  confirmButton: ViewStyle;
  retakeIcon: TextStyle;
  confirmIcon: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  imageWindow: {
    position: "absolute",
    top: "15%",
    bottom: "18%",
    left: 0,
    right: 0,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  billImage: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    position: "absolute",
    top: "15%",
    bottom: "18%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },
  noImageText: {
    color: "#fff",
    fontSize: 16,
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "15%",
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 5,
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "18%",
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 5,
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backArrowImg: {
    width: 36,
    height: 24,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    zIndex: 10,
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4B1C82",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  confirmButton: {
    backgroundColor: "#fff",
  },
  retakeIcon: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "600",
    lineHeight: 34,
  },
  confirmIcon: {
    color: "#4B1C82",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
});