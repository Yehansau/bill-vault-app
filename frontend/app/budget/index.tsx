import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, {useState, useEffect} from "react";
import { useRouter } from "expo-router";
import { analyticsAPI } from "@/services/api";

interface Props {
  category: string;
  amount: number;
  budget: number;
  onChange: (value: number) => void;
}

const BudgetScreen = () => {
  const router = useRouter();

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [currentSpending, setCurrentSpending] = useState(2908);
  const [alertThreshold, setAlertThreshold] = useState(0);
  
  const CategoryWise = ({ category, amount, budget, onChange }: Props) => {
    return (
    <View className="flex-row justify-start">
            <Text className="text-md text-black">{category}</Text>
            <View className="flex-row rounded-full bg-gray-200 p-2">
              <Text className="text-md text-black">Rs</Text>
              <TextInput className="bg-white rounded-full" value={String(budget)}
              keyboardType="numeric"
              onChangeText={(text) => onChange(Number(text))}/>
            </View>
            <Text className="text-sm text-black">Current: Rs.{amount}</Text>
        </View>
    );
  }

  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const res = await analyticsAPI.getSummary();

      console.log("Analytics response:", res.data);

      setCurrentSpending(res.data.total_spending);

      // Map backend → frontend
      const mappedCategories = res.data.chart_data.map(
        (item: any, index: number) => ({
          id: index + 1,
          category: item.category,
          amount: item.amount,
          budget: 0, // user will fill this
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
    <View className="flex-1 bg-white px-2">
      <View className="flex-col rounded-full border border-[#CAC4D0] mt-5 p-4">
        <Text className="text-lg text-black font-bold">Overall Monthly Budget</Text>
        <View className="flex-row justify-start">
          <View className="flex-col">
            <Text className="text-md text-black">Monthly Budget Amount</Text>
            <View className="flex-row rounded-full bg-gray-200 p-2">
              <Text className="text-md text-black">Rs</Text>
              <TextInput className="bg-white rounded-full" value={String(monthlyBudget)} onChangeText={(text) => setMonthlyBudget(Number(text))}/>
            </View>
            <Text className="text-md text-black">Current Spending</Text>
            <View className="flex-row rounded-full bg-gray-200 p-2">
              <Text className="text-md text-black">Rs. {currentSpending}.00</Text>
              <Text className="text-sm text-black">(40% of budget)</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-col rounded-full border border-[#CAC4D0] mt-5 p-4">
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
            setCategoryData(updated);/>
        ))}
        
      </View>

      <View className="flex-col rounded-full border border-[#CAC4D0] mt-5 p-4">
        <Text className="text-lg text-black font-bold">Alert Threshold</Text>
        <Text className="text-md text-black">Alert me when spending reaches</Text>
            <View className="flex-row rounded-full bg-gray-200 p-2">
              <TextInput className="bg-white rounded-full" value={String(alertThreshold)} onChangeText={(text) => setAlertThreshold(Number(text))}/>
              <Text className="text-md text-black">%</Text>
            </View>
        <Text className="text-sm text-black">You'll receive notifications when your spending reaches {alertThreshold}% of your budget</Text>
        </View>
      </View>

      <View className="flex-row mt-10 justify-center items-center">
      <TouchableOpacity className="rounded-full bg-white border border-[#3B1E54] p-auto" onPress={() => setAlertThreshold(0)}>
        <Text className="text-md text-[#3B1E54]">Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity className="rounded-full bg-white border border-[#3B1E54] p-auto ml-5" onPress={() => router.push("/(tabs)/analytics")}>
        <Text className="text-md text-[#3B1E54]">Save</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default BudgetScreen;
