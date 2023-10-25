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
            userEmail: e.target.email.value,
        });

        if (res instanceof Error) {
            alert('Something went wrong with the server. Please try again later.');
        } else {
            alert(
                'Password reset request received.\nIf this email is associated with an account then an email will be sent containing a unique password reset link.'
            );
        }

        setIsModalShowing(false);
    }

    return (
        <dialog onClick={(e) => closeModal(e, setIsModalShowing)} ref={modalRef}>
            <form className={modalStyles.modal} onSubmit={sendPasswordResetEmail}>
                <label htmlFor="email">
                    Please enter the email registered to your account below:
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Please enter your email"
                    aria-label="email to send password reset link to"
                    required
                />

                <button className="bg-accented-lg">Verify password</button>
            </form>

            <button
                id="close"
                className={modalStyles.close}
                onClick={(e) => closeModal(e, setIsModalShowing)}
            >
                {'\u2A2F'}
            </button>
        </dialog>
    );
});
