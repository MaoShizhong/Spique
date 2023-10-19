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

    return (
        <UserContext.Provider
            value={{
                user: user,
                setUser: setUser,
            }}
        >
            <Outlet />
        </UserContext.Provider>
    );
}
