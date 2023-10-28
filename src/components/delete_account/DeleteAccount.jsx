import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchData } from '../../helpers/helpers';
import { Loading } from '../loading/Loading';
import styles from './delete.module.css';

export function DeleteAccount() {
    const { resetID } = useParams();

    const [isValidToken, setIsValidToken] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [connectionError, setConnectionError] = useState(false);

    useEffect(() => {
        async function verifyToken() {
            const res = await fetchData(`/auth/users/${resetID}`, 'DELETE');

            if (res instanceof Error) {
                setConnectionError(true);
            } else if (res.ok) {
                setIsValidToken(true);
            }

            setVerifying(false);
        }

        verifyToken();
    }, [resetID]);

    return (
        <main className={styles.main}>
            {verifying ? (
                <>
                    <div className="sr-only" aria-live="polite">
                        Verifying account deletion link
                    </div>

                    <Loading text="Verifying link" />
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
                        Please request a new account deletion link.
                    </p>
                    <Link to="/" className={`${styles.return} bg-accented-lg`}>
                        Return to homepage
                    </Link>
                </>
            ) : (
                <>
                    <p aria-live="polite">Your account has successfully been deleted.</p>
                    <Link to="/" className={`${styles.return} bg-accented-lg`}>
                        Return to homepage
                    </Link>
                </>
            )}
        </main>
    );
}
