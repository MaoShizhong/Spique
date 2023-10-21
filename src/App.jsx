import { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Login } from './components/login/Login';
import { fetchData } from './helpers/helpers';

export const UserContext = createContext({
    user: null,
    setUser: () => {},
});

export default function App() {
    const [user, setUser] = useState(null);

    const goTo = useNavigate();

    useEffect(() => {
        async function autoLogin() {
            try {
                const res = await fetchData('/auth/sessions', 'GET');

                if (res.ok) {
                    setUser(await res.json());
                } else {
                    goTo('/');
                }
            } catch (error) {
                goTo('/error');
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
            {user ? <Outlet /> : <Login />}
        </UserContext.Provider>
    );
}
