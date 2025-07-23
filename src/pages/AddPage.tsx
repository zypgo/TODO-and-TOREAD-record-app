import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckSquare, BookOpen, Calendar, Tag, Link as LinkIcon, Clock, Save, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store';
import { Todo, ReadingResource } from '../types';
import { toast } from 'sonner';

const AddPage = () => {
  const { type } = useParams<{ type?: 'todo' | 'resource' }>();
  const navigate = useNavigate();
  const { addTodo, addResource } = useAppStore();
  
  const [selectedType, setSelectedType] = useState<'todo' | 'resource'>(type || 'todo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 待办事项表单数据
  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as Todo['priority'],
    dueDate: '',
    tags: [] as string[],
  });
  
  // 阅读资源表单数据
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    url: '',
    type: 'article' as ReadingResource['type'],
    category: '',
    tags: [] as string[],
    estimatedReadTime: '',
  });
  
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (type) {
      setSelectedType(type);
    }
  }, [type]);
  
  const handleAddTag = (formType: 'todo' | 'resource') => {
    if (!tagInput.trim()) return;
    
    if (formType === 'todo') {
      if (!todoForm.tags.includes(tagInput.trim())) {
        setTodoForm(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
    } else {
      if (!resourceForm.tags.includes(tagInput.trim())) {
        setResourceForm(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
    }
    
    setTagInput('');
  };
  
  const handleRemoveTag = (formType: 'todo' | 'resource', tagToRemove: string) => {
    if (formType === 'todo') {
      setTodoForm(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    } else {
      setResourceForm(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (selectedType === 'todo') {
        if (!todoForm.title.trim()) {
          toast.error('请输入待办事项标题');
          return;
        }
        
        addTodo({
          title: todoForm.title.trim(),
          description: todoForm.description.trim() || undefined,
          status: 'pending',
          priority: todoForm.priority,
          dueDate: todoForm.dueDate || undefined,
          tags: todoForm.tags.length > 0 ? todoForm.tags : undefined,
        });
        
        toast.success('待办事项添加成功！');
        navigate('/todos');
      } else {
        if (!resourceForm.title.trim()) {
          toast.error('请输入资源标题');
          return;
        }
        
        if (!resourceForm.category.trim()) {
          toast.error('请输入资源分类');
          return;
        }
        
        addResource({
          title: resourceForm.title.trim(),
          description: resourceForm.description.trim() || undefined,
          url: resourceForm.url.trim() || undefined,
          type: resourceForm.type,
          status: 'unread',
          category: resourceForm.category.trim(),
          tags: resourceForm.tags.length > 0 ? resourceForm.tags : undefined,
          estimatedReadTime: resourceForm.estimatedReadTime ? parseInt(resourceForm.estimatedReadTime) : undefined,
        });
        
        toast.success('阅读资源添加成功！');
        navigate('/resources');
      }
    } catch (error) {
      toast.error('添加失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setTodoForm({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      tags: [],
    });
    
    setResourceForm({
      title: '',
      description: '',
      url: '',
      type: 'article',
      category: '',
      tags: [],
      estimatedReadTime: '',
    });
    
    setTagInput('');
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="glass-button p-2 rounded-xl text-white/90 hover:text-white transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white gradient-text">添加新项目</h1>
          <p className="text-white/80 mt-1">创建新的待办事项或阅读资源</p>
        </div>
      </div>
      
      {/* 类型选择 */}
      {!type && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 gradient-text">选择类型</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setSelectedType('todo');
                resetForm();
              }}
              className={`glass-button p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                selectedType === 'todo'
                  ? 'border-white/50 bg-white/20'
                  : 'border-white/30 hover:border-white/40'
              }`}
            >
              <CheckSquare className={`w-8 h-8 mx-auto mb-3 ${
                selectedType === 'todo' ? 'text-white' : 'text-white/70'
              }`} />
              <h3 className="font-semibold text-white mb-1">待办事项</h3>
              <p className="text-sm text-white/80">创建需要完成的任务</p>
            </button>
            
            <button
              onClick={() => {
                setSelectedType('resource');
                resetForm();
              }}
              className={`glass-button p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                selectedType === 'resource'
                  ? 'border-white/50 bg-white/20'
                  : 'border-white/30 hover:border-white/40'
              }`}
            >
              <BookOpen className={`w-8 h-8 mx-auto mb-3 ${
                selectedType === 'resource' ? 'text-white' : 'text-white/70'
              }`} />
              <h3 className="font-semibold text-white mb-1">阅读资源</h3>
              <p className="text-sm text-white/80">添加文章、书籍或其他资源</p>
            </button>
          </div>
        </div>
      )}
      
      {/* 表单 */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          {selectedType === 'todo' ? (
            <CheckSquare className="w-6 h-6 text-white" />
          ) : (
            <BookOpen className="w-6 h-6 text-white" />
          )}
          <h2 className="text-xl font-bold text-white gradient-text">
            {selectedType === 'todo' ? '新建待办事项' : '新建阅读资源'}
          </h2>
        </div>
        
        {selectedType === 'todo' ? (
          // 待办事项表单
          <>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                标题 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={todoForm.title}
                onChange={(e) => setTodoForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 glass-button rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="输入待办事项标题"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                描述
              </label>
              <textarea
                value={todoForm.description}
                onChange={(e) => setTodoForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 glass-button rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
                placeholder="详细描述待办事项（可选）"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  优先级
                </label>
                <select
                  value={todoForm.priority}
                  onChange={(e) => setTodoForm(prev => ({ ...prev, priority: e.target.value as Todo['priority'] }))}
                  className="w-full px-4 py-3 glass-button rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                >
                  <option value="low" className="bg-slate-800 text-white">低</option>
                  <option value="medium" className="bg-slate-800 text-white">中</option>
                  <option value="high" className="bg-slate-800 text-white">高</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  截止日期
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={todoForm.dueDate}
                    onChange={(e) => setTodoForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 glass-button rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                  <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-white/60 pointer-events-none" />
                </div>
              </div>
            </div>
          </>
        ) : (
          // 阅读资源表单
          <>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                标题 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={resourceForm.title}
                onChange={(e) => setResourceForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 glass-button rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="输入资源标题"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                描述
              </label>
              <textarea
                value={resourceForm.description}
                onChange={(e) => setResourceForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 glass-button rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
                placeholder="描述资源内容（可选）"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                链接
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={resourceForm.url}
                  onChange={(e) => setResourceForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-3 pl-12 glass-button rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="https://example.com"
                />
                <LinkIcon className="absolute left-4 top-3.5 w-4 h-4 text-white/60" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  类型
                </label>
                <select
                  value={resourceForm.type}
                  onChange={(e) => setResourceForm(prev => ({ ...prev, type: e.target.value as ReadingResource['type'] }))}
                  className="w-full px-4 py-3 glass-button rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                >
                  <option value="article" className="bg-slate-800 text-white">文章</option>
                  <option value="book" className="bg-slate-800 text-white">书籍</option>
                  <option value="video" className="bg-slate-800 text-white">视频</option>
                  <option value="document" className="bg-slate-800 text-white">文档</option>
                  <option value="other" className="bg-slate-800 text-white">其他</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  分类 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={resourceForm.category}
                  onChange={(e) => setResourceForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 glass-button rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="如：技术、生活"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  预估时长（分钟）
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={resourceForm.estimatedReadTime}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, estimatedReadTime: e.target.value }))}
                    className="w-full px-4 py-3 glass-button rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                    placeholder="30"
                    min="1"
                  />
                  <Clock className="absolute right-4 top-3.5 w-4 h-4 text-white/60 pointer-events-none" />
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* 标签输入 */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            标签
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(selectedType);
                    }
                  }}
                  className="w-full px-4 py-3 pl-12 glass-button rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="输入标签后按回车"
                />
                <Tag className="absolute left-4 top-3.5 w-4 h-4 text-white/60" />
              </div>
              <button
                type="button"
                onClick={() => handleAddTag(selectedType)}
                className="glass-button px-6 py-3 text-white rounded-xl hover:scale-105 transition-all duration-300"
              >
                添加
              </button>
            </div>
            
            {/* 标签列表 */}
            {(selectedType === 'todo' ? todoForm.tags : resourceForm.tags).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(selectedType === 'todo' ? todoForm.tags : resourceForm.tags).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-4 py-2 glass-button rounded-full text-sm text-white"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(selectedType, tag)}
                      className="ml-2 text-white/80 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* 提交按钮 */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/20">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="glass-button px-6 py-3 text-white/90 hover:text-white rounded-xl transition-all duration-300"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="glass-button flex items-center px-8 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPage;