import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App';
import { fetchData } from '../helpers/helpers';
import { Loading } from './loading/Loading';

export function AutoLogin() {
    const { userID } = useParams();
    const { setUser } = useContext(UserContext);

    const goTo = useNavigate();

    useEffect(() => {
        async function autoLogin() {
            const res = await fetchData(`/auth/sessions/github/${userID}`, 'POST');

            if (res.ok) {
                const user = await res.json();
                setUser(user);
            } else {
                setUser(null);
            }

            goTo('/');
        }

        autoLogin();
    }, [userID, goTo, setUser]);

    return <Loading text="Logging in" />;
}
