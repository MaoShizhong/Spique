import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../../../helpers/helpers';
import { AddParticipantModal } from './AddParticipantModal';
import { EditChannelNameModal } from './EditChannelNameModal';
import styles from './header.module.css';

export function ChannelMenu({ channelName, setChannelName }) {
    const { channelID } = useParams();

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

    const addModalRef = useRef(null);
    const nameModalRef = useRef(null);

    const goTo = useNavigate();

    useEffect(() => {
        if (isAddUserModalOpen) addModalRef.current.showModal();
        else if (isNameModalOpen) nameModalRef.current.showModal();
    }, [isAddUserModalOpen, isNameModalOpen]);

    async function leaveChannel() {
        try {
            await fetchData(`/channels/${channelID}?action=leave`, 'PUT');

            goTo('/dashboard');
        } catch (error) {
            goTo('/error');
        }
    }

    return (
        <>
            <div className={styles.menu}>
                <ul className={styles.menu_options}>
                    <li onClick={() => setIsAddUserModalOpen(!isAddUserModalOpen)}>
                        Add participant
                    </li>
                    <li onClick={() => setIsNameModalOpen(!isNameModalOpen)}>Edit channel name</li>
                    {showLeaveConfirm ? (
                        <li onClick={leaveChannel} className={styles.confirm}>
                            Click to confirm and leave channel
                        </li>
                    ) : (
                        <li onClick={() => setShowLeaveConfirm(true)}>Leave channel</li>
                    )}
                </ul>
            </div>

            {isAddUserModalOpen && (
                <AddParticipantModal
                    setIsModalOpen={setIsAddUserModalOpen}
                    setChannelName={setChannelName}
                    ref={addModalRef}
                />
            )}

            {isNameModalOpen && (
                <EditChannelNameModal
                    setIsModalOpen={setIsNameModalOpen}
                    channelName={channelName}
                    setChannelName={setChannelName}
                    ref={nameModalRef}
                />
            )}
        </>
    );
}
