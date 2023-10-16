import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { Loading } from '../loading/Loading';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import styles from './login.module.css';

export function Login() {
    const [formType, setFormType] = useState('login');
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const { setUser } = useContext(UserContext);

    const goTo = useNavigate();

    async function submitForm(e) {
        e.preventDefault();
        setLoading(true);

        const form = {};
        for (const input of Object.values(e.target)) {
            if (input instanceof HTMLInputElement) form[input.name] = input.value;
        }

        const endpoint = formType === 'login' ? '/auth/sessions' : '/auth/users';

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                credentials: 'include',
                method: 'POST',
                body: new URLSearchParams(form),
            });

            if (res.ok) {
                const user = await res.json();
                setUser(user);
                setLoading(false);
                goTo(`/${user._id}`);
            } else {
                setHasError(true);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            goTo('/error');
        }
    }

    return (
        <main className={styles.noUser}>
            <div className={styles.container}>
                <img className={styles.logo} src="/spique-full.png" alt="Website logo image" />

                {loading ? (
                    <Loading text={formType === 'login' ? 'Logging in' : 'Creating account'} />
                ) : (
                    <>
                        <nav className={styles.formSelect}>
                            <button
                                className={formType === 'login' ? styles.active : ''}
                                onClick={() => setFormType('login')}
                            >
                                Login
                            </button>
                            <button
                                className={formType === 'signup' ? styles.active : ''}
                                onClick={() => setFormType('signup')}
                            >
                                Create account
                            </button>
                        </nav>

                        <form className={styles.loginSignup} onSubmit={submitForm}>
                            {formType === 'login' ? (
                                <LoginForm hasError={hasError} />
                            ) : (
                                <SignupForm />
                            )}
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}
