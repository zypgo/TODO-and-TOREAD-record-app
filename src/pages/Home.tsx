import { Link } from 'react-router-dom';
import { Plus, CheckSquare, BookOpen, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store';
import { useEffect } from 'react';

const Home = () => {
  const { getStatistics, activities, initializeData } = useAppStore();
  const stats = getStatistics();

  useEffect(() => {
    // 初始化示例数据（仅在首次加载时）
    if (stats.totalTodos === 0 && stats.totalResources === 0) {
      initializeData();
    }
  }, []);

  const recentActivities = activities.slice(0, 5);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    return `${Math.floor(diffInMinutes / 1440)}天前`;
  };

  const getActivityIcon = (type: string, action: string) => {
    if (type === 'todo') {
      return action === 'completed' ? (
        <CheckSquare className="w-4 h-4 text-green-600" />
      ) : (
        <CheckSquare className="w-4 h-4 text-blue-600" />
      );
    }
    return <BookOpen className="w-4 h-4 text-purple-600" />;
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'created': return '创建了';
      case 'updated': return '更新了';
      case 'completed': return '完成了';
      case 'deleted': return '删除了';
      default: return '操作了';
    }
  };

  return (
    <div className="space-y-8">
      {/* 欢迎标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          欢迎回来！
        </h1>
        <p className="text-slate-600">
          管理您的待办事项和阅读资源，提升工作效率
        </p>
      </div>

      {/* 统计概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">待办事项</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalTodos}</p>
              <p className="text-xs text-slate-500 mt-1">
                已完成 {stats.completedTodos} 项
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">阅读资源</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalResources}</p>
              <p className="text-xs text-slate-500 mt-1">
                已读 {stats.completedResources} 项
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">今日任务</p>
              <p className="text-2xl font-bold text-slate-900">{stats.todayTasks}</p>
              <p className="text-xs text-slate-500 mt-1">
                进行中 {stats.inProgressTodos} 项
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">逾期任务</p>
              <p className="text-2xl font-bold text-slate-900">{stats.overdueTasks}</p>
              <p className="text-xs text-slate-500 mt-1">
                需要关注
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/add/todo"
            className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors group"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-blue-700">添加待办</p>
            </div>
          </Link>
          
          <Link
            to="/add/resource"
            className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-dashed border-purple-200 hover:border-purple-300 transition-colors group"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-purple-700">添加资源</p>
            </div>
          </Link>
          
          <Link
            to="/todos"
            className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-dashed border-green-200 hover:border-green-300 transition-colors group"
          >
            <div className="text-center">
              <CheckSquare className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-green-700">管理待办</p>
            </div>
          </Link>
          
          <Link
            to="/statistics"
            className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-2 border-dashed border-orange-200 hover:border-orange-300 transition-colors group"
          >
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-orange-700">查看统计</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">最近活动</h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                {getActivityIcon(activity.type, activity.action)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">
                    {getActionText(activity.action)}
                    <span className="font-medium"> {activity.itemTitle}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">暂无活动记录</p>
            <p className="text-sm text-slate-400 mt-1">开始添加待办事项或阅读资源吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;