import { forwardRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { closeModal, fetchData } from '../../../helpers/helpers';
import modalStyles from '../../../modals.module.css';
import styles from './header.module.css';

export const EditChannelNameModal = forwardRef(function EditChannelNameModal(
    { setIsModalOpen, channelName, setChannelName, closeMenu },
    nameModalRef
) {
    const { channelID } = useParams();

    const goTo = useNavigate();

    async function changeChannelName(e) {
        e.preventDefault();

        const form = e.target;

        const res = await fetchData(`/channels/${channelID}`, 'PATCH', {
            name: form.name.value,
        });

        if (res instanceof Error) {
            goTo('/error');
        } else if (res.ok) {
            const { newChannelName } = await res.json();
            setChannelName(newChannelName);
            setIsModalOpen(false);
        } else {
            goTo('/error');
        }
    }

    return (
        <dialog onClick={(e) => closeModal(e, setIsModalOpen, closeMenu)} ref={nameModalRef}>
            <div className={modalStyles.modal}>
                <form className={styles.new_name} onSubmit={changeChannelName}>
                    <input
                        name="name"
                        type="text"
                        defaultValue={channelName}
                        placeholder="Enter new channel name"
                        aria-label="Edit channel name"
                    />
                    <button className={modalStyles.button}>Set</button>
                </form>
            </div>

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
