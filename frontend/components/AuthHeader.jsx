import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AuthHeader = ({ title, subtitle }) => {
    return (
        <View style={styles.container}>

            <Text style={styles.title}>{title}</Text>

            <Text style={styles.subtitle}>{subtitle}</Text>
            <View style={styles.loginRow}>
                <Text style={styles.sign}>Do you already have an account?</Text>
                <Text style={styles.loginbtn} onPress={() => router.push("./login")}>Log in</Text>
            </View>

        </View>
    );
};

export default AuthHeader;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 90,
        marginBottom: 28,
        paddingHorizontal: 24,
    },
    loginRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18
    },
    logo: {
        width: 64,
        height: 64,
        marginBottom: 14,
        resizeMode: "contain",
    },
    step: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6C63FF",
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
        letterSpacing: 0.3,
    },

    subtitle: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 22,
        maxWidth: 280,
    },
    sign: {
        fontSize: 10,
        color: "#757575",
        textAlign: "center"
    },
    loginbtn: {
        fontSize: 10,
        color: "#6C63FF",
        fontWeight: "600",
    }
});

