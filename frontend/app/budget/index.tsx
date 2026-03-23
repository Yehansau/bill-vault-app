import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import { useRouter } from "expo-router";

interface Props {
  category: string;
  amount: number;
}

const BudgetScreen = () => {
  const router = useRouter();

  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [currentSpending, setCurrentSpending] = useState(2908);
  const [alertThreshold, setAlertThreshold] = useState(0);
  
  const CategoryWise = ({ category, amount }: Props) => {
    const [budget, setBudget] = useState(0);
    return (
    <View className="flex-row justify-start">
            <Text className="text-md text-black">{category}</Text>
            <View className="flex-row rounded-full bg-gray-200 p-2">
              <Text className="text-md text-black">Rs</Text>
              <TextInput className="bg-white rounded-full" value={budget} onChangeText={setBudget}/>
            </View>
            <Text className="text-sm text-black">Current: Rs.{amount}</Text>
        </View>
    );
  }

  const categoryData = [
    {id: 1, category: "Grocery", amount: 30000},
    {id: 2, category: "Restaurant", amount: 5000},
    {id: 3, category: "Clothing", amount: 2000},
    {id: 4, category: "Travelling", amount: 13500},
  ]

  return (
    <View className="flex-1 bg-white px-2">
      <View className="flex-col rounded-full border border-[#CAC4D0] mt-5 p-4">
        <Text className="text-lg text-black font-bold">Overall Monthly Budget</Text>
        <View className="flex-row justify-start">
          <View className="flex-col">
            <Text className="text-md text-black">Monthly Budget Amount</Text>
            <View className="flex-row rounded-full bg-gray-200 p-2">
              <Text className="text-md text-black">Rs</Text>
              <TextInput className="bg-white rounded-full" value={monthlyBudget} onChangeText={setMonthlyBudget}/>
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
        
        {categoryData.map((item) => (
          <CategoryWise
          key={item.id}
          category={item.category}
          amount={item.amount}/>
        ))}
        
      </View>

      <View className="flex-col rounded-full border border-[#CAC4D0] mt-5 p-4">
        <Text className="text-lg text-black font-bold">Alert Threshold</Text>
        <Text className="text-md text-black">Alert me when spending reaches</Text>
            <View className="flex-row rounded-full bg-gray-200 p-2">
              <TextInput className="bg-white rounded-full" value={alertThreshold} onChangeText={setAlertThreshold}/>
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
