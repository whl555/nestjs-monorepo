import * as React from "react";
import {
  StyleSheet,
  GestureResponderEvent,
  Text,
  View,
  Image,
  Pressable,
  Linking,
} from "react-native";
import { Card as CardType, CardType as CardTypeEnum } from "@repo/shared-types";

export interface CardProps {
  card: CardType;
  onPress?: (card: CardType) => void;
  onEdit?: (card: CardType) => void;
  editable?: boolean;
}

export function Card({ card, onPress, onEdit, editable = false }: CardProps) {
  const config = typeof card.config === 'string' ? JSON.parse(card.config) : card.config;
  
  const handlePress = () => {
    if (onPress) {
      onPress(card);
    }
  };

  const handleEdit = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(card);
    }
  };

  const renderCardContent = () => {
    switch (card.type) {
      case CardTypeEnum.TEXT:
        return renderTextCard();
      case CardTypeEnum.IMAGE:
        return renderImageCard();
      case CardTypeEnum.LINK:
        return renderLinkCard();
      case CardTypeEnum.STATS:
        return renderStatsCard();
      case CardTypeEnum.TODO:
        return renderTodoCard();
      default:
        return <Text>Unsupported card type</Text>;
    }
  };

  const renderTextCard = () => {
    const textConfig = config.text || {};
    return (
      <Text
        style={[
          styles.cardText,
          {
            fontSize: textConfig.fontSize || 16,
            color: textConfig.color || '#333333',
            textAlign: textConfig.alignment || 'left',
          },
        ]}
      >
        {textConfig.content || ''}
      </Text>
    );
  };

  const renderImageCard = () => {
    const imageConfig = config.image || {};
    return (
      <Image
        source={{ uri: imageConfig.url || '' }}
        style={[styles.cardImage, { resizeMode: imageConfig.objectFit || 'cover' }]}
      />
    );
  };

  const renderLinkCard = () => {
    const linkConfig = config.link || {};
    return (
      <Pressable
        onPress={() => linkConfig.url && Linking.openURL(linkConfig.url)}
        style={styles.linkContainer}
      >
        <Text style={styles.linkTitle}>{linkConfig.title || ''}</Text>
        {linkConfig.description && (
          <Text style={styles.linkDescription}>{linkConfig.description}</Text>
        )}
        <Text style={styles.linkUrl}>{linkConfig.url || ''}</Text>
      </Pressable>
    );
  };

  const renderStatsCard = () => {
    const statsConfig = config.stats || {};
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsValue}>{statsConfig.value || 0}</Text>
        <Text style={styles.statsLabel}>{statsConfig.label || ''}</Text>
        {statsConfig.trend && (
          <View style={styles.trendContainer}>
            <Text
              style={[
                styles.trendText,
                {
                  color:
                    statsConfig.trend === 'up'
                      ? '#10b981'
                      : statsConfig.trend === 'down'
                      ? '#ef4444'
                      : '#6b7280',
                },
              ]}
            >
              {statsConfig.trend === 'up' ? '↑' : statsConfig.trend === 'down' ? '↓' : '→'}
              {statsConfig.percentage || 0}%
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderTodoCard = () => {
    const todoConfig = config.todo || { items: [] };
    const items = todoConfig.showCompleted
      ? todoConfig.items
      : todoConfig.items?.filter((item: any) => !item.completed) || [];

    return (
      <View style={styles.todoContainer}>
        {items.map((item: any, index: number) => (
          <View key={item.id || index} style={styles.todoItem}>
            <Text
              style={[
                styles.todoText,
                item.completed && styles.todoCompleted,
              ]}
            >
              {item.completed ? '✓' : '○'} {item.text}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const cardStyle = config.style || {};
  
  return (
    <Pressable onPress={handlePress} style={styles.cardContainer}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: cardStyle.backgroundColor || '#ffffff',
            borderRadius: cardStyle.borderRadius || 8,
            padding: cardStyle.padding || 16,
            borderWidth: cardStyle.borderWidth || 0,
            borderColor: cardStyle.borderColor || 'transparent',
          },
          cardStyle.shadow && styles.shadow,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          {editable && (
            <Pressable onPress={handleEdit} style={styles.editButton}>
              <Text style={styles.editButtonText}>编辑</Text>
            </Pressable>
          )}
        </View>
        
        {card.description && (
          <Text style={styles.cardDescription}>{card.description}</Text>
        )}
        
        <View style={styles.cardContent}>
          {renderCardContent()}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#333333',
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  linkContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  linkUrl: {
    fontSize: 12,
    color: '#3b82f6',
  },
  statsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  trendContainer: {
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  todoContainer: {
    gap: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  todoText: {
    fontSize: 14,
    color: '#374151',
  },
  todoCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
}); 