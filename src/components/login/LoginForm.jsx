import styles from './login.module.css';

export function LoginForm({ hasError, setIsForgotModalShowing }) {
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

            <a
                href={`${
                    import.meta.env.VITE_MODE === 'prod'
                        ? import.meta.env.VITE_PROD_API
                        : import.meta.env.VITE_DEV_API
                }/auth/users/github`}
                className={styles.github_login}
            >
                <img src="/github.png" alt="github login logo" />
                Login with Github
            </a>

            <button
                type="button"
                className={styles.forgot}
                onClick={() => setIsForgotModalShowing(true)}
            >
                Forgot password?
            </button>
        </>
    );
}
