import { Link } from 'react-router-dom';
import styles from './header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                Spique
            </Link>
            <a
                href="https://github.com/MaoShizhong/Spique"
                target="_blank"
                rel="noreferrer"
                className={styles.github}
                aria-label="link to github repo"
            >
                <img
                    src="/github.png"
                    alt="github link"
                    className="w-8 transition sm:w-12 hover:scale-125"
                />
            </a>
        </header>
    );
}
