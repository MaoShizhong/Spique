import { forwardRef, useCallback, useEffect, useState } from 'react';
import { fetchData } from '../../../helpers/fetch';
import { AddButton } from './friend_request_buttons/AddButton';
import { RemoveButton } from './friend_request_buttons/RemoveButton';
import { RespondButtons } from './friend_request_buttons/RespondButtons';
import styles from './friends.module.css';

export const AddFriends = forwardRef(function AddFriends(
    { friends, setIsAddModalShowing },
    modalRef
) {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState(null);

    const searchUsers = useCallback(async () => {
        const res = await fetchData(`/users?search=${searchText}`, 'GET');

        if (res.ok) {
            const results = await res.json();
            setSearchResults(results);
            setSearchError(null);
        } else {
            setSearchError(res.status);
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

    function closeModal(e) {
        // Allows closing upon clicking outside modal (or dedicated close button)
        if (e.target.tagName === 'DIALOG' || e.target.tagName === 'BUTTON') {
            modalRef.current.close();
            setIsAddModalShowing(false);
        }
    }

    return (
        <dialog onClick={closeModal} ref={modalRef}>
            <button className={styles.close} onClick={closeModal}>
                {'\u2A2F'}
            </button>

            <div className={styles.modal}>
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
                                    <RespondButtons />
                                ) : friendStatus(user) === 'pending' ? (
                                    <div>Pending</div>
                                ) : friendStatus(user) === 'accepted' ? (
                                    <RemoveButton />
                                ) : (
                                    <AddButton />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </dialog>
    );
});
