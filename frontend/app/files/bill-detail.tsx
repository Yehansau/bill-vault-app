import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
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
  payment_method?: string;
  items: BillItem[];
}

// ── Info Row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isProcessed = status?.toLowerCase() === "processed";
  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: isProcessed ? "#D1FAE5" : "#FEF3C7" },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          { backgroundColor: isProcessed ? "#10B981" : "#F59E0B" },
        ]}
      />
      <Text
        style={[
          styles.statusText,
          { color: isProcessed ? "#065F46" : "#92400E" },
        ]}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Text>
    </View>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
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
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#944ABC" />
          <Text style={styles.loadingText}>Loading bill details...</Text>
        </View>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !bill) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error || "Bill not found"}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Back</Text>
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

  const uploadType =
    bill.upload_type.charAt(0).toUpperCase() + bill.upload_type.slice(1);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details</Text>
        {bill.status ? (
          <StatusBadge status={bill.status} />
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Bill Image Preview ───────────────────────────────────────────── */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => bill.firebase_image_url && setImageModal(true)}
            style={styles.imageContainer}
          >
            {bill.firebase_image_url ? (
              <>
                <Image
                  source={{ uri: bill.firebase_image_url }}
                  style={styles.billImage}
                  resizeMode="contain"
                />
                {/* Subtle gradient overlay at bottom */}
                <View style={styles.imageOverlay} />
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderEmoji}>🧾</Text>
                <Text style={styles.imagePlaceholderText}>No image available</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* View Full Image Button */}
          {bill.firebase_image_url ? (
            <TouchableOpacity
              onPress={() => setImageModal(true)}
              style={styles.viewFullImageBtn}
            >
              <Text style={styles.viewFullImageIcon}>🔍</Text>
              <Text style={styles.viewFullImageText}>View Full Image</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Amount Hero Card ─────────────────────────────────────────────── */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>{formattedAmount}</Text>
          <Text style={styles.merchantName}>{bill.merchant || "Unknown Merchant"}</Text>
        </View>

        {/* ── Bill Information ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <SectionHeader title="Bill Information" />
          <InfoRow label="Bill Amount" value={formattedAmount} />
          <InfoRow label="Merchant" value={bill.merchant || "Unknown"} />
          <InfoRow label="Date" value={formattedDate} />
          <InfoRow label="Language" value={language} />
          <InfoRow label="Payment Method" value={bill.payment_method || uploadType} />
        </View>

        {/* ── Items ───────────────────────────────────────────────────────── */}
        {bill.items && bill.items.length > 0 ? (
          <View style={styles.card}>
            <SectionHeader title={`Items (${bill.items.length})`} />

            {bill.items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.itemRow,
                  index < bill.items.length - 1 && styles.itemRowBorder,
                ]}
              >
                <View style={styles.itemLeft}>
                  <View style={styles.itemDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                      {item.warranty_detected && (
                        <View style={styles.warrantyBadge}>
                          <Text style={styles.warrantyText}>🛡 Warranty</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                {item.price ? (
                  <Text style={styles.itemPrice}>
                    Rs. {parseFloat(item.price).toFixed(2)}
                  </Text>
                ) : (
                  <Text style={styles.itemPriceNull}>—</Text>
                )}
              </View>
            ))}

            {/* Total row */}
            {bill.total_amount && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formattedAmount}</Text>
              </View>
            )}
          </View>
        ) : null}

        {/* ── Bottom padding ───────────────────────────────────────────────── */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Full Image Modal ─────────────────────────────────────────────────── */}
      <Modal
        visible={imageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            onPress={() => setImageModal(false)}
            style={styles.modalClose}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: bill.firebase_image_url }}
            style={styles.modalImage}
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={() => setImageModal(false)}
            style={styles.modalDoneBtn}
          >
            <Text style={styles.modalDoneText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  backButton: {
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
  },

  // Status badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Image section
  imageSection: {
    padding: 16,
    paddingBottom: 8,
  },
  imageContainer: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    backgroundColor: "#F3E8FF",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E9D5FF",
    shadowColor: "#944ABC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  billImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(148,74,188,0.04)",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePlaceholderEmoji: { fontSize: 52 },
  imagePlaceholderText: { fontSize: 14, color: "#C4B5D9", fontWeight: "600" },

  viewFullImageBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: "#E9D5FF",
    shadowColor: "#944ABC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  viewFullImageIcon: { fontSize: 16 },
  viewFullImageText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#944ABC",
    letterSpacing: 0.1,
  },

  // Amount Hero Card
  amountCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: "#944ABC",
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#944ABC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  amountLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  merchantName: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    marginTop: 4,
  },

  // Card
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Section header
  sectionHeader: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.2,
    marginBottom: 10,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: "#F3E8FF",
    borderRadius: 2,
    marginBottom: 2,
  },

  // Info row
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F9F5FF",
  },
  infoLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    maxWidth: "60%",
    textAlign: "right",
  },

  // Item row
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F9F5FF",
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 12,
    gap: 10,
  },
  itemDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#944ABC",
    marginTop: 5,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 20,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
    flexWrap: "wrap",
  },
  itemCategory: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  warrantyBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  warrantyText: {
    fontSize: 11,
    color: "#3B82F6",
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#944ABC",
  },
  itemPriceNull: {
    fontSize: 14,
    color: "#D1D5DB",
    fontWeight: "600",
  },

  // Total row
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 14,
    paddingBottom: 10,
    borderTopWidth: 2,
    borderTopColor: "#F3E8FF",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#944ABC",
  },

  // Loading / Error
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F7FA",
    padding: 30,
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 36,
    alignItems: "center",
    gap: 14,
    shadowColor: "#944ABC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  loadingText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  errorEmoji: { fontSize: 52, marginBottom: 12 },
  errorText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: "#944ABC",
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  errorButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.94)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalClose: {
    position: "absolute",
    top: 54,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  modalImage: { width: "95%", height: "78%" },
  modalDoneBtn: {
    position: "absolute",
    bottom: 48,
    backgroundColor: "#944ABC",
    borderRadius: 14,
    paddingHorizontal: 36,
    paddingVertical: 13,
  },
  modalDoneText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});