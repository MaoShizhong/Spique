import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../App';
import { Filter } from '../Filter';
import { ChannelPreview } from './ChannelPreview';
import { CreateChannelModal } from './CreateChannelModal';
import styles from './channel_list.module.css';

export function ChannelList({ channels, friends }) {
    const { user } = useContext(UserContext);

    const [filteredChannels, setFilteredChannels] = useState(channels);
    const [isCreateModalShowing, setIsCreateModalShowing] = useState(false);

    const inputRef = useRef(null);
    const modalRef = useRef(null);

    function filterChannels(searchBar) {
        const filtered = channels.filter((channel) =>
            channel.name.toLowerCase().includes(searchBar.value.toLowerCase())
        );

        setFilteredChannels(searchBar.value ? filtered : channels);
    }

    useEffect(() => {
        if (isCreateModalShowing) modalRef.current?.showModal();
    }, [isCreateModalShowing]);

    return (
        <>
            <div className="sr-only" aria-live="polite">
                Channel list
            </div>

            <Filter list="channel list" callback={filterChannels} ref={inputRef} />

            <button className="bg-accented-lg" onClick={() => setIsCreateModalShowing(true)}>
                Create new channel
            </button>

            <section className={styles.overflow_container}>
                <div className={styles.list}>
                    {!filteredChannels.length ? (
                        <p className={styles.no_channels}>No channels found</p>
                    ) : (
                        filteredChannels.map((channel) => (
                            <ChannelPreview
                                key={channel._id}
                                channel={channel}
                                username={user.username}
                            />
                        ))
                    )}
                </div>
            </section>

            {isCreateModalShowing && (
                <CreateChannelModal
                    friends={friends}
                    setIsCreateModalShowing={setIsCreateModalShowing}
                    ref={modalRef}
                />
            )}
        </>
    );
}
