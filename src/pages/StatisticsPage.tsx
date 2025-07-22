import { useMemo } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp, BookOpen, Target, Activity } from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

const StatisticsPage = () => {
  const { todos, resources, getStatistics } = useAppStore();
  const stats = getStatistics();
  
  // 计算图表数据
  const chartData = useMemo(() => {
    // 待办事项状态分布
    const todoStatusData = [
      { name: '待办', value: stats.todos.pending, color: '#94a3b8' },
      { name: '进行中', value: stats.todos.inProgress, color: '#3b82f6' },
      { name: '已完成', value: stats.todos.completed, color: '#10b981' },
    ];
    
    // 阅读资源状态分布
    const resourceStatusData = [
      { name: '未读', value: stats.resources.unread, color: '#94a3b8' },
      { name: '阅读中', value: stats.resources.reading, color: '#3b82f6' },
      { name: '已读', value: stats.resources.completed, color: '#10b981' },
    ];
    
    // 优先级分布
    const priorityData = [
      { name: '高', value: stats.todos.highPriority, color: '#ef4444' },
      { name: '中', value: stats.todos.mediumPriority, color: '#f59e0b' },
      { name: '低', value: stats.todos.lowPriority, color: '#10b981' },
    ];
    
    // 资源类型分布
    const resourceTypeData = [
      { name: '文章', value: resources.filter(r => r.type === 'article').length, color: '#3b82f6' },
      { name: '书籍', value: resources.filter(r => r.type === 'book').length, color: '#8b5cf6' },
      { name: '视频', value: resources.filter(r => r.type === 'video').length, color: '#ef4444' },
      { name: '文档', value: resources.filter(r => r.type === 'document').length, color: '#f59e0b' },
      { name: '其他', value: resources.filter(r => r.type === 'other').length, color: '#10b981' },
    ].filter(item => item.value > 0);
    
    // 最近7天的活动趋势（模拟数据）
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        todos: Math.floor(Math.random() * 5) + 1,
        resources: Math.floor(Math.random() * 3) + 1,
      };
    });
    
    // 分类统计
    const categoryStats = resources.reduce((acc, resource) => {
      const category = resource.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoryData = Object.entries(categoryStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // 只显示前8个分类
    
    return {
      todoStatusData,
      resourceStatusData,
      priorityData,
      resourceTypeData,
      last7Days,
      categoryData,
    };
  }, [todos, resources, stats]);
  
  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      red: 'bg-red-50 text-red-600 border-red-200',
    };
    
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-lg border',
            colorClasses[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };
  
  const PieChartCard = ({ title, data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        
        {/* 简单的环形图表示 */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-slate-100"></div>
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const previousPercentages = data.slice(0, index).reduce((sum, prevItem) => {
                return sum + (total > 0 ? (prevItem.value / total) * 100 : 0);
              }, 0);
              
              return (
                <div
                  key={index}
                  className="absolute inset-2 rounded-full"
                  style={{
                    background: `conic-gradient(from ${previousPercentages * 3.6}deg, ${item.color} 0deg ${(previousPercentages + percentage) * 3.6}deg, transparent ${(previousPercentages + percentage) * 3.6}deg)`,
                    mask: 'radial-gradient(circle at center, transparent 40%, black 40%)',
                    WebkitMask: 'radial-gradient(circle at center, transparent 40%, black 40%)',
                  }}
                />
              );
            })}
            <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-slate-900">{total}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{item.value}</span>
                  <span className="text-xs text-slate-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const BarChartCard = ({ title, data, dataKey }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = maxValue > 0 ? (item[dataKey] / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">{item.name}</span>
                  <span className="text-slate-900 font-semibold">{item[dataKey]}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const LineChartCard = ({ title, data }) => {
    const maxTodos = Math.max(...data.map(item => item.todos));
    const maxResources = Math.max(...data.map(item => item.resources));
    const maxValue = Math.max(maxTodos, maxResources);
    
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        
        {/* 图例 */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-slate-700">待办事项</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-sm text-slate-700">阅读资源</span>
          </div>
        </div>
        
        {/* 简单的趋势图 */}
        <div className="space-y-4">
          {data.map((item, index) => {
            const todoPercentage = maxValue > 0 ? (item.todos / maxValue) * 100 : 0;
            const resourcePercentage = maxValue > 0 ? (item.resources / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 font-medium">{item.date}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-blue-600 font-semibold">{item.todos}</span>
                    <span className="text-green-600 font-semibold">{item.resources}</span>
                  </div>
                </div>
                
                {/* 待办事项条 */}
                <div className="space-y-1">
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${todoPercentage}%` }}
                    />
                  </div>
                  
                  {/* 阅读资源条 */}
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${resourcePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const completionRate = stats.todos.total > 0 
    ? Math.round((stats.todos.completed / stats.todos.total) * 100)
    : 0;
    
  const readingRate = stats.resources.total > 0
    ? Math.round((stats.resources.completed / stats.resources.total) * 100)
    : 0;
  
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">数据统计</h1>
        <p className="text-slate-600 mt-2">查看您的待办事项和阅读资源的详细统计信息</p>
      </div>
      
      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={CheckCircle}
          title="总待办事项"
          value={stats.todos.total}
          subtitle={`完成率 ${completionRate}%`}
          color="blue"
        />
        
        <StatCard
          icon={BookOpen}
          title="总阅读资源"
          value={stats.resources.total}
          subtitle={`阅读率 ${readingRate}%`}
          color="green"
        />
        
        <StatCard
          icon={Target}
          title="进行中任务"
          value={stats.todos.inProgress}
          subtitle="当前活跃任务"
          color="yellow"
        />
        
        <StatCard
          icon={Activity}
          title="阅读中资源"
          value={stats.resources.reading}
          subtitle="当前阅读中"
          color="purple"
        />
      </div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 待办事项状态分布 */}
        <PieChartCard
          title="待办事项状态分布"
          data={chartData.todoStatusData}
        />
        
        {/* 阅读资源状态分布 */}
        <PieChartCard
          title="阅读资源状态分布"
          data={chartData.resourceStatusData}
        />
        
        {/* 优先级分布 */}
        <PieChartCard
          title="待办事项优先级分布"
          data={chartData.priorityData}
        />
        
        {/* 资源类型分布 */}
        <PieChartCard
          title="阅读资源类型分布"
          data={chartData.resourceTypeData}
        />
      </div>
      
      {/* 趋势图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近7天活动趋势 */}
        <LineChartCard
          title="最近7天活动趋势"
          data={chartData.last7Days}
        />
        
        {/* 分类统计 */}
        {chartData.categoryData.length > 0 && (
          <BarChartCard
            title="资源分类统计"
            data={chartData.categoryData}
            dataKey="value"
          />
        )}
      </div>
      
      {/* 详细统计信息 */}
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">详细统计</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 待办事项统计 */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              待办事项
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">总数</span>
                <span className="font-medium text-slate-900">{stats.todos.total}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">已完成</span>
                <span className="font-medium text-green-600">{stats.todos.completed}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">进行中</span>
                <span className="font-medium text-blue-600">{stats.todos.inProgress}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">待办</span>
                <span className="font-medium text-slate-600">{stats.todos.pending}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">高优先级</span>
                <span className="font-medium text-red-600">{stats.todos.highPriority}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">中优先级</span>
                <span className="font-medium text-yellow-600">{stats.todos.mediumPriority}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">低优先级</span>
                <span className="font-medium text-green-600">{stats.todos.lowPriority}</span>
              </div>
            </div>
          </div>
          
          {/* 阅读资源统计 */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              阅读资源
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">总数</span>
                <span className="font-medium text-slate-900">{stats.resources.total}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">已读</span>
                <span className="font-medium text-green-600">{stats.resources.completed}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">阅读中</span>
                <span className="font-medium text-blue-600">{stats.resources.reading}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">未读</span>
                <span className="font-medium text-slate-600">{stats.resources.unread}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">文章</span>
                <span className="font-medium text-slate-900">
                  {resources.filter(r => r.type === 'article').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">书籍</span>
                <span className="font-medium text-slate-900">
                  {resources.filter(r => r.type === 'book').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">视频</span>
                <span className="font-medium text-slate-900">
                  {resources.filter(r => r.type === 'video').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;