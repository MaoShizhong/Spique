import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../../helpers/helpers';
import { Loading } from '../loading/Loading';
import styles from './reset.module.css';

export function PasswordReset() {
    const { resetID } = useParams();

    const [isValidToken, setIsValidToken] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [settingPassword, setSettingPassword] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState(null);

    const goTo = useNavigate();

    useEffect(() => {
        async function verifyToken() {
            const res = await fetchData(`/auth/password-tokens/${resetID}`, 'POST');

            if (res instanceof Error) {
                setConnectionError(true);
            } else if (res.ok) {
                setIsValidToken(true);
            }

            setVerifying(false);
        }

        verifyToken();
    }, [resetID]);

    async function setNewPassword(e) {
        e.preventDefault();
        setSettingPassword(true);

        const form = e.target;
        const password = form.password.value;
        const confirm = form.confirm.value;

        if (password !== confirm) {
            setPasswordErrors([{ msg: 'Passwords must match' }]);
            setSettingPassword(false);
            return;
        }

        const res = await fetchData(`/auth/password-tokens/${resetID}`, 'PUT', {
            password,
            confirm,
        });

        if (res instanceof Error) {
            alert('Something went wrong with the server, please try again later.');
            setSettingPassword(false);
            goTo('/error');
        } else if (res.status === 400) {
            const errors = await res.json();
            setPasswordErrors(errors);
            setSettingPassword(false);
        } else if (!res.ok) {
            // For catching other error status e.g. 500s
            setSettingPassword(false);
            goTo('/error');
        } else {
            setSettingPassword(false);
            alert('Password changed successfully! Please login again.');
            goTo('/');
        }
    }

    return (
        <main className={styles.main}>
            {verifying ? (
                <>
                    <div className="sr-only" aria-live="polite">
                        Verifying reset link
                    </div>

                    <Loading text="Verifying link" />
                </>
            ) : settingPassword ? (
                <>
                    <div className="sr-only" aria-live="polite">
                        Setting new password
                    </div>

                    <Loading text="Setting new password" />
                </>
            ) : connectionError ? (
                <>
                    <p aria-live="polite">
                        Something went wrong with the server, please try again later.
                    </p>
                    <Link to="/" className={`${styles.return} bg-accented-l`}>
                        Return to homepage
                    </Link>
                </>
            ) : !isValidToken ? (
                <>
                    <p aria-live="polite">
                        This link has expired.
                        <br />
                        Please request a new password reset link.
                    </p>
                    <Link to="/" className={`${styles.return} bg-accented-lg`}>
                        Return to homepage
                    </Link>
                </>
            ) : (
                <form className={styles.form} onSubmit={setNewPassword}>
                    <div className="sr-only" aria-live="polite">
                        Link verified. Password reset screen.
                    </div>

                    <img src="/spique-full.png" alt="spique logo" className={styles.logo} />

                    <h1>Password reset</h1>

                    {passwordErrors && (
                        <ul>
                            {passwordErrors.map((error, i) => (
                                <li key={i} className={styles.error}>
                                    {error.msg}
                                </li>
                            ))}
                        </ul>
                    )}

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        aria-label="enter password"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                        onInput={() => setPasswordErrors(null)}
                        required
                    />

                    <input
                        name="confirm"
                        type="password"
                        placeholder="Confirm password"
                        aria-label="confirm password"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                        onInput={() => setPasswordErrors(null)}
                        required
                    />

                    <p className={styles.reqs}>
                        Password must be at least 8 characters and include at least 1 uppercase, 1
                        lowercase, and 1 number
                    </p>

                    <button>Set new password</button>
                </form>
            )}
        </main>
    );
}
