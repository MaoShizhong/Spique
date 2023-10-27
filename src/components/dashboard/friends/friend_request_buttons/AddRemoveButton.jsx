import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../App';
import { fetchData, sortFriends } from '../../../../helpers/helpers';
import styles from '../friends.module.css';

export function AddRemoveButton({ type, targetUserID, targetUserUsername, setFriends }) {
    const { user } = useContext(UserContext);

    const goTo = useNavigate();

    async function handleFriend() {
        const method = type === 'add' ? 'POST' : 'DELETE';

        const res = await fetchData(`/users/${user._id}/friends/${targetUserID}`, method);

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
                <button
                    className="bg-accented-sm"
                    onClick={handleFriend}
                    aria-label={`Send ${targetUserUsername} a friend request`}
                >
                    Add friend
                </button>
            ) : (
                <button
                    className={styles.remove}
                    onClick={handleFriend}
                    aria-label={`Remove ${targetUserUsername} as a friend`}
                ></button>
            )}
        </>
    );
}
