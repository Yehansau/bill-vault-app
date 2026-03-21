// app/warranty/warranty-detail.tsx

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

import { Warranty } from '../../types/warranty.types';
import { getWarrantyById, deleteWarranty } from '../../services/warrantyService';
import {
  formatDaysRemaining,
  formatDate,
  getStatusColor,
  getStatusText,
} from '../../utils/warrantyCalculations';

export default function WarrantyDetailScreen() {
  const router = useRouter();

  // This reads the 'id' that was passed from warranty-tracker.tsx
  // when the user tapped a warranty card
  const { id } = useLocalSearchParams<{ id: string }>();

  // ========== STATE ==========

  // The warranty data fetched from Firebase
  const [warranty, setWarranty] = useState<Warranty | null>(null);

  // Shows spinner while fetching from Firebase
  const [loading, setLoading] = useState(true);

  // Shows spinner on delete button while deleting
  const [deleting, setDeleting] = useState(false);

  // ========== DATA FETCHING ==========

  const fetchWarranty = async () => {
    try {
      setLoading(true);

      // Use the service function from File 3
      // Pass the id we received from the list screen
      const data = await getWarrantyById(id);
      setWarranty(data);

    } catch (error) {
      console.error('Error fetching warranty details:', error);
      Alert.alert('Error', 'Failed to load warranty details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch when screen loads, or when id changes
  useEffect(() => {
    if (id) {
      fetchWarranty();
    }
  }, [id]);

  // ========== DELETE HANDLER ==========

  const handleDelete = () => {
    // Show a confirmation popup before deleting
    Alert.alert(
      'Delete Warranty',
      `Are you sure you want to delete the warranty for "${warranty?.productName}"? This cannot be undone.`,
      [
        {
          // Cancel button — does nothing
          text: 'Cancel',
          style: 'cancel',
        },
        {
          // Confirm delete button
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);

              // Call the delete function from File 3
              const result = await deleteWarranty(id);

              if (result.success) {
                Alert.alert(
                  'Deleted',
                  'Warranty has been deleted successfully.',
                  [
                    {
                      text: 'OK',
                      // Go back to the list screen after deletion
                      onPress: () => router.back(),
                    },
                  ]
                );
              } else {
                Alert.alert('Error', result.error || 'Failed to delete warranty.');
              }

            } catch (error) {
              console.error('Error deleting warranty:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
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
  // Shown if warranty wasn't found in Firebase (e.g. already deleted)

  if (!warranty) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Warranty Not Found</Text>
        <Text style={styles.errorSubtitle}>
          This warranty may have been deleted or doesn't exist.
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

  // ========== CALCULATE DISPLAY VALUES ==========
  // These use the utility functions from File 2

  const statusColor = getStatusColor(warranty.status);
  const statusText = getStatusText(warranty.status);
  const daysText = formatDaysRemaining(warranty.daysRemaining);
  const purchaseText = formatDate(warranty.purchaseDate);
  const expiryText = formatDate(warranty.expiryDate);

  // ========== MAIN RENDER ==========

  return (
    <View style={styles.container}>

      {/* Header — colour changes based on warranty status */}
      <View style={[styles.header, { backgroundColor: statusColor }]}>

        {/* Back button */}
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Warranty Details</Text>

        {/* Empty view to keep title centered */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Product Image Section */}
        <View style={styles.imageSection}>
          {warranty.productImage ? (
            <Image
              source={{ uri: warranty.productImage }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            // Placeholder if no image was saved
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>📦</Text>
            </View>
          )}
        </View>

        {/* Product Name */}
        <Text style={styles.productName}>{warranty.productName}</Text>

        {/* Status Badge — coloured pill */}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        {/* Days Remaining — large coloured text */}
        <Text style={[styles.daysText, { color: statusColor }]}>
          {daysText}
        </Text>

        {/* Details Card */}
        <View style={styles.detailsSection}>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purchase Date</Text>
            <Text style={styles.detailValue}>{purchaseText}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expiry Date</Text>
            <Text style={styles.detailValue}>{expiryText}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>
              {warranty.warrantyDuration} months
            </Text>
          </View>

          {/* Only show Brand row if it was saved */}
          {warranty.brand && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>{warranty.brand}</Text>
            </View>
          )}

          {/* Only show Serial Number row if it was saved */}
          {warranty.serialNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Serial Number</Text>
              <Text style={styles.detailValue}>{warranty.serialNumber}</Text>
            </View>
          )}

        </View>

        {/* Delete Button */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              // Show spinner while delete is in progress
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteButtonText}>🗑️ Delete Warranty</Text>
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

  // Header — background color is set dynamically based on status
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

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Image
  imageSection: {
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

  // Product name + status
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  statusBadge: {
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

  // Details card
  detailsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '90%',
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

  // Delete button
  actionsSection: {
    width: '90%',
    marginHorizontal: 20,
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

  // Loading state
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

  // Error state
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