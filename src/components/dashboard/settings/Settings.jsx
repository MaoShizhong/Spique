import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../App';
import { fetchData } from '../../../helpers/helpers';
import { ConfirmButton } from '../../confirm/ConfirmButton';
import { ChangeableDetail } from './ChangeableDetail';
import styles from './settings.module.css';

export function Settings() {
    const { user, setUser } = useContext(UserContext);

    const goTo = useNavigate();

    async function sendPasswordResetEmail() {
        if (user.isDemo) {
            alert('This feature does not work for demo accounts.');
            return;
        }

        const res = await fetchData('/auth/password-tokens', 'POST', { userID: user._id });

        if (res instanceof Error || !res.ok) {
            goTo('/error');
        } else {
            alert(
                'An email containing a password reset link has been sent to the email associated with this account.\nThe link will expire after 10 minutes.'
            );
        }
    }

    async function logout() {
        // No need to check response status - if no session then logout anyway
        await fetchData('/auth/sessions', 'DELETE');

        setUser(null);
        goTo('/');
    }

    return (
        <div className={styles.settings}>
            <ChangeableDetail userDetail="username" />

            <ChangeableDetail userDetail="email" />

            <ConfirmButton
                initialText="Request password reset"
                callback={sendPasswordResetEmail}
                buttonAlignment="center"
            />

            <ConfirmButton initialText="Logout" callback={logout} buttonAlignment="center" />
        </div>
    );
}
