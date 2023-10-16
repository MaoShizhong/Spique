import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { fetchData } from '../../helpers/fetch';
import { Navbar } from './Navbar';
import { ChannelPreview } from './channels/ChannelPreview';

export function Dashboard() {
    const { user } = useContext(UserContext);

    const [channels, setChannels] = useState([]);

    console.log(channels);

    useEffect(() => {
        async function getChannels() {
            const res = await fetchData(`/users/${user._id}/channels`, 'GET');

            if (res.ok) {
                const data = await res.json();
                setChannels(data);
            }
        }

        getChannels();
    }, [user]);

    return (
        <>
            <main>
                <h4>
                    {user._id} - {user.username}
                </h4>

                {!channels.length ? (
                    <p>No channels</p>
                ) : (
                    channels.map((channel) => (
                        <ChannelPreview key={channel._id} channel={channel} />
                    ))
                )}
            </main>

            <Navbar />
        </>
    );
}
