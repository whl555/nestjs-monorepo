import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Alert,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CardGrid } from "@repo/ui";
import { cardService } from "./services/api";
import { Card as CardType, CardType as CardTypeEnum } from "@repo/shared-types";

export default function Native() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cardService.getCards();
      setCards(data);
    } catch (err) {
      setError('无法加载卡片数据');
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCards();
    setRefreshing(false);
  };

  const handleAddSampleCard = async () => {
    try {
      const sampleCard = {
        title: `移动端卡片 ${cards.length + 1}`,
        description: '这是在移动端创建的卡片',
        type: CardTypeEnum.TEXT,
        config: {
          text: {
            content: '🎉 这是在React Native应用中创建的新卡片！',
            fontSize: 16,
            color: '#2c3e50',
            alignment: 'center' as const,
          },
          style: {
            backgroundColor: '#e8f4fd',
            borderRadius: 12,
            padding: 20,
            shadow: true,
          },
        },
        position: cards.length,
      };

      const newCard = await cardService.createCard(sampleCard);
      setCards([...cards, newCard]);
      Alert.alert('成功', '卡片创建成功！');
    } catch (err) {
      console.error('Error creating card:', err);
      Alert.alert('错误', '创建卡片失败，请检查网络连接');
    }
  };

  const handleCardPress = (card: CardType) => {
    Alert.alert(
      card.title,
      card.description || '暂无描述',
      [{ text: '确定', style: 'default' }]
    );
  };

  const handleCardEdit = (card: CardType) => {
    Alert.alert(
      '编辑卡片',
      `是否要编辑卡片 "${card.title}"？`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '删除', 
          style: 'destructive',
          onPress: () => handleDeleteCard(card)
        },
      ]
    );
  };

  const handleDeleteCard = async (card: CardType) => {
    try {
      await cardService.deleteCard(card.id);
      setCards(cards.filter(c => c.id !== card.id));
      Alert.alert('成功', '卡片已删除');
    } catch (err) {
      console.error('Error deleting card:', err);
      Alert.alert('错误', '删除卡片失败');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.title}>🎯 卡片系统</Text>
        <Text style={styles.subtitle}>React Native Demo</Text>
      </View>

      {/* 工具栏 */}
      <View style={styles.toolbar}>
        <Pressable style={styles.addButton} onPress={handleAddSampleCard}>
          <Text style={styles.addButtonText}>➕ 添加卡片</Text>
        </Pressable>
      </View>

      {/* 错误提示 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <Pressable style={styles.retryButton} onPress={loadCards}>
            <Text style={styles.retryText}>重试</Text>
          </Pressable>
        </View>
      )}

      {/* 卡片网格 */}
      <View style={styles.content}>
        <CardGrid
          cards={cards}
          onCardPress={handleCardPress}
          onCardEdit={handleCardEdit}
          editable={true}
          loading={loading}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          emptyMessage="暂无卡片数据\n下拉刷新或点击上方按钮添加"
          numColumns={1}
        />
      </View>

      {/* 底部信息 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          支持iOS和Android平台 🚀
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  errorContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  footer: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});
