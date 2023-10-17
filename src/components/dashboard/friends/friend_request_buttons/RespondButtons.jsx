import { useContext } from 'react';
import { UserContext } from '../../../../App';
import { fetchData, sortFriends } from '../../../../helpers/helpers';
import styles from '../friends.module.css';

export function RespondButtons({ targetUserID, setFriends }) {
    const { user } = useContext(UserContext);

    async function handleFriendRequest(action) {
        const res = await fetchData(
            `/users/${user._id}/friends?action=${action}&userID=${targetUserID}`,
            'PUT'
        );

        if (res.ok) {
            const updatedFriendsList = await res.json();
            setFriends(sortFriends(updatedFriendsList));
        } else {
            alert('Something went wrong, please try again later.');
        }
    }

    return (
        <div className={styles.friend_request}>
            Accept?
            <button
                onClick={() => handleFriendRequest('accept')}
                aria-label="accept friend request"
            >
                {'\u2713'}
            </button>
            <button
                onClick={() => handleFriendRequest('reject')}
                aria-label="reject friend request"
            >
                {'\u2A2F'}
            </button>
        </div>
    );
}
