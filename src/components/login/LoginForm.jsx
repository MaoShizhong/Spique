import styles from './login.module.css';

export function LoginForm({ hasError }) {
    return (
        <>
            <div className="sr-only" aria-live="polite">
                Login screen
            </div>

            <input
                name="username"
                type="text"
                placeholder="Username"
                aria-label="enter username"
                autoComplete="off"
                required
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                aria-label="enter password"
                required
            />

            {hasError && <p className={styles.error}>Incorrect username or password</p>}

            <button>Login</button>
        </>
    );
}
