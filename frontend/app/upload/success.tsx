import arrow from "@/assets/images/arrow.png";
import lockColor from "@/assets/images/lockColor.png";
import vault from "@/assets/images/vault.png";
import { CustomButton } from "@/components/ui";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";

const ConfirmScreen = () => {
    const router = useRouter();

  return (
    <LinearGradient
      colors={["#944ABC", "#3B0856"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-1 items-center"
    >
      <View className="items-center justify-center mt-60">
        <Image source={vault} className="size-52" />
        <View className="flex-row justify-between w-full">
          <Image source={lockColor} className="h-[137px] w-[98px]" />
          <Image source={arrow} className="h-[189px] w-[154px]" />
        </View>
      </View>
      <Text className="text-4xl text-white font-bold text-center mb-5">
        Successfully{"\n"}Uploaded!
      </Text>
      <CustomButton
        title="Back to Home"
        onPress={() => router.push("./(tabs)/index.tsx")}
      />
    </LinearGradient>
  );
};

export default ConfirmScreen;
