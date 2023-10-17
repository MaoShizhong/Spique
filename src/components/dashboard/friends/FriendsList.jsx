import { Fragment, useEffect, useRef, useState } from 'react';
import { Filter } from '../Filter';
import { AddFriends } from './AddFriends';
import { RemoveButton } from './friend_request_buttons/RemoveButton';
import { RespondButtons } from './friend_request_buttons/RespondButtons';
import styles from './friends.module.css';

export function FriendsList({ friends }) {
    const [filteredFriends, setFilteredFriends] = useState(friends);
    const [isAddModalShowing, setIsAddModalShowing] = useState(false);

    const modalRef = useRef(null);

    function filterFriends(e) {
        const filtered = friends.filter((friend) => friend.user.username.includes(e.target.value));

        setFilteredFriends(filtered);
    }

    useEffect(() => {
        if (isAddModalShowing) modalRef.current?.showModal();
    }, [isAddModalShowing]);

    return (
        <>
            <Filter callback={filterFriends} />

            <button className={styles.add} onClick={() => setIsAddModalShowing(true)}>
                Add friends
            </button>

            <div className={styles.friends_list}>
                {filteredFriends.map((friend) => (
                    <Fragment key={friend.user._id}>
                        <div className={styles.friend}>
                            <span>{friend.user.username}</span>

                            {friend.status === 'incoming' ? (
                                <RespondButtons />
                            ) : friend.status === 'pending' ? (
                                <div>Pending</div>
                            ) : (
                                <RemoveButton />
                            )}
                        </div>
                    </Fragment>
                ))}
            </div>

            {isAddModalShowing && (
                <AddFriends
                    friends={friends}
                    setIsAddModalShowing={setIsAddModalShowing}
                    ref={modalRef}
                />
            )}
        </>
    );
}
