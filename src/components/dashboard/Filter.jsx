import { forwardRef } from 'react';
import styles from './dashboard.module.css';

export const Filter = forwardRef(function Filter({ list, callback }, inputRef) {
    return (
        <div className={styles.filter}>
            Filter:
            <input
                type="text"
                aria-label={`Filter ${list} by name`}
                ref={inputRef}
                onInput={(e) => callback(e.target)}
            />
        </div>
    );
});
