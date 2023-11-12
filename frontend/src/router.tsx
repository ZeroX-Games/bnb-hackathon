import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import MainLayout from './components/MainLayout';
import Game from './pages/Game';
import Login from './pages/Login';
import Friends from './pages/Friends';
import FriendsCollection from './pages/FriendsCollection';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/friends',
        element: <Friends />,
      },
      {
        path: '/friends/:id',
        element: <FriendsCollection />,
      }
    ],
  },
  {
    path: '/game',
    element: <Game />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;
