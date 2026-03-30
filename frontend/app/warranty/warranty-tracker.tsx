// app/warranty/warranty-tracker.tsx

/**
 * ============================================================================
 * WARRANTY TRACKER LIST SCREEN
 * ============================================================================
 * 
 * Main warranty list view showing all user's warranties.
 * 
 * Features:
 * - Displays all warranties in scrollable list
 * - Filter by status (All, Active, Expiring Soon, Expired)
 * - Color-coded status badges
 * - Pull-to-refresh
 * - Navigate to detail screen on card tap
 * 
 * @author BillVault Team - Warranty Tracker Module
 * @date 2025-01-01
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

// Import types and services
import { Warranty, WarrantyFilter } from '../../types/warranty.types';
import { getWarranties } from '../../services/warrantyService';
import {
  formatDaysRemaining,
  formatDate,
  getStatusColor,
  getStatusText,
} from '../../utils/warrantyCalculations';

/**
 * Warranty Tracker Screen Component
 */
export default function WarrantyTrackerScreen() {
  const router = useRouter();

  // ========== STATE ==========
  
  /** All warranties fetched from Firestore */
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  
  /** Filtered warranties based on active filter */
  const [filteredWarranties, setFilteredWarranties] = useState<Warranty[]>([]);
  
  /** Loading state for initial data fetch */
  const [loading, setLoading] = useState(true);
  
  /** Loading state for pull-to-refresh */
  const [refreshing, setRefreshing] = useState(false);
  
  /** Currently active filter */
  const [activeFilter, setActiveFilter] = useState<WarrantyFilter>('all');

  // ========== DATA FETCHING ==========
  
  /**
   * Fetch all warranties from Firestore
   */
  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const data = await getWarranties();
      setWarranties(data);
      applyFilter(activeFilter, data);
    } catch (error) {
      console.error('Error fetching warranties:', error);
      Alert.alert('Error', 'Failed to load warranties');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Pull-to-refresh handler
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchWarranties();
  };

  /**
   * Load warranties on component mount
   */
  useEffect(() => {
    fetchWarranties();
  }, []);

  // ========== FILTERING ==========

  /**
   * Apply filter to warranty list
   * 
   * @param filter - Filter type to apply
   * @param data - Optional warranty data (uses state if not provided)
   */
  const applyFilter = (filter: WarrantyFilter, data?: Warranty[]) => {
    const warrantyList = data || warranties;

    if (filter === 'all') {
      setFilteredWarranties(warrantyList);
    } else {
      const filtered = warrantyList.filter((w) => w.status === filter);
      setFilteredWarranties(filtered);
    }

    setActiveFilter(filter);
  };

  /**
   * Handle filter button press
   */
  const handleFilterPress = (filter: WarrantyFilter) => {
    applyFilter(filter);
  };

  // ========== NAVIGATION ==========

  /**
   * Navigate to warranty detail screen
   * 
   * @param warrantyId - Firestore document ID
   */
  const handleWarrantyPress = (warrantyId: string) => {
    router.push(`/warranty/${warrantyId}` as any);
  };

  // ========== RENDER FUNCTIONS ==========

  /**
   * Render individual warranty card
   */
  const renderWarrantyCard = ({ item }: { item: Warranty }) => {
    const statusColor = getStatusColor(item.status);
    const statusText = getStatusText(item.status);
    const daysText = formatDaysRemaining(item.daysRemaining);
    const expiryText = formatDate(item.expiryDate);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleWarrantyPress(item.id)}
        activeOpacity={0.7}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {item.productImage ? (
            <Image
              source={{ uri: item.productImage }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>📦</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.productName}
          </Text>

          <Text style={styles.purchaseDate}>
            Purchased: {formatDate(item.purchaseDate)}
          </Text>

          <Text style={styles.expiryDate}>
            Expiring: {expiryText}
          </Text>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        {/* Days Remaining */}
        <View style={styles.daysContainer}>
          <Text style={[styles.daysText, { color: statusColor }]}>
            {daysText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Render filter buttons
   */
  const renderFilterButtons = () => {
    const filters: { key: WarrantyFilter; label: string }[] = [
      { key: 'all', label: 'All' },
      { key: 'active', label: 'Active' },
      { key: 'expiring_soon', label: 'Expiring Soon' },
      { key: 'expired', label: 'Expired' },
    ];

    return (
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              activeFilter === filter.key && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterPress(filter.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === filter.key && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📋</Text>
      <Text style={styles.emptyTitle}>No Warranties Found</Text>
      <Text style={styles.emptySubtitle}>
        {activeFilter === 'all'
          ? 'Scan a warranty card to get started!'
          : `No ${activeFilter.replace('_', ' ')} warranties`}
      </Text>
    </View>
  );

  // ========== MAIN RENDER ==========

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading warranties...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Warranty Tracker</Text>
        <Text style={styles.headerSubtitle}>
          {warranties.length} {warranties.length === 1 ? 'warranty' : 'warranties'} total
        </Text>
      </View>

      {/* Filter Buttons */}
      {renderFilterButtons()}

      {/* Warranty List */}
      <FlatList
        data={filteredWarranties}
        renderItem={renderWarrantyCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7C3AED']}
            tintColor="#7C3AED"
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
    backgroundColor: '#7C3AED',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E9D5FF',
  },

  // Filter Buttons
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Warranty Card
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  purchaseDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  daysContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  daysText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Loading
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
});