import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Dashboard } from './components/dashboard/Dashboard';
import { ErrorPage } from './components/error/ErrorPage';
import { Login } from './components/login/Login';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/error', element: <ErrorPage /> },
            { path: '/login', element: <Login /> },
            { path: '/dashboard', element: <Dashboard /> },
        ],
    },
]);
