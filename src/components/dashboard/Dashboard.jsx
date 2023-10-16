import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { fetchData } from '../../helpers/fetch';
import { Navbar } from './Navbar';
import { ChannelList } from './channels/ChannelList';
import styles from './dashboard.module.css';
import { FriendsList } from './friends/FriendsList';
import { Settings } from './settings/Settings';

export function Dashboard() {
    const { user } = useContext(UserContext);

    const [channels, setChannels] = useState([]);
    const [friends, setFriends] = useState([]);
    const [page, setPage] = useState('channels');

    const friendRequestCount = friends.filter((friend) => friend.status === 'incoming').length;

    useEffect(() => {
        async function getChannelsAndFriends() {
            const [usersChannels, usersFriends] = await Promise.all([
                fetchData(`/users/${user._id}/channels`, 'GET'),
                fetchData(`/users/${user._id}/friends`, 'GET'),
            ]);

            if (usersChannels.ok) {
                const channels = await usersChannels.json();
                setChannels(channels);
            }

            if (usersFriends.ok) {
                const friends = await usersFriends.json();
                setFriends(friends);
            }
        }

        getChannelsAndFriends();
    }, [user]);

    return (
        <>
            {user && (
                <>
                    <header className={styles.welcome}>
                        <h1>Hello, {user.username}!</h1>
                        <a
                            href="https://github.com/MaoShizhong/Spique"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="link to project repo"
                            className={styles.github}
                        >
                            <img src="/github.png" alt="github link" />
                        </a>
                    </header>

                    <main className={styles.content}>
                        {page === 'channels' ? (
                            <ChannelList channels={channels} />
                        ) : page === 'friends' ? (
                            <FriendsList friends={friends} />
                        ) : (
                            <Settings />
                        )}
                    </main>

                    <Navbar page={page} setPage={setPage} friendRequests={friendRequestCount} />
                </>
            )}
        </>
    );
}
