import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


const BackButton = ({ color = "#000", size = 28, style = "", title = "" }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, style]}
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back-outline" size={size} color={color} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',},
    button: {
        position: 'absolute',
        top: 22,
        left: 5,
        zIndex: 10,
        fontWeight: '600',
        borderRadius: 20,
        padding: 6,
        opacity: 0.7

    },
    title: {
        position: 'absolute',
        top: 30,
        fontWeight: '700',
        fontSize: 18
    }
});
export default BackButton;