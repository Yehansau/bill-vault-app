import { Tabs } from "expo-router";
import React, { useState } from "react";

import analytics from "@/assets/images/icons/analytics.png";
import files from "@/assets/images/icons/files.png";
import home from "@/assets/images/icons/home.png";
import iconBg from "@/assets/images/icons/iconBg.png";
import profile from "@/assets/images/icons/profile.png";
import { Image, ImageBackground, View } from "react-native";
import UploadFAB from "@/components/home/UploadFAB";

export default function TabLayout() {
  const [fabOpen, setFabOpen] = useState(false);

  const TabIcon = ({ focused, icon }: { focused: boolean; icon: any }) => {
    // When FAB is open, show all tab icons flat (unfocused) — no highlighted tab
    const showFocused = focused && !fabOpen;

    if (showFocused) {
      return (
        <ImageBackground
          source={iconBg}
          className="absolute left-1/2 w-[70px] h-[60px] items-center justify-center"
          style={{
            top: 0,
            transform: [{ translateX: -35 }, { translateY: -38 }],
          }}
        >
          <Image source={icon} className="w-7 h-7 mb-2" />
        </ImageBackground>
      );
    }
    return <Image source={icon} className="size-8" />;
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            top: "20%",
          },
          tabBarStyle: {
            backgroundColor: "#D7CAFA",
            position: "relative",
            borderColor: "#D7CAFA",
            height: 76,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={home} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            headerShown: false,
            title: "Analytics",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={analytics} />
            ),
          }}
        />
        {/*
          Camera tab — renders an invisible placeholder.
          The real button is the UploadFAB overlay below.
          tabBarButton: () => null hides the pressable area so the FAB handles all taps.
        */}
        <Tabs.Screen
          name="camera"
          options={{
            headerShown: false,
            title: "Camera",
            tabBarIcon: () => <View style={{ width: 44, height: 44 }} />,
            tabBarButton: () => <View style={{ flex: 1 }} />,
          }}
        />
        <Tabs.Screen
          name="files"
          options={{
            headerShown: true,
            title: "Files",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={files} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={profile} />
            ),
          }}
        />
      </Tabs>

      {/* UploadFAB floats above the centre of the tab bar */}
      <UploadFAB onOpenChange={setFabOpen} />
    </View>
  );
}