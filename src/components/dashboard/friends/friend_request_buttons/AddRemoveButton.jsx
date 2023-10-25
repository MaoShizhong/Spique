import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../App';
import { fetchData, sortFriends } from '../../../../helpers/helpers';
import styles from '../friends.module.css';

export function AddRemoveButton({ type, targetUserID, setFriends }) {
    const { user } = useContext(UserContext);

    const goTo = useNavigate();

    async function handleFriend() {
        const endpoint =
            type === 'add'
                ? `/users/${user._id}/friends?&action=add&userID=${targetUserID}`
                : `/users/${user._id}/friends?&userID=${targetUserID}`;

        const method = type === 'add' ? 'PUT' : 'DELETE';

        const res = await fetchData(endpoint, method);

        if (res instanceof Error) {
            goTo('/error');
        } else if (!res.ok) {
            alert('Something went wrong, please try again later.');
        } else {
            const updatedFriendsList = await res.json();
            setFriends(sortFriends(updatedFriendsList));
        }
    }

    return (
        <>
            {type === 'add' ? (
                <button className="bg-accented-sm" onClick={handleFriend}>
                    Add friend
                </button>
            ) : (
                <button
                    className={styles.remove}
                    onClick={handleFriend}
                    aria-label="remove friend status"
                ></button>
            )}
        </>
    );
}
