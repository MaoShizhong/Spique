import { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Loading } from './components/loading/Loading';
import { Login } from './components/login/Login';
import { fetchData } from './helpers/helpers';

export const UserContext = createContext({
    user: null,
    setUser: () => {},
});

export default function App() {
    const [user, setUser] = useState(null);
    const [initialising, setInitialising] = useState(true);

    const goTo = useNavigate();

    useEffect(() => {
        async function autoLogin() {
            if (window.location.pathname.includes('login')) {
                setInitialising(false);
                return;
            }

            const res = await fetchData('/auth/sessions/all', 'GET');

            if (res instanceof Error) {
                setInitialising(false);
                alert('Something went wrong with the server, please try again later!');
            } else if (!res.ok) {
                setInitialising(false);
                goTo('/');
            } else {
                setUser(await res.json());
                setInitialising(false);
            }
        }

        autoLogin();
    }, [goTo]);

    return (
        <UserContext.Provider
            value={{
                user: user,
                setUser: setUser,
            }}
        >
            {initialising ? (
                <Loading />
            ) : window.location.pathname.includes('login') || user ? (
                <Outlet />
            ) : (
                <Login />
            )}
        </UserContext.Provider>
    );
}
