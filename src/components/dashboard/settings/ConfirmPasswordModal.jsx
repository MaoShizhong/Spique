import { forwardRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const goTo = useNavigate();

    async function verifyPassword(e) {
        e.preventDefault();
        setLoading(true);

        const res = await fetchData(`/auth/users/${user._id}/password`, 'POST', {
            password: e.target.password.value,
        });

        if (res instanceof Error) {
            goTo('/error');
        } else if (!res.ok) {
            setIsVerificationError(true);
        } else {
            setPasswordConfirmed(true);
            setIsModalShowing(false);
        }

        setLoading(false);
    }

    return (
        <dialog
            onClick={(e) => closeModal(e, setIsModalShowing)}
            onSubmit={verifyPassword}
            aria-modal
            ref={modalRef}
        >
            {loading ? (
                <div className={modalStyles.modal} style={{ padding: '2rem' }}>
                    <Loading text="Verifying..." />
                </div>
            ) : (
                <>
                    <div className="sr-only" aria-live="polite">
                        Opened password verification modal
                    </div>

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
                        aria-label="close password verification modal"
                    >
                        {'\u2A2F'}
                    </button>
                </>
            )}
        </dialog>
    );
});
