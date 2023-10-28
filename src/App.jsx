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
            const res = await fetchData('/auth/sessions', 'GET');

            console.log(document.cookie);

            if (res instanceof Error) {
                alert('Something went wrong with the server, please try again later!');
            } else if (!res.ok) {
                goTo('/');
            } else {
                setUser(await res.json());
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
            <button
                style={{ bottom: '3rem', right: '3rem', position: 'fixed' }}
                onClick={async () => {
                    const res = await fetchData('/auth/test');

                    console.log(res.status, res);
                }}
            >
                REDIRECT
            </button>
        </UserContext.Provider>
    );
}
