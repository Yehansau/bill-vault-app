import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import api from "@/services/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 16 * 2 - 12) / 2;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Bill {
    id: string;
    merchant: string;
    bill_date: string | null;
    total_amount: string | null;
    firebase_image_url: string;
    upload_type: string; // "image" | "pdf"
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

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
    value,
    label,
    accent,
}: {
    value: string;
    label: string;
    accent?: boolean;
}) {
    return (
        <View style={[styles.statCard, accent && styles.statCardAccent]}>
            <Text style={[styles.statValue, accent && styles.statValueAccent]}>
                {value}
            </Text>
            <Text style={[styles.statLabel, accent && styles.statLabelAccent]}>
                {label}
            </Text>
        </View>
    );
}

// ── Bill Card ─────────────────────────────────────────────────────────────────
function BillCard({ bill }: { bill: Bill }) {
    const isPdf = bill.upload_type === "pdf";

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/files/bill-detail" as any,
                    params: { id: bill.id },
                })
            }
            style={styles.billCard}
            activeOpacity={0.82}
        >
            {/* Thumbnail */}
            <View style={styles.billThumb}>
                {isPdf ? (
                    <View style={styles.pdfThumb}>
                        <View style={styles.pdfIconWrap}>
                            <Text style={styles.pdfIconText}>PDF</Text>
                        </View>
                    </View>
                ) : bill.firebase_image_url ? (
                    <Image
                        source={{ uri: bill.firebase_image_url }}
                        style={styles.billThumbImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.billThumbPlaceholder}>
                        <Text style={{ fontSize: 30 }}>🧾</Text>
                    </View>
                )}
            </View>

            {/* Info */}
            <View style={styles.billInfo}>
                <Text style={styles.billMerchant} numberOfLines={2}>
                    {bill.merchant || "Unknown Merchant"}
                </Text>
                <Text style={styles.billTime}>{timeAgo(bill.created_at)}</Text>
            </View>
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

    // ── Computed stats ────────────────────────────────────────────────────────
    const totalFiles = bills.length;
    const mbUsed = (bills.length * 0.3).toFixed(1);
    const thisWeek = bills.filter((b) => {
        const diff =
            (new Date().getTime() - new Date(b.created_at).getTime()) /
            (1000 * 60 * 60 * 24);
        return diff <= 7;
    }).length;

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <ActivityIndicator size="large" color="#944ABC" />
                <Text style={styles.loadingText}>Loading {category}...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* ── Header ──────────────────────────────────────────────────────── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{category}</Text>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.iconBtnText}>≡</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Text style={styles.iconBtnText}>⊽</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Stats Row ───────────────────────────────────────────────────── */}
            <View style={styles.statsRow}>
                <StatCard value={String(totalFiles)} label="Total Files" accent />
                <StatCard value={mbUsed} label="MB Used" />
                <StatCard value={String(thisWeek)} label="This Week" />
            </View>

            {/* ── Error Banner ─────────────────────────────────────────────────── */}
            {error ? (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{error}</Text>
                </View>
            ) : null}

            {/* ── Bills Grid ──────────────────────────────────────────────────── */}
            {bills.length === 0 && !error ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>🧾</Text>
                    <Text style={styles.emptyTitle}>No bills in {category}</Text>
                    <Text style={styles.emptySubtitle}>
                        Upload a bill and it will appear here
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={bills}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.gridContent}
                    columnWrapperStyle={styles.gridRow}
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

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F8F7FA",
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: 52,
        paddingBottom: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#F0ECF7",
        shadowColor: "#944ABC",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#F3E8FF",
        alignItems: "center",
        justifyContent: "center",
    },
    backArrow: {
        fontSize: 18,
        color: "#944ABC",
        fontWeight: "700",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1F2937",
        letterSpacing: -0.3,
        flex: 1,
        textAlign: "center",
    },
    headerActions: {
        flexDirection: "row",
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#F3E8FF",
        alignItems: "center",
        justifyContent: "center",
    },
    iconBtnText: {
        fontSize: 17,
        color: "#944ABC",
        fontWeight: "700",
    },

    // Stats
    statsRow: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    statCardAccent: {
        backgroundColor: "#944ABC",
    },
    statValue: {
        fontSize: 22,
        fontWeight: "900",
        color: "#1F2937",
        letterSpacing: -0.5,
    },
    statValueAccent: {
        color: "#fff",
    },
    statLabel: {
        fontSize: 11,
        color: "#9CA3AF",
        fontWeight: "600",
        marginTop: 2,
        textAlign: "center",
    },
    statLabelAccent: {
        color: "rgba(255,255,255,0.75)",
    },

    // Grid
    gridContent: {
        padding: 16,
        paddingBottom: 40,
    },
    gridRow: {
        justifyContent: "space-between",
        marginBottom: 12,
    },

    // Bill Card
    billCard: {
        width: CARD_WIDTH,
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#944ABC",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    billThumb: {
        width: "100%",
        height: 120,
        backgroundColor: "#F3E8FF",
    },
    billThumbImage: {
        width: "100%",
        height: "100%",
    },
    billThumbPlaceholder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3E8FF",
    },

    // PDF
    pdfThumb: {
        flex: 1,
        backgroundColor: "#F3E8FF",
        alignItems: "center",
        justifyContent: "center",
    },
    pdfIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 13,
        backgroundColor: "#944ABC",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#944ABC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 5,
    },
    pdfIconText: {
        fontSize: 12,
        fontWeight: "900",
        color: "#fff",
        letterSpacing: 0.5,
    },

    // Bill info
    billInfo: {
        padding: 10,
        paddingTop: 8,
    },
    billMerchant: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F2937",
        lineHeight: 18,
    },
    billTime: {
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 3,
        fontWeight: "500",
    },

    // Error
    errorBanner: {
        marginHorizontal: 16,
        marginBottom: 4,
        backgroundColor: "#FEF2F2",
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: "#FCA5A5",
    },
    errorBannerText: {
        color: "#DC2626",
        fontSize: 13,
        fontWeight: "500",
    },

    // Empty
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        gap: 8,
    },
    emptyEmoji: { fontSize: 48 },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#6B7280",
    },
    emptySubtitle: {
        fontSize: 13,
        color: "#9CA3AF",
        textAlign: "center",
        lineHeight: 20,
    },

    // Loading
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F8F7FA",
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: "#9CA3AF",
        fontWeight: "600",
    },
});