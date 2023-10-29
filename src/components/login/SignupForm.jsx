import styles from './login.module.css';

export function SignupForm({ errors }) {
    return (
        <>
            <div className="sr-only" aria-live="polite">
                Account creation screen
            </div>

            {errors && (
                <ul>
                    {errors.map((error, i) => (
                        <li key={i} className={styles.error}>
                            {error.msg}
                        </li>
                    ))}
                </ul>
            )}
            <p className={styles.reqs}>All fields are required</p>

            <input
                name="username"
                type="text"
                placeholder="Username (min. 3 characters)"
                aria-label="enter username"
                autoComplete="off"
                minLength={3}
                required
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
                aria-label="enter email"
                autoComplete="off"
                required
            />

            <input
                name="password"
                type="password"
                placeholder="Password"
                aria-label="enter password"
                autoComplete="new-password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                required
            />

            <input
                name="confirm"
                type="password"
                placeholder="Confirm password"
                aria-label="confirm password"
                autoComplete="off"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                required
            />

            <p className={styles.reqs} tabIndex={0}>
                Password must be at least 8 characters and include at least 1 uppercase, 1
                lowercase, and 1 number
            </p>

            <button>Create account</button>

            <a
                href={`${
                    import.meta.env.VITE_MODE === 'prod'
                        ? import.meta.env.VITE_PROD_API
                        : import.meta.env.VITE_DEV_API
                }/auth/users/github`}
                className={styles.github_login}
            >
                <img src="/github.png" alt="github login logo" />
                Create account using Github
            </a>
        </>
    );
}
