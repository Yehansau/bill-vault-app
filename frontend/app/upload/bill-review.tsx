import check from "@/assets/images/check.png";
import close from "@/assets/images/close.png";
import dateIcon from "@/assets/images/dateIcon.png";
import edit from "@/assets/images/edit.png";
import expire from "@/assets/images/expire.png";
import notes from "@/assets/images/notes.png";
import notify from "@/assets/images/notify.png";
import noWarranty from "@/assets/images/noWarranty.png";
import scanIcon from "@/assets/images/scanIcon.png";
import warrantyDetected from "@/assets/images/warrantyDetected.png";
import warrantyIcon from "@/assets/images/warrantyIcon.png";
import { CustomButton } from "@/components/ui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import DropDownPicker from "react-native-dropdown-picker";

// Define the type for the item state (dictionary to hold warranty and editability status for each item)
type ItemState = {
  isEditable: boolean;
  warranty: boolean;
};

// Define the props for the ItemDetails component
interface Props {
  id: string;
  name: string;
  size: string;
  price: string;
  category: string;
  selectedId: string | null; // ID of the currently selected item
  setSelectedId(id: string | null): void; // Function to set the selected item ID
  removeItem(id: string): void; // Function to remove an item by ID
  state: ItemState; // State for the item (warranty and editability)
  setState: (newState: ItemState) => void; // Function to update the item state
  onOpenActionSheet: (id: string) => void; // Function to open the action sheet for a specific item ID
}

