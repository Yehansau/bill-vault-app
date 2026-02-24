import close from "@/assets/images/close.png";
import warrantyIcon from "@/assets/images/warrantyIcon.png";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import WarrantyBadge from "./WarrantyBadge";
import WarrantyForm from "./WarrantyForm";

// Define the type for the item state (dictionary to hold warranty and editability status for each item)
type ItemState = {
  isEditable: boolean;
  warranty: boolean;
  confirmed: boolean;
  expiryDate?: Date;
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
  setState: React.Dispatch<React.SetStateAction<Record<string, ItemState>>>; // Function to update the item state
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

        {state.warranty && !state.isEditable && !state.confirmed && (
          <WarrantyBadge onAddWarranty={() => onOpenActionSheet(id)} />
        )}

        {state.warranty && state.isEditable && !state.confirmed && (
          <WarrantyForm
            onConfirm={() => {
              setState((prev) => ({
                ...prev,
                [id]: {
                  ...prev[id],
                  confirmed: true,
                  isEditable: false,
                },
              }));
            }}
            expiryDate={state.expiryDate}
            onSelectDate={(date) => {
              setState((prev) => ({
                ...prev,
                [id]: {
                  ...prev[id],
                  expiryDate: date,
                },
              }));
            }}
          />
        )}

        {state.confirmed && (
          <View className="flex-row items-center justify-between px-4 pb-4">
            <View className="flex-row items-start">
              <Image source={warrantyIcon} className="h-7 w-6 mr-2" />
              <Text className="text-black text-lg font-bold">
                Warranty Expires:
              </Text>
            </View>
            <Text className="text-black text-lg">{`${state.expiryDate?.toLocaleDateString("en-US", { month: "short" })} ${state.expiryDate?.getDate()}, ${state.expiryDate?.getFullYear()}`}</Text>
          </View>
        )}
      </View>
    </Pressable>
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

export default ItemDetails;
