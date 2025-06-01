import { lazy } from 'react';
import { Navigate, useRoutes, type RouteObject } from 'react-router-dom';
import Layout from '../layout/Layout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/page1" />,
      },
      {
        path: '/page1',
        Component: lazy(() => import('../pages/Page1')),
      },
      {
        path: '/page2',
        Component: lazy(() => import('../pages/Page2')),
      },
      {
        path: '/page3',
        Component: lazy(() => import('../pages/Page3')),
      },
    ],
  },
];

const Router = () => {
  return useRoutes(routes);
};

export default Router;
