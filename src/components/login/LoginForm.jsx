export function LoginForm() {
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
                Password
                <input name="password" type="password" aria-label="enter password" required />
            </label>

            <button>Login</button>
        </>
    );
}
