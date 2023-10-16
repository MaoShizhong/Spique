import styles from './login.module.css';

export function SignupForm() {
    return (
        <>
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
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                required
            />

            <input
                name="confirm"
                type="password"
                placeholder="Confirm password"
                aria-label="confirm password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                required
            />

            <p className={styles.reqs}>
                Password must be at least 8 characters and include at least 1 uppercase, 1
                lowercase, and 1 number
            </p>

            <button>Create account</button>
        </>
    );
}
