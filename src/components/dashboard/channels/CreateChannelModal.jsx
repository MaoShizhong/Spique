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
        <dialog onClick={(e) => closeModal(e, setIsCreateModalShowing)} aria-modal ref={modalRef}>
            <div className="sr-only" aria-live="polite">
                Opened channel creation modal
            </div>

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
                                <div
                                    key={friend.user._id}
                                    aria-label={`Friend name: ${friend.user.username}`}
                                    tabIndex={0}
                                >
                                    <span>{friend.user.username}</span>
                                    {!participants.find((user) => user._id === friend.user._id) && (
                                        <button
                                            onClick={() => addAsParticipant(friend)}
                                            className={modalStyles.button}
                                            aria-label={`add ${friend.user.username} as channel participant`}
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
                    <p
                        className={modalStyles.error}
                        aria-label="Create channel button unlocks when at least one other participant is added"
                        tabIndex={0}
                    >
                        Please add at least one other user.
                    </p>
                )}

                <button
                    className={styles.add}
                    onClick={createChannel}
                    disabled={!participants.length}
                >
                    Create channel
                </button>
            </div>

            <button
                id="close"
                className={modalStyles.close}
                onClick={(e) => closeModal(e, setIsCreateModalShowing)}
                aria-label="close channel creation modal"
            >
                {'\u2A2F'}
            </button>
        </dialog>
    );
});
