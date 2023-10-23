import { useState } from 'react';

export function ConfirmButton({ initialText, callback, buttonAlignment }) {
    const [isShowingConfirm, setIsShowingConfirm] = useState(false);

    return (
        <>
            {isShowingConfirm ? (
                <div>
                    <div>Confirm {initialText.toLowerCase()}?</div>

                    <div style={{ textAlign: buttonAlignment, marginBlock: '0.5rem' }}>
                        <button
                            className="bg-accented-sm"
                            style={{ marginRight: '0.5rem' }}
                            onClick={callback}
                        >
                            Yes
                        </button>
                        <button
                            className="bg-accented-sm"
                            style={{ marginLeft: '0.5rem' }}
                            onClick={() => setIsShowingConfirm(false)}
                        >
                            No
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsShowingConfirm(true)}>{initialText}</button>
            )}
        </>
    );
}
