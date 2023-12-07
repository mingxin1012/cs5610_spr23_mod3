import React from 'react'
import ReactDOM from 'react-dom/client'
import { UserProvider } from './UserContext'; 

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from './Login';
import CreateUser from './CreateUser';
import UserPage from './UserPage';
import HomePage from './HomePage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <CreateUser />
  },
  {
    path: '/:username',
    element: <UserPage />
  },
  {
    path: '/',
    element: <HomePage />
  }
])



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);