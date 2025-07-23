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
      <div className="text-center float-animation">
        <h1 className="text-4xl font-bold text-white mb-2 gradient-text">
          欢迎回来！
        </h1>
        <p className="text-white/80 text-lg">
          管理您的待办事项和阅读资源，提升工作效率
        </p>
      </div>

      {/* 统计概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">待办事项</p>
              <p className="text-3xl font-bold text-white">{stats.totalTodos}</p>
              <p className="text-xs text-white/60 mt-1">
                已完成 {stats.completedTodos} 项
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">阅读资源</p>
              <p className="text-3xl font-bold text-white">{stats.totalResources}</p>
              <p className="text-xs text-white/60 mt-1">
                已读 {stats.completedResources} 项
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">今日任务</p>
              <p className="text-3xl font-bold text-white">{stats.todayTasks}</p>
              <p className="text-xs text-white/60 mt-1">
                进行中 {stats.inProgressTodos} 项
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">逾期任务</p>
              <p className="text-3xl font-bold text-white">{stats.overdueTasks}</p>
              <p className="text-xs text-white/60 mt-1">
                需要关注
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 gradient-text">快速操作</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/add/todo"
            className="glass-button flex items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/30 hover:border-white/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="text-center">
              <Plus className="w-10 h-10 text-white mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">添加待办</p>
            </div>
          </Link>
          
          <Link
            to="/add/resource"
            className="glass-button flex items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/30 hover:border-white/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="text-center">
              <Plus className="w-10 h-10 text-white mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">添加资源</p>
            </div>
          </Link>
          
          <Link
            to="/todos"
            className="glass-button flex items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/30 hover:border-white/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="text-center">
              <CheckSquare className="w-10 h-10 text-white mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">管理待办</p>
            </div>
          </Link>
          
          <Link
            to="/statistics"
            className="glass-button flex items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/30 hover:border-white/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="text-center">
              <TrendingUp className="w-10 h-10 text-white mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-white">查看统计</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 gradient-text">最近活动</h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-4 glass-button rounded-xl hover:scale-102 transition-all duration-300">
                {getActivityIcon(activity.type, activity.action)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    {getActionText(activity.action)}
                    <span className="font-medium"> {activity.itemTitle}</span>
                  </p>
                  <p className="text-xs text-white/60">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-white/50 mx-auto mb-3" />
            <p className="text-white/70">暂无活动记录</p>
            <p className="text-sm text-white/50 mt-1">开始添加待办事项或阅读资源吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;