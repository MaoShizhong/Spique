import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App';
import { fetchData } from '../helpers/helpers';
import { Loading } from './loading/Loading';

export function AutoLogin() {
    const { loginID } = useParams();
    const { setUser } = useContext(UserContext);

    const goTo = useNavigate();

    useEffect(() => {
        async function autoLogin() {
            const res = await fetchData(``, 'POST');

            console.log(res.status);

            if (res.ok) {
                const user = await res.json();
                console.log(user);
            }
        }

        autoLogin();
    }, [loginID, goTo]);

    return <Loading />;
}
