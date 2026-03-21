import dateIcon from "@/assets/images/dateIcon.png";
import expire from "@/assets/images/expire.png";
import notes from "@/assets/images/notes.png";
import notify from "@/assets/images/notify.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  onConfirm: () => void;
  onSelectDate: (date: Date) => void;
  expiryDate?: Date;
}

const WarrantyForm = ({ onConfirm, onSelectDate, expiryDate }: Props) => {
  // Local state for the notification settings
  const [show, setShow] = useState(false);

  // Handler for when the date is changed in the date picker
  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      onSelectDate(selectedDate);
    }

    setShow(false);
  };

  // Format the expiration date for display
  const formattedDate = `${expiryDate?.toLocaleDateString("en-US", { month: "long" })} ${expiryDate?.getDate()}, ${expiryDate?.getFullYear()}`;

  // Local state for the notification date and time
  const [notifyDate, setNotifyDate] = useState(
    new Date(
      expiryDate?.getFullYear() || 2025,
      expiryDate?.getMonth() || 12,
      expiryDate?.getDate() || 10 - 1,
    ),
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

  // Local state for the notes text input
  const [notesText, setNotesText] = useState("");

  return (
    <View className="flex-col px-5 pb-5">
      <View className="flex-col items-center justify-center pb-4">
        <View className="bg-gray-300 h-1 w-1/2 rounded-lg" />
      </View>
      <View className="flex-row justify-between items-center px-2 py-2">
        <View className="flex-row items-start">
          <Image source={expire} className="size-6 mr-1 mt-1" />
          <Text className="text-black text-xl font-semibold">Expires:</Text>
        </View>

        <View className="flex-row items-end">
          <Text className="text-md">{formattedDate}</Text>
          <TouchableOpacity onPress={() => setShow(true)}>
            <Image source={dateIcon} className="size-5 ml-2" />
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              value={expiryDate || new Date()}
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
          <Text className="text-black text-lg font-semibold">Notify On:</Text>
        </View>

        <View className="flex-row items-end">
          <TouchableOpacity
            onPress={showDatepicker}
            className="bg-gray-300 rounded-xl h-auto w-auto p-2 items-center justify-center mr-2"
          >
            <Text className="text-black text-md">{formattedNotifyDate}</Text>
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
        onPress={onConfirm}
      >
        <Text className="text-white text-lg font-semibold">Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WarrantyForm;
