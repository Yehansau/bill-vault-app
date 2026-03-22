import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import api from "@/services/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Folder {
  name: string;
  count: number;
  last_updated: string | null;
}

interface StorageStats {
  used_mb: number;
  total_mb: number;
  used_percent: number;
  bill_count: number;
  this_week: number;
}

// ── Folder colors ─────────────────────────────────────────────────────────────
const FOLDER_COLORS: Record<string, string> = {
  Groceries: "#F59E0B",
  Electronics: "#8B5CF6",
  Restaurants: "#EF4444",
  "Bank Statements": "#3B82F6",
  Clothing: "#EC4899",
  Healthcare: "#10B981",
  Transport: "#F97316",
  Others: "#6B7280",
};

function getFolderColor(name: string): string {
  return FOLDER_COLORS[name] || "#944ABC";
}

// ── Storage Donut ─────────────────────────────────────────────────────────────
function StorageDonut({
  percent,
  usedGb,
  freeGb,
}: {
  percent: number;
  usedGb: string;
  freeGb: string;
}) {
  const size = 170;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={{ alignItems: "center" }}>
      {/* Used / Free labels on left and right */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingHorizontal: 10,
          marginBottom: 6,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#1F2937" }}>
            {usedGb} GB
          </Text>
          <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Used</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#1F2937" }}>
            {freeGb} GB
          </Text>
          <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Free</Text>
        </View>
      </View>

      {/* Donut chart */}
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg width={size} height={size} style={{ position: "absolute" }}>
          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E9D5FF"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Filled arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#944ABC"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Center text */}
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 30, fontWeight: "800", color: "#3B0856" }}>
            {percent}%
          </Text>
          <Text style={{ fontSize: 13, color: "#9CA3AF" }}>used</Text>
        </View>
      </View>
    </View>
  );
}

// ── Folder Card ───────────────────────────────────────────────────────────────
function FolderCard({ folder }: { folder: Folder }) {
  const color = getFolderColor(folder.name);

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(tabs)/files",
          params: { category: folder.name },
        })
      }
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
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
      {/* Folder icon */}
      <View style={{ marginBottom: 10 }}>
        {/* Tab on top of folder */}
        <View
          style={{
            width: 18,
            height: 6,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 8,
            backgroundColor: color,
            marginLeft: 3,
            marginBottom: -1,
            zIndex: 1,
          }}
        />
        {/* Folder body */}
        <View
          style={{
            width: 44,
            height: 34,
            borderRadius: 6,
            borderTopLeftRadius: 2,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <View
            style={{
              width: 30,
              height: 3,
              backgroundColor: "rgba(255,255,255,0.45)",
              borderRadius: 2,
            }}
          />
          <View
            style={{
              width: 24,
              height: 3,
              backgroundColor: "rgba(255,255,255,0.25)",
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      {/* Name */}
      <Text
        style={{
          fontWeight: "700",
          fontSize: 13,
          color: "#1F2937",
          marginBottom: 2,
        }}
        numberOfLines={1}
      >
        {folder.name}
      </Text>

      {/* Item count */}
      <Text style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>
        {folder.count} {folder.count === 1 ? "item" : "items"}
      </Text>

      {/* Toggle icons row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        {/* Active toggle */}
        <View
          style={{
            width: 30,
            height: 16,
            borderRadius: 8,
            backgroundColor: color,
            alignItems: "flex-end",
            justifyContent: "center",
            paddingRight: 2,
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#fff",
            }}
          />
        </View>
        {/* Inactive toggles */}
        {[0, 1].map((i) => (
          <View
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: color + "25",
              borderWidth: 1,
              borderColor: color + "50",
            }}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function FilesScreen() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [storage, setStorage] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      const [foldersRes, storageRes] = await Promise.all([
        api.get("/bills/folders/"),
        api.get("/bills/storage/"),
      ]);
      setFolders(foldersRes.data as Folder[]);
      setStorage(storageRes.data as StorageStats);
    } catch (e: any) {
      setError("Could not load files. Pull down to retry.");
      console.error("Files screen error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // ── Loading state ─────────────────────────────────────────────────────────
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
          Loading files...
        </Text>
      </View>
    );
  }

  // ── Compute values ────────────────────────────────────────────────────────
  const usedMb = storage?.used_mb ?? 0;
  const totalMb = storage?.total_mb ?? 20480;
  const usedGbNum = usedMb / 1024;
  const usedGb = usedGbNum < 1 ? usedGbNum.toFixed(1) : Math.round(usedGbNum).toString();
  const freeGb = Math.round((totalMb - usedMb) / 1024).toString();
  const percent = Math.round(storage?.used_percent ?? 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#944ABC"
          colors={["#944ABC"]}
        />
      }
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 22, color: "#1F2937" }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1F2937" }}>
          My Bills
        </Text>
      </View>

      {/* ── Storage Donut ─────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 30, marginBottom: 16 }}>
        <StorageDonut percent={percent} usedGb={usedGb} freeGb={freeGb} />
      </View>

      {/* ── Upgrade Banner ────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
        <TouchableOpacity
          style={{ borderRadius: 14, overflow: "hidden" }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#C084FC", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              paddingHorizontal: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff" }}>↑</Text>
              </View>
              <View>
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
                >
                  Unlimited storage
                </Text>
                <Text style={{ color: "#E9D5FF", fontSize: 12 }}>
                  Rs. 150.00 / mo
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 7,
              }}
            >
              <Text
                style={{ color: "#7C3AED", fontWeight: "700", fontSize: 13 }}
              >
                Upgrade
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error ? (
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
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

      {/* ── Folders ───────────────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: "#1F2937",
            marginBottom: 14,
          }}
        >
          Folders
        </Text>

        {folders.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              paddingVertical: 50,
              backgroundColor: "#FAFAFA",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#F3E8FF",
            }}
          >
            <Text style={{ fontSize: 44, marginBottom: 10 }}>📂</Text>
            <Text
              style={{ fontSize: 16, fontWeight: "700", color: "#6B7280" }}
            >
              No folders yet
            </Text>
            <Text
              style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}
            >
              Upload your first bill to get started
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {folders.map((folder) => (
              <FolderCard key={folder.name} folder={folder} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}