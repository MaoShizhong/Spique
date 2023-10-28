import { toTimestamp } from '../../helpers/helpers';
import styles from './message.module.css';

export function Message({ message, isOwnMessage }) {
    const classes = isOwnMessage ? `${styles.message} ${styles.own}` : styles.message;

    let author;
    if (isOwnMessage) {
        author = 'You';
    } else if (!message.user) {
        author = 'deleted account';
    } else {
        author = message.user.username;
    }

    return (
        <article className={classes}>
            <div className={styles.details}>
                <span className={styles.name}>{author}</span>
                <span className={styles.timestamp}>{toTimestamp(message.timestamp)}</span>
            </div>
            <p>{message.text}</p>
        </article>
    );
}
