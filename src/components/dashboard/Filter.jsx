import styles from './dashboard.module.css';

export function Filter({ callback }) {
    return (
        <div className={styles.filter}>
            Filter:
            <input type="text" aria-label="Filter" onChange={callback} />
        </div>
    );
}
