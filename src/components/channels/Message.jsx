import { toTimestamp } from '../../helpers/helpers';
import styles from './message.module.css';

export function Message({ message, isOwnMessage }) {
    const isEdited = message.edited;
    const classes = isOwnMessage ? `${styles.message} ${styles.own}` : styles.message;

    return (
        <article className={classes}>
            <div className={styles.details}>
                <span className={styles.name}>{isOwnMessage ? 'You' : message.user.username}</span>
                <span className={styles.timestamp}>{toTimestamp(message.timestamp)}</span>
            </div>
            <p>{message.text}</p>
            {isEdited && <div className={styles.edited}>Edited</div>}
        </article>
    );
}
