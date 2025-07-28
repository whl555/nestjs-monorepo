import React, { useState, useEffect } from 'react';
import { Card } from './components/Card';
import { cardService } from './services/api';
import { Card as CardType, CardType as CardTypeEnum } from '@repo/shared-types';
import './App.css';

function App() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
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
      setError('Failed to load cards');
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSampleCard = async () => {
    try {
      const sampleCard = {
        title: `新卡片 ${cards.length + 1}`,
        description: '这是一个示例卡片',
        type: CardTypeEnum.TEXT,
        config: {
          text: {
            content: '这是一个新的文本卡片！',
            fontSize: 16,
            color: '#333333',
            alignment: 'left' as const,
          },
          style: {
            backgroundColor: '#f8f9fa',
            borderRadius: 8,
            padding: 16,
            shadow: true,
          },
        },
        position: cards.length,
      };

      const newCard = await cardService.createCard(sampleCard);
      setCards([...cards, newCard]);
    } catch (err) {
      console.error('Error creating card:', err);
      setError('Failed to create card');
    }
  };

  const handleEditCard = (card: CardType) => {
    // 这里可以打开编辑对话框
    alert(`编辑卡片: ${card.title}`);
  };

  const handleDeleteCard = async (card: CardType) => {
    if (confirm(`确定要删除卡片 "${card.title}" 吗？`)) {
      try {
        await cardService.deleteCard(card.id);
        setCards(cards.filter(c => c.id !== card.id));
      } catch (err) {
        console.error('Error deleting card:', err);
        setError('Failed to delete card');
      }
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 可配置卡片系统</h1>
        <p>一个基于TypeScript全栈的卡片展示系统</p>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <button onClick={handleAddSampleCard} className="add-button">
            ➕ 添加示例卡片
          </button>
          <button onClick={loadCards} className="refresh-button">
            🔄 刷新
          </button>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <div className="cards-grid">
          {cards.length === 0 ? (
            <div className="empty-state">
              <h3>暂无卡片</h3>
              <p>点击上方按钮添加第一个卡片吧！</p>
            </div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="card-item">
                <Card
                  card={card}
                  onEdit={handleEditCard}
                  editable={true}
                />
                <button
                  onClick={() => handleDeleteCard(card)}
                  className="delete-button"
                  title="删除卡片"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          基于 <strong>NestJS + React + React Native + Prisma</strong> 构建
        </p>
        <p>
          支持Web、iOS、Android多平台 🚀
        </p>
      </footer>
    </div>
  );
}

export default App;
