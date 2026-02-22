import { Tabs } from "expo-router";
import React from "react";

import analytics from "@/assets/images/icons/analytics.png";
import files from "@/assets/images/icons/files.png";
import home from "@/assets/images/icons/home.png";
import iconBg from "@/assets/images/icons/iconBg.png";
import profile from "@/assets/images/icons/profile.png";
import upload from "@/assets/images/icons/upload.png";
import { Image, ImageBackground } from "react-native";

export default function TabLayout() {
  const TabIcon = ({ focused, icon }: any) => {
    const [height, setHeight] = React.useState(0);

    if (focused) {
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
    } else {
      return <Image source={icon} className="size-8" />;
    }
  };

  return (
    <>
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
        <Tabs.Screen
          name="camera"
          options={{
            headerShown: false,
            title: "Camera",
            tabBarIcon: ({ focused }) => (
              <Image source={upload} className="size-10" />
            ),
            tabBarStyle: { display: "none" },
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
    </>
  );
}
