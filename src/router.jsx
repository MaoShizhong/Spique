import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { Channel } from './components/channels/Channel';
import { Dashboard } from './components/dashboard/Dashboard';
import { ErrorPage } from './components/error/ErrorPage';
import { PasswordReset } from './components/password_reset/PasswordReset';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: '/error', element: <ErrorPage /> },
            { path: '/', element: <Dashboard /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/channels/:channelID', element: <Channel /> },
        ],
    },
    {
        path: '/password-reset/:resetID',
        element: <PasswordReset />,
    },
]);
