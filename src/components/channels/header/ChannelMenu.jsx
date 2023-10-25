import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../../../helpers/helpers';
import { ConfirmButton } from '../../confirm/ConfirmButton';
import { AddParticipantModal } from './AddParticipantModal';
import { EditChannelNameModal } from './EditChannelNameModal';
import styles from './header.module.css';

export function ChannelMenu({ channelName, setChannelName, closeMenu }) {
    const { channelID } = useParams();

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);

    const addModalRef = useRef(null);
    const nameModalRef = useRef(null);

    const goTo = useNavigate();

    useEffect(() => {
        if (isAddUserModalOpen) addModalRef.current.showModal();
        else if (isNameModalOpen) nameModalRef.current.showModal();
    }, [isAddUserModalOpen, isNameModalOpen]);

    async function leaveChannel() {
        const res = await fetchData(`/channels/${channelID}?action=leave`, 'PUT');

        if (res instanceof Error) {
            goTo('/error');
        } else {
            goTo('/dashboard');
        }
    }

    return (
        <>
            <div className={styles.menu}>
                <ul className={styles.menu_options}>
                    <button onClick={() => setIsAddUserModalOpen(!isAddUserModalOpen)}>
                        Add participant
                    </button>
                    <button onClick={() => setIsNameModalOpen(!isNameModalOpen)}>
                        Edit channel name
                    </button>
                    <ConfirmButton
                        initialText="Leave channel"
                        callback={leaveChannel}
                        buttonAlignment="right"
                    />
                </ul>
            </div>

            {isAddUserModalOpen && (
                <AddParticipantModal
                    setIsModalOpen={setIsAddUserModalOpen}
                    setChannelName={setChannelName}
                    closeMenu={closeMenu}
                    ref={addModalRef}
                />
            )}

            {isNameModalOpen && (
                <EditChannelNameModal
                    setIsModalOpen={setIsNameModalOpen}
                    channelName={channelName}
                    setChannelName={setChannelName}
                    closeMenu={closeMenu}
                    ref={nameModalRef}
                />
            )}
        </>
    );
}
