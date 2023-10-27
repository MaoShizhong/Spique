import { useContext } from 'react';
import { UserContext } from '../../../../App';
import { fetchData, sortFriends } from '../../../../helpers/helpers';
import styles from '../friends.module.css';

export function RespondButtons({ targetUserID, targetUserUsername, setFriends }) {
    const { user } = useContext(UserContext);

    async function handleFriendRequest(action) {
        const res = await fetchData(
            `/users/${user._id}/friends/${targetUserID}?action=${action}`,
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
                className="bg-accented-sm"
                aria-label={`Accept ${targetUserUsername}'s friend request`}
            >
                {'\u2713'}
            </button>
            <button
                onClick={() => handleFriendRequest('reject')}
                className="bg-accented-sm"
                aria-label={`Reject ${targetUserUsername}'s friend request`}
            >
                {'\u2A2F'}
            </button>
        </div>
    );
}
