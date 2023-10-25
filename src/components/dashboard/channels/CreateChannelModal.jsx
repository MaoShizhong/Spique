import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { closeModal, fetchData } from '../../../helpers/helpers';
import modalStyles from '../../../modals.module.css';
import styles from './channel_list_modal.module.css';

export const CreateChannelModal = forwardRef(function CreateChannelModal(
    { friends, setIsCreateModalShowing },
    modalRef
) {
    const [participants, setParticipants] = useState([]);

    const goTo = useNavigate();

    function addAsParticipant(friend) {
        setParticipants((prev) => [...prev, friend.user]);
    }

    function removeParticipant(id) {
        setParticipants((prev) => prev.filter((participant) => participant._id != id));
    }

    async function createChannel() {
        // failsafe
        if (!participants.length) return;

        const participantIDs = participants.map((participant) => participant._id);
        const participantsQuery = participantIDs.join(',');

        const res = await fetchData(`/channels?participants=${participantsQuery}`, 'POST');

        if (res instanceof Error || !res.ok) {
            goTo('/error');
        } else {
            const newChannel = await res.json();
            goTo(newChannel.url, { state: { channelName: newChannel.name } });
        }
    }

    return (
        <dialog onClick={(e) => closeModal(e, setIsCreateModalShowing)} ref={modalRef}>
            <button
                id="close"
                className={modalStyles.close}
                onClick={(e) => closeModal(e, setIsCreateModalShowing)}
            >
                {'\u2A2F'}
            </button>

            <div className={modalStyles.modal}>
                <div className={styles.participants}>
                    {participants.map((participant) => (
                        <button
                            key={participant._id}
                            onClick={() => removeParticipant(participant._id)}
                        >
                            {participant.username} {'\u2715'}
                        </button>
                    ))}
                </div>

                <div className={styles.friends}>
                    <b>Friends:</b>
                    {friends.map((friend) => {
                        if (friend.status === 'accepted') {
                            return (
                                <div key={friend.user._id}>
                                    <span>{friend.user.username}</span>
                                    {!participants.find((user) => user._id === friend.user._id) && (
                                        <button
                                            onClick={() => addAsParticipant(friend)}
                                            className={modalStyles.button}
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>
                            );
                        }
                    })}
                </div>

                {!participants.length && (
                    <p className={modalStyles.error}>Please add at least one other user.</p>
                )}

                <button
                    className={styles.add}
                    onClick={createChannel}
                    disabled={!participants.length}
                >
                    Create channel
                </button>
            </div>
        </dialog>
    );
});
