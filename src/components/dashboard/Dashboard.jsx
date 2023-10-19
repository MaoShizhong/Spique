import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { fetchData, sortChannels, sortFriends } from '../../helpers/helpers';
import { Loading } from '../loading/Loading';
import { Github } from './Github';
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
    const [loading, setLoading] = useState(true);

    const friendRequestCount = friends.filter((friend) => friend.status === 'incoming').length;

    useEffect(() => {
        async function getChannelsAndFriends() {
            if (!user) return;

            const [usersChannels, usersFriends] = await Promise.all([
                fetchData(`/users/${user._id}/channels`, 'GET'),
                fetchData(`/users/${user._id}/friends`, 'GET'),
            ]);

            if (usersChannels.ok) {
                const channels = await usersChannels.json();
                setChannels(sortChannels(channels));
            }

            if (usersFriends.ok) {
                const friends = await usersFriends.json();
                setFriends(sortFriends(friends));
            }

            setLoading(false);
        }

        getChannelsAndFriends();
    }, [user]);

    return (
        <>
            {loading ? (
                <Loading text="Fetching data..." />
            ) : (
                <>
                    <header className={styles.welcome}>
                        <h1>Hello, {user.username}!</h1>
                        <Github classObj={styles.github} />
                    </header>

                    <main className={styles.content}>
                        {page === 'channels' ? (
                            <ChannelList channels={channels} friends={friends} />
                        ) : page === 'friends' ? (
                            <FriendsList friends={friends} setFriends={setFriends} />
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
