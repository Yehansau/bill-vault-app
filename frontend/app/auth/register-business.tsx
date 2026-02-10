import { CustomButton, CustomInput } from "@/components/ui";
import { Checkbox } from "expo-checkbox";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const RegisterBusinessScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    if (!businessName || !email || !password || !isChecked) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    // TODO: Call backend API (INT-2)
    setTimeout(() => {
      setLoading(false);
      router.replace("./(tabs)"); // Go to Home (tabs)
    }, 2000);
  };

  return (
    <View className="bg-white flex-1">
      <View className="items-center mt-5">
        <View className="rounded-xl size-14 bg-[#4CAF50] relative justify-center items-center shadow-lg shadow-black">
          <Text className="text-3xl">💼</Text>
        </View>
        <Text className="text-2xl text-center font-bold mt-5">
          Create Business Account
        </Text>
        <Text className="text-lg text-center text-gray-500 mt-5">
          Enable all-in-one billing and customer management
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
            label="Business Name"
            placeholder="Enter your business name"
            value={businessName}
            onChangeText={setBusinessName}
            icon="business-outline"
          />
          <CustomInput
            label="Business Type"
            placeholder="e.g., Retail, Restaurant, etc."
            value={businessType}
            onChangeText={setBusinessType}
            icon="briefcase-outline"
          />
          <CustomInput
            label="Business Email"
            placeholder="Enter business email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />
          <CustomInput
            label="Business Phone"
            placeholder="Enter business phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon="call-outline"
          />
          <CustomInput
            label="Business Address"
            placeholder="Enter your business address"
            value={address}
            onChangeText={setAddress}
            icon="location-outline"
          />
          <CustomInput
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            icon="lock-closed-outline"
          />

          <View className="flex-row items-center justify-between mt-7 mb-2">
            <TouchableOpacity>
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? "#4CAF50" : undefined}
              />
            </TouchableOpacity>

            <Text className="flex-1 text-lg font-semibold text-gray-400 ml-5">
              I agree to the Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>

        <View className="items-center mt-5 px-5">
          <CustomButton
            title="Create Business Account"
            onPress={handlePress}
            loading={loading}
            disabled={!isChecked}
          />

          <Text className="text-lg font-bold mt-4">
            Already have an account?{" "}
            <Link href="./auth/login" className="text-[#4CAF50] font-semibold">
              Sign in
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterBusinessScreen;
