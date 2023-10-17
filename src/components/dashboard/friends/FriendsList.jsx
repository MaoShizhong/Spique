import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Filter } from '../Filter';
import { AddFriendsModal } from './AddFriendsModal';
import { RemoveButton } from './friend_request_buttons/RemoveButton';
import { RespondButtons } from './friend_request_buttons/RespondButtons';
import styles from './friends.module.css';

export function FriendsList({ friends, setFriends }) {
    const [filteredFriends, setFilteredFriends] = useState(friends);
    const [isAddModalShowing, setIsAddModalShowing] = useState(false);

    const inputRef = useRef(null);
    const modalRef = useRef(null);

    const filterFriends = useCallback(
        (searchBar) => {
            const filtered = friends.filter((friend) =>
                friend.user.username.includes(searchBar.value)
            );

            setFilteredFriends(searchBar.value ? filtered : friends);
        },
        [friends]
    );

    useEffect(() => {
        filterFriends(inputRef);
    }, [friends, filterFriends]);

    useEffect(() => {
        if (isAddModalShowing) modalRef.current?.showModal();
    }, [isAddModalShowing]);

    return (
        <>
            <Filter callback={filterFriends} ref={inputRef} />

            <button className={styles.add} onClick={() => setIsAddModalShowing(true)}>
                Find friends
            </button>

            <div className={styles.friends_list}>
                {filteredFriends.map((friend) => (
                    <Fragment key={friend.user._id}>
                        <div className={styles.friend}>
                            <span>{friend.user.username}</span>

                            {friend.status === 'incoming' ? (
                                <RespondButtons
                                    targetUserID={friend.user._id}
                                    setFriends={setFriends}
                                />
                            ) : friend.status === 'requested' ? (
                                <div>Requested</div>
                            ) : (
                                <RemoveButton
                                    targetUserID={friend.user._id}
                                    setFriends={setFriends}
                                />
                            )}
                        </div>
                    </Fragment>
                ))}
            </div>

            {isAddModalShowing && (
                <AddFriendsModal
                    friends={friends}
                    setFriends={setFriends}
                    setIsAddModalShowing={setIsAddModalShowing}
                    ref={modalRef}
                />
            )}
        </>
    );
}
