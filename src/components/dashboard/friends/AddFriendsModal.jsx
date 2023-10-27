import { forwardRef, useCallback, useEffect, useState } from 'react';
import { closeModal, fetchData } from '../../../helpers/helpers';
import modalStyles from '../../../modals.module.css';
import { AddRemoveButton } from './friend_request_buttons/AddRemoveButton';
import { RespondButtons } from './friend_request_buttons/RespondButtons';
import styles from './friends.module.css';

export const AddFriendsModal = forwardRef(function AddFriendsModal(
    { isDemo, friends, setFriends, setIsAddModalShowing },
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

        if (!friend) return 'not a friend';
        else return friend.status;
    }

    return (
        <dialog onClick={(e) => closeModal(e, setIsAddModalShowing)} aria-modal ref={modalRef}>
            <div className="sr-only" aria-live="polite">
                Opened add friends modal
            </div>

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
                            <div
                                key={user._id}
                                className={styles.friend}
                                aria-label={`username: ${user.username}. Status: ${friendStatus(
                                    user
                                )}`}
                                tabIndex={0}
                            >
                                <span>{user.username}</span>
                                {isDemo && user.username === 'MaoShizhong' ? (
                                    <div>{':)'}</div>
                                ) : friendStatus(user) === 'incoming' ? (
                                    <RespondButtons
                                        targetUserID={user._id}
                                        targetUserUsername={user.username}
                                        setFriends={setFriends}
                                    />
                                ) : friendStatus(user) === 'requested' ? (
                                    <div>Requested</div>
                                ) : friendStatus(user) === 'accepted' ? (
                                    <AddRemoveButton
                                        type="remove"
                                        targetUserID={user._id}
                                        targetUserUsername={user.username}
                                        setFriends={setFriends}
                                    />
                                ) : (
                                    <AddRemoveButton
                                        type="add"
                                        targetUserID={user._id}
                                        targetUserUsername={user.username}
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
                aria-label="close find friends modal"
            >
                {'\u2A2F'}
            </button>
        </dialog>
    );
});
