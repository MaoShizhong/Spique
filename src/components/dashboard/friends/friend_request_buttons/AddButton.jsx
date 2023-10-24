import { useContext } from 'react';
import { UserContext } from '../../../../App';
import { fetchData, sortFriends } from '../../../../helpers/helpers';

export function AddButton({ targetUserID, setFriends }) {
    const { user } = useContext(UserContext);

    async function sendFriendRequest() {
        const res = await fetchData(
            `/users/${user._id}/friends?&action=add&userID=${targetUserID}`,
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
        <button className="bg-accented-sm" onClick={sendFriendRequest}>
            Add friend
        </button>
    );
}
