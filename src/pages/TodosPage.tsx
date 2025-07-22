import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Calendar, AlertCircle, CheckCircle, Clock, Trash2, Edit } from 'lucide-react';
import { useAppStore } from '../store';
import { Todo } from '../types';
import { cn } from '../lib/utils';

const TodosPage = () => {
  const { todos, todoFilter, setTodoFilter, updateTodo, deleteTodo } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  // 筛选待办事项
  const filteredTodos = todos.filter((todo) => {
    if (todoFilter.status && todoFilter.status.length > 0) {
      if (!todoFilter.status.includes(todo.status)) return false;
    }
    if (todoFilter.priority && todoFilter.priority.length > 0) {
      if (!todoFilter.priority.includes(todo.priority)) return false;
    }
    if (todoFilter.tags && todoFilter.tags.length > 0) {
      if (!todo.tags || !todoFilter.tags.some(tag => todo.tags?.includes(tag))) return false;
    }
    return true;
  });

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (status: Todo['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: Todo['status']) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'in-progress': return '进行中';
      case 'pending': return '待办';
    }
  };

  const getPriorityText = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `逾期 ${Math.abs(diffDays)} 天`;
    } else if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '明天';
    } else {
      return `${diffDays} 天后`;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const handleStatusChange = (todoId: string, newStatus: Todo['status']) => {
    updateTodo(todoId, { status: newStatus });
  };

  const handleDelete = (todoId: string) => {
    console.log('开始删除待办事项:', todoId);
    if (window.confirm('确定要删除这个待办事项吗？')) {
      console.log('用户确认删除，调用deleteTodo');
      deleteTodo(todoId);
      console.log('删除操作完成，当前待办数量:', todos.length);
      // 强制重新渲染
      setTimeout(() => {
        console.log('延迟检查，当前待办数量:', todos.length);
      }, 100);
    } else {
      console.log('用户取消删除操作');
    }
  };

  const toggleFilter = (type: 'status' | 'priority', value: string) => {
    const currentFilter = todoFilter[type] || [];
    const newFilter = currentFilter.includes(value as any)
      ? currentFilter.filter(item => item !== value)
      : [...currentFilter, value as any];
    
    setTodoFilter({ [type]: newFilter.length > 0 ? newFilter : undefined });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">待办事项</h1>
          <p className="text-slate-600 mt-1">
            共 {filteredTodos.length} 项任务
            {todoFilter.status || todoFilter.priority ? ` (已筛选)` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
              showFilters
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-400'
            )}
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
          <Link
            to="/add/todo"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加待办
          </Link>
        </div>
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">状态</h3>
            <div className="flex flex-wrap gap-2">
              {(['pending', 'in-progress', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleFilter('status', status)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    todoFilter.status?.includes(status)
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  )}
                >
                  {getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">优先级</h3>
            <div className="flex flex-wrap gap-2">
              {(['high', 'medium', 'low'] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => toggleFilter('priority', priority)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    todoFilter.priority?.includes(priority)
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  )}
                >
                  {getPriorityText(priority)}
                </button>
              ))}
            </div>
          </div>
          
          {(todoFilter.status || todoFilter.priority) && (
            <button
              onClick={() => setTodoFilter({})}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              清除所有筛选
            </button>
          )}
        </div>
      )}

      {/* 待办事项列表 */}
      {filteredTodos.length > 0 ? (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(todo.status)}
                    <h3 className="text-lg font-semibold text-slate-900 truncate">
                      {todo.title}
                    </h3>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium border',
                      getPriorityColor(todo.priority)
                    )}>
                      {getPriorityText(todo.priority)}
                    </span>
                  </div>
                  
                  {todo.description && (
                    <p className="text-slate-600 mb-3 line-clamp-2">
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {todo.dueDate && (
                      <div className={cn(
                        'flex items-center gap-1',
                        isOverdue(todo.dueDate) && todo.status !== 'completed'
                          ? 'text-red-600'
                          : 'text-slate-500'
                      )}>
                        <Calendar className="w-4 h-4" />
                        {formatDate(todo.dueDate)}
                      </div>
                    )}
                    
                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        {todo.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {todo.tags.length > 2 && (
                          <span className="text-xs text-slate-400">
                            +{todo.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {/* 状态切换按钮 */}
                  <select
                    value={todo.status}
                    onChange={(e) => handleStatusChange(todo.id, e.target.value as Todo['status'])}
                    className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="pending">待办</option>
                    <option value="in-progress">进行中</option>
                    <option value="completed">已完成</option>
                  </select>
                  
                  <Link
                    to={`/detail/todo/${todo.id}`}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('删除按钮被点击，待办ID:', todo.id);
                      handleDelete(todo.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer bg-transparent border-0 outline-none"
                    title="删除"
                    type="button"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Trash2 className="w-4 h-4 pointer-events-none" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {todos.length === 0 ? '还没有待办事项' : '没有符合条件的待办事项'}
          </h3>
          <p className="text-slate-500 mb-6">
            {todos.length === 0 ? '开始添加您的第一个待办事项吧！' : '尝试调整筛选条件或添加新的待办事项'}
          </p>
          <Link
            to="/add/todo"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加待办事项
          </Link>
        </div>
      )}
    </div>
  );
};

export default TodosPage;