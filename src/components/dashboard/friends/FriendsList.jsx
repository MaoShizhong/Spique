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
            if (!searchBar.value) return;

            const filtered = friends.filter((friend) =>
                friend.user.username.toLowerCase().includes(searchBar.value.toLowerCase())
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

            <button className="bg-accented-lg" onClick={() => setIsAddModalShowing(true)}>
                Find friends
            </button>

            <section className={styles.overflow_container}>
                <div className={styles.friends_list}>
                    {!filteredFriends.length ? (
                        <div className={styles.no_friends}>
                            <p>No friends found</p>
                            <p>Click the button above to start connecting</p>
                        </div>
                    ) : (
                        filteredFriends.map((friend) => (
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
                        ))
                    )}
                </div>
            </section>

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
