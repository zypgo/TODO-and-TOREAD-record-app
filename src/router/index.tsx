import { createHashRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import TodosPage from '../pages/TodosPage';
import ResourcesPage from '../pages/ResourcesPage';
import AddPage from '../pages/AddPage';
import DetailPage from '../pages/DetailPage';
import StatisticsPage from '../pages/StatisticsPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'todos',
        element: <TodosPage />,
      },
      {
        path: 'resources',
        element: <ResourcesPage />,
      },
      {
        path: 'add',
        element: <AddPage />,
      },
      {
        path: 'add/:type',
        element: <AddPage />,
      },
      {
        path: 'detail/:type/:id',
        element: <DetailPage />,
      },
      {
        path: 'statistics',
        element: <StatisticsPage />,
      },
    ],
  },
]);