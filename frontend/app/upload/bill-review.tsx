import check from "@/assets/images/icons/check.png";
import { CustomButton } from "@/components/ui";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface Props {
  name: string;
  size: string;
  price: number;
  category: string;
}

const ItemDetails = ({ name, size, price, category }: Props) => {
  let style = "bg-yellow-200";
  let styleText = "text-yellow-400";
  if (category === "Food & Dining") {
    style = "bg-blue-200";
    styleText = "text-blue-400";
  } else if (category === "Electronics") {
    style = "bg-green-200";
    styleText = "text-green-400";
  } else if (category === "Personal Care") {
    style = "bg-pink-200";
    styleText = "text-pink-400";
  }

  return (
    <View className="flex-row justify-between w-full pb-2">
      <View className="flex-col">
        <Text className="text-md font-bold">{name}</Text>
        <Text className="text-sm text-gray-400 font-bold">{size}</Text>
      </View>
      <View className="flex-col items-center">
        <Text className="text-md font-bold">Rs. {price}.00</Text>
        <View
          className={`rounded-xl h-5 w-auto px-5 ${style} items-center justify-center`}
        >
          <Text className={`text-sm ${styleText} font-bold`}>{category}</Text>
        </View>
      </View>
    </View>
  );
};

const OCRScreen = () => {
    const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 100,
        }}
      >
        <View className="flex-1 items-center px-10">
          <Image source={check} className="size-16 my-4" />
          <Text className="text-lg font-bold">Scan Complete!</Text>
          <View className="border border-gray-300 rounded-lg h-auto w-full py-3 items-center shadow-xl bg-white mb-5">
            <Text className="text-md font-bold mb-3">Scanned Document</Text>
            <Image
              source={{
                uri: "file:///data/user/0/host.exp.exponent/cache/Camera/11bebfb2-2945-407a-9824-625db3d2f588.jpg",
              }}
              className="size-[200px]"
            />
          </View>

          <View className="border border-gray-300 rounded-lg h-auto w-full py-3 items-center shadow-xl px-4 bg-white mb-5">
            <Text className="text-md font-bold mb-10">
              Extracted Information
            </Text>
            <View className="flex-row justify-between w-full pb-2">
              <Text className="text-md text-gray-400 font-bold">Merchant:</Text>
              <Text className="text-md">SuperMart Grocery</Text>
            </View>
            <View className="flex-row justify-between w-full pb-2">
              <Text className="text-md text-gray-400 font-bold">Date:</Text>
              <Text className="text-md">December 10, 2024</Text>
            </View>
            <View className="flex-row justify-between w-full pb-2">
              <Text className="text-md text-gray-400 font-bold">
                Total Amount:
              </Text>
              <Text className="text-md font-bold">Rs. 1696.67</Text>
            </View>
            <View className="flex-row justify-between w-full pb-10">
              <Text className="text-md text-gray-400 font-bold">Language:</Text>
              <Text className="text-md">English</Text>
            </View>
          </View>

          <View className="border border-gray-300 rounded-lg h-auto w-full py-3 items-center shadow-xl px-4 bg-white">
            <Text className="text-md font-bold mb-10">Items Detected</Text>
            <ItemDetails
              name="Bananas"
              size="300g"
              price={96.0}
              category="Food & Dining"
            />
            <ItemDetails
              name="Panasonic Batteries"
              size="4B-Aa"
              price={650.0}
              category="Electronics"
            />
            <ItemDetails
              name="Shampoo"
              size="180ml"
              price={750.0}
              category="Personal Care"
            />
            <ItemDetails
              name="Mixed Vegetables"
              size="250g"
              price={200.0}
              category="Food & Dining"
            />
          </View>

          <View className="flex-1 mt-5">
            <CustomButton
                title="Save to BillVault"
                onPress={() => router.push("./success.tsx")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OCRScreen;
