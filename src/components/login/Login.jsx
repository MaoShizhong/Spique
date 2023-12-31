import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { fetchData } from '../../helpers/helpers';
import { Github } from '../dashboard/Github';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import styles from './login.module.css';

export function Login() {
    const [formType, setFormType] = useState('login');
    const [errors, setErrors] = useState(null);
    const [isForgotModalShowing, setIsForgotModalShowing] = useState(false);

    const { user, setUser } = useContext(UserContext);

    const modalRef = useRef(null);
    const goTo = useNavigate();

    useEffect(() => {
        if (user) goTo('/dashboard');
    }, [user, goTo]);

    useEffect(() => {
        if (modalRef.current) modalRef.current.showModal();
    }, [isForgotModalShowing]);

    async function submitForm(e, demoAccount) {
        e.preventDefault();

        const form = {};

        // handle demo account button
        if (demoAccount) {
            form.username = `DemoAccount${demoAccount}`;
            form.password = import.meta.env.VITE_DEMO_PW;
        } else {
            for (const input of Object.values(e.target)) {
                if (input instanceof HTMLInputElement) form[input.name] = input.value;
            }
        }

        const endpoint = formType === 'login' ? '/auth/sessions/local' : '/auth/users';

        const res = await fetchData(endpoint, 'POST', form);

        if (res instanceof Error) {
            goTo('/error');
        } else if (res.ok) {
            const user = await res.json();

            setUser(user);
        } else if (res.status === 401) {
            setErrors(true);
        } else {
            const errors = await res.json();

            setErrors(errors);
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

                <nav className={styles.formSelect}>
                    <button
                        className={formType === 'login' ? styles.active : ''}
                        onClick={() => changeForm('login')}
                        aria-label="Switch to login screen"
                    >
                        Login
                    </button>
                    <button
                        className={formType === 'signup' ? styles.active : ''}
                        onClick={() => changeForm('signup')}
                        aria-label="Switch to account creation screen"
                    >
                        Create account
                    </button>
                </nav>

                <form className={styles.loginSignup} onSubmit={submitForm}>
                    {formType === 'login' ? (
                        <>
                            <LoginForm
                                hasError={errors}
                                setIsForgotModalShowing={setIsForgotModalShowing}
                            />

                            <div className={styles.demo}>
                                <button
                                    type="button"
                                    onClick={(e) => submitForm(e, 1)}
                                    aria-label="Login with demo account 1"
                                >
                                    Demo account 1
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => submitForm(e, 2)}
                                    aria-label="Login with demo account 2"
                                >
                                    Demo account 2
                                </button>
                            </div>
                        </>
                    ) : (
                        <SignupForm errors={errors} />
                    )}
                </form>
            </div>

            {isForgotModalShowing && (
                <ForgotPasswordModal setIsModalShowing={setIsForgotModalShowing} ref={modalRef} />
            )}
        </main>
    );
}
