import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, ExternalLink, BookOpen, Video, FileText, Globe, Trash2, Edit, Grid, List } from 'lucide-react';
import { useAppStore } from '../store';
import { ReadingResource } from '../types';
import { cn } from '../lib/utils';

const ResourcesPage = () => {
  const { resources, resourceFilter, setResourceFilter, updateResource, deleteResource } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 筛选阅读资源
  const filteredResources = resources.filter((resource) => {
    if (resourceFilter.status && resourceFilter.status.length > 0) {
      if (!resourceFilter.status.includes(resource.status)) return false;
    }
    if (resourceFilter.type && resourceFilter.type.length > 0) {
      if (!resourceFilter.type.includes(resource.type)) return false;
    }
    if (resourceFilter.category && resourceFilter.category.length > 0) {
      if (!resourceFilter.category.includes(resource.category)) return false;
    }
    return true;
  });

  const getTypeIcon = (type: ReadingResource['type']) => {
    switch (type) {
      case 'article': return <FileText className="w-5 h-5" />;
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'other': return <Globe className="w-5 h-5" />;
    }
  };

  const getTypeText = (type: ReadingResource['type']) => {
    switch (type) {
      case 'article': return '文章';
      case 'book': return '书籍';
      case 'video': return '视频';
      case 'document': return '文档';
      case 'other': return '其他';
    }
  };

  const getStatusColor = (status: ReadingResource['status']) => {
    switch (status) {
      case 'unread': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'reading': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusText = (status: ReadingResource['status']) => {
    switch (status) {
      case 'unread': return '未读';
      case 'reading': return '阅读中';
      case 'completed': return '已读';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      '技术': 'bg-purple-100 text-purple-800',
      '生活': 'bg-green-100 text-green-800',
      '工作': 'bg-blue-100 text-blue-800',
      '学习': 'bg-orange-100 text-orange-800',
      '娱乐': 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (resourceId: string, newStatus: ReadingResource['status']) => {
    updateResource(resourceId, { status: newStatus });
  };

  const handleDelete = (resourceId: string) => {
    console.log('开始删除阅读资源:', resourceId);
    if (window.confirm('确定要删除这个阅读资源吗？')) {
      console.log('用户确认删除，调用deleteResource');
      deleteResource(resourceId);
      console.log('删除操作完成，当前资源数量:', resources.length);
      // 强制重新渲染
      setTimeout(() => {
        console.log('延迟检查，当前资源数量:', resources.length);
      }, 100);
    } else {
      console.log('用户取消删除操作');
    }
  };

  const toggleFilter = (type: 'status' | 'type' | 'category', value: string) => {
    const currentFilter = resourceFilter[type] || [];
    const newFilter = currentFilter.includes(value as any)
      ? currentFilter.filter(item => item !== value)
      : [...currentFilter, value as any];
    
    setResourceFilter({ [type]: newFilter.length > 0 ? newFilter : undefined });
  };

  const uniqueCategories = Array.from(new Set(resources.map(r => r.category)));

  const ResourceCard = ({ resource }: { resource: ReadingResource }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            {getTypeIcon(resource.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {resource.title}
            </h3>
            <p className="text-sm text-slate-500">{getTypeText(resource.type)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              title="打开链接"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <Link
            to={`/detail/resource/${resource.id}`}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('删除按钮被点击，资源ID:', resource.id);
                      handleDelete(resource.id);
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
      
      {resource.description && (
        <p className="text-slate-600 mb-4 line-clamp-2">
          {resource.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium border',
            getStatusColor(resource.status)
          )}>
            {getStatusText(resource.status)}
          </span>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            getCategoryColor(resource.category)
          )}>
            {resource.category}
          </span>
        </div>
        
        {resource.estimatedReadTime && (
          <span className="text-xs text-slate-500">
            约 {resource.estimatedReadTime} 分钟
          </span>
        )}
      </div>
      
      {resource.status === 'reading' && resource.progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>阅读进度</span>
            <span>{resource.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${resource.progress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {resource.tags && resource.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {resource.tags && resource.tags.length > 2 && (
            <span className="text-xs text-slate-400">
              +{resource.tags.length - 2}
            </span>
          )}
        </div>
        
        <select
          value={resource.status}
          onChange={(e) => handleStatusChange(resource.id, e.target.value as ReadingResource['status'])}
          className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
        >
          <option value="unread">未读</option>
          <option value="reading">阅读中</option>
          <option value="completed">已读</option>
        </select>
      </div>
    </div>
  );

  const ResourceListItem = ({ resource }: { resource: ReadingResource }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="p-2 bg-slate-100 rounded-lg">
            {getTypeIcon(resource.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-slate-900 truncate">
                {resource.title}
              </h3>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium border',
                getStatusColor(resource.status)
              )}>
                {getStatusText(resource.status)}
              </span>
              <span className={cn(
                'px-2 py-1 rounded text-xs font-medium',
                getCategoryColor(resource.category)
              )}>
                {resource.category}
              </span>
            </div>
            
            {resource.description && (
              <p className="text-slate-600 text-sm line-clamp-1 mb-2">
                {resource.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>{getTypeText(resource.type)}</span>
              {resource.estimatedReadTime && (
                <span>约 {resource.estimatedReadTime} 分钟</span>
              )}
              {resource.status === 'reading' && resource.progress !== undefined && (
                <span>进度 {resource.progress}%</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              title="打开链接"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          
          <select
            value={resource.status}
            onChange={(e) => handleStatusChange(resource.id, e.target.value as ReadingResource['status'])}
            className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
          >
            <option value="unread">未读</option>
            <option value="reading">阅读中</option>
            <option value="completed">已读</option>
          </select>
          
          <Link
            to={`/detail/resource/${resource.id}`}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('删除按钮被点击，资源ID:', resource.id);
              handleDelete(resource.id);
            }}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
            title="删除"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">阅读资源</h1>
          <p className="text-slate-600 mt-1">
            共 {filteredResources.length} 个资源
            {resourceFilter.status || resourceFilter.type || resourceFilter.category ? ` (已筛选)` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
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
            to="/add/resource"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加资源
          </Link>
        </div>
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">状态</h3>
            <div className="flex flex-wrap gap-2">
              {(['unread', 'reading', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleFilter('status', status)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    resourceFilter.status?.includes(status)
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
            <h3 className="text-sm font-medium text-slate-900 mb-2">类型</h3>
            <div className="flex flex-wrap gap-2">
              {(['article', 'book', 'video', 'document', 'other'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => toggleFilter('type', type)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    resourceFilter.type?.includes(type)
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  )}
                >
                  {getTypeText(type)}
                </button>
              ))}
            </div>
          </div>
          
          {uniqueCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-2">分类</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleFilter('category', category)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      resourceFilter.category?.includes(category)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {(resourceFilter.status || resourceFilter.type || resourceFilter.category) && (
            <button
              onClick={() => setResourceFilter({})}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              清除所有筛选
            </button>
          )}
        </div>
      )}

      {/* 资源列表 */}
      {filteredResources.length > 0 ? (
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}>
          {filteredResources.map((resource) => (
            viewMode === 'grid' ? (
              <ResourceCard key={resource.id} resource={resource} />
            ) : (
              <ResourceListItem key={resource.id} resource={resource} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {resources.length === 0 ? '还没有阅读资源' : '没有符合条件的阅读资源'}
          </h3>
          <p className="text-slate-500 mb-6">
            {resources.length === 0 ? '开始添加您的第一个阅读资源吧！' : '尝试调整筛选条件或添加新的阅读资源'}
          </p>
          <Link
            to="/add/resource"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加阅读资源
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;