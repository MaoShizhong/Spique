import { useNavigate } from 'react-router-dom';
import styles from './channel.module.css';

export function ChannelHeader({ channelName }) {
    const goTo = useNavigate();

    return (
        <header className={styles.header}>
            <button
                onClick={() => {
                    goTo('/dashboard');
                }}
                className={styles.button}
            >
                <svg width="64px" height="64px" viewBox="0 0 1024 1024" fill="currentColor">
                    <g>
                        <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path>
                        <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path>
                    </g>
                </svg>
            </button>

            <h1>{channelName}</h1>

            <button className={`${styles.button} ${styles.options}`}>
                <svg width="64px" height="64px" viewBox="0 0 16 16" fill="currentColor">
                    <g>
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                    </g>
                </svg>
            </button>
        </header>
    );
}
