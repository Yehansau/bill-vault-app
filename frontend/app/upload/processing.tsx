import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View, StyleSheet, Alert } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { router, useLocalSearchParams } from "expo-router";
import { useBillUpload } from "@/hooks/useBillUpload";
import DuplicateModal from "@/components/upload/DuplicateModal";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProcessingScreen() {
  const { imageUri, language, uploadType } = useLocalSearchParams<{
    imageUri: string;
    language: string;
    uploadType: string;
  }>();

  const {
    progress,
    statusMessage,
    isDuplicate,
    existingBill,
    processedData,
    startUpload,
  } = useBillUpload();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [displayPercent, setDisplayPercent] = useState(0);
  const [uploadStarted, setUploadStarted] = useState(false);

  const SIZE = 260;
  const STROKE_WIDTH = 14;
  const RADIUS = (SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Sync progress from hook to animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Rotating tick marks animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const listener = progressAnim.addListener(({ value }) => {
      setDisplayPercent(Math.round(value));
    });

    return () => progressAnim.removeListener(listener);
  }, []);

  // Start upload when screen mounts
  useEffect(() => {
    if (!uploadStarted && imageUri) {
      setUploadStarted(true);
      startUpload(
        imageUri,
        language || "english",
        uploadType || "receipt",
      ).catch((err) => {
        Alert.alert("Upload Failed", "Something went wrong. Please try again.");
        console.error("Upload error:", err);
        router.back();
      });
    }
  }, [imageUri]);

  // Navigate when processing is complete
  useEffect(() => {
    if (processedData && progress === 100) {
      setTimeout(() => {
        router.replace({
          pathname: "/upload/bill-review",
          params: { processedData: JSON.stringify(processedData) },
        });
      }, 600);
    }
  }, [processedData, progress]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const angle = (i / 72) * 2 * Math.PI;
    const outerR = SIZE / 2;
    const innerR = SIZE / 2 - 14;
    const x1 = SIZE / 2 + innerR * Math.cos(angle);
    const y1 = SIZE / 2 + innerR * Math.sin(angle);
    const x2 = SIZE / 2 + outerR * Math.cos(angle);
    const y2 = SIZE / 2 + outerR * Math.sin(angle);
    return { x1, y1, x2, y2 };
  });

  return (
    <View style={styles.container}>
      {/* Duplicate Modal */}
      <DuplicateModal
        visible={isDuplicate}
        existingBill={existingBill}
        onViewExisting={() => {
          router.replace({
            pathname: "/upload/bill-review",
            params: { processedData: JSON.stringify(existingBill) },
          });
        }}
        onUploadAnyway={() => {
          // Re-trigger upload ignoring duplicate
          startUpload(
            imageUri,
            language || "english",
            uploadType || "receipt",
          ).catch(console.error);
        }}
        onCancel={() => router.back()}
      />

      {/* Progress ring + tick marks */}
      <View
        style={{
          width: SIZE,
          height: SIZE,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Rotating tick marks */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { transform: [{ rotate }] }]}
        >
          <Svg width={SIZE} height={SIZE}>
            {ticks.map((tick, i) => (
              <AnimatedCircle key={i} />
            ))}
            {ticks.map((tick, i) => (
              <Line
                key={i}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={i % 3 === 0 ? 2.5 : 1}
              />
            ))}
          </Svg>
        </Animated.View>

        {/* Progress arc */}
        <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFillObject}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="white"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        {/* Inner dark circle */}
        <View style={styles.innerCircle}>
          <Text style={styles.percentText}>{displayPercent}%</Text>
        </View>
      </View>

      {/* Status message */}
      <View style={styles.labelRow}>
        <Text style={styles.lightning}>⚡</Text>
        <Text style={styles.labelText}>{statusMessage || "Starting..."}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6B21A8",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  innerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#5B179A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  percentText: {
    color: "white",
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lightning: {
    fontSize: 20,
  },
  labelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
