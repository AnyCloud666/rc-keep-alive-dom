import { lazy } from 'react';
import { useRoutes, type RouteObject } from 'react-router-dom';
import Layout from '../layout/Layout';

const routes: RouteObject[] = [
  {
    path: '/layout',
    element: <Layout />,
    children: [
      {
        path: '/layout/page1',
        Component: lazy(() => import('../pages/Page1')),
      },
      {
        path: '/layout/page2',
        Component: lazy(() => import('../pages/Page2')),
      },
    ],
  },
];

const Router = () => {
  return useRoutes(routes);
};

export default Router;
