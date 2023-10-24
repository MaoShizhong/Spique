import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import { fetchData } from '../../helpers/helpers';
import { Loading } from '../loading/Loading';
import { Message } from './Message';
import { NewMessageBox } from './NewMessageBox';
import styles from './channel.module.css';
import { ChannelHeader } from './header/ChannelHeader';

export function Channel() {
    const { user } = useContext(UserContext);
    const { channelID } = useParams();
    const { channelName } = useLocation().state;
    const {
        messages,
        setMessages,
        hasMoreMessages,
        setHasMoreMessages,
        latestMessageAction,
        setLatestMessageAction,
        error,
        loading,
    } = useGetMessages(channelID);

    const [name, setName] = useState(channelName);
    const [pagesShown, setPagesShown] = useState(1);
    const [messagesHeight, setMessagesHeight] = useState(0);

    const messagesRef = useRef(null);
    const goTo = useNavigate();

    useEffect(() => {
        if (error) goTo('/error');
    }, [error, goTo]);

    useEffect(() => {
        if (!messagesRef.current) return;

        if (latestMessageAction === 'add') {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        } else if (latestMessageAction === 'scroll') {
            console.log(messagesRef.current.scrollHeight, messagesHeight);
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight - messagesHeight;
        }

        setMessagesHeight(messagesRef.current.scrollHeight);
        setLatestMessageAction(null);
    }, [messages.length, latestMessageAction, messagesHeight, setLatestMessageAction]);

    async function loadMoreMessages() {
        try {
            const nextPage = pagesShown + 1;

            const res = await fetchData(`/channels/${channelID}/messages?page=${nextPage}`);

            if (res.ok) {
                const data = await res.json();

                setLatestMessageAction('scroll');
                setMessages((prev) => [...prev, ...data.messages]);
                setHasMoreMessages(data.hasMoreMessages);
                setPagesShown(nextPage);
            }
        } catch (error) {
            goTo('/error');
        }
    }

    return (
        <>
            {loading ? (
                <Loading text="" />
            ) : (
                <>
                    <ChannelHeader channelName={name} setChannelName={setName} />

                    <main
                        className={styles.overflow_container}
                        ref={messagesRef}
                        onScroll={(e) => {
                            if (e.target.scrollTop === 0 && hasMoreMessages) {
                                loadMoreMessages();
                            }
                        }}
                    >
                        <div className={styles.messages}>
                            {messages.length ? (
                                <>
                                    {messages.map((message) => (
                                        <Message
                                            key={message._id}
                                            message={message}
                                            isOwnMessage={user._id === message.user._id}
                                        />
                                    ))}

                                    {messages.length && !hasMoreMessages && (
                                        <p className={styles.no_messages}>Start of conversation</p>
                                    )}
                                </>
                            ) : (
                                <p className={styles.no_messages}>
                                    No messages! Be the first to say something!
                                </p>
                            )}
                        </div>
                    </main>

                    <NewMessageBox
                        channelID={channelID}
                        setMessages={setMessages}
                        setLatestMessageAction={setLatestMessageAction}
                    />
                </>
            )}
        </>
    );
}

function useGetMessages(channelID) {
    const [messages, setMessages] = useState([]);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [latestMessageAction, setLatestMessageAction] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChannelMessages() {
            try {
                const res = await fetchData(`/channels/${channelID}/messages`);

                if (res.ok) {
                    const data = await res.json();

                    setMessages(data.messages);
                    setHasMoreMessages(data.hasMoreMessages);
                    setLatestMessageAction('add');
                }
            } catch (error) {
                setError(error);
            }

            setLoading(false);
        }

        fetchChannelMessages();
    }, [channelID]);

    return {
        messages,
        setMessages,
        hasMoreMessages,
        setHasMoreMessages,
        latestMessageAction,
        setLatestMessageAction,
        error,
        loading,
    };
}