import React from 'react';
import { Card as CardType, CardType as CardTypeEnum } from '@repo/shared-types';
import './Card.css';

interface CardProps {
  card: CardType;
  onEdit?: (card: CardType) => void;
  editable?: boolean;
}

export function Card({ card, onEdit, editable = false }: CardProps) {
  const config = typeof card.config === 'string' ? JSON.parse(card.config) : card.config;

  const handleEdit = () => {
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
        return <div>Unsupported card type</div>;
    }
  };

  const renderTextCard = () => {
    const textConfig = config.text || {};
    return (
      <div
        className="card-text"
        style={{
          fontSize: `${textConfig.fontSize || 16}px`,
          color: textConfig.color || '#333333',
          textAlign: textConfig.alignment || 'left' as any,
        }}
      >
        {textConfig.content || ''}
      </div>
    );
  };

  const renderImageCard = () => {
    const imageConfig = config.image || {};
    return (
      <img
        src={imageConfig.url || ''}
        alt={imageConfig.alt || ''}
        className="card-image"
        style={{
          objectFit: imageConfig.objectFit || 'cover' as any,
        }}
      />
    );
  };

  const renderLinkCard = () => {
    const linkConfig = config.link || {};
    return (
      <a
        href={linkConfig.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="link-container"
      >
        <div className="link-title">{linkConfig.title || ''}</div>
        {linkConfig.description && (
          <div className="link-description">{linkConfig.description}</div>
        )}
        <div className="link-url">{linkConfig.url || ''}</div>
      </a>
    );
  };

  const renderStatsCard = () => {
    const statsConfig = config.stats || {};
    return (
      <div className="stats-container">
        <div className="stats-value">{statsConfig.value || 0}</div>
        <div className="stats-label">{statsConfig.label || ''}</div>
        {statsConfig.trend && (
          <div className="trend-container">
            <span
              className={`trend-text trend-${statsConfig.trend}`}
            >
              {statsConfig.trend === 'up' ? '↑' : statsConfig.trend === 'down' ? '↓' : '→'}
              {statsConfig.percentage || 0}%
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderTodoCard = () => {
    const todoConfig = config.todo || { items: [] };
    const items = todoConfig.showCompleted
      ? todoConfig.items
      : todoConfig.items?.filter((item: any) => !item.completed) || [];

    return (
      <div className="todo-container">
        {items.map((item: any, index: number) => (
          <div key={item.id || index} className="todo-item">
            <span
              className={`todo-text ${item.completed ? 'todo-completed' : ''}`}
            >
              {item.completed ? '✓' : '○'} {item.text}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const cardStyle = config.style || {};

  return (
    <div className="card-container">
      <div
        className={`card ${cardStyle.shadow ? 'card-shadow' : ''}`}
        style={{
          backgroundColor: cardStyle.backgroundColor || '#ffffff',
          borderRadius: `${cardStyle.borderRadius || 8}px`,
          padding: `${cardStyle.padding || 16}px`,
          borderWidth: `${cardStyle.borderWidth || 0}px`,
          borderColor: cardStyle.borderColor || 'transparent',
          borderStyle: 'solid',
        }}
      >
        <div className="card-header">
          <h3 className="card-title">{card.title}</h3>
          {editable && (
            <button onClick={handleEdit} className="edit-button">
              编辑
            </button>
          )}
        </div>

        {card.description && (
          <p className="card-description">{card.description}</p>
        )}

        <div className="card-content">
          {renderCardContent()}
        </div>
      </div>
    </div>
  );
} 