import React from "react";
import { View } from "react-native";

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <View className="relative h-3 rounded-full w-[280px] bg-white">
      <View
        className="h-full"
        style={{
          width: `${progress}%`,
          backgroundColor: "rgba(95, 51, 225, 0.72)",
        }}
      />
      <View
        className="absolute rounded-full bg-white items-center justify-center"
        style={{
          width: 30,
          height: 30,
          top: (12 - 30) / 2,
          left: `${progress - 2}%`,
        }}
      >
        <View className="h-[20px] w-[20px] rounded-full bg-[#5F33E1]" />
      </View>
    </View>
  );
};

export default ProgressBar;
