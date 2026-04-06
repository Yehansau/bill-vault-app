// app/(tabs)/analytics.tsx
import {
  View,
  Text,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import total from "@/assets/images/total.png";
import bills from "@/assets/images/bills.png";
import chart from "@/assets/images/chart.png";
import { LinearGradient } from "expo-linear-gradient";
import { PieChart } from "react-native-gifted-charts";
import { useState, useEffect, useRef, Key } from "react";
import { Text as SvgText } from "react-native-svg";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { analyticsAPI } from "@/services/api";

interface Props {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics on component mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getSummary();
        setAnalyticsData(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please login again.",
          );
          // Optional: navigate to login screen here
        } else {
          Alert.alert(
            "Failed to fetch analytics",
            "Something went wrong. Please try again later.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Animation for the pie chart
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const CategoryWise = ({ category, amount, percentage, color }: Props) => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold text-gray-700">{category}</Text>
        <Text className="text-lg font-semibold text-gray-600">
          Rs. {amount}
        </Text>
      </View>
      <View className="h-3 w-full bg-gray-200 rounded-full mt-2 overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#944ABC" />
        <Text className="mt-4 text-gray-500 text-lg font-medium">
          Loading analytics...
        </Text>
      </View>
    );
  }

  if (!analyticsData || analyticsData.chart_data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-5">
        <View className="bg-gray-50 p-6 rounded-2xl shadow-md items-center">
          <Text className="text-gray-700 text-lg font-semibold text-center">
            You haven&apos;t uploaded any bills yet.
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Upload bills to get started and track your spending easily!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Pie Chart */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <PieChart
            data={analyticsData.chart_data}
            donut
            innerRadius={70}
            strokeColor="white"
            strokeWidth={5}
            showExternalLabels
            externalLabelComponent={(item) => (
              <SvgText fill="black" fontSize={18} fontWeight="bold">
                {item?.text || ""}
              </SvgText>
            )}
            labelLineConfig={{
              color: "gray",
              thickness: 1,
              length: 20,
              avoidOverlappingOfLabels: true,
            }}
          />
        </Animated.View>

        {/* Summary Cards */}
        <View className="px-5 mt-5 space-y-4">
          <SummaryCard
            title="Total Spending"
            value={`Rs. ${analyticsData.total_spending}`}
            image={total}
          />
          <SummaryCard
            title="Number of Bills"
            value={`${analyticsData.number_of_bills}`}
            image={bills}
          />
          <SummaryCard
            title="Average Bill Amount"
            value={`Rs. ${Math.round(analyticsData.average_bill_amount)}`}
            image={chart}
          />
        </View>

        {/* Category-wise spending */}
        <View className="px-5 mt-5">
          <Text className="text-xl text-gray-500 font-bold mb-3">
            Categories
          </Text>
          {analyticsData.categories &&analyticsData.categories.map(
            (
              item: {
                category: string;
                amount: number;
                percentage: number;
                color: string;
              },
              index: Key | null | undefined,
            ) => (
              <CategoryWise
                key={index}
                category={item.category}
                amount={item.amount}
                percentage={item.percentage}
                color={item.color}
              />
            ),
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const SummaryCard = ({ title, value, image }: any) => (
  <View className="flex-row justify-between items-center bg-white p-5 px-6 rounded-full shadow-md mt-2">
    <View>
      <Text className="text-gray-400 font-medium">{title}</Text>
      <Text className="text-black font-bold text-xl mt-1">{value}</Text>
    </View>
    <Image source={image} className="w-10 h-10" />
  </View>
);
