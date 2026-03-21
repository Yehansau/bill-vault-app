// app/warranty/warranty-tracker.tsx

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

import { Warranty, WarrantyFilter } from '../../types/warranty.types';
import { getWarranties } from '../../services/warrantyService';
import {
  formatDaysRemaining,
  formatDate,
  getStatusColor,
  getStatusText,
} from '../../utils/warrantyCalculations';

export default function WarrantyTrackerScreen() {
  const router = useRouter();

  // ========== STATE ==========

  // Full list of warranties from Firebase
  const [warranties, setWarranties] = useState<Warranty[]>([]);

  // Filtered list shown on screen (changes when filter button is pressed)
  const [filteredWarranties, setFilteredWarranties] = useState<Warranty[]>([]);

  // Shows loading spinner while fetching from Firebase
  const [loading, setLoading] = useState(true);

  // Controls the pull-to-refresh spinner
  const [refreshing, setRefreshing] = useState(false);

  // Which filter button is currently active
  const [activeFilter, setActiveFilter] = useState<WarrantyFilter>('all');

  // ========== DATA FETCHING ==========

  const fetchWarranties = async () => {
    try {
      setLoading(true);

      // Call the service function we created in File 3
      const data = await getWarranties();

      // Save full list to state
      setWarranties(data);

      // Apply current filter to new data
      applyFilter(activeFilter, data);

    } catch (error) {
      console.error('Error fetching warranties:', error);
      Alert.alert('Error', 'Failed to load warranties. Please try again.');
    } finally {
      // Always turn off loading, whether success or error
      setLoading(false);
      setRefreshing(false);
    }
  };

  // When user pulls down on the list to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchWarranties();
  };

  // Fetch warranties when screen first loads
  useEffect(() => {
    fetchWarranties();
  }, []);

  // ========== FILTERING ==========

  // Filters the warranty list based on selected status
  // If 'all' is selected, show everything
  // Otherwise only show warranties matching that status
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

  const handleFilterPress = (filter: WarrantyFilter) => {
    applyFilter(filter);
  };

  // ========== NAVIGATION ==========

  // Navigate to warranty-detail.tsx and pass the warranty ID as a param
  // This is adapted for your warranty-detail.tsx file naming
  const handleWarrantyPress = (warrantyId: string) => {
    router.push({
      pathname: '/warranty/warranty-detail',
      params: { id: warrantyId },
    });
  };

  // ========== RENDER FUNCTIONS ==========

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
        {/* Left side: Product Image */}
        <View style={styles.imageContainer}>
          {item.productImage ? (
            <Image
              source={{ uri: item.productImage }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            // Show a placeholder box with emoji if no image
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>📦</Text>
            </View>
          )}
        </View>

        {/* Middle: Product Info */}
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

          {/* Coloured status pill */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        {/* Right side: Days remaining */}
        <View style={styles.daysContainer}>
          <Text style={[styles.daysText, { color: statusColor }]}>
            {daysText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButtons = () => {
    const filters: { key: WarrantyFilter; label: string }[] = [
      { key: 'all', label: 'All' },
      { key: 'active', label: 'Active' },
      { key: 'expiring_soon', label: 'Expiring' },
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

  // ========== LOADING STATE ==========

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading warranties...</Text>
      </View>
    );
  }

  // ========== MAIN RENDER ==========

  return (
    <View style={styles.container}>

      {/* Top header bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Warranty Tracker</Text>
        <Text style={styles.headerSubtitle}>
          {warranties.length} {warranties.length === 1 ? 'warranty' : 'warranties'} total
        </Text>
      </View>

      {/* Filter buttons row */}
      {renderFilterButtons()}

      {/* Scrollable warranty list */}
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

  // Purple header at top
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

  // Filter buttons row
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

  // List padding
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Warranty card
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

  // Empty state
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
});