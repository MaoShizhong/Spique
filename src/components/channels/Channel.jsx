import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import { fetchData } from '../../helpers/helpers';
import { Loading } from '../loading/Loading';
import { ChannelHeader } from './ChannelHeader';
import { Message } from './Message';
import styles from './channel.module.css';

export function Channel() {
    const { user } = useContext(UserContext);
    const { channelID } = useParams();
    const { channelName } = useLocation().state;
    const { messages, error, loading } = useGetMessages(channelID);

    const messagesRef = useRef(null);
    const inputRef = useRef(null);

    const goTo = useNavigate();

    useEffect(() => {
        if (error) goTo('/error');
    }, [error, goTo]);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    async function sendMessage(e) {
        e.preventDefault();
    }

    return (
        <>
            {loading ? (
                <Loading text="" />
            ) : (
                <>
                    <ChannelHeader channelName={channelName} />

                    <main className={styles.channel}>
                        <section className={styles.overflow_container} ref={messagesRef}>
                            <div className={styles.messages}>
                                {messages.length ? (
                                    messages.map((message) => (
                                        <Message
                                            key={message._id}
                                            message={message}
                                            isOwnMessage={user._id === message.user._id}
                                        />
                                    ))
                                ) : (
                                    <p className={styles.no_messages}>
                                        No messages! Be the first to say something!
                                    </p>
                                )}
                            </div>
                        </section>
                    </main>

                    <form className={styles.input} onSubmit={sendMessage}>
                        <div
                            name="text"
                            placeholder="Message"
                            aria-label="enter message"
                            ref={inputRef}
                            contentEditable
                        ></div>
                        <button type="submit" className={styles.button}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <g>
                                    <path d="M20 12L4 4L6 12M20 12L4 20L6 12M20 12H6"></path>
                                </g>
                            </svg>
                        </button>
                    </form>
                </>
            )}
        </>
    );
}

function useGetMessages(channelID) {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChannelMessages() {
            try {
                const res = await fetchData(`/channels/${channelID}/messages`);

                if (res.ok) {
                    const messagesFirstPage = await res.json();
                    setMessages(messagesFirstPage);
                }
            } catch (error) {
                setError(error);
            }

            setLoading(false);
        }

        fetchChannelMessages();
    }, [channelID]);

    return { messages, error, loading };
}
