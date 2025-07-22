import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, ReadingResource, Statistics, Activity, TodoFilter, ResourceFilter } from '../types';

interface AppState {
  // 待办事项相关
  todos: Todo[];
  todoFilter: TodoFilter;
  
  // 阅读资源相关
  resources: ReadingResource[];
  resourceFilter: ResourceFilter;
  
  // 活动记录
  activities: Activity[];
  
  // UI状态
  isLoading: boolean;
  
  // 待办事项操作
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  setTodoFilter: (filter: Partial<TodoFilter>) => void;
  
  // 阅读资源操作
  addResource: (resource: Omit<ReadingResource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateResource: (id: string, updates: Partial<ReadingResource>) => void;
  deleteResource: (id: string) => void;
  setResourceFilter: (filter: Partial<ResourceFilter>) => void;
  
  // 统计数据
  getStatistics: () => Statistics;
  
  // 活动记录
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  
  // 初始化数据
  initializeData: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const getCurrentTimestamp = () => new Date().toISOString();

export const useAppStore = create<AppState>()(persist((set, get) => ({
  // 初始状态
  todos: [],
  todoFilter: {},
  resources: [],
  resourceFilter: {},
  activities: [],
  isLoading: false,
  
  // 待办事项操作
  addTodo: (todoData) => {
    const newTodo: Todo = {
      ...todoData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    
    set((state) => ({
      todos: [...state.todos, newTodo],
    }));
    
    get().addActivity({
      type: 'todo',
      action: 'created',
      itemId: newTodo.id,
      itemTitle: newTodo.title,
    });
  },
  
  updateTodo: (id, updates) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: getCurrentTimestamp() }
          : todo
      ),
    }));
    
    const todo = get().todos.find(t => t.id === id);
    if (todo) {
      get().addActivity({
        type: 'todo',
        action: updates.status === 'completed' ? 'completed' : 'updated',
        itemId: id,
        itemTitle: todo.title,
      });
    }
  },
  
  deleteTodo: (id) => {
    console.log('Store: 开始删除待办事项', id);
    const todo = get().todos.find(t => t.id === id);
    console.log('Store: 找到待办事项', todo);
    
    set((state) => {
      const newTodos = state.todos.filter((todo) => todo.id !== id);
      console.log('Store: 删除前数量', state.todos.length, '删除后数量', newTodos.length);
      return {
        todos: newTodos,
      };
    });
    
    if (todo) {
      get().addActivity({
        type: 'todo',
        action: 'deleted',
        itemId: id,
        itemTitle: todo.title,
      });
    }
    console.log('Store: 删除操作完成');
  },
  
  setTodoFilter: (filter) => {
    set((state) => ({
      todoFilter: { ...state.todoFilter, ...filter },
    }));
  },
  
  // 阅读资源操作
  addResource: (resourceData) => {
    const newResource: ReadingResource = {
      ...resourceData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    
    set((state) => ({
      resources: [...state.resources, newResource],
    }));
    
    get().addActivity({
      type: 'resource',
      action: 'created',
      itemId: newResource.id,
      itemTitle: newResource.title,
    });
  },
  
  updateResource: (id, updates) => {
    set((state) => ({
      resources: state.resources.map((resource) =>
        resource.id === id
          ? { ...resource, ...updates, updatedAt: getCurrentTimestamp() }
          : resource
      ),
    }));
    
    const resource = get().resources.find(r => r.id === id);
    if (resource) {
      get().addActivity({
        type: 'resource',
        action: updates.status === 'completed' ? 'completed' : 'updated',
        itemId: id,
        itemTitle: resource.title,
      });
    }
  },
  
  deleteResource: (id) => {
    console.log('Store: 开始删除阅读资源', id);
    const resource = get().resources.find(r => r.id === id);
    console.log('Store: 找到阅读资源', resource);
    
    set((state) => {
      const newResources = state.resources.filter((resource) => resource.id !== id);
      console.log('Store: 删除前数量', state.resources.length, '删除后数量', newResources.length);
      return {
        resources: newResources,
      };
    });
    
    if (resource) {
      get().addActivity({
        type: 'resource',
        action: 'deleted',
        itemId: id,
        itemTitle: resource.title,
      });
    }
    console.log('Store: 删除操作完成');
  },
  
  setResourceFilter: (filter) => {
    set((state) => ({
      resourceFilter: { ...state.resourceFilter, ...filter },
    }));
  },
  
  // 统计数据
  getStatistics: () => {
    const { todos, resources } = get();
    const today = new Date().toDateString();
    
    return {
      todos: {
        total: todos.length,
        completed: todos.filter(t => t.status === 'completed').length,
        pending: todos.filter(t => t.status === 'pending').length,
        inProgress: todos.filter(t => t.status === 'in-progress').length,
        highPriority: todos.filter(t => t.priority === 'high').length,
        mediumPriority: todos.filter(t => t.priority === 'medium').length,
        lowPriority: todos.filter(t => t.priority === 'low').length,
        today: todos.filter(t => 
          t.dueDate && new Date(t.dueDate).toDateString() === today
        ).length,
        overdue: todos.filter(t => 
          t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
        ).length,
      },
      resources: {
        total: resources.length,
        unread: resources.filter(r => r.status === 'unread').length,
        reading: resources.filter(r => r.status === 'reading').length,
        completed: resources.filter(r => r.status === 'completed').length,
      },
    };
  },
  
  // 活动记录
  addActivity: (activityData) => {
    const newActivity: Activity = {
      ...activityData,
      id: generateId(),
      timestamp: getCurrentTimestamp(),
    };
    
    set((state) => ({
      activities: [newActivity, ...state.activities].slice(0, 50), // 只保留最近50条记录
    }));
  },
  
  // 初始化示例数据
  initializeData: () => {
    const sampleTodos: Todo[] = [
      {
        id: '1',
        title: '完成项目文档',
        description: '编写项目的技术文档和用户手册',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // 明天
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 昨天
        updatedAt: getCurrentTimestamp(),
        tags: ['工作', '文档'],
      },
      {
        id: '2',
        title: '学习React新特性',
        description: '了解React 18的新功能和最佳实践',
        status: 'pending',
        priority: 'medium',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        tags: ['学习', '技术'],
      },
    ];
    
    const sampleResources: ReadingResource[] = [
      {
        id: '1',
        title: 'React官方文档',
        description: 'React最新版本的官方文档',
        url: 'https://react.dev',
        type: 'article',
        status: 'reading',
        category: '技术',
        progress: 60,
        estimatedReadTime: 120,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        tags: ['React', '前端'],
      },
      {
        id: '2',
        title: '《代码整洁之道》',
        description: '关于编写可维护代码的经典书籍',
        type: 'book',
        status: 'unread',
        category: '技术',
        estimatedReadTime: 600,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
        tags: ['编程', '最佳实践'],
      },
    ];
    
    set({
      todos: sampleTodos,
      resources: sampleResources,
    });
  },
}), {
  name: 'todo-app-storage',
  partialize: (state) => ({
    todos: state.todos,
    resources: state.resources,
    activities: state.activities,
  }),
}));