import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    RefreshControl,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import api from "@/services/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Bill {
    id: string;
    merchant: string;
    bill_date: string | null;
    total_amount: string | null;
    firebase_image_url: string;
    created_at: string;
}

// ── Time ago helper ───────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

// ── Bill Card ─────────────────────────────────────────────────────────────────
function BillCard({ bill }: { bill: Bill }) {
    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/files/bill-detail",
                    params: { id: bill.id },
                })
            }
            style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 12,
                width: "47.5%",
                marginBottom: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.07,
                shadowRadius: 6,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#F3F4F6",
            }}
        >
            {/* Bill image preview */}
            <View
                style={{
                    width: "100%",
                    height: 110,
                    borderRadius: 10,
                    backgroundColor: "#F3E8FF",
                    marginBottom: 8,
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {bill.firebase_image_url ? (
                    <Image
                        source={{ uri: bill.firebase_image_url }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                ) : (
                    <Text style={{ fontSize: 32 }}>🧾</Text>
                )}
            </View>

            {/* Merchant name */}
            <Text
                style={{
                    fontWeight: "700",
                    fontSize: 13,
                    color: "#1F2937",
                    marginBottom: 2,
                }}
                numberOfLines={2}
            >
                {bill.merchant || "Unknown Merchant"}
            </Text>

            {/* Time ago */}
            <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                {timeAgo(bill.created_at)}
            </Text>
        </TouchableOpacity>
    );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function FolderScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadBills = async () => {
        try {
            setError("");
            const res = await api.get(`/bills/folders/${category}/`);
            setBills(res.data as Bill[]);
        } catch (e: any) {
            setError("Could not load bills. Pull down to retry.");
            console.error("Folder screen error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (category) loadBills();
    }, [category]);

    const onRefresh = () => {
        setRefreshing(true);
        loadBills();
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                }}
            >
                <ActivityIndicator size="large" color="#944ABC" />
                <Text style={{ marginTop: 12, color: "#9CA3AF", fontSize: 14 }}>
                    Loading {category}...
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>

            {/* ── Header ──────────────────────────────────────────────────────────── */}
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingTop: 56,
                    paddingBottom: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F3F4F6",
                }}
            >
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ fontSize: 22, color: "#1F2937" }}>←</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: "800", color: "#1F2937" }}>
                    {category}
                </Text>
            </View>

            {/* ── Stats bar ───────────────────────────────────────────────────────── */}
            <View
                style={{
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    gap: 24,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F3F4F6",
                }}
            >
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 22, fontWeight: "800", color: "#1F2937" }}>
                        {bills.length}
                    </Text>
                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>Total Files</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 22, fontWeight: "800", color: "#1F2937" }}>
                        {(bills.length * 0.3).toFixed(1)}
                    </Text>
                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>MB Used</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text style={{ fontSize: 22, fontWeight: "800", color: "#944ABC" }}>
                        {
                            bills.filter((b) => {
                                const diff =
                                    (new Date().getTime() - new Date(b.created_at).getTime()) /
                                    (1000 * 60 * 60 * 24);
                                return diff <= 7;
                            }).length
                        }
                    </Text>
                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>This Week</Text>
                </View>
            </View>

            {/* ── Error ───────────────────────────────────────────────────────────── */}
            {error ? (
                <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                    <View
                        style={{
                            backgroundColor: "#FEF2F2",
                            borderRadius: 10,
                            padding: 12,
                            borderWidth: 1,
                            borderColor: "#FCA5A5",
                        }}
                    >
                        <Text style={{ color: "#DC2626", fontSize: 13 }}>{error}</Text>
                    </View>
                </View>
            ) : null}

            {/* ── Bills grid ──────────────────────────────────────────────────────── */}
            {bills.length === 0 && !error ? (
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 40,
                    }}
                >
                    <Text style={{ fontSize: 44, marginBottom: 10 }}>🧾</Text>
                    <Text
                        style={{ fontSize: 16, fontWeight: "700", color: "#6B7280" }}
                    >
                        No bills in {category}
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: "#9CA3AF",
                            marginTop: 4,
                            textAlign: "center",
                        }}
                    >
                        Upload a bill and it will appear here
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={bills}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{
                        padding: 16,
                        gap: 0,
                    }}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    renderItem={({ item }) => <BillCard bill={item} />}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#944ABC"
                            colors={["#944ABC"]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}