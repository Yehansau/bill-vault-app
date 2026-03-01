import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Image } from "react-native";

// The same upload icon used in the tab bar
import upload from "@/assets/images/icons/upload.png";
import iconBg from "@/assets/images/icons/iconBg.png";

// —— Swap these for your real receipt / warranty icon assets ——
// import receiptIcon  from "@/assets/images/icons/receipt.png";
// import warrantyIcon from "@/assets/images/icons/warranty.png";
// ——————————————————————————————————————————————————————————————

interface Props {
  onOpenChange?: (open: boolean) => void;
}

const UploadFAB = ({ onOpenChange }: Props) => {
  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const springTo = (toValue: number, cb?: () => void) => {
    Animated.spring(animation, {
      toValue,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start(cb);
  };

  const toggle = () => {
    if (open) {
      springTo(0, () => {
        setOpen(false);
        onOpenChange?.(false);
      });
    } else {
      setOpen(true);
      onOpenChange?.(true);
      springTo(1);
    }
  };

  const close = () => {
    springTo(0, () => {
      setOpen(false);
      onOpenChange?.(false);
    });
  };

  const handleOption = (uploadType: "receipt" | "warranty") => {
    springTo(0, () => {
      setOpen(false);
      onOpenChange?.(false);
      router.push({
        pathname: "/(tabs)/camera",
        params: { uploadType },
      });
    });
  };

  // ── FAB lifts up like other focused tab icons
  const fabTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -36],
  });

  // Purple circle + white circle scale in behind the icon
  const bgScale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 1],
  });

  const bgOpacity = animation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  // Upload icon rotates to × and back
  const iconRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  // iconBg fades into the tab bar position when FAB lifts (stays static)
  const tabBgOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  // ── Options rise above the FAB, spread slightly left & right
  const receiptTranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });
  const receiptTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -130],
  });

  const warrantyTranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });
  const warrantyTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -130],
  });

  const optionScale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.85, 1],
  });

  const optionOpacity = animation.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });

  // ── Full-screen backdrop
  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.55],
  });

  return (
    <>
      {/* iconBg — lifts with the button but sits BELOW the dark backdrop */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.iconBgWrapper,
          {
            opacity: tabBgOpacity,
            transform: [{ translateY: fabTranslateY }],
          },
        ]}
      >
        <Image source={iconBg} style={{ width: 95, height: 71 }} resizeMode="contain" />
      </Animated.View>

      {/* Dark backdrop */}
      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      </Animated.View>

      {/* FAB + options — centred horizontally, sitting in tab bar zone */}
      <View style={styles.fabWrapper} pointerEvents="box-none">

        {/* Receipt option */}
        <Animated.View
          pointerEvents={open ? "auto" : "none"}
          style={[
            styles.optionAnchor,
            {
              opacity: optionOpacity,
              transform: [
                { translateX: receiptTranslateX },
                { translateY: receiptTranslateY },
                { scale: optionScale },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.optionCircle}
            onPress={() => handleOption("receipt")}
            activeOpacity={0.85}
          >
            {/*
              Replace emoji with your icon:
              <Image source={receiptIcon} style={styles.optionIcon} />
            */}
            <Text style={styles.optionEmoji}>🧾</Text>
          </TouchableOpacity>
          <Text style={styles.optionLabel}>Receipt</Text>
        </Animated.View>

        {/* Warranty option */}
        <Animated.View
          pointerEvents={open ? "auto" : "none"}
          style={[
            styles.optionAnchor,
            {
              opacity: optionOpacity,
              transform: [
                { translateX: warrantyTranslateX },
                { translateY: warrantyTranslateY },
                { scale: optionScale },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.optionCircle}
            onPress={() => handleOption("warranty")}
            activeOpacity={0.85}
          >
            {/*
              Replace emoji with your icon:
              <Image source={warrantyIcon} style={styles.optionIcon} />
            */}
            <Text style={styles.optionEmoji}>🏅</Text>
          </TouchableOpacity>
          <Text style={styles.optionLabel}>Warranty</Text>
        </Animated.View>

        {/* The FAB — lifts up, purple circle + white circle appear behind it */}
        <Animated.View
          style={[styles.fabAnimated, { transform: [{ translateY: fabTranslateY }] }]}
        >
          {/* Purple circle (outermost) */}
          <Animated.View
            style={[
              styles.purpleBg,
              { opacity: bgOpacity, transform: [{ scale: bgScale }] },
            ]}
          />
          {/* White circle (inner) */}
          <Animated.View
            style={[
              styles.whiteBg,
              { opacity: bgOpacity, transform: [{ scale: bgScale }] },
            ]}
          />

          <TouchableOpacity
            onPress={toggle}
            activeOpacity={0.85}
            style={styles.fabTouchable}
          >
            {/* Upload icon rotates 45° to become × */}
            <Animated.Image
              source={upload}
              style={[styles.uploadIcon, { transform: [{ rotate: iconRotation }] }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>

      </View>
    </>
  );
};

const OPTION_SIZE = 58;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 10,
  },

  // Sits centred at bottom, height covers the tab bar + options above
  fabWrapper: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 20,
    width: 370,
    height: 250,         // tall enough to contain the lifted options
    paddingBottom: 18,   // aligns FAB centre with the tab bar centre (76px / 2 - a bit)
  },

  // Options start stacked directly on top of the FAB position, then animate away
  optionAnchor: {
    position: "absolute",
    bottom: 18,          // same as fabWrapper paddingBottom
    alignItems: "center",
  },
  optionCircle: {
    width: OPTION_SIZE,
    height: OPTION_SIZE,
    borderRadius: OPTION_SIZE / 2,
    backgroundColor: "#4B1C82",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  optionEmoji: {
    fontSize: 26,
  },
  optionIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  optionLabel: {
    marginTop: 5,
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // iconBg wrapper — below the backdrop (zIndex 9), lifts with the button
  iconBgWrapper: {
    position: "absolute",
    bottom: 0,          // vertically centred in the 76px tab bar
    alignSelf: "center",
    zIndex: 9,
    alignItems: "center",
  },
  // The FAB container — animates upward
  fabAnimated: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Purple circle behind the icon (matches the design's purple bubble)
  purpleBg: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4B1C82",
  },
  // White circle on top of purple, behind the icon
  whiteBg: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 26,
    backgroundColor: "#fff",
  },
  fabTouchable: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
  },
  uploadIcon: {
    width: 40,
    height: 40,
  },
});

export default UploadFAB;