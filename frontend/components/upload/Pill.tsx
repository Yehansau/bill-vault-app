import React from "react";
import { Text, View } from "react-native";

const Pill = ({
  color,
  children,
}: {
  color: "green" | "blue" | "purple";
  children: string;
}) => {
  const bgColor = {
    green: "bg-green-400/20",
    blue: "bg-blue-400/20",
    purple: "bg-purple-400/20",
  }[color];

  const textColor = {
    green: "text-green-300",
    blue: "text-blue-200",
    purple: "text-purple-200",
  }[color];

  return (
    <View className={`px-3 py-1 rounded-full ${bgColor}`}>
      <Text className={`text-md font-medium ${textColor}`}>{children}</Text>
    </View>
  );
};

export default Pill;
