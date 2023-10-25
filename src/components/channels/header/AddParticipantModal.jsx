import { forwardRef, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../App';
import { closeModal, fetchData } from '../../../helpers/helpers';
import modalStyles from '../../../modals.module.css';
import { Filter } from '../../dashboard/Filter';
import { Loading } from '../../loading/Loading';
import styles from './header.module.css';

export const AddParticipantModal = forwardRef(function AddParticipantModal(
    { setIsModalOpen, setChannelName, closeMenu },
    addModalRef
) {
    const { user } = useContext(UserContext);

    const { channelID } = useParams();

    const [participants, setParticipants] = useState([]);
    const [friendGetError, setFriendGetError] = useState(false);
    const [friendsNotInChannel, setFriendsNotInChannel] = useState(null);
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getFriends() {
            const [friendsRes, channelRes] = await Promise.all([
                fetchData(`/users/${user._id}/friends`),
                fetchData(`/channels/${channelID}`),
            ]);

            if (
                friendsRes instanceof Error ||
                channelRes instanceof Error ||
                !friendsRes.ok ||
                !channelRes.ok
            ) {
                setFriendGetError(true);
            } else {
                const friends = await friendsRes.json();
                const { participants } = await channelRes.json();

                const nonChannelFriends = friends.filter((friend) => {
                    if (friend.status === 'accepted') {
                        return !participants.find(
                            (participant) => participant._id === friend.user._id
                        );
                    }
                });

                setFriendsNotInChannel(nonChannelFriends);
                setFilteredFriends(nonChannelFriends);
                setParticipants(participants);
            }

            setLoading(false);
        }

        getFriends();
    }, [user, channelID]);

    async function addUserToChannel(friendID) {
        const res = await fetchData(`/channels/${channelID}?action=add&target=${friendID}`, 'PUT');

        if (res instanceof Error) {
            setFriendGetError(true);
        } else if (res.ok) {
            const { newChannelName } = await res.json();
            setChannelName(newChannelName);
            setIsModalOpen(false);
        } else {
            setFriendGetError(true);
        }
    }

    function filterFriends(input) {
        setFilteredFriends(
            friendsNotInChannel.filter((friend) =>
                friend.user.username.toLowerCase().includes(input.value.toLowerCase())
            )
        );
    }

    return (
        <dialog onClick={(e) => closeModal(e, setIsModalOpen, closeMenu)} ref={addModalRef}>
            {loading ? (
                <Loading text="Loading friends" />
            ) : friendGetError ? (
                <div className={modalStyles.modal}>
                    Something went wrong - please try again later!
                </div>
            ) : (
                <div className={modalStyles.modal}>
                    {Boolean(friendsNotInChannel.length) && <Filter callback={filterFriends} />}

                    {!friendsNotInChannel.length ? (
                        <div>All of your friends are already in this channel!</div>
                    ) : !filteredFriends.length ? (
                        <div>Could not find any friends matching the filter criteria.</div>
                    ) : (
                        filteredFriends.map((friend) => {
                            if (
                                !participants.find(
                                    (participant) => participant._id === friend.user._id
                                )
                            ) {
                                return (
                                    <div key={friend.user._id} className={styles.friend}>
                                        {friend.user.username}
                                        <button
                                            className={modalStyles.button}
                                            onClick={() => addUserToChannel(friend.user._id)}
                                        >
                                            Add to channel
                                        </button>
                                    </div>
                                );
                            }
                        })
                    )}
                </div>
            )}

            <button
                id="close"
                className={modalStyles.close}
                onClick={(e) => closeModal(e, setIsModalOpen)}
            >
                {'\u2A2F'}
            </button>
        </dialog>
    );
});
