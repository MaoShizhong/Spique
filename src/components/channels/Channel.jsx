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

    const goTo = useNavigate();

    useEffect(() => {
        if (error) goTo('/error');
    }, [error, goTo]);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

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
                                {messages.map((message) => (
                                    <Message
                                        key={message._id}
                                        message={message}
                                        isOwnMessage={user._id === message.user._id}
                                    />
                                ))}
                            </div>
                        </section>
                    </main>

                    <form className={styles.input}>
                        <input
                            name="text"
                            type="text"
                            placeholder="Message"
                            aria-label="enter message"
                        />
                        <button>Send</button>
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
