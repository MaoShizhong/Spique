import { useEffect, useRef, useState } from 'react';
import { ConfirmPasswordModal } from './ConfirmPasswordModal';
import styles from './settings.module.css';

export function ChangeableDetail({ user, userDetail }) {
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [isPasswordModalShowing, setIsPasswordModalShowing] = useState(false);
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);

    const modalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current) modalRef.current.showModal();
    }, [isPasswordModalShowing]);

    async function changeUserDetails(e) {
        e.preventDefault();

        setIsPasswordModalShowing(true);
    }

    return (
        <>
            <form className={styles.form} onSubmit={(e) => changeUserDetails(e, 'username')}>
                <label htmlFor="username">
                    {userDetail[0].toUpperCase()}
                    {userDetail.slice(1)}:
                </label>

                <input
                    id={userDetail}
                    name={userDetail}
                    type={userDetail === 'username' ? 'text' : 'email'}
                    placeholder={`Please enter a new ${userDetail}`}
                    defaultValue={user[userDetail]}
                    disabled={isInputDisabled}
                    aria-label={`enter new ${userDetail}`}
                    required
                />

                {isInputDisabled ? (
                    <button
                        type="button"
                        onClick={() => setIsInputDisabled(false)}
                        aria-label={`enable ${userDetail} change form`}
                    >
                        Change
                    </button>
                ) : (
                    <div className={styles.set}>
                        <button type="button" onClick={() => setIsInputDisabled(true)}>
                            Cancel
                        </button>
                        <button type="submit" aria-label="set new username">
                            Set
                        </button>
                    </div>
                )}
            </form>

            {isPasswordModalShowing && (
                <ConfirmPasswordModal
                    setIsModalShowing={setIsPasswordModalShowing}
                    setPasswordConfirmed={setPasswordConfirmed}
                    ref={modalRef}
                />
            )}
        </>
    );
}
