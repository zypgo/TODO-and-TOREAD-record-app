import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router';
import { useAppStore } from './store';

function App() {
  const { initializeData } = useAppStore();
  
  useEffect(() => {
    // 初始化示例数据
    initializeData();
  }, [initializeData]);
  
  return (
    <>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#1e293b',
          },
        }}
      />
    </>
  );
}

export default App;
