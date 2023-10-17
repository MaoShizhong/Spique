import { useContext } from 'react';
import { UserContext } from '../../../../App';
import { fetchData, sortFriends } from '../../../../helpers/helpers';
import styles from '../friends.module.css';

export function RemoveButton({ targetUserID, setFriends }) {
    const { user } = useContext(UserContext);

    async function removeFriend() {
        const res = await fetchData(`/users/${user._id}/friends?&userID=${targetUserID}`, 'DELETE');

        if (res.ok) {
            const updatedFriendsList = await res.json();
            setFriends(sortFriends(updatedFriendsList));
        } else {
            alert('Something went wrong, please try again later.');
        }
    }

    return (
        <button
            className={styles.remove}
            onClick={removeFriend}
            aria-label="remove friend status"
        ></button>
    );
}
