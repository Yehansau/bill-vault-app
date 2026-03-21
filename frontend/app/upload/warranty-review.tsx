import check from "@/assets/images/check.png";
import CustomButton from "@/components/ui/CustomButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const WarrantyReviewScreen = () => {
  const router = useRouter();

  // Editable fields — replace with real data from OCR later
  const [itemName, setItemName] = useState("Samsung TV");
  const [merchant, setMerchant] = useState("Abans");
  const [purchaseDate, setPurchaseDate] = useState("December 10, 2024");
  const [totalAmount, setTotalAmount] = useState("Rs.56,969.00");
  const [language, setLanguage] = useState("English");
  const [warrantyPeriodNum, setWarrantyPeriodNum] = useState("12");
  const [warrantyPeriodUnit, setWarrantyPeriodUnit] = useState("months");
  const [expiryDate, setExpiryDate] = useState("December 10, 2025");
  const [notifyDate, setNotifyDate] = useState("Dec 9, 2025");
  const [notifyTime, setNotifyTime] = useState("9:40 AM");
  const [notes, setNotes] = useState("");

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-5 pt-12 pb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Text className="text-2xl text-black">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold">Scanned Warranty Results</Text>
        </View>

        <View className="items-center px-5">
          {/* Check icon + title */}
          <Image source={check} className="size-16 my-3" />
          <Text className="text-lg font-bold mb-4">Scan Complete!</Text>

          {/* Scanned Document card */}
          <View className="border border-gray-200 rounded-2xl w-full py-4 items-center bg-white mb-4 shadow-sm">
            <Text className="text-base font-bold mb-3">Scanned Document</Text>
            <Image
              source={{
                uri: "file:///data/user/0/host.exp.exponent/cache/Camera/11bebfb2-2945-407a-9824-625db3d2f588.jpg",
              }}
              className="w-48 h-44 rounded-lg"
              resizeMode="cover"
            />
          </View>

          {/* Extracted Information card */}
          <View className="border border-gray-200 rounded-2xl w-full py-4 px-4 bg-white mb-4 shadow-sm">
            <Text className="text-base font-bold mb-4 text-center">
              Extracted Information
            </Text>

            {/* Item Name */}
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-500 font-medium">
                Item Name:
              </Text>
              <TextInput
                value={itemName}
                onChangeText={setItemName}
                className="text-sm font-medium text-right border border-gray-300 rounded-lg px-3 py-1 min-w-[130px]"
              />
            </View>

            {/* Merchant */}
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-500 font-medium">
                Merchant:
              </Text>
              <TextInput
                value={merchant}
                onChangeText={setMerchant}
                className="text-sm font-medium text-right border border-gray-300 rounded-lg px-3 py-1 min-w-[130px]"
              />
            </View>

            {/* Purchase Date */}
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-500 font-medium">
                Purchase Date:
              </Text>
              <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg px-3 py-1 min-w-[130px] justify-between">
                <Text className="text-sm font-medium">{purchaseDate}</Text>
                <Text className="text-gray-400 ml-2">📅</Text>
              </TouchableOpacity>
            </View>

            {/* Total Amount */}
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-500 font-medium">
                Total Amount:
              </Text>
              <TextInput
                value={totalAmount}
                onChangeText={setTotalAmount}
                className="text-sm font-bold text-right border border-gray-300 rounded-lg px-3 py-1 min-w-[130px]"
              />
            </View>

            {/* Language */}
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <Text className="text-sm text-gray-500 font-medium">
                Language:
              </Text>
              <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg px-3 py-1 min-w-[130px] justify-between">
                <Text className="text-sm font-medium">{language}</Text>
                <Text className="text-gray-400 ml-2">▾</Text>
              </TouchableOpacity>
            </View>

            {/* Warranty Period */}
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-gray-500 font-medium">
                Warranty Period:
              </Text>
              <View className="flex-row gap-2">
                <TextInput
                  value={warrantyPeriodNum}
                  onChangeText={setWarrantyPeriodNum}
                  keyboardType="numeric"
                  className="text-sm font-medium text-center border border-gray-300 rounded-lg px-2 py-1 w-12"
                />
                <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg px-3 py-1 justify-between">
                  <Text className="text-sm font-medium">
                    {warrantyPeriodUnit}
                  </Text>
                  <Text className="text-gray-400 ml-1">▾</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Warranty Details card */}
          <View className="border border-gray-200 rounded-2xl w-full py-4 px-4 bg-white mb-6 shadow-sm">
            {/* Expires */}
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <View className="flex-row items-center gap-1">
                <Text>⏱</Text>
                <Text className="text-sm font-semibold ml-1">Expires:</Text>
              </View>
              <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg px-3 py-1 min-w-[140px] justify-between">
                <Text className="text-sm font-medium">{expiryDate}</Text>
                <Text className="text-gray-400 ml-2">📅</Text>
              </TouchableOpacity>
            </View>

            {/* Notify On */}
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text>🔔</Text>
                <Text className="text-sm font-semibold ml-1">Notify On:</Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg px-2 py-1 justify-between">
                  <Text className="text-sm font-medium">{notifyDate}</Text>
                  <Text className="text-gray-400 ml-1">📅</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-lg px-2 py-1">
                  <Text className="text-sm font-medium">{notifyTime}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Notes */}
            <View className="py-2">
              <View className="flex-row items-center mb-2">
                <Text>📋</Text>
                <Text className="text-sm font-semibold ml-1">Add Notes:</Text>
              </View>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional..."
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={3}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 min-h-[70px]"
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save button pinned to bottom */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-white border-t border-gray-100">
        <CustomButton
          title="Save to BillVault"
          onPress={() => router.push("/(tabs)")}
        />
      </View>
    </View>
  );
};

export default WarrantyReviewScreen;
