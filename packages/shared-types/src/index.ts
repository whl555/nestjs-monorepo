// 卡片类型枚举
export enum CardType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  LINK = 'LINK',
  STATS = 'STATS',
  WEATHER = 'WEATHER',
  TODO = 'TODO',
  CHART = 'CHART',
  CUSTOM = 'CUSTOM',
}

// 任务状态枚举
export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

// 基础实体接口
export interface BaseEntity {
  createdAt: Date;
  updatedAt: Date;
}

// 用户接口
export interface User extends BaseEntity {
  id: number;
  email: string;
  name?: string;
  password: string;
}

// 卡片配置接口
export interface CardConfig {
  // 文本卡片配置
  text?: {
    content: string;
    fontSize?: number;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  
  // 图片卡片配置
  image?: {
    url: string;
    alt?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
  };
  
  // 链接卡片配置
  link?: {
    url: string;
    title: string;
    description?: string;
    favicon?: string;
  };
  
  // 统计卡片配置
  stats?: {
    value: number;
    label: string;
    trend?: 'up' | 'down' | 'neutral';
    percentage?: number;
  };
  
  // 天气卡片配置
  weather?: {
    location: string;
    apiKey?: string;
    units?: 'metric' | 'imperial';
  };
  
  // 待办事项卡片配置
  todo?: {
    items: Array<{
      id: string;
      text: string;
      completed: boolean;
    }>;
    showCompleted?: boolean;
  };
  
  // 图表卡片配置
  chart?: {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    data: any;
    options?: any;
  };
  
  // 通用样式配置
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: number;
    margin?: number;
    shadow?: boolean;
  };
}

// 卡片接口  
export interface Card extends BaseEntity {
  id: string;
  title: string;
  description?: string;
  type: CardType;
  config: CardConfig;
  position: number;
  isActive: boolean;
  userId?: number;
}

// 卡片模板接口
export interface CardTemplate extends BaseEntity {
  id: string;
  name: string;
  type: CardType;
  defaultConfig: CardConfig;
  preview?: string;
  description?: string;
}

// 任务接口
export interface Task extends BaseEntity {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId?: number;
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页接口
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// DTO接口
export interface CreateCardDto {
  title: string;
  description?: string;
  type: CardType;
  config: CardConfig;
  position?: number;
  userId?: number;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  config?: CardConfig;
  position?: number;
  isActive?: boolean;
}

export interface CreateUserDto {
  email: string;
  name?: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
}

export interface AuthCredentialsDto {
  email: string;
  password: string;
}

// 错误类型
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
} 