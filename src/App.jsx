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
        const res = await fetchData('/auth/sessions', 'DELETE');

        if (res.ok) {
            setUser(null);
            goTo('/');
        }
    }

    return (
        <>
            <button onClick={logout} style={{ position: 'fixed', bottom: 0, left: 0 }}>
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
