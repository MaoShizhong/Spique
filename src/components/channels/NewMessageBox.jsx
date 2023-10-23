import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../helpers/helpers';
import styles from './channel.module.css';

const MESSAGE_CHAR_LIMIT = 2000;

export function NewMessageBox({ channelID, setMessages, setLatestMessageAction }) {
    const [messageText, setMessageText] = useState('');

    const goTo = useNavigate();

    async function sendMessage(e) {
        e.preventDefault();

        if (!messageText || messageText.length > MESSAGE_CHAR_LIMIT) {
            return;
        }

        try {
            const res = await fetchData(`/channels/${channelID}/messages`, 'POST', {
                text: messageText,
            });

            if (res.ok) {
                const newMessage = await res.json();

                setMessages((prev) => [newMessage, ...prev]);
                setLatestMessageAction('add');
                e.target.text.value = '';
            } else {
                goTo('/error');
            }
        } catch (err) {
            goTo('/error');
        }
    }

    return (
        <form className={styles.input} onSubmit={sendMessage}>
            <textarea
                name="text"
                placeholder="Message"
                aria-label="enter message"
                onKeyDown={handleEnterKey}
                onInput={(e) => {
                    handleAutoHeightChange(e);
                    setMessageText(e.target.value);
                }}
                rows={1}
            ></textarea>

            {messageText.length > MESSAGE_CHAR_LIMIT && (
                <p className={styles.error}>Max. 2000 characters</p>
            )}

            <button type="submit" className={styles.send} aria-label="send message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <g>
                        <path d="M20 12L4 4L6 12M20 12L4 20L6 12M20 12H6"></path>
                    </g>
                </svg>
            </button>
        </form>
    );
}

// Allow submit on pressing enter (textarea) but shift+enter gives new line
function handleEnterKey(e) {
    if (e.key !== 'Enter' || e.shiftKey) return;

    e.preventDefault();
    e.target.closest('form').requestSubmit();
}

function handleAutoHeightChange(e) {
    const textarea = e.target;

    // needed so that line deletion/full text deletion resets the scrollHeight
    // otherwise the scrollHeight decreases in 2px steps with each character delete
    textarea.style.height = '0px';

    textarea.style.height = `${textarea.scrollHeight}px`;
}
