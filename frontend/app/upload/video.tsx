import videoSource from "@/assets/videos/animationVideo.mp4";
import Pill from "@/components/upload/Pill";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const BounceIn = ({ children, delay = 0 }: any) => {
  const scale = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.12, { duration: 450 }),
        withTiming(1, { duration: 350 }),
      ),
    );
  }, [scale, delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

const VideoAnimation = () => {
  const router = useRouter();
  const [skipped, setSkipped] = useState(false);

  const player = useVideoPlayer(videoSource, (player) => {
    player.muted = true;
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playToEnd", () => {
      if (!skipped) {
        router.replace("/upload/success");
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, router, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    player.pause?.();
    router.replace("/upload/success");
  };

  return (
    <View className="flex-1 bg-[#8B9CC1]">
      <View className="items-center mt-20 mb-2">
        <Text className="text-white text-3xl mb-2">🔒</Text>
        <Text className="text-white text-xl font-semibold text-center">
          Saving your bill securely…
        </Text>
        <Text className="text-white/70 text-sm mt-1 text-center">
          This will only take a few seconds
        </Text>
      </View>

      <Pressable style={{ flex: 1 }}>
        <VideoView
          player={player}
          contentFit="contain"
          style={{ flex: 1 }}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false} // 🚫 NO controls
        />
      </Pressable>

      <View className="items-center pb-32">
        <View className="flex-row gap-2">
          <BounceIn delay={1200}>
            <Pill color="green">Encrypted</Pill>
          </BounceIn>

          <BounceIn delay={1500}>
            <Pill color="blue">Private</Pill>
          </BounceIn>

          <BounceIn delay={1800}>
            <Pill color="purple">Secure</Pill>
          </BounceIn>
        </View>
      </View>

      <Pressable onPress={handleSkip}>
        <Text className="text-white text-lg font-bold text-center pb-6">
          Skip Animation
        </Text>
      </Pressable>
    </View>
  );
};

export default VideoAnimation;
