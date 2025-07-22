import { useAppStore } from '../store';
import { Trash2 } from 'lucide-react';

const DebugPage = () => {
  const { todos, resources, deleteTodo, deleteResource, addTodo, addResource } = useAppStore();

  const handleAddTestTodo = () => {
    addTodo({
      title: '测试待办事项',
      description: '这是一个用于测试删除功能的待办事项',
      status: 'pending',
      priority: 'medium',
      tags: ['测试']
    });
  };

  const handleAddTestResource = () => {
    addResource({
      title: '测试阅读资源',
      description: '这是一个用于测试删除功能的阅读资源',
      type: 'article',
      status: 'unread',
      category: '测试',
      estimatedReadTime: 30,
      tags: ['测试']
    });
  };

  const handleDeleteTodo = (id: string) => {
    console.log('=== 删除待办事项调试信息 ===');
    console.log('删除前的待办事项数量:', todos.length);
    console.log('要删除的待办事项ID:', id);
    console.log('删除前的待办事项列表:', todos);
    
    deleteTodo(id);
    
    // 使用setTimeout来检查删除后的状态
    setTimeout(() => {
      console.log('删除后的待办事项数量:', useAppStore.getState().todos.length);
      console.log('删除后的待办事项列表:', useAppStore.getState().todos);
      console.log('localStorage中的数据:', localStorage.getItem('todo-app-storage'));
    }, 100);
  };

  const handleDeleteResource = (id: string) => {
    console.log('=== 删除阅读资源调试信息 ===');
    console.log('删除前的阅读资源数量:', resources.length);
    console.log('要删除的阅读资源ID:', id);
    console.log('删除前的阅读资源列表:', resources);
    
    deleteResource(id);
    
    // 使用setTimeout来检查删除后的状态
    setTimeout(() => {
      console.log('删除后的阅读资源数量:', useAppStore.getState().resources.length);
      console.log('删除后的阅读资源列表:', useAppStore.getState().resources);
      console.log('localStorage中的数据:', localStorage.getItem('todo-app-storage'));
    }, 100);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">删除功能调试页面</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">测试数据</h2>
          <div className="flex gap-4">
            <button
              onClick={handleAddTestTodo}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              添加测试待办事项
            </button>
            <button
              onClick={handleAddTestResource}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              添加测试阅读资源
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">待办事项 ({todos.length})</h2>
          <div className="space-y-2">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between p-3 bg-white border rounded">
                <div>
                  <span className="font-medium">{todo.title}</span>
                  <span className="text-sm text-gray-500 ml-2">ID: {todo.id}</span>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {todos.length === 0 && (
              <p className="text-gray-500">没有待办事项</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">阅读资源 ({resources.length})</h2>
          <div className="space-y-2">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between p-3 bg-white border rounded">
                <div>
                  <span className="font-medium">{resource.title}</span>
                  <span className="text-sm text-gray-500 ml-2">ID: {resource.id}</span>
                </div>
                <button
                  onClick={() => handleDeleteResource(resource.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {resources.length === 0 && (
              <p className="text-gray-500">没有阅读资源</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">调试信息</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>请打开浏览器开发者工具的控制台查看详细的调试信息</p>
            <p>当前localStorage数据:</p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(JSON.parse(localStorage.getItem('todo-app-storage') || '{}'), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;