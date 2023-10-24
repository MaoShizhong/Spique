import { forwardRef, useContext, useState } from 'react';
import { UserContext } from '../../../App';
import { closeModal, fetchData } from '../../../helpers/helpers';
import modalStyles from '../../../modals.module.css';
import { Loading } from '../../loading/Loading';

export const ConfirmPasswordModal = forwardRef(function ConfirmPasswordModal(
    { setIsModalShowing, setPasswordConfirmed },
    modalRef
) {
    const { user } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [isVerificationError, setIsVerificationError] = useState(false);

    async function verifyPassword(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetchData(`/auth/users/${user._id}/password`, 'POST', {
                password: e.target.password.value,
            });

            if (res.ok) {
                setPasswordConfirmed(true);
                setIsModalShowing(false);
            } else {
                setIsVerificationError(true);
            }
        } catch (error) {
            alert('Something went wrong with the server. Please try again later.');
        }

        setLoading(false);
    }

    return (
        <dialog
            onClick={(e) => closeModal(e, setIsModalShowing)}
            onSubmit={verifyPassword}
            ref={modalRef}
        >
            {loading ? (
                <div className={modalStyles.modal} style={{ padding: '2rem' }}>
                    <Loading text="Verifying..." />
                </div>
            ) : (
                <>
                    <form className={modalStyles.modal} onSubmit={verifyPassword}>
                        <label htmlFor="password">
                            For security reasons, please enter your password:
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Please enter your password"
                            aria-label="password confirmation"
                            required
                        />
                        {isVerificationError && (
                            <div className={modalStyles.error}>
                                Incorrect password entered. Please try again.
                            </div>
                        )}
                        <button className="bg-accented-lg">Verify password</button>
                    </form>

                    <button
                        id="close"
                        className={modalStyles.close}
                        onClick={(e) => closeModal(e, setIsModalShowing)}
                    >
                        {'\u2A2F'}
                    </button>
                </>
            )}
        </dialog>
    );
});
