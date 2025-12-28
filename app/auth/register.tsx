import profile from "@/assets/images/profile.png";
import { CustomButton, CustomInput } from "@/src/components";

import { Checkbox } from "expo-checkbox";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const RegisterScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setIsLoading] = useState(false);

  const handlePress = () => {
    setIsLoading(true);

    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <View className="bg-white flex-1">
      <View className="items-center mt-5">
        <View className="rounded-xl size-14 bg-[#8B5AA4] relative justify-center items-center shadow-lg shadow-black">
          <Image source={profile} className="size-10" />
        </View>
        <Text className="text-2xl text-center font-bold mt-5">
          Create Your Account
        </Text>
        <Text className="text-lg text-center text-gray-500 mt-5">
          Start managing your bills smarter
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <View className="flex-col items-start mt-5 px-5">
          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
          <CustomInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error="Please enter a valid email"
          />
          <CustomInput
            label="Phone Number (Optional)"
            placeholder="Enter your phone number"
            value={number}
            onChangeText={setNumber}
            keyboardType="phone-pad"
          />
          <CustomInput
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <CustomInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />

          <View className="flex-row items-center justify-between mt-7 mb-2">
            <TouchableOpacity>
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? "#8B5AA4" : undefined}
              />
            </TouchableOpacity>

            <Text className="flex-1 text-lg font-semibold text-gray-400 ml-5">
              I agree to the Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>

        <View className="items-center mt-5 px-5">
          <CustomButton
            title="Create Individual Account"
            onPress={handlePress}
            loading={loading}
          />

          <Text className="text-lg font-bold mt-4">
            Already have an account?{" "}
            <Link
              href="/(tabs)/explore"
              className="text-[#9B7EBD] font-semibold"
            >
              Sign in
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;
