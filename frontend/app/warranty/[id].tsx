// app/warranty/[id].tsx

/**
 * ============================================================================
 * WARRANTY DETAIL SCREEN
 * ============================================================================
 * 
 * Shows complete details for a single warranty.
 * 
 * Features:
 * - Display all warranty information
 * - Large product image
 * - Delete functionality with confirmation
 * - Back navigation
 * - Color-coded header based on status
 * 
 * @author BillVault Team - Warranty Tracker Module
 * @date 2025-01-01
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import types and services
import { Warranty } from '../../types/warranty.types';
import { getWarrantyById, deleteWarranty } from '../../services/warrantyService';
import {
  formatDaysRemaining,
  formatDate,
  getStatusColor,
  getStatusText,
} from '../../utils/warrantyCalculations';

/**
 * Warranty Detail Screen Component
 */
export default function WarrantyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // ========== STATE ==========
  
  /** Warranty data fetched from Firestore */
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  
  /** Loading state for initial fetch */
  const [loading, setLoading] = useState(true);
  
  /** Loading state for delete operation */
  const [deleting, setDeleting] = useState(false);

  // ========== DATA FETCHING ==========

  /**
   * Fetch warranty details by ID
   */
  const fetchWarranty = async () => {
    try {
      setLoading(true);
      const data = await getWarrantyById(id);
      setWarranty(data);
    } catch (error) {
      console.error('Error fetching warranty:', error);
      Alert.alert('Error', 'Failed to load warranty details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchWarranty();
    }
  }, [id]);

  // ========== DELETE HANDLER ==========

  /**
   * Handle warranty deletion with confirmation dialog
   */
  const handleDelete = () => {
    Alert.alert(
      'Delete Warranty',
      `Are you sure you want to delete the warranty for "${warranty?.productName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              const result = await deleteWarranty(id);
              
              if (result.success) {
                Alert.alert('Success', 'Warranty deleted successfully');
                router.back();
              } else {
                Alert.alert('Error', result.error || 'Failed to delete warranty');
              }
            } catch (error) {
              console.error('Error deleting warranty:', error);
              Alert.alert('Error', 'Failed to delete warranty');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  // ========== LOADING STATE ==========

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  // ========== ERROR STATE ==========

  if (!warranty) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Warranty Not Found</Text>
        <Text style={styles.errorSubtitle}>
          This warranty may have been deleted.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ========== CALCULATE VALUES ==========

  const statusColor = getStatusColor(warranty.status);
  const statusText = getStatusText(warranty.status);
  const daysText = formatDaysRemaining(warranty.daysRemaining);
  const purchaseText = formatDate(warranty.purchaseDate);
  const expiryText = formatDate(warranty.expiryDate);

  // ========== MAIN RENDER ==========

  return (
    <View style={styles.container}>
      {/* Header with status color */}
      <View style={[styles.header, { backgroundColor: statusColor }]}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Warranty Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageSection}>
          {warranty.productImage ? (
            <Image
              source={{ uri: warranty.productImage }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>📦</Text>
            </View>
          )}
        </View>

        {/* Product Name */}
        <Text style={styles.productName}>{warranty.productName}</Text>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        {/* Days Remaining */}
        <Text style={[styles.daysText, { color: statusColor }]}>
          {daysText}
        </Text>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Purchase Date */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purchase Date</Text>
            <Text style={styles.detailValue}>{purchaseText}</Text>
          </View>

          {/* Expiry Date */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expiry Date</Text>
            <Text style={styles.detailValue}>{expiryText}</Text>
          </View>

          {/* Warranty Duration */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Warranty Duration</Text>
            <Text style={styles.detailValue}>
              {warranty.warrantyDuration} months
            </Text>
          </View>

          {/* Brand (if exists) */}
          {warranty.brand && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>{warranty.brand}</Text>
            </View>
          )}

          {/* Serial Number (if exists) */}
          {warranty.serialNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Serial Number</Text>
              <Text style={styles.detailValue}>{warranty.serialNumber}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete Warranty</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ========== STYLES ==========

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Image Section
  imageSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },

  // Product Info
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  daysText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },

  // Details Section
  detailsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },

  // Actions
  actionsSection: {
    paddingHorizontal: 20,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 40,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});