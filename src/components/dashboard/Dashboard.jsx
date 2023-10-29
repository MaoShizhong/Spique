import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const goTo = useNavigate();

    const friendRequestCount = friends.filter((friend) => friend.status === 'incoming').length;

    useEffect(() => {
        async function getChannelsAndFriends() {
            if (!user) return;

            const [usersChannels, usersFriends] = await Promise.all([
                fetchData(`/users/${user._id}/channels`, 'GET'),
                fetchData(`/users/${user._id}/friends`, 'GET'),
            ]);

            if (usersChannels instanceof Error || usersFriends instanceof Error) {
                goTo('/error');
            }

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
    }, [user, goTo]);

    return (
        <>
            {loading ? (
                <Loading text="" />
            ) : (
                <>
                    <header className={styles.welcome}>
                        <h1>Hello, {user.username}!</h1>
                        <Github classObj={styles.github} />
                    </header>

                    <main className={styles.content}>
                        {page === 'channels' ? (
                            <ChannelList friends={friends} channels={channels} />
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
