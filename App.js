import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { PRODUCTS, CATEGORIES } from './data/products';
import ProductCard from './components/ProductCard';
import SearchBar from './components/SearchBar';

// ─── Sort options ───────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { key: 'default',    label: 'Default' },
  { key: 'price_asc',  label: '💸 Termurah' },
  { key: 'price_desc', label: '💎 Termahal' },
  { key: 'rating',     label: '⭐ Rating' },
];

// ─── View modes ─────────────────────────────────────────────────────────────
const VIEW_LIST = 'list';
const VIEW_GRID = 'grid';
const VIEW_SECTION = 'section';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatPrice = (price) =>
  'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

function sortProducts(products, sortKey) {
  const arr = [...products];
  if (sortKey === 'price_asc')  return arr.sort((a, b) => a.price - b.price);
  if (sortKey === 'price_desc') return arr.sort((a, b) => b.price - a.price);
  if (sortKey === 'rating')     return arr.sort((a, b) => b.rating - a.rating);
  return arr;
}

function buildSections(products) {
  const map = {};
  products.forEach((p) => {
    if (!map[p.category]) map[p.category] = [];
    map[p.category].push(p);
  });
  return Object.entries(map).map(([title, data]) => ({ title, data }));
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🛒</Text>
      <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
      <Text style={styles.emptyHint}>
        {query
          ? `Tidak ada produk dengan kata kunci "${query}". Coba kata lain!`
          : 'Tidak ada produk dalam kategori ini.'}
      </Text>
    </View>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [search, setSearch]           = useState('');
  const [activeCategory, setCategory] = useState('Semua');
  const [sortKey, setSortKey]         = useState('default');
  const [viewMode, setViewMode]       = useState(VIEW_LIST);
  const [refreshing, setRefreshing]   = useState(false);
  const [products, setProducts]       = useState(PRODUCTS);

  // ── Filter + Search + Sort ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = products;
    if (activeCategory !== 'Semua') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    return sortProducts(result, sortKey);
  }, [products, activeCategory, search, sortKey]);

  const sections = useMemo(() => buildSections(filtered), [filtered]);

  // ── Pull-to-Refresh ───────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate re-fetch: shuffle data
      setProducts([...PRODUCTS].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1200);
  }, []);

  // ── Render item ───────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        item={item}
        isGrid={viewMode === VIEW_GRID}
        onPress={() => {}}
      />
    ),
    [viewMode]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  // ── Header ────────────────────────────────────────────────────────────────
  const Header = (
    <View>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appTitle}>🛍️ ShopList</Text>
          <Text style={styles.appSubtitle}>
            {filtered.length} produk ditemukan
          </Text>
        </View>
        {/* View mode toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === VIEW_LIST && styles.toggleActive]}
            onPress={() => setViewMode(VIEW_LIST)}
          >
            <Text style={styles.toggleIcon}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === VIEW_GRID && styles.toggleActive]}
            onPress={() => setViewMode(VIEW_GRID)}
          >
            <Text style={styles.toggleIcon}>⊞</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === VIEW_SECTION && styles.toggleActive]}
            onPress={() => setViewMode(VIEW_SECTION)}
          >
            <Text style={styles.toggleIcon}>§</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
        placeholder="Cari produk fashion favoritmu..."
      />

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={styles.chipsContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, activeCategory === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortRow}
        contentContainerStyle={styles.chipsContent}
      >
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortBtn, sortKey === opt.key && styles.sortBtnActive]}
            onPress={() => setSortKey(opt.key)}
          >
            <Text
              style={[styles.sortText, sortKey === opt.key && styles.sortTextActive]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // ── SectionList mode ──────────────────────────────────────────────────────
  if (viewMode === VIEW_SECTION) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <ProductCard item={item} isGrid={false} onPress={() => {}} />
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>{section.data.length} item</Text>
            </View>
          )}
          ListHeaderComponent={Header}
          ListEmptyComponent={<EmptyState query={search} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#E63946']}
              tintColor="#E63946"
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
        />
      </SafeAreaView>
    );
  }

  // ── FlatList mode (list / grid) ───────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={viewMode === VIEW_GRID ? 2 : 1}
        key={viewMode} // force re-render on numColumns change
        ListHeaderComponent={Header}
        ListEmptyComponent={<EmptyState query={search} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#E63946']}
            tintColor="#E63946"
          />
        }
        columnWrapperStyle={viewMode === VIEW_GRID ? styles.gridRow : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },

  // App Header
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginTop: 2,
  },

  // View Toggle
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: '#E63946',
  },
  toggleIcon: {
    fontSize: 14,
  },

  // Category Chips
  chipsRow: {
    marginBottom: 6,
  },
  chipsContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  chipActive: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // Sort buttons
  sortRow: {
    marginBottom: 12,
  },
  sortBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  sortBtnActive: {
    backgroundColor: '#1A1A2E',
    borderColor: '#1A1A2E',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // List
  listContent: {
    paddingBottom: 30,
  },
  gridRow: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8FF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});