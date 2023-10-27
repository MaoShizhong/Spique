import { useState } from 'react';
import styles from './confirm.module.css';

export function ConfirmButton({ initialText, callback, buttonAlignment }) {
    const [isShowingConfirm, setIsShowingConfirm] = useState(false);

    return (
        <>
            {isShowingConfirm ? (
                <div style={{ textAlign: buttonAlignment }}>
                    <div>Confirm {initialText.toLowerCase()}?</div>

                    <div className={styles.buttons}>
                        <button
                            className="bg-accented-sm"
                            onClick={() => setIsShowingConfirm(false)}
                            aria-label={`Confirm ${initialText.toLowerCase()}? No`}
                        >
                            No
                        </button>
                        <button
                            className="bg-accented-sm"
                            onClick={() => {
                                callback();
                                setIsShowingConfirm(false);
                            }}
                            aria-label={`Confirm ${initialText.toLowerCase()}? Yes`}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            ) : (
                <button className={styles.original} onClick={() => setIsShowingConfirm(true)}>
                    {initialText}
                </button>
            )}
        </>
    );
}
