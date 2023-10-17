import styles from '../friends.module.css';

export function RespondButtons() {
    return (
        <div className={styles.friend_request}>
            Accept?
            <button aria-label="accept friend request">{'\u2713'}</button>
            <button aria-label="reject friend request">{'\u2A2F'}</button>
        </div>
    );
}
