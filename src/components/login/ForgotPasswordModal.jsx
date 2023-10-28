import { forwardRef } from 'react';
import { closeModal, fetchData } from '../../helpers/helpers';
import modalStyles from '../../modals.module.css';

export const ForgotPasswordModal = forwardRef(function ForgotPasswordModal(
    { setIsModalShowing },
    modalRef
) {
    async function sendPasswordResetEmail(e) {
        e.preventDefault();

        const res = await fetchData('/auth/password-tokens', 'POST', {
            username: e.target.username.value,
        });

        if (res instanceof Error) {
            alert('Something went wrong with the server. Please try again later.');
        } else {
            alert(
                'Password reset request received.\nIf an account exists with this username, a unique one-time-use password reset link will be sent to the email associated with it.'
            );
        }

        setIsModalShowing(false);
    }

    return (
        <dialog onClick={(e) => closeModal(e, setIsModalShowing)} aria-modal ref={modalRef}>
            <div className="sr-only" aria-live="polite">
                Opened forgot password modal
            </div>

            <form className={modalStyles.modal} onSubmit={sendPasswordResetEmail}>
                <label htmlFor="username">
                    Please enter the username registered to your account below:
                </label>

                <input
                    id="username"
                    name="username"
                    type="test"
                    placeholder="Please enter your username"
                    aria-label="username for the account to email password reset link to"
                    required
                />

                <button className="bg-accented-lg">Send password reset email</button>
            </form>

            <button
                id="close"
                className={modalStyles.close}
                onClick={(e) => closeModal(e, setIsModalShowing)}
                aria-label="close forgot password modal"
            >
                {'\u2A2F'}
            </button>
        </dialog>
    );
});
