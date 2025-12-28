import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const WelcomeScreen = () => {
  return (
    <View className="mt-44">
      <Text className="text-red-200 text-md">WelcomeScreen</Text>
      <Link href="/auth/register" className="text-red-200 text-md">
        Login Screen
      </Link>
    </View>
  );
};

export default WelcomeScreen;
