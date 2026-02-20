import fileCard from "@/assets/images/fileCard2.png";
import React from "react";
import { Image, Text, View } from "react-native";

const FilesCard = () => {
  return (
    <View className="h-full w-auto">
      <Image source={fileCard} className="w-[80px] h-[114px]" />
      <Text className="text-center text-md font-bold">
        Cargills{"\n"}Food City{"\n"}-{"\n"}Ganemulla
      </Text>
      <Text className="text-center text-md font-bold text-gray-400">
        2 hours ago
      </Text>
    </View>
  );
};

export default FilesCard;
