// components/home/WarrantyTrackerCard.tsx

/**
 * ============================================================================
 * WARRANTY TRACKER PREVIEW CARD
 * ============================================================================
 * 
 * Small warranty card displayed in HomeScreen preview section.
 * Shows essential warranty info in a compact, scannable format.
 */

import { View, Text, Image, StyleSheet } from "react-native";

// Import types and utilities
import { Warranty } from "../../types/warranty.types";
import {
  formatDaysRemaining,
  formatDate,
  getStatusColor,
} from "../../utils/warrantyCalculations";

/**
 * Props for WarrantyCard component
 */
interface WarrantyCardProps {
  /** Warranty data to display */
  warranty: Warranty;
}

/**
 * Warranty Preview Card Component
 * 
 * Displays warranty in compact card format for HomeScreen.
 * Used in horizontal scroll list showing first 4 warranties.
 * 
 * @param warranty - Warranty object with all details
 */
export default function WarrantyCard({ warranty }: WarrantyCardProps) {
  // Calculate display values
  const statusColor = getStatusColor(warranty.status);
  const daysText = formatDaysRemaining(warranty.daysRemaining);
  const expiryText = formatDate(warranty.expiryDate);

  return (
    <View style={styles.card}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {warranty.productImage ? (
          <Image
            source={{ uri: warranty.productImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.productImage, styles.imagePlaceholder]}>
            <Text style={styles.placeholderEmoji}>📦</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={1}>
          {warranty.productName}
        </Text>
        
        <Text style={styles.expiryDate}>
          Expiring: {expiryText}
        </Text>
        
        {/* Days Remaining Badge */}
        <View style={[styles.daysBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.daysText}>{daysText}</Text>
        </View>
      </View>
    </View>
  );
}

// ========== STYLES ==========

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  imagePlaceholder: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 28,
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
  },
  daysBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  daysText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});