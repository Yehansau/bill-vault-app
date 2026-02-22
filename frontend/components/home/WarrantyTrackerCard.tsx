import highlight from "@/assets/images/highlight.png";
import warranty from "@/assets/images/warranty.png";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

const HorizontalRule = () => {
  return <View className="w-32 bg-black h-0.5 self-stretch mx-auto" />;
};

const WarrantyCard = () => {
  return (
    <View className="border border-black rounded-lg px-5 py-2 w-72 h-44">
      <View className="flex-row justify-between items-center">
        <Image source={warranty} className="w-[130.95px] h-[89.22px]" />
        <ImageBackground
          source={highlight}
          className="w-[86.35px] h-[54.99px] ml-2 justify-center items-center"
          resizeMode="cover"
        >
          <Text className="text-lg font-semibold text-center">
            Expires in 5{"\n"}days
          </Text>
        </ImageBackground>
      </View>

      <View className="flex-row justify-between mt-2 items-center">
        <View className="flex-col">
          <Text className="text-md font-bold">Samsung TV</Text>
          <HorizontalRule />
          <Text className="text-sm text-gray-500">Electronics</Text>
        </View>
        <View className="rounded-full h-7 w-24 justify-center items-center bg-[#3B1E54]">
          <Text className="text-white text-sm font-semibold">View Details</Text>
        </View>
      </View>
    </View>
  );
};

export default WarrantyCard;
