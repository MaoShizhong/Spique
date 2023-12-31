import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../App';
import { Filter } from '../Filter';
import { AddFriendsModal } from './AddFriendsModal';
import { AddRemoveButton } from './friend_request_buttons/AddRemoveButton';
import { RespondButtons } from './friend_request_buttons/RespondButtons';
import styles from './friends.module.css';

export function FriendsList({ friends, setFriends }) {
    const { user } = useContext(UserContext);

    const [filteredFriends, setFilteredFriends] = useState(friends);
    const [isAddModalShowing, setIsAddModalShowing] = useState(false);

    const inputRef = useRef(null);
    const modalRef = useRef(null);

    const filterFriends = useCallback(
        (searchBar) => {
            if (!searchBar.value) {
                setFilteredFriends(friends);
                return;
            }

            const filtered = friends.filter((friend) =>
                friend.user.username.toLowerCase().includes(searchBar.value.toLowerCase())
            );

            setFilteredFriends(filtered);
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
            <div className="sr-only" aria-live="polite">
                Friends list
            </div>

            <Filter list="friends list" callback={filterFriends} ref={inputRef} />

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
                                <div
                                    className={styles.friend}
                                    aria-label={`friend name: ${friend.user.username}. Status: ${friend.status}`}
                                    tabIndex={0}
                                >
                                    <span>{friend.user.username}</span>
                                    {user.isDemo && friend.user.username === 'MaoShizhong' ? (
                                        <div>{':)'}</div>
                                    ) : friend.status === 'incoming' ? (
                                        <RespondButtons
                                            targetUserID={friend.user._id}
                                            targetUserUsername={friend.user.username}
                                            setFriends={setFriends}
                                        />
                                    ) : friend.status === 'requested' ? (
                                        <div>Requested</div>
                                    ) : (
                                        <AddRemoveButton
                                            type="remove"
                                            targetUserID={friend.user._id}
                                            targetUserUsername={friend.user.username}
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
                    isDemo={user.idDemo}
                    friends={friends}
                    setFriends={setFriends}
                    setIsAddModalShowing={setIsAddModalShowing}
                    ref={modalRef}
                />
            )}
        </>
    );
}
