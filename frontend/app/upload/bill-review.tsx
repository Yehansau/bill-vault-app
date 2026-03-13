import check from "@/assets/images/check.png";
import dateIcon from "@/assets/images/dateIcon.png";
import edit from "@/assets/images/edit.png";
import noWarranty from "@/assets/images/noWarranty.png";
import scanIcon from "@/assets/images/scanIcon.png";
import { CustomButton } from "@/components/ui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import DropDownPicker from "react-native-dropdown-picker";
import ItemDetails from "@/components/upload/ItemDetails";
import { billsAPI } from "@/services/api";

// Define the type for the item state (dictionary to hold warranty and editability status for each item)
type ItemState = {
  isEditable: boolean;
  warranty: boolean;
  confirmed: boolean;
  expiryDate?: Date;
};

const OCRScreen = () => {
  const { processedData, imageUri, uploadType } = useLocalSearchParams();
  const parsedData = processedData ? JSON.parse(processedData as string) : null;

  const [merchant, setMerchant] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState(new Date());

  const [data, setData] = useState<any[]>([]);
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>({});

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("english");

  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [actionItemId, setActionItemId] = useState<string | null>(null);
  const router = useRouter();

  // Define the language options for the dropdown
  const [languageItems, setLanguageItems] = useState([
    { label: "English", value: "english" },
    { label: "Tamil", value: "tamil" },
    { label: "Sinhala", value: "sinhala" },
  ]);

  useEffect(() => {
    if (!parsedData) return;

    console.log("Received OCR data:", parsedData);

    // Fill UI fields
    setMerchant(parsedData.merchant);
    setTotal(`Rs. ${parsedData.total_amount}`);
    setDate(parsedData.bill_date ? new Date(parsedData.bill_date) : new Date());

    // Convert backend items → UI items
    const formattedItems = parsedData.items.map((item: any, index: number) => ({
      id: String(index + 1),
      name: item.name,
      size: "",
      price: `Rs.${item.price}`,
      category: item.category,
      category_confidence: item.category_confidence,
      warranty_detected: item.warranty_detected,
      warranty_confidence: item.warranty_confidence,
    }));

    setData(formattedItems);

    // initialize state for items
    const states: Record<string, ItemState> = {};
    formattedItems.forEach((item: any) => {
      states[item.id] = {
        isEditable: false,
        warranty: item.warranty_detected,
        confirmed: false,
      };
    });

    setItemStates(states);
  }, [processedData]);

  const saveBill = async () => {
    try {
      const payload = {
        imageUri: imageUri,
        firebase_url: parsedData?.firebase_url || "",
        upload_type: "receipt" as const,
        language: value,
        merchant: merchant,
        bill_date: date.toISOString().split("T")[0],
        total_amount: parseFloat(total.replace("Rs.", "").trim()),
        items: data.map((item) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price.replace("Rs.", "")),
          category: item.category,
          category_confidence: item.category_confidence || 0.8,
          warranty_detected: itemStates[item.id]?.warranty || false,
          warranty_confidence: item.warranty_confidence || 0,
        })),
      };

      await billsAPI.save(payload);

      router.replace("/upload/video");
    } catch (error) {
      console.log("Save error:", error);
      alert("Failed to save bill.");
    }
  };

  // Function to remove an item from the data list by ID
  const removeItem = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  // Handler for when the date is changed in the date picker for the receipt date
  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }

    setShow(false);
  };

  // Format the receipt date for display
  const formattedDate = `${date.toLocaleDateString("en-US", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`;

  // Handler to open the action sheet for a specific item ID when the "+Add Warranty" button is pressed
  const onOpenActionSheet = (id: string) => {
    setActionItemId(id);
    actionSheetRef.current?.setModalVisible(true);
  };

  // Function to handle the "Enter details manually" option in the action sheet, which sets the item to be editable
  const handleEnterDetails = () => {
    if (actionItemId) {
      setItemStates((prev) => ({
        ...prev,
        [actionItemId]: {
          ...prev[actionItemId],
          isEditable: true,
          warranty: true,
        },
      }));
    }
    actionSheetRef.current?.setModalVisible(false);
  };

  // Function to handle the "No Warranty" option in the action sheet, which sets the warranty status of the item to false
  const handleNoWarranty = () => {
    if (actionItemId) {
      setItemStates((prev) => ({
        ...prev,
        [actionItemId]: { ...prev[actionItemId], warranty: false },
      }));
    }
    actionSheetRef.current?.setModalVisible(false);
  };

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
        <View className="flex-1 items-center px-5 mt-5">
          <Image source={check} className="size-16 my-4" />
          <Text className="text-lg font-bold">Scan Complete!</Text>
          <View className="border border-gray-300 rounded-lg h-auto w-full py-3 items-center shadow-xl bg-white mb-5">
            <Text className="text-md font-bold mb-3">Scanned Document</Text>
            <Image
              source={{ uri: imageUri as string }}
              className="size-[200px]"
            />
          </View>

          <View className="border border-gray-300 rounded-lg h-auto w-full py-3 items-center shadow-xl px-4 bg-white mb-5">
            <Text className="text-md font-bold mb-10">
              Extracted Information
            </Text>
            <View className="flex-row justify-between w-full pb-4 items-center">
              <Text className="text-md text-gray-400 font-bold">Merchant:</Text>
              <TextInput
                className="border border-gray-300 rounded-md px-2 py-1 text-md"
                value={merchant}
                onChangeText={setMerchant}
              />
            </View>
            <View className="flex-row justify-between w-full pb-4 items-center">
              <Text className="text-md text-gray-400 font-bold">Date:</Text>
              <View className="flex-row justify-between border border-gray-300 rounded-md px-2 py-1">
                <Text className="text-md">{formattedDate}</Text>
                <TouchableOpacity onPress={() => setShow(true)}>
                  <Image source={dateIcon} className="size-5 ml-2" />
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={onChange}
                    display="default"
                  />
                )}
              </View>
            </View>
            <View className="flex-row justify-between w-full pb-4 items-center">
              <Text className="text-md text-gray-400 font-bold">
                Total Amount:
              </Text>
              <TextInput
                className="border border-gray-300 rounded-md px-2 py-1 font-bold text-md"
                value={total}
                onChangeText={setTotal}
              />
            </View>
            <View className="flex-row justify-between w-full pb-10 items-center relative">
              <Text className="text-md text-gray-400 font-bold">Language:</Text>
              <DropDownPicker
                open={open}
                value={value}
                items={languageItems}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setLanguageItems}
                placeholder=""
                listMode="SCROLLVIEW"
                // 🧵 Custom styling
                style={{
                  borderColor: "#ccc",
                  borderRadius: 8,
                  minHeight: 35,
                  width: 120,
                  marginLeft: 135,
                }}
                dropDownContainerStyle={{
                  borderColor: "#ccc",
                  borderRadius: 8,
                  width: 120,
                  marginLeft: 135,
                  position: "relative",
                  zIndex: 1,
                  top: 0,
                }}
                textStyle={{
                  fontSize: 14,
                }}
                listItemContainerStyle={{
                  height: 30,
                }}
                listItemLabelStyle={{
                  color: "#222",
                  fontSize: 14,
                }}
              />
            </View>
          </View>

          <Pressable style={{ flex: 1 }} onPress={() => setSelectedId(null)}>
            <View className="border border-gray-300 rounded-lg h-auto w-full py-3 items-center shadow-xl px-4 bg-white">
              <Text className="text-md font-bold mb-10">Items Detected</Text>
              {data.map((item) => (
                <ItemDetails
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  size={item.size}
                  price={item.price}
                  category={item.category}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  removeItem={removeItem}
                  state={itemStates[item.id]}
                  setState={setItemStates}
                  onOpenActionSheet={onOpenActionSheet}
                />
              ))}
            </View>

            <ActionSheet
              ref={actionSheetRef}
              containerStyle={{
                borderRadius: 16,
                backgroundColor: "transparent",
              }}
            >
              <View className="p-4 rounded-xl mb-2 bg-white">
                <TouchableOpacity
                  className="flex-row justify-start items-center py-4 border-b border-gray-300"
                  onPress={handleEnterDetails}
                >
                  <Image source={edit} className="size-6 mr-2 mt-1" />
                  <Text className="text-xl font-semibold">
                    Enter details manually
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row justify-start items-center py-4 border-b border-gray-300"
                  onPress={() => {
                    actionSheetRef?.current?.setModalVisible(false);
                    router.push("/(tabs)/camera");
                  }}
                >
                  <Image source={scanIcon} className="size-6 mr-2 mt-1" />
                  <Text className="text-xl font-semibold">
                    Scan Warranty Card
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row justify-start items-center pt-4 pb-2"
                  onPress={handleNoWarranty}
                >
                  <Image source={noWarranty} className="size-6 mr-2 mt-1" />
                  <Text className="text-xl font-semibold">No Warranty</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => actionSheetRef?.current?.setModalVisible(false)}
                className="items-center justify-center rounded-xl mb-3 bg-white p-4"
              >
                <Text className="text-black text-xl font-semibold">Cancel</Text>
              </TouchableOpacity>
            </ActionSheet>
          </Pressable>

          <View className="flex-1 mt-10">
            <CustomButton title="Save to BillVault" onPress={saveBill} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OCRScreen;
