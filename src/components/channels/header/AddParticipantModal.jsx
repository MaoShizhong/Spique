import { forwardRef, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../App';
import { closeModal, fetchData } from '../../../helpers/helpers';
import modalStyles from '../../../modals.module.css';
import { Filter } from '../../dashboard/Filter';
import styles from './header.module.css';

export const AddParticipantModal = forwardRef(function AddParticipantModal(
    { setIsModalOpen, setChannelName, closeMenu },
    addModalRef
) {
    const { user } = useContext(UserContext);

    const { channelID } = useParams();

    const [participants, setParticipants] = useState([]);
    const [friendGetError, setFriendGetError] = useState(false);
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);

    useEffect(() => {
        async function getFriends() {
            try {
                const [friendsRes, channelRes] = await Promise.all([
                    fetchData(`/users/${user._id}/friends`),
                    fetchData(`/channels/${channelID}`),
                ]);

                if (!friendsRes.ok || !channelRes.ok) {
                    setFriendGetError(true);
                } else {
                    const friends = await friendsRes.json();
                    setFriends(friends);
                    setFilteredFriends(friends);

                    const { participants } = await channelRes.json();
                    setParticipants(participants);
                }
            } catch (error) {
                setFriendGetError(true);
            }
        }

        getFriends();
    }, [user, channelID]);

    async function addUserToChannel(friendID) {
        try {
            const res = await fetchData(
                `/channels/${channelID}?action=add&target=${friendID}`,
                'PUT'
            );

            if (res.ok) {
                const { newChannelName } = await res.json();
                setChannelName(newChannelName);
                setIsModalOpen(false);
            } else {
                setFriendGetError(true);
            }
        } catch (error) {
            setFriendGetError(true);
        }
    }

    function filterFriends(input) {
        setFilteredFriends(
            friends.filter((friend) =>
                friend.user.username.toLowerCase().includes(input.value.toLowerCase())
            )
        );
    }

    return (
        <dialog onClick={(e) => closeModal(e, setIsModalOpen, closeMenu)} ref={addModalRef}>
            <button
                id="close"
                className={modalStyles.close}
                onClick={(e) => closeModal(e, setIsModalOpen)}
            >
                {'\u2A2F'}
            </button>

            {friendGetError ? (
                <div className={modalStyles.modal}>
                    Something went wrong - please try again later!
                </div>
            ) : (
                <div className={modalStyles.modal}>
                    <Filter callback={filterFriends} />

                    {filteredFriends.map((friend) => {
                        if (
                            !participants.find((participant) => participant._id === friend.user._id)
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
                    })}
                </div>
            )}
        </dialog>
    );
});
