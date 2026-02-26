import warrantyDetected from "@/assets/images/warrantyDetected.png";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onAddWarranty: () => void;
}

const WarrantyBadge = ({ onAddWarranty }: Props) => {
  return (
    <View className="bg-[#F6C136] px-3 py-4 rounded-b-lg flex-row items-center justify-between">
      <View className="flex-row">
        <Image source={warrantyDetected} className="size-4 mr-1 mt-1" />
        <Text className="text-md font-bold text-red-600">
          WARRANTY DETECTED
        </Text>
      </View>
      <TouchableOpacity onPress={onAddWarranty}>
        <Text className="text-black text-md font-semibold">+Add Warranty</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WarrantyBadge;