const ItemDetails = ({
  id,
  name,
  size,
  price,
  category,
  selectedId,
  setSelectedId,
  removeItem,
  state,
  setState,
  onOpenActionSheet,
}: Props) => {
  // Local state for the item details (name, size, price)
  const [itemName, setItemName] = useState(name);
  const [itemSize, setItemSize] = useState(size);
  const [itemPrice, setItemPrice] = useState(price);

  // Local state for the category dropdown
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(category);

  // Define the category options for the dropdown
  const [items, setItems] = useState([
    {
      label: "Food & Dining",
      value: "Food & Dining",
      containerStyle: styles.blueCategory,
      labelStyle: styles.blueText,
    },
    {
      label: "Electronics",
      value: "Electronics",
      containerStyle: styles.greenCategory,
      labelStyle: styles.greenText,
    },
    {
      label: "Personal Care",
      value: "Personal Care",
      containerStyle: styles.pinkCategory,
      labelStyle: styles.pinkText,
    },
  ]);

  // Local state for the warranty expiration date and notification settings
  const [date, setDate] = useState(new Date(2026, 12, 10));
  const [show, setShow] = useState(false);

  // Handler for when the date is changed in the date picker
  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }

    setShow(false);
  };

  // Format the expiration date for display
  const formattedDate = `${date.toLocaleDateString("en-US", { month: "long" })} ${date.getDate()}, ${date.getFullYear()}`;

  // Local state for the notification date and time
  const [notifyDate, setNotifyDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
  ); // Default to 1 day before expiration
  const [time, setTime] = useState(
    new Date(
      notifyDate.getFullYear(),
      notifyDate.getMonth(),
      notifyDate.getDate(),
      9,
      40,
    ),
  ); // Default to same as notifyDate
  const [showNotify, setShowNotify] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  // Handler for when the notification date or time is changed in the date/time picker
  const onChangeNotify = (event: any, selectedDate?: Date) => {
    if (selectedDate && mode === "date") {
      setNotifyDate(selectedDate);
    }
    if (selectedDate && mode === "time") {
      setTime(selectedDate);
    }

    setShowNotify(false);
  };

  // Function to show the date or time picker based on the current mode
  const showMode = (currentMode: "date" | "time") => {
    setMode(currentMode);
    setShowNotify(true);
  };

  // Handlers to show the date picker or time picker for notifications
  const showDatepicker = () => {
    showMode("date");
  };

  // Handler to show the time picker for notifications
  const showTimepicker = () => {
    showMode("time");
  };

  // Format the notification date and time for display
  const formattedNotifyDate = `${notifyDate.toLocaleDateString("en-US", { month: "long" }).substring(0, 3)} ${notifyDate.getDate()}, ${notifyDate.getFullYear()}`;
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

  // Local state for the notes text and button confirmation status of the warranty details
  const [notesText, setNotesText] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  return (
    // Pressable component to handle selection of the item details card
    <Pressable
      className="w-full"
      onPress={(e) => {
        e.stopPropagation();
        setSelectedId(id);
      }}
    >
      <View
        className={`flex-col justify-between w-full border border-gray-200 mb-4 rounded-lg ${selectedId === id ? "pt-4 pb-4" : ""}`}
      >
        <View className="flex-row justify-between items-center px-3 py-2 pb-2 w-full">
          <View className="flex-col items-start">
            <TextInput
              className={`text-md font-bold ${selectedId === id ? "border border-gray-300 rounded-md px-2 py-1" : "mb-[-20px]"}`}
              value={itemName}
              editable={selectedId === id ? true : false}
              onChangeText={setItemName}
            />
            <TextInput
              className={`text-sm text-gray-400 font-bold ${selectedId === id ? "border border-gray-300 rounded-md px-2 py-1 mt-2" : ""}`}
              value={itemSize}
              editable={selectedId === id ? true : false}
              onChangeText={setItemSize}
            />
          </View>
          <View className="flex-row">
            <View className="flex-col items-end">
              <TextInput
                className={`text-md font-bold mb-[-10px] mt-2 ${selectedId === id ? "border border-gray-300 rounded-md px-2 py-1 mb-2" : ""}`}
                value={itemPrice}
                editable={selectedId === id ? true : false}
                onChangeText={(text) => setItemPrice(text)}
              />

              <View className="mt-4">
                {selectedId === id ? (
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder=""
                    listMode="SCROLLVIEW"
                    style={{
                      width: 120,
                    }}
                    dropDownContainerStyle={{
                      borderColor: "#ccc",
                      borderRadius: 8,
                      position: "relative",
                      zIndex: 1,
                      top: 0,
                      width: 120,
                    }}
                    textStyle={{
                      fontSize: 13,
                    }}
                  />
                ) : (
                  <View
                    style={
                      items.find((item) => item.value === value)?.containerStyle
                    }
                  >
                    <Text
                      style={
                        items.find((item) => item.value === value)?.labelStyle
                      }
                    >
                      {value}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(id)}>
              <Image source={close} className="size-5" />
            </TouchableOpacity>
          </View>
        </View>

        {state.warranty && !state.isEditable && (
          <View className="bg-[#F6C136] px-3 py-4 rounded-b-lg flex-row items-center justify-between">
            <View className="flex-row">
              <Image source={warrantyDetected} className="size-5 mr-1 mt-1" />
              <Text className="text-lg font-bold text-red-600">
                WARRANTY DETECTED
              </Text>
            </View>
            <TouchableOpacity onPress={() => onOpenActionSheet(id)}>
              <Text className="text-black text-md font-semibold">
                +Add Warranty
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {state.warranty && state.isEditable && !confirmed && (
          <View className="flex-col px-5 pb-5">
            <View className="flex-col items-center justify-center pb-4">
              <View className="bg-gray-300 h-1 w-1/2 rounded-lg" />
            </View>
            <View className="flex-row justify-between items-center px-2 py-2">
              <View className="flex-row items-start">
                <Image source={expire} className="size-6 mr-1 mt-1" />
                <Text className="text-black text-xl font-semibold">
                  Expires:
                </Text>
              </View>

              <View className="flex-row items-end">
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

            <View className="flex-row justify-between items-center px-2 py-2">
              <View className="flex-row items-start">
                <Image source={notify} className="size-6 mr-1 mt-1" />
                <Text className="text-black text-lg font-semibold">
                  Notify On:
                </Text>
              </View>

              <View className="flex-row items-end">
                <TouchableOpacity
                  onPress={showDatepicker}
                  className="bg-gray-300 rounded-xl h-auto w-auto p-2 items-center justify-center mr-2"
                >
                  <Text className="text-black text-md">
                    {formattedNotifyDate}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={showTimepicker}
                  className="bg-gray-300 rounded-xl h-auto w-auto p-2 items-center justify-center"
                >
                  <Text className="text-black text-md">{formattedTime}</Text>
                </TouchableOpacity>
                {showNotify && (
                  <DateTimePicker
                    value={mode === "date" ? notifyDate : time}
                    mode={mode}
                    onChange={onChangeNotify}
                    display="default"
                    testID="dateTimePicker"
                    is24Hour={true}
                  />
                )}
              </View>
            </View>

            <View className="flex-row justify-between px-2 py-2">
              <View className="flex-row items-start">
                <Image source={notes} className="size-6 mr-1 mt-1" />
                <View className="flex-col justify-center">
                  <Text className="text-black text-lg font-semibold pb-1">
                    Add Notes:
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-2 h-20 w-64"
                    placeholder="Optional..."
                    value={notesText}
                    onChangeText={setNotesText}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-center bg-[#810081] p-2 w-auto rounded-3xl mt-4"
              onPress={() => setConfirmed(true)}
            >
              <Text className="text-white text-lg font-semibold">Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {confirmed && (
          <View className="flex-row items-center justify-between px-4 pb-4">
            <View className="flex-row items-start">
              <Image source={warrantyIcon} className="h-7 w-6 mr-2" />
              <Text className="text-black text-lg font-bold">
                Warranty Expires:
              </Text>
            </View>
            <Text className="text-black text-lg">{`${date.toLocaleDateString("en-US", { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const OCRScreen = () => {
  // Local state for the receipt details (merchant, total amount, date) and item list
  const [merchant, setMerchant] = useState("SuperMart Grocery");
  const [total, setTotal] = useState("Rs. 1696.67");
  const [date, setDate] = useState(new Date(2024, 12, 10));
  const [show, setShow] = useState(false);

  // Local state for the selected item ID, action sheet visibility
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [actionItemId, setActionItemId] = useState<string | null>(null);
  const router = useRouter();

  // Local state for the item states (warranty and editability), and the extracted data list
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>({
    "1": { isEditable: false, warranty: false },
    "2": { isEditable: false, warranty: true },
    "3": { isEditable: false, warranty: false },
    "4": { isEditable: false, warranty: false },
  });

  const [data, setData] = useState([
    {
      id: "1",
      name: "Bananas",
      size: "300g",
      price: "Rs.96.00",
      category: "Food & Dining",
    },
    {
      id: "2",
      name: "Panasonic Batteries",
      size: "4B-Aa",
      price: "Rs.650.00",
      category: "Electronics",
    },
    {
      id: "3",
      name: "Shampoo",
      size: "180ml",
      price: "Rs.750.00",
      category: "Personal Care",
    },
    {
      id: "4",
      name: "Mixed Vegetables",
      size: "250g",
      price: "Rs.200.67",
      category: "Food & Dining",
    },
  ]);

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

  // Local state for the language selection dropdown in the receipt details section
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("english");

  // Define the language options for the dropdown
  const [languageItems, setLanguageItems] = useState([
    { label: "English", value: "english" },
    { label: "Tamil", value: "tamil" },
    { label: "Sinhala", value: "sinhala" },
  ]);

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
        [actionItemId]: { ...prev[actionItemId], isEditable: true },
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
        <View className="flex-1 items-center px-5">
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
                  setState={(newState) => {
                    setItemStates((prev) => ({ ...prev, [item.id]: newState }));
                  }}
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
            <CustomButton
              title="Save to BillVault"
              onPress={() => router.push("/upload/success")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  blueCategory: {
    backgroundColor: "#BFDBFE",
    borderRadius: 12,
    height: 30,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  blueText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#63b3ed",
  },

  greenCategory: {
    backgroundColor: "#BBF7D0",
    borderRadius: 12,
    height: 30,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 10,
  },

  greenText: {
    color: "#4ADE80",
    fontSize: 12,
    fontWeight: "bold",
  },

  pinkCategory: {
    backgroundColor: "#FBCFE8",
    borderRadius: 12,
    height: 30,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 10,
  },

  pinkText: {
    color: "#EC407A",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default OCRScreen;
