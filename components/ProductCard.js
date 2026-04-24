import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const formatPrice = (price) =>
  'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const formatSold = (sold) => {
  if (sold >= 1000) return (sold / 1000).toFixed(1) + 'rb';
  return sold.toString();
};

const CATEGORY_COLORS = {
  Pakaian:   { bg: '#FFF3E0', text: '#E65100' },
  Sepatu:    { bg: '#E8F5E9', text: '#2E7D32' },
  Aksesoris: { bg: '#EDE7F6', text: '#4527A0' },
  Tas:       { bg: '#E3F2FD', text: '#1565C0' },
};

export default function ProductCard({ item, isGrid, onPress }) {
  const catColor = CATEGORY_COLORS[item.category] || { bg: '#F5F5F5', text: '#555' };

  return (
    <TouchableOpacity
      style={[styles.card, isGrid ? styles.cardGrid : styles.cardList]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Image / Emoji */}
      <View style={[styles.imageBox, isGrid ? styles.imageBoxGrid : styles.imageBoxList]}>
        <Text style={styles.emoji}>{item.image}</Text>
      </View>

      {/* Info */}
      <View style={[styles.info, isGrid ? styles.infoGrid : styles.infoList]}>
        {/* Category badge */}
        <View style={[styles.badge, { backgroundColor: catColor.bg }]}>
          <Text style={[styles.badgeText, { color: catColor.text }]}>{item.category}</Text>
        </View>

        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

        <Text style={styles.price}>{formatPrice(item.price)}</Text>

        {/* Rating + Sold */}
        <View style={styles.meta}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.sold}>{formatSold(item.sold)} terjual</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardList: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardGrid: {
    flex: 1,
    flexDirection: 'column',
    margin: 6,
  },

  imageBox: {
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBoxList: {
    width: 100,
    height: 100,
  },
  imageBoxGrid: {
    height: 110,
    width: '100%',
  },
  emoji: {
    fontSize: 44,
  },

  info: {
    padding: 12,
    justifyContent: 'space-between',
  },
  infoList: {
    flex: 1,
  },
  infoGrid: {
    width: '100%',
  },

  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    lineHeight: 18,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#E63946',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 11,
  },
  rating: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
    marginLeft: 2,
  },
  dot: {
    fontSize: 12,
    color: '#CCC',
    marginHorizontal: 4,
  },
  sold: {
    fontSize: 11,
    color: '#888',
  },
});