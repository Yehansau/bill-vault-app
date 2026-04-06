import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { analyticsAPI } from "@/services/api";

interface Props {
  category: string;
  amount: number;
  budget: number;
  onChange: (value: number) => void;
}

interface AnalyticsSummary {
  total_spending: number;
  chart_data: {
    category: string;
    amount: number;
  }[];
}

const CategoryWise = ({ category, amount, budget, onChange }: Props) => {
  return (
    <View className="flex-col">
    <View className="flex-row justify-start mt-2 items-center">
      <Text className="text-md text-black mr-5 font-bold">{category}</Text>
      <View className="flex-row rounded-lg bg-gray-200 py-2 items-center w-3/4 pl-5 mb-2">
        <Text className="text-md text-black mr-2">Rs</Text>
        <TextInput
          className="bg-white rounded-lg w-3/4 px-2"
          value={String(budget)}
          keyboardType="numeric"
          onChangeText={(text) => onChange(Number(text))}
        />
      </View>
    </View>
    <Text className="text-sm text-black">Current: Rs.{amount}</Text>
    </View>
  );
};

const BudgetScreen = () => {
  const router = useRouter();

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [currentSpending, setCurrentSpending] = useState(2908);
  const [alertThreshold, setAlertThreshold] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getSummary();
        const data = res.data as AnalyticsSummary;
        console.log("Analytics response:", res.data);
        setCurrentSpending(data.total_spending);

        const mappedCategories = data.chart_data.map(
          (item: any, index: number) => ({
            id: index + 1,
            category: item.category,
            amount: item.amount,
            budget: 0,
          })
        );

        setCategoryData(mappedCategories);
      } catch (error) {
        console.log("Analytics error:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}
    contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", paddingBottom: 30 }}>
    <ScrollView className="flex-1 bg-white px-5 py-10">
      <View className="flex-col border border-[#CAC4D0] mt-5 p-5 rounded-2xl">
        <Text className="text-lg text-black font-bold mb-2">Overall Monthly Budget</Text>
        <View className="flex-col justify-center">
          <View className="flex-col">
            <Text className="text-md text-black">Monthly Budget Amount</Text>
            <View className="mt-2 flex-row rounded-full bg-gray-200 py-1 pl-5 w-3/4 justify-start items-center overflow-hidden mb-3">
              <Text className="text-md text-black mr-1">Rs</Text>
              <TextInput
                className="bg-white rounded-full w-3/4 px-2"
                value={String(monthlyBudget)}
                keyboardType="numeric"
                onChangeText={(text) => setMonthlyBudget(Number(text))}
              />
            </View>
          </View>
          <View className="flex-col">
            <Text className="text-md text-black">Current Spending</Text>
            <View className="flex-row rounded-full bg-gray-200 py-4 mt-2 px-5 w-3/4 justify-start items-center">
              <Text className="text-md text-black">Rs. {currentSpending}.00</Text>
              <Text className="text-sm text-black">{" "}(40% of budget)</Text>
            </View>
          </View>
          
        </View>
      </View>

      <View className="flex-col border border-[#CAC4D0] mt-5 p-4 rounded-2xl">
        <Text className="text-lg text-black font-bold">Category-Wise Budgets</Text>

        {categoryData.map((item, index) => (
          <CategoryWise
            key={item.id}
            category={item.category}
            amount={item.amount}
            budget={item.budget}
            onChange={(value) => {
              const updated = [...categoryData];
              updated[index].budget = value;
              setCategoryData(updated);
            }}
          />
        ))}
      </View>

      <View className="flex-col border border-[#CAC4D0] mt-5 p-4 rounded-2xl">
        <Text className="text-lg text-black font-bold mb-2">Alert Threshold</Text>
        <Text className="text-md text-black mb-2">Alert me when spending reaches</Text>
        <View className="flex-row rounded-full bg-gray-200 py-2 justify-between pr-5 pl-2 items-center w-3/4 mb-2">
          <TextInput
            className="bg-white rounded-full w-3/4 px-2"
            value={String(alertThreshold)}
            keyboardType="numeric"
            onChangeText={(text) => setAlertThreshold(Number(text))}
          />
          <Text className="text-md text-black">%</Text>
        </View>
        <Text className="text-sm text-black">
          You&apos;ll receive notifications when your spending reaches {alertThreshold}% of your budget
        </Text>
      </View>

      <View className="flex-row mt-10 justify-center items-center mb-20">
        <TouchableOpacity
          className="rounded-full bg-white border border-[#3B1E54] px-4 py-2"
          onPress={() => setAlertThreshold(0)}
        >
          <Text className="text-lg text-[#3B1E54] font-bold">Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-full bg-white border border-[#3B1E54] px-4 py-2 ml-5"
          onPress={() => router.push("/(tabs)/analytics")}
        >
          <Text className="text-lg text-[#3B1E54] font-bold">Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BudgetScreen;