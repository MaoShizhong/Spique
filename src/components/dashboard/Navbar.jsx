import styles from './dashboard.module.css';

export function Navbar({ page, setPage, friendRequests }) {
    return (
        <footer>
            <nav className={styles.navbar}>
                <button className={styles.page} onClick={() => setPage('channels')}>
                    <svg
                        viewBox="0 0 24 24"
                        className={page === 'channels' ? styles.active : ''}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="7%"
                    >
                        <g>
                            <path d="M22.5,10.05v10.5l-2.86-2.87H11.05a3.81,3.81,0,0,1-3.7-2.86,3.77,3.77,0,0,1-.12-1V10.05a3.82,3.82,0,0,1,3.82-3.82h7.63A3.82,3.82,0,0,1,22.5,10.05Z"></path>
                            <path d="M16.77,5.27v1H11.05a3.82,3.82,0,0,0-3.82,3.82v2.86H4.36L1.5,15.77V5.27A3.82,3.82,0,0,1,5.32,1.45H13A3.82,3.82,0,0,1,16.77,5.27Z"></path>
                        </g>
                    </svg>
                </button>

                <button className={styles.page} onClick={() => setPage('friends')}>
                    <svg
                        viewBox="0 0 24 24"
                        className={page === 'friends' ? styles.active : ''}
                        fill="none"
                        stroke="currentColor"
                    >
                        <g>
                            <path d="M7.5 9A3.5 3.5 0 1 0 4 5.5 3.504 3.504 0 0 0 7.5 9zm0-6A2.5 2.5 0 1 1 5 5.5 2.503 2.503 0 0 1 7.5 3zm2.713 14a5.456 5.456 0 0 0-.188 1H2v-3.5A4.505 4.505 0 0 1 6.5 10h2a4.503 4.503 0 0 1 4.414 3.649 5.518 5.518 0 0 0-.936.632A3.495 3.495 0 0 0 8.5 11h-2A3.504 3.504 0 0 0 3 14.5V17zm6.287-4A3.5 3.5 0 1 0 13 9.5a3.504 3.504 0 0 0 3.5 3.5zm0-6A2.5 2.5 0 1 1 14 9.5 2.503 2.503 0 0 1 16.5 7zM22 18.5a4.505 4.505 0 0 0-4.5-4.5h-2a4.505 4.505 0 0 0-4.5 4.5V22h11zM21 21h-9v-2.5a3.504 3.504 0 0 1 3.5-3.5h2a3.504 3.504 0 0 1 3.5 3.5z"></path>
                        </g>
                    </svg>

                    {!!friendRequests && (
                        <div className={styles.requests_count}>{friendRequests}</div>
                    )}
                </button>

                <button className={styles.page} onClick={() => setPage('settings')}>
                    <svg
                        viewBox="0 0 24 24"
                        className={page === 'settings' ? styles.active : ''}
                        fill="currentColor"
                    >
                        <g>
                            <path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"></path>
                        </g>
                    </svg>
                </button>
            </nav>
        </footer>
    );
}
