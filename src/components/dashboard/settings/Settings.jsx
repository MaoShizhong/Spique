import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../App';
import { fetchData } from '../../../helpers/helpers';

export function Settings() {
    const { setUser } = useContext(UserContext);

    const goTo = useNavigate();

    async function logout() {
        // No need to check response status - if no session then logout anyway
        await fetchData('/auth/sessions', 'DELETE');

        setUser(null);
        goTo('/');
    }

    return (
        <div>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
