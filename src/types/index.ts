// 待办事项类型定义
export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// 阅读资源类型定义
export interface ReadingResource {
  id: string;
  title: string;
  description?: string;
  url?: string;
  type: 'article' | 'book' | 'video' | 'document' | 'other';
  status: 'unread' | 'reading' | 'completed';
  category: string;
  tags?: string[];
  progress?: number; // 阅读进度百分比
  createdAt: string;
  updatedAt: string;
  estimatedReadTime?: number; // 预估阅读时间（分钟）
}

// 统计数据类型
export interface Statistics {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  inProgressTodos: number;
  totalResources: number;
  unreadResources: number;
  readingResources: number;
  completedResources: number;
  todayTasks: number;
  overdueTasks: number;
}

// 筛选器类型
export interface TodoFilter {
  status?: Todo['status'][];
  priority?: Todo['priority'][];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ResourceFilter {
  status?: ReadingResource['status'][];
  type?: ReadingResource['type'][];
  category?: string[];
  tags?: string[];
}

// 活动记录类型
export interface Activity {
  id: string;
  type: 'todo' | 'resource';
  action: 'created' | 'updated' | 'completed' | 'deleted';
  itemId: string;
  itemTitle: string;
  timestamp: string;
}