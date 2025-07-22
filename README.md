# 📝 待办和阅读资源管理应用

一个现代化的全栈待办事项和阅读资源管理应用，使用 React + TypeScript + Tailwind CSS 构建。

## ✨ 功能特色

### 📋 待办事项管理
- ✅ 创建、编辑、删除待办事项
- 🏷️ 设置优先级（高、中、低）
- 📅 设置截止日期
- 🔄 状态管理（待办、进行中、已完成）
- 🏷️ 标签分类
- 🔍 智能筛选和搜索

### 📚 阅读资源管理
- 📖 管理文章、书籍、视频等阅读资源
- 🔗 支持URL链接保存
- 📊 阅读进度跟踪
- ⏱️ 预估阅读时间
- 📂 分类管理
- 🏷️ 标签系统

### 📊 数据统计
- 📈 任务完成统计
- 📚 阅读进度分析
- 🎯 效率指标展示
- 📅 时间分布图表

### 🎨 用户体验
- 🌓 深色/浅色主题切换
- 📱 完全响应式设计
- 💾 本地数据持久化
- 🚀 快速加载和流畅交互
- 🎯 直观的用户界面

## 🛠️ 技术栈

- **前端框架**: React 18
- **类型系统**: TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router
- **图标**: Lucide React
- **数据持久化**: LocalStorage
- **代码规范**: ESLint + Prettier

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm 或 pnpm

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 启动开发服务器
```bash
npm run dev
# 或
pnpm dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本
```bash
npm run build
# 或
pnpm build
```

### 预览生产版本
```bash
npm run preview
# 或
pnpm preview
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Empty.tsx       # 空状态组件
│   └── Layout.tsx      # 布局组件
├── hooks/              # 自定义 Hooks
│   └── useTheme.ts     # 主题管理
├── lib/                # 工具函数
│   └── utils.ts        # 通用工具
├── pages/              # 页面组件
│   ├── AddPage.tsx     # 添加页面
│   ├── DetailPage.tsx  # 详情页面
│   ├── Home.tsx        # 首页
│   ├── ResourcesPage.tsx # 阅读资源页面
│   ├── StatisticsPage.tsx # 统计页面
│   └── TodosPage.tsx   # 待办事项页面
├── router/             # 路由配置
│   └── index.tsx       # 路由定义
├── store/              # 状态管理
│   └── index.ts        # Zustand 存储
├── types/              # 类型定义
│   └── index.ts        # TypeScript 类型
├── App.tsx             # 应用根组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 🎯 主要功能页面

### 🏠 首页 (`/`)
- 快速概览待办事项和阅读资源
- 最近活动展示
- 快捷操作入口

### 📋 待办事项 (`/todos`)
- 待办事项列表展示
- 筛选和排序功能
- 快速状态切换

### 📚 阅读资源 (`/resources`)
- 阅读资源管理
- 进度跟踪
- 分类浏览

### ➕ 添加页面 (`/add/:type`)
- 统一的添加界面
- 表单验证
- 智能默认值

### 📊 统计页面 (`/statistics`)
- 数据可视化
- 效率分析
- 趋势展示

## 💾 数据存储

应用使用 LocalStorage 进行数据持久化，所有数据都保存在浏览器本地，确保：
- 🔒 数据隐私安全
- ⚡ 快速访问速度
- 📱 离线使用能力

## 🎨 主题系统

支持深色和浅色两种主题模式：
- 🌞 浅色主题：适合白天使用
- 🌙 深色主题：适合夜间使用
- 💾 主题偏好自动保存

## 📱 响应式设计

完全适配各种设备：
- 📱 移动设备 (320px+)
- 📟 平板设备 (768px+)
- 💻 桌面设备 (1024px+)
- 🖥️ 大屏设备 (1280px+)

## 🔧 开发工具

### 代码质量
- ESLint：代码规范检查
- TypeScript：类型安全
- Prettier：代码格式化

### 调试功能
- 开发环境下提供调试页面 (`/debug`)
- 详细的控制台日志
- 状态变化追踪

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues]

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
