import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, Calendar, Tag, Link as LinkIcon, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { Todo, ReadingResource } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const DetailPage = () => {
  const { type, id } = useParams<{ type: 'todo' | 'resource'; id: string }>();
  const navigate = useNavigate();
  const { todos, resources, updateTodo, updateResource, deleteTodo, deleteResource } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  // 获取当前项目
  const currentItem = type === 'todo' 
    ? todos.find(t => t.id === id)
    : resources.find(r => r.id === id);
  
  // 编辑表单状态
  const [editForm, setEditForm] = useState<any>({});
  
  useEffect(() => {
    if (currentItem) {
      setEditForm({ ...currentItem });
    }
  }, [currentItem]);
  
  if (!currentItem || !type || !id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">项目不存在</h2>
        <p className="text-slate-600 mb-6">您要查看的项目可能已被删除或不存在</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          返回
        </button>
      </div>
    );
  }
  
  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      if (type === 'todo') {
        if (!editForm.title?.trim()) {
          toast.error('请输入待办事项标题');
          return;
        }
        
        updateTodo(id, {
          title: editForm.title.trim(),
          description: editForm.description?.trim() || undefined,
          priority: editForm.priority,
          status: editForm.status,
          dueDate: editForm.dueDate || undefined,
          tags: editForm.tags?.length > 0 ? editForm.tags : undefined,
        });
      } else {
        if (!editForm.title?.trim()) {
          toast.error('请输入资源标题');
          return;
        }
        
        if (!editForm.category?.trim()) {
          toast.error('请输入资源分类');
          return;
        }
        
        updateResource(id, {
          title: editForm.title.trim(),
          description: editForm.description?.trim() || undefined,
          url: editForm.url?.trim() || undefined,
          type: editForm.type,
          status: editForm.status,
          category: editForm.category.trim(),
          tags: editForm.tags?.length > 0 ? editForm.tags : undefined,
          estimatedReadTime: editForm.estimatedReadTime || undefined,
          progress: editForm.progress || undefined,
        });
      }
      
      setIsEditing(false);
      toast.success('保存成功！');
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = () => {
    const itemName = type === 'todo' ? '待办事项' : '阅读资源';
    
    if (window.confirm(`确定要删除这个${itemName}吗？此操作无法撤销。`)) {
      if (type === 'todo') {
        deleteTodo(id);
        navigate('/todos');
      } else {
        deleteResource(id);
        navigate('/resources');
      }
      toast.success(`${itemName}已删除`);
    }
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = editForm.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      setEditForm(prev => ({
        ...prev,
        tags: [...currentTags, tagInput.trim()]
      }));
    }
    
    setTagInput('');
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };
  
  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };
  
  const getStatusColor = (status: string) => {
    if (type === 'todo') {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-800 border-green-200';
        case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-800 border-green-200';
        case 'reading': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'unread': return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  const getStatusText = (status: string) => {
    if (type === 'todo') {
      switch (status) {
        case 'completed': return '已完成';
        case 'in-progress': return '进行中';
        case 'pending': return '待办';
      }
    } else {
      switch (status) {
        case 'completed': return '已读';
        case 'reading': return '阅读中';
        case 'unread': return '未读';
      }
    }
    return status;
  };
  
  const getPriorityText = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
    }
  };
  
  const getTypeText = (resourceType: ReadingResource['type']) => {
    switch (resourceType) {
      case 'article': return '文章';
      case 'book': return '书籍';
      case 'video': return '视频';
      case 'document': return '文档';
      case 'other': return '其他';
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {type === 'todo' ? '待办事项详情' : '阅读资源详情'}
            </h1>
            <p className="text-slate-600 mt-1">
              {isEditing ? '编辑模式' : '查看模式'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({ ...currentItem });
                }}
                className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? '保存中...' : '保存'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors bg-transparent border-0 outline-none"
                style={{ pointerEvents: 'auto' }}
              >
                <Trash2 className="w-4 h-4 mr-2 pointer-events-none" />
                删除
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* 主要内容 */}
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        {isEditing ? (
          // 编辑模式
          <div className="space-y-6">
            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入标题"
              />
            </div>
            
            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                描述
              </label>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入描述"
              />
            </div>
            
            {/* 状态和其他字段 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  状态
                </label>
                <select
                  value={editForm.status || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {type === 'todo' ? (
                    <>
                      <option value="pending">待办</option>
                      <option value="in-progress">进行中</option>
                      <option value="completed">已完成</option>
                    </>
                  ) : (
                    <>
                      <option value="unread">未读</option>
                      <option value="reading">阅读中</option>
                      <option value="completed">已读</option>
                    </>
                  )}
                </select>
              </div>
              
              {type === 'todo' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      优先级
                    </label>
                    <select
                      value={editForm.priority || 'medium'}
                      onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      截止日期
                    </label>
                    <input
                      type="date"
                      value={editForm.dueDate || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      类型
                    </label>
                    <select
                      value={editForm.type || 'article'}
                      onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="article">文章</option>
                      <option value="book">书籍</option>
                      <option value="video">视频</option>
                      <option value="document">文档</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      分类 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="如：技术、生活"
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* 资源特有字段 */}
            {type === 'resource' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    链接
                  </label>
                  <input
                    type="url"
                    value={editForm.url || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    预估时长（分钟）
                  </label>
                  <input
                    type="number"
                    value={editForm.estimatedReadTime || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, estimatedReadTime: parseInt(e.target.value) || undefined }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                    min="1"
                  />
                </div>
                
                {editForm.status === 'reading' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      阅读进度（%）
                    </label>
                    <input
                      type="number"
                      value={editForm.progress || 0}
                      onChange={(e) => setEditForm(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* 标签编辑 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                标签
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="输入标签后按回车"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                  >
                    添加
                  </button>
                </div>
                
                {editForm.tags && editForm.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editForm.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // 查看模式
          <div className="space-y-8">
            {/* 标题和状态 */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                  {currentItem.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium border',
                    getStatusColor(currentItem.status)
                  )}>
                    {getStatusText(currentItem.status)}
                  </span>
                  
                  {type === 'todo' && 'priority' in currentItem && (
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium border',
                      getPriorityColor(currentItem.priority)
                    )}>
                      {getPriorityText(currentItem.priority)}
                    </span>
                  )}
                </div>
              </div>
              
              {currentItem.description && (
                <p className="text-slate-700 text-lg leading-relaxed">
                  {currentItem.description}
                </p>
              )}
            </div>
            
            {/* 详细信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  基本信息
                </h3>
                
                {type === 'todo' && 'dueDate' in currentItem && currentItem.dueDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">截止日期</p>
                      <p className="font-medium text-slate-900">
                        {formatDate(currentItem.dueDate)}
                      </p>
                    </div>
                  </div>
                )}
                
                {type === 'resource' && (
                  <>
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">类型</p>
                        <p className="font-medium text-slate-900">
                          {getTypeText((currentItem as ReadingResource).type)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">分类</p>
                        <p className="font-medium text-slate-900">
                          {(currentItem as ReadingResource).category}
                        </p>
                      </div>
                    </div>
                    
                    {(currentItem as ReadingResource).url && (
                      <div className="flex items-center gap-3">
                        <LinkIcon className="w-5 h-5 text-slate-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-600">链接</p>
                          <a
                            href={(currentItem as ReadingResource).url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium truncate"
                          >
                            <span className="truncate">{(currentItem as ReadingResource).url}</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {(currentItem as ReadingResource).estimatedReadTime && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-600">预估时长</p>
                          <p className="font-medium text-slate-900">
                            {(currentItem as ReadingResource).estimatedReadTime} 分钟
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {(currentItem as ReadingResource).status === 'reading' && (currentItem as ReadingResource).progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                          <span>阅读进度</span>
                          <span>{(currentItem as ReadingResource).progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all"
                            style={{ width: `${(currentItem as ReadingResource).progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  其他信息
                </h3>
                
                {currentItem.tags && currentItem.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">标签</p>
                    <div className="flex flex-wrap gap-2">
                      {currentItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">创建时间</p>
                  <p className="font-medium text-slate-900">
                    {formatDateTime(currentItem.createdAt)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 mb-1">最后更新</p>
                  <p className="font-medium text-slate-900">
                    {formatDateTime(currentItem.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;