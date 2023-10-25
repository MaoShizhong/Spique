import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../helpers/helpers';
import { Loading } from '../loading/Loading';
import styles from './reset.module.css';

export function PasswordReset() {
    const { resetID } = useParams();

    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const [connectionError, setConnectionError] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState(null);

    useEffect(() => {
        async function verifyToken() {
            const res = await fetchData(`/auth/password-tokens/${resetID}`, 'POST');

            if (res instanceof Error) {
                setConnectionError(true);
            } else if (res.ok) {
                setIsValidToken(true);
            }

            setLoading(false);
        }

        verifyToken();
    }, [resetID]);

    return (
        <main className={styles.main}>
            {loading ? (
                <Loading text="Verifying link" />
            ) : connectionError ? (
                <p>Something went wrong with the server, please try again later.</p>
            ) : !isValidToken ? (
                <p>
                    This link has expired.
                    <br />
                    Please request a new password reset link.
                </p>
            ) : (
                <form>
                    {passwordErrors && (
                        <ul>
                            {passwordErrors.map((error, i) => (
                                <li key={i} className={styles.error}>
                                    {error.msg}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
            )}
        </main>
    );
}
