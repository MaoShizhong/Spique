import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { AutoLogin } from './components/AutoLogin';
import { Channel } from './components/channels/Channel';
import { Dashboard } from './components/dashboard/Dashboard';
import { DeleteAccount } from './components/delete_account/DeleteAccount';
import { ErrorPage } from './components/error/ErrorPage';
import { PasswordReset } from './components/password_reset/PasswordReset';
import { PrivacyPolicy } from './components/privacy/PrivacyPolicy';

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
            {
                path: '/login/:loginID',
                element: <AutoLogin />,
            },
        ],
    },

    {
        path: '/password-reset/:resetID',
        element: <PasswordReset />,
    },
    {
        path: '/delete-account/:resetID',
        element: <DeleteAccount />,
    },
    {
        path: '/privacy',
        element: <PrivacyPolicy />,
    },
]);
