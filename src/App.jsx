import { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { fetchData } from './helpers/helpers';

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

    useEffect(() => {
        if (user) goTo('/dashboard');
        else goTo('/login');
    }, [user, goTo]);

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
                <Outlet />
            </UserContext.Provider>
        </>
    );
}
