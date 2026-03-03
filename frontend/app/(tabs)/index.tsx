import arrow from "@/assets/images/arrow.png";
import bell from "@/assets/images/icons/bell.png";
import vault from "@/assets/images/vault.png";
import FilesCard from "@/components/home/RecentBillCard";
import ProgressBar from "@/components/home/ProgressBar";
import SearchBar from "@/components/home/SearchBar";
import WarrantyCard from "@/components/home/WarrantyTrackerCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";

const HorizontalRule = () => {
  return <View className="w-3/4 bg-gray-200 h-1 my-4 mx-auto" />;
};

export default function App() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("full_name").then((name) =>
      setUserName(name || "there")
    );
  }, []);

  const getOrdinal = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const data = ["warranty 1", "warranty 2", "warranty 3", "warranty 4"];

  const date = new Date();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", {
    month: "long",
  });
  const formattedDate = `${day}${getOrdinal(day)} ${month}`;

  return (
    <View className="flex-1 flex-col bg-white px-7 pt-14">
      <View className="flex-row justify-between">
        <View className="flex-col">
          <Text className="text-lg font-bold text-[#808080]">{weekday}</Text>
          <Text className="text-lg font-bold">{formattedDate}</Text>
        </View>

        <Image source={bell} className="flex-end size-9" resizeMode="contain" />
      </View>
      <Text className="text-2xl font-bold mt-2">Hi {userName}!</Text>
      <SearchBar />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <View className="rounded-lg h-[160px] overflow-hidden w-full">
          <LinearGradient
            colors={["#944ABC", "#3B0856"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          >
            <View className="flex-row justify-between pl-4 mt-4">
              <View className="flex-col justify-between">
                <View className="flex-row justify-evenly">
                  <Image source={vault} className="size-24" />
                  <View className="flex-col">
                    <Text className="text-white font-semibold text-2xl">
                      Cloud Storage
                    </Text>
                    <Text className="text-white font-semibold text-md">
                      247 Secured Documents
                    </Text>
                  </View>
                </View>
                <Text className="text-white text-md font-semibold">
                  20GB of 35GB Used
                </Text>
                <View className="w-full pt-2">
                  <ProgressBar progress={67} />
                </View>
              </View>

              <Image source={arrow} className="w-14 h-24 mt-12" />
            </View>
          </LinearGradient>
        </View>

        <HorizontalRule />

        <View className="flex-row justify-between">
          <Text className="text-2xl font-bold">Warranty Tracker</Text>
          <Text className="text-sm text-gray-400 font-bold">View All</Text>
        </View>

        <View style={{ height: 155, marginVertical: 10 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => <WarrantyCard />}
            className=""
            contentContainerStyle={{
              gap: 10,
            }}
          />
        </View>

        <HorizontalRule />

        <View className="flex-row justify-between">
          <Text className="text-2xl font-bold">Recent Uploads</Text>
          <Text className="text-sm text-gray-400 font-bold">View All</Text>
        </View>

        <View style={{ minHeight: 170, marginVertical: 10 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={({ item }) => <FilesCard />}
            className=""
            contentContainerStyle={{
              gap: 10,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
