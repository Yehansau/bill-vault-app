import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import api from "@/services/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BillItem {
  id: string;
  name: string;
  price: string | null;
  category: string;
  warranty_detected: boolean;
}

interface Bill {
  id: string;
  merchant: string;
  bill_date: string | null;
  total_amount: string | null;
  firebase_image_url: string;
  upload_type: string;
  language: string;
  status: string;
  created_at: string;
  items: BillItem[];
}

// ── Info Row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
      }}
    >
      <Text style={{ fontSize: 14, color: "#9CA3AF" }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#1F2937" }}>
        {value}
      </Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function BillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageModal, setImageModal] = useState(false);

  const loadBill = async () => {
    try {
      setError("");
      const res = await api.get(`/bills/${id}/`);
      setBill(res.data as Bill);
    } catch (e: any) {
      setError("Could not load bill details.");
      console.error("Bill detail error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadBill();
  }, [id]);

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
        <Text style={{ marginTop: 12, color: "#9CA3AF" }}>
          Loading bill...
        </Text>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !bill) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          padding: 30,
        }}
      >
        <Text style={{ fontSize: 44, marginBottom: 10 }}>⚠️</Text>
        <Text
          style={{ fontSize: 16, fontWeight: "700", color: "#6B7280", textAlign: "center" }}
        >
          {error || "Bill not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 20,
            backgroundColor: "#944ABC",
            borderRadius: 10,
            paddingHorizontal: 24,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Format values ─────────────────────────────────────────────────────────
  const formattedDate = bill.bill_date
    ? new Date(bill.bill_date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const formattedAmount = bill.total_amount
    ? `Rs. ${parseFloat(bill.total_amount).toFixed(2)}`
    : "Unknown";

  const language =
    bill.language.charAt(0).toUpperCase() + bill.language.slice(1);

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
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#1F2937" }}>
          Bill Details
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Bill image preview ───────────────────────────────────────────── */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              width: "100%",
              height: 220,
              borderRadius: 16,
              backgroundColor: "#F3E8FF",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "#E9D5FF",
            }}
          >
            {bill.firebase_image_url ? (
              <Image
                source={{ uri: bill.firebase_image_url }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ fontSize: 50 }}>🧾</Text>
            )}
          </View>

          {/* View Full Image button */}
          {bill.firebase_image_url ? (
            <TouchableOpacity
              onPress={() => setImageModal(true)}
              style={{
                marginTop: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                backgroundColor: "#F9FAFB",
                borderRadius: 10,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <Text style={{ fontSize: 16 }}>🔍</Text>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}
              >
                View Full Image
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Bill Information ─────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#1F2937",
              marginBottom: 4,
            }}
          >
            Bill Information
          </Text>

          <InfoRow label="Bill Amount" value={formattedAmount} />
          <InfoRow label="Merchant" value={bill.merchant || "Unknown"} />
          <InfoRow label="Date" value={formattedDate} />
          <InfoRow label="Language" value={language} />
          <InfoRow
            label="Type"
            value={
              bill.upload_type.charAt(0).toUpperCase() +
              bill.upload_type.slice(1)
            }
          />
        </View>

        {/* ── Items ───────────────────────────────────────────────────────── */}
        {bill.items && bill.items.length > 0 ? (
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#1F2937",
                marginBottom: 12,
              }}
            >
              Items ({bill.items.length})
            </Text>

            {bill.items.map((item, index) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: index < bill.items.length - 1 ? 1 : 0,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#1F2937",
                    }}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                    {item.category}
                    {item.warranty_detected ? "  •  🛡 Warranty" : ""}
                  </Text>
                </View>
                {item.price ? (
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#944ABC",
                    }}
                  >
                    Rs. {parseFloat(item.price).toFixed(2)}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {/* ── Full Image Modal ─────────────────────────────────────────────────── */}
      <Modal
        visible={imageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.92)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setImageModal(false)}
            style={{
              position: "absolute",
              top: 56,
              right: 20,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>✕</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: bill.firebase_image_url }}
            style={{ width: "95%", height: "80%" }}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}