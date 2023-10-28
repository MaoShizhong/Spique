import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App';
import { fetchData } from '../helpers/helpers';
import { Loading } from './loading/Loading';

export function AutoLogin() {
    const { token } = useParams();
    const { setUser } = useContext(UserContext);

    const goTo = useNavigate();

    useEffect(() => {
        async function autoLogin() {
            const res = await fetchData(`/auth/sessions/github/${token}`, 'POST');

            if (res.ok) {
                const user = await res.json();
                setUser(user);
            } else {
                setUser(null);
            }

            goTo('/');
        }

        autoLogin();
    }, [token, goTo, setUser]);

    return <Loading text="Logging in" />;
}
