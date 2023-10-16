import { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Login } from './components/login/Login';
import { fetchData } from './helpers/fetch';

export const UserContext = createContext({
    user: null,
    setUser: () => {},
});

export default function App() {
    const [user, setUser] = useState(null);

    const goTo = useNavigate();

    useEffect(() => {
        (async () => {
            const res = await fetchData('/auth/sessions', 'GET');

            if (res.ok) {
                setUser(await res.json());
            }
        })();
    }, []);

    async function logout() {
        // No need to check response status - if no session then logout anyway
        await fetchData('/auth/sessions', 'DELETE');

        setUser(null);
        goTo('/');
    }

    return (
        <>
            <button
                onClick={logout}
                style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 100 }}
            >
                Logout
            </button>

            <UserContext.Provider
                value={{
                    user: user,
                    setUser: setUser,
                }}
            >
                {user ? <Outlet /> : <Login />}
            </UserContext.Provider>
        </>
    );
}
