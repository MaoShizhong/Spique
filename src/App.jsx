import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/header/Header';
import { Login } from './components/login/Login';

export const UserContext = createContext({
    _id: '',
    username: '',
});

export default function App() {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider
            value={{
                user: '',
                setUser: '',
            }}
        >
            <Header />
            {user ? <Outlet /> : <Login />}
        </UserContext.Provider>
    );
}
