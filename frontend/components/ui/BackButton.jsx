import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const BackButton = ({ color = "#000", size = 28, style = "" }) => {
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={() => router.back()}
        >
            <Ionicons name="arrow-back" size={size} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 30,
        left: 5,
        zIndex: 10,
        borderRadius: 20,
        padding: 6,
        opacity: 0.8,   
    }
});
export default BackButton;