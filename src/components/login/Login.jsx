import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import styles from './login.module.css';

export function Login() {
    const [form, setForm] = useState('login');

    return (
        <main className={styles.noUser}>
            <div className={styles.container}>
                <nav className={styles.formSelect}>
                    <button
                        className={form === 'login' ? styles.active : ''}
                        onClick={() => setForm('login')}
                    >
                        Login
                    </button>
                    <button
                        className={form === 'signup' ? styles.active : ''}
                        onClick={() => setForm('signup')}
                    >
                        Sign up
                    </button>
                </nav>
                <form className={styles.loginSignup}>
                    {form === 'login' ? <LoginForm /> : <SignupForm />}
                </form>
            </div>
        </main>
    );
}
