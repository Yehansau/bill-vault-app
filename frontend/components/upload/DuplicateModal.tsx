import CustomButton from "@/components/ui/CustomButton";
import { Image, ImageStyle, Modal, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

// Matches the Bill shape returned by BillSerializer
export type Bill = {
  id: string;
  upload_type: "receipt" | "warranty";
  language: string;
  merchant: string;
  bill_date: string | null;
  total_amount: string | null;
  firebase_image_url: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
};

interface DuplicateModalProps {
  visible: boolean;
  existingBill: Bill | null;
  onViewExisting: () => void;
  onUploadAnyway: () => void;
  onCancel: () => void;
}

// Converts ISO date string to a readable format e.g. "Mar 2, 2026"
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Converts ISO date string to relative time e.g. "2 days ago"
const timeAgo = (isoString: string): string => {
  const now = new Date();
  const past = new Date(isoString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return formatDate(isoString);
};

export default function DuplicateModal({
  visible,
  existingBill,
  onViewExisting,
  onUploadAnyway,
  onCancel,
}: DuplicateModalProps) {
  if (!existingBill) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* Dark backdrop */}
      <View style={styles.backdrop}>
        <View style={styles.card}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Duplicate Bill Detected</Text>
            <Text style={styles.subtitle}>
              You've already uploaded a very similar bill before.
            </Text>
          </View>

          {/* Existing bill preview */}
          <View style={styles.billPreview}>
            {existingBill.firebase_image_url ? (
              <Image
                source={{ uri: existingBill.firebase_image_url }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.thumbnailPlaceholderText}>No Image</Text>
              </View>
            )}

            <View style={styles.billInfo}>
              <Text style={styles.merchantName} numberOfLines={1}>
                {existingBill.merchant || "Unknown Merchant"}
              </Text>
              {existingBill.bill_date && (
                <Text style={styles.billDate}>
                  📅 {formatDate(existingBill.bill_date)}
                </Text>
              )}
              {existingBill.total_amount && (
                <Text style={styles.billAmount}>
                  Rs. {parseFloat(existingBill.total_amount).toLocaleString()}
                </Text>
              )}
              <Text style={styles.uploadedAgo}>
                Uploaded {timeAgo(existingBill.created_at)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Action buttons */}
          <View style={styles.buttons}>
            {/* Primary — view existing */}
            <CustomButton
              title="View Existing Bill"
              onPress={onViewExisting}
              style={styles.primaryButton}
              innerStyle={styles.primaryButtonInner}
              textStyle={styles.primaryButtonText}
            />

            {/* Secondary — upload anyway */}
            <CustomButton
              title="Upload Anyway"
              onPress={onUploadAnyway}
              variant="secondary"
              style={styles.secondaryButton}
              innerStyle={styles.secondaryButtonInner}
              textStyle={styles.secondaryButtonText}
            />

            {/* Cancel — text only */}
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create<{
  backdrop: ViewStyle;
  card: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  billPreview: ViewStyle;
  thumbnail: ImageStyle;
  thumbnailPlaceholder: ViewStyle;
  thumbnailPlaceholderText: TextStyle;
  billInfo: ViewStyle;
  merchantName: TextStyle;
  billDate: TextStyle;
  billAmount: TextStyle;
  uploadedAgo: TextStyle;
  divider: ViewStyle;
  buttons: ViewStyle;
  primaryButton: ViewStyle;
  primaryButtonInner: ViewStyle;
  primaryButtonText: TextStyle;
  secondaryButton: ViewStyle;
  secondaryButtonInner: ViewStyle;
  secondaryButtonText: TextStyle;
  cancelButton: ViewStyle;
  cancelText: TextStyle;
}>({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3B1E54",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  billPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F0FF",
    borderRadius: 12,
    padding: 12,
    gap: 14,
    marginBottom: 20,
  },
  thumbnail: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  thumbnailPlaceholder: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailPlaceholderText: {
    fontSize: 11,
    color: "#999",
  },
  billInfo: {
    flex: 1,
    gap: 4,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  billDate: {
    fontSize: 13,
    color: "#555",
  },
  billAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B1E54",
  },
  uploadedAgo: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  buttons: {
    gap: 10,
  },
  primaryButton: {
    borderRadius: 12,
    width: "100%",
  },
  primaryButtonInner: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 12,
    width: "100%",
    backgroundColor: "#F5F0FF",
    borderWidth: 0,
  },
  secondaryButtonInner: {
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: "#F5F0FF",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B1E54",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 15,
    color: "#999",
    fontWeight: "500",
  },
});