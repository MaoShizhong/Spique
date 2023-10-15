import styles from './login.module.css';

export function SignupForm() {
    return (
        <>
            <label>
                Username
                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    aria-label="enter username"
                    autoComplete="off"
                    required
                />
            </label>

            <label>
                Email
                <input
                    name="username"
                    type="email"
                    placeholder="Email"
                    aria-label="enter email"
                    autoComplete="off"
                    required
                />
            </label>

            <label>
                Password
                <input name="password" type="password" aria-label="enter password" required />
            </label>
            <p className={styles.password_reqs}>
                Password must be at least 8 characters and include at least 1 uppercase, 1
                lowercase, and 1 number
            </p>

            <label>
                Confirm password
                <input name="confirm" type="password" aria-label="confirm password" required />
            </label>

            <button>Sign up</button>
        </>
    );
}
