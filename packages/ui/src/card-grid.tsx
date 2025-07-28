import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  RefreshControl,
} from "react-native";
import { Card } from "./card";
import { Card as CardType } from "@repo/shared-types";

export interface CardGridProps {
  cards: CardType[];
  onCardPress?: (card: CardType) => void;
  onCardEdit?: (card: CardType) => void;
  editable?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
  numColumns?: number;
}

export function CardGrid({
  cards,
  onCardPress,
  onCardEdit,
  editable = false,
  loading = false,
  onRefresh,
  refreshing = false,
  emptyMessage = "暂无卡片",
  numColumns = 1,
}: CardGridProps) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const renderCard = (card: CardType, index: number) => (
    <View
      key={card.id}
      style={[
        styles.cardWrapper,
        numColumns > 1 && {
          width: `${100 / numColumns}%`,
        },
      ]}
    >
      <Card
        card={card}
        onPress={onCardPress}
        onEdit={onCardEdit}
        editable={editable}
      />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      <View
        style={[
          styles.grid,
          numColumns > 1 && styles.multiColumnGrid,
        ]}
      >
        {cards.map((card, index) => renderCard(card, index))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  grid: {
    gap: 16,
  },
  multiColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
}); 