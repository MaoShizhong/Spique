import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { Github } from '../dashboard/Github';
import { Loading } from '../loading/Loading';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import styles from './login.module.css';

export function Login() {
    const [formType, setFormType] = useState('login');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

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
            } else if (res.status === 401) {
                setErrors(true);
                setLoading(false);
            } else {
                const errors = await res.json();

                setErrors(errors);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            goTo('/error');
        }
    }

    // Reset errors when changing form
    function changeForm(type) {
        setErrors(null);
        setFormType(type);
    }

    return (
        // static 'login' class for bg-gradient animation for login screen only
        <main className={`${styles.noUser} login`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img src="/spique-full.png" alt="Website logo image" />
                    <Github classObj={styles.github} />
                </div>

                {loading ? (
                    <Loading text={formType === 'login' ? 'Logging in' : 'Creating account'} />
                ) : (
                    <>
                        <nav className={styles.formSelect}>
                            <button
                                className={formType === 'login' ? styles.active : ''}
                                onClick={() => changeForm('login')}
                            >
                                Login
                            </button>
                            <button
                                className={formType === 'signup' ? styles.active : ''}
                                onClick={() => changeForm('signup')}
                            >
                                Create account
                            </button>
                        </nav>

                        <form className={styles.loginSignup} onSubmit={submitForm}>
                            {formType === 'login' ? (
                                <LoginForm hasError={errors} />
                            ) : (
                                <SignupForm errors={errors} />
                            )}
                        </form>
                    </>
                )}
            </div>
        </main>
    );
}
