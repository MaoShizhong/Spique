import { Fragment } from 'react';
import styles from './friends.module.css';

export function FriendsList({ friends }) {
    return (
        <>
            {/* Search bar here */}
            <div className={styles.friends_list}>
                {friends.map((friend) => (
                    <Fragment key={friend.user._id}>
                        <div className={styles.friend}>
                            {friend.user.username}
                            {friend.status === 'incoming' ? (
                                <div className={styles.friend_request}>
                                    Accept?
                                    <button aria-label="accept friend request">{'\u2713'}</button>
                                    <button aria-label="reject friend request">{'\u2A2F'}</button>
                                </div>
                            ) : friend.status === 'pending' ? (
                                <div>Pending</div>
                            ) : (
                                <button className={styles.remove}></button>
                            )}
                        </div>
                    </Fragment>
                ))}
            </div>
        </>
    );
}
