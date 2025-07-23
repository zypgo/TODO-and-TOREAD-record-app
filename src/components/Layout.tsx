import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, BookOpen, Plus, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '待办事项', href: '/todos', icon: CheckSquare },
    { name: '阅读资源', href: '/resources', icon: BookOpen },
    { name: '添加', href: '/add', icon: Plus },
    { name: '统计', href: '/statistics', icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen">
      {/* 顶部导航栏 */}
      <header className="glass-card border-b border-white/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white gradient-text">
                任务管理中心
              </h1>
            </div>
            
            {/* 桌面端导航 */}
            <nav className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'glass-button flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 float-animation',
                      isActive(item.href)
                        ? 'bg-white/30 text-white shadow-lg'
                        : 'text-white/90 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden glass-button p-2 rounded-xl text-white/90 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* 移动端导航菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 glass-card">
            <nav className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'glass-button flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                      isActive(item.href)
                        ? 'bg-white/30 text-white shadow-lg'
                        : 'text-white/90 hover:text-white'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;