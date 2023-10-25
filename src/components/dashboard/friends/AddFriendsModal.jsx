import { forwardRef, useCallback, useEffect, useState } from 'react';
import { closeModal, fetchData } from '../../../helpers/helpers';
import modalStyles from '../../../modals.module.css';
import { AddRemoveButton } from './friend_request_buttons/AddRemoveButton';
import { RespondButtons } from './friend_request_buttons/RespondButtons';
import styles from './friends.module.css';

export const AddFriendsModal = forwardRef(function AddFriendsModal(
    { friends, setFriends, setIsAddModalShowing },
    modalRef
) {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);

    const searchUsers = useCallback(async () => {
        const res = await fetchData(`/users?search=${searchText}`, 'GET');

        if (res instanceof Error) {
            alert('Something went wrong with the server, please try again later.');
        } else if (!res.ok) {
            setSearchError(res.status);
        } else {
            const results = await res.json();
            setSearchResults(results);
            setSearchError(null);
        }
    }, [searchText]);

    useEffect(() => {
        // Automatically searches when user stops typing
        const stopTypingDelay = setTimeout(() => {
            // Only search when query is at least minimum username length (3)
            if (searchText.length > 2) searchUsers();
        }, 1000);

        return () => clearTimeout(stopTypingDelay);
    }, [searchText, searchUsers]);

    function friendStatus(user) {
        const friend = friends.find((friend) => friend.user.username === user.username);

        if (!friend) return 'not';
        else return friend.status;
    }

    return (
        <dialog onClick={(e) => closeModal(e, setIsAddModalShowing)} ref={modalRef}>
            <div className={modalStyles.modal}>
                <input
                    type="text"
                    placeholder="Search users"
                    aria-label="Search for users"
                    onChange={(e) => setSearchText(e.target.value)}
                />

                {searchError ? (
                    <div className={styles.results}>
                        {searchError} - something went wrong! Please try again later.
                    </div>
                ) : !searchResults.length ? (
                    <div className={styles.results}>No users found!</div>
                ) : (
                    <div className={styles.results}>
                        {searchResults.map((user) => (
                            <div key={user._id} className={styles.friend}>
                                <span>{user.username}</span>
                                {friendStatus(user) === 'incoming' ? (
                                    <RespondButtons
                                        targetUserID={user._id}
                                        setFriends={setFriends}
                                    />
                                ) : friendStatus(user) === 'requested' ? (
                                    <div>Requested</div>
                                ) : friendStatus(user) === 'accepted' ? (
                                    <AddRemoveButton
                                        type="remove"
                                        targetUserID={user._id}
                                        setFriends={setFriends}
                                    />
                                ) : (
                                    <AddRemoveButton
                                        type="add"
                                        targetUserID={user._id}
                                        setFriends={setFriends}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                id="close"
                className={modalStyles.close}
                onClick={(e) => closeModal(e, setIsAddModalShowing)}
            >
                {'\u2A2F'}
            </button>
        </dialog>
    );
});
