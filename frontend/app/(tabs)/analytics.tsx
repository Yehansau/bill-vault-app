// app/(tabs)/analytics.tsx
import { View, Text, Image, ScrollView, Animated } from "react-native";
import total from "@/assets/images/total.png";
import bills from "@/assets/images/bills.png";
import chart from "@/assets/images/chart.png";
import groceries from "@/assets/images/groceries.png";
import restaurant from "@/assets/images/restaurant.png";
import travelling from "@/assets/images/travelling.png";
import clothing from "@/assets/images/clothing.png";
import { LinearGradient } from "expo-linear-gradient";
import { PieChart } from "react-native-gifted-charts";
import { useState, useEffect, useRef } from "react";
import { Text as SvgText } from "react-native-svg";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";

interface Props {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export default function Analytics() {
  const [pickerMode, setPickerMode] = useState<
    "date" | "month" | "year" | null
  >(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const showDate = `📅 ${selectedDate.getDate()} ${selectedDate.toLocaleDateString("en-US", { month: "short" })} ${selectedDate.getFullYear()}`;
  const showMonth = `📅 ${selectedDate.toLocaleDateString("en-US", { month: "long" })} ${selectedDate.getFullYear()}`;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("today");
  const [dateItems, setDateItems] = useState([
    { label: "📅 Today", value: "today" },
    { label: "📅 Custom Month", value: "month" },
    { label: "📅 Custom Year", value: "year" },
    { label: "📅 Custom Date", value: "date" },
  ]);

  // Data to be included in the donut pie chart
  const chartData = [
    { value: 50, color: "#009DFF", text: "👕", image: clothing },
    { value: 20, color: "#9E00C6", text: "🚗", image: travelling },
    { value: 25, color: "#00B700", text: "🍽️", image: restaurant },
    { value: 5, color: "#34009C", text: "🛍️", image: groceries },
  ];

  const fadeAnim = useRef(new Animated.Value(0)).current; // opacity
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // scale

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
  }, [fadeAnim, scaleAnim]);

  const CategoryWise = ({ category, amount, percentage, color }: Props) => {
    return (
      <View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-lg text-black font-bold">{category}</Text>
          <Text className="text-lg text-gray-200 font-bold">
            {`Rs. ${amount} / 2908`}
          </Text>
        </View>
        <View className="flex-row h-1 w-full items-center justify-start bg-gray-300 rounded-full mt-2">
          <View
            className="h-full bg-black rounded-full"
            style={{ width: `${percentage}%` }}
          />
          <View
            className="h-2 w-2 rounded-xl ml-[-5px]"
            style={{
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    );
  };

  const categoryData = [
    {
      id: 1,
      category: "Groceries",
      amount: 145,
      percentage: 5,
      color: "red",
    },
    {
      id: 2,
      category: "Restaurant",
      amount: 727,
      percentage: 25,
      color: "blue",
    },
    {
      id: 3,
      category: "Clothing",
      amount: 1454,
      percentage: 50,
      color: "green",
    },
    {
      id: 4,
      category: "Travelling",
      amount: 581,
      percentage: 20,
      color: "pink",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 50,
        }}
      >
        <View className="flex-1">
          <View className="px-5">
            <DropDownPicker
              open={open}
              value={value}
              items={dateItems}
              setOpen={setOpen}
              setValue={setValue} // just update the state
              setItems={setDateItems}
              placeholder={value}
              listMode="SCROLLVIEW"
              onChangeValue={(val) => {
                // val is guaranteed to be string | null
                if (!val) return;

                if (val === "date") setPickerMode("date");
                else if (val === "month") setPickerMode("month");
                else if (val === "year") setPickerMode("year");
                else setPickerMode(null);
              }}
              style={{
                borderRadius: 50,
                maxWidth: "50%",
                marginTop: 10,
              }}
              dropDownContainerStyle={{
                maxWidth: "50%",
                borderRadius: 50,
                zIndex: 1,
                top: 0,
                position: "relative",
              }}
            />

            <DateTimePickerModal
              isVisible={pickerMode !== null}
              mode="date"
              date={selectedDate}
              onConfirm={(date) => {
                setSelectedDate(date);
                if (pickerMode === "date") {
                  setValue(`${showDate}`);
                } else if (pickerMode === "month") {
                  setValue(`${showMonth}`);
                } else if (pickerMode === "year") {
                  setValue(`📅 ${selectedDate.getFullYear()}`);
                }
                setPickerMode(null);
              }}
              onCancel={() => setPickerMode(null)}
              // For month/year, just read the month/year from selectedDate
              display="spinner"
            />
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              alignItems: "center",
            }}
          >
            <PieChart
              data={chartData}
              donut
              innerRadius={70}
              strokeColor="white"
              strokeWidth={5}
              showExternalLabels
              animationDuration={800}
              externalLabelComponent={(item) => {
                return (
                  <SvgText fill="black" fontSize="20" fontWeight="bold">
                    {item?.text}
                  </SvgText>
                );
              }}
              // Customize the line connecting labels to slices
              labelLineConfig={{
                color: "gray",
                thickness: 1,
                length: 20,
                // Optional: Avoid label overlapping
                avoidOverlappingOfLabels: true,
              }}
            />
          </Animated.View>

          <View className="px-5">
            <View className="flex-col justify-start rounded-full p-5 px-10 bg-white shadow-md mt-5">
              <Text className="text-md text-gray-300">Total Spending</Text>
              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-xl text-black">
                  Rs. 2908.00
                </Text>
                <Image source={total} className="size-10" />
              </View>
            </View>

            <View className="flex-col justify-start rounded-full p-5 px-10 bg-white shadow-md mt-5">
              <Text className="text-md text-gray-300">Number of Bills</Text>
              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-xl text-black">48</Text>
                <Image source={bills} className="size-10" />
              </View>
            </View>

            <View className="flex-col justify-start rounded-full p-5 px-10 bg-white shadow-md mt-5">
              <Text className="text-md text-gray-300">Average Bill Amount</Text>
              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-xl text-black">Rs. 60.58</Text>
                <Image source={chart} className="size-10" />
              </View>
            </View>

            <View className="flex-col justify-start rounded-3xl p-10 bg-white shadow-md mt-5">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl text-gray-400 font-bold">
                  CATEGORIES
                </Text>
                <View className="rounded-full w-auto h-auto overflow-hidden">
                  <LinearGradient
                    colors={["#944ABC", "#3B0856"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      flex: 1,
                      padding: 5,
                      paddingHorizontal: 15,
                      height: "100%",
                    }}
                  >
                    <Text className="text-white text-md font-bold">
                      Budget Setting
                    </Text>
                  </LinearGradient>
                </View>
              </View>

              {categoryData.map((item) => (
                <CategoryWise
                  key={item.id}
                  category={item.category}
                  amount={item.amount}
                  percentage={item.percentage}
                  color={item.color}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
