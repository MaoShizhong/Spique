import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../helpers/helpers';
import styles from './channel_list_modal.module.css';

export const CreateChannelModal = forwardRef(function CreateChannelModal(
    { friends, setIsCreateModalShowing },
    modalRef
) {
    const [participants, setParticipants] = useState([]);

    const goTo = useNavigate();

    function closeModal(e) {
        // Allows closing upon clicking outside modal (or dedicated close button)
        if (e.target.tagName === 'DIALOG' || e.target.id === 'close') {
            modalRef.current.close();
            setIsCreateModalShowing(false);
        }
    }

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

        if (res.ok) {
            const newChannel = await res.json();
            goTo(newChannel.url, { state: { channelName: newChannel.name } });
        } else {
            goTo('/error');
        }
    }

    return (
        <dialog onClick={closeModal} ref={modalRef}>
            <button id="close" className={styles.close} onClick={closeModal}>
                {'\u2A2F'}
            </button>

            <div className={styles.modal}>
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
                                        <button onClick={() => addAsParticipant(friend)}>
                                            Add
                                        </button>
                                    )}
                                </div>
                            );
                        }
                    })}
                </div>

                {!participants.length && (
                    <p className={styles.error}>Please add at least one other user.</p>
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
