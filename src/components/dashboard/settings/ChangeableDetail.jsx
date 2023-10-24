import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../App';
import { fetchData } from '../../../helpers/helpers';
import { ConfirmPasswordModal } from './ConfirmPasswordModal';
import styles from './settings.module.css';

export function ChangeableDetail({ userDetail }) {
    const { user, setUser } = useContext(UserContext);

    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [isPasswordModalShowing, setIsPasswordModalShowing] = useState(false);
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);
    const [error, setError] = useState(null);

    const modalRef = useRef(null);

    useEffect(() => {
        // Else submitting one will not clear an error showing on the other
        setError(null);
    }, [user.username, user.email]);

    useEffect(() => {
        if (modalRef.current) modalRef.current.showModal();
    }, [isPasswordModalShowing]);

    useEffect(() => {
        if (!passwordConfirmed || !inputValue) return;

        async function changeDetail() {
            try {
                const res = await fetchData(`/users/${user._id}/${userDetail}`, 'PUT', {
                    [userDetail]: inputValue,
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    setUser(updatedUser);

                    alert(
                        `${userDetail[0].toUpperCase()}${userDetail.slice(1)} successfully updated!`
                    );
                } else if (res.status === 403) {
                    const errorMsg =
                        userDetail === 'username'
                            ? 'Username already taken.'
                            : 'Email already registered to another account.';
                    setError(errorMsg);
                } else if (res.status === 400) {
                    const errorMsg =
                        userDetail === 'username'
                            ? 'Username must be alphanumeric only and contain at least 3 characters.'
                            : 'Invalid email format.';
                    setError(errorMsg);
                } else {
                    alert('Something went wrong with the server. Please try again later.');
                }

                // setInputValue('');
            } catch (error) {
                alert('Something went wrong with the server. Please try again later.');
            }

            setInputValue('');
            setPasswordConfirmed(false);
            setIsInputDisabled(true);
        }

        changeDetail();
    }, [passwordConfirmed, userDetail, user._id, inputValue, setUser]);

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
                    placeholder={user[userDetail]}
                    onInput={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    disabled={isInputDisabled}
                    autoComplete="off"
                    aria-label={`enter new ${userDetail}`}
                    required
                />

                {error && <div className={styles.error}>{error}</div>}

                {isInputDisabled ? (
                    <button
                        type="button"
                        onClick={() => {
                            setIsInputDisabled(false);
                            setError(null);
                        }}
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
