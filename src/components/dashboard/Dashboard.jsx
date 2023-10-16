import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import { fetchData } from '../../helpers/fetch';
import { ChannelList } from './ChannelList';

export function Dashboard() {
    const { user } = useContext(UserContext);

    const [channels, setChannels] = useState([]);

    useEffect(() => {
        async function getChannels() {
            const res = await fetchData(`/users/${user._id}/channels`, 'GET');

            console.log(res.status);

            if (res.ok) {
                const data = await res.json();
                setChannels(data);
            }
        }

        getChannels();
    }, [user]);

    return (
        <div>
            <h4>
                {user._id} - {user.username}
            </h4>

            {channels.map((channel) => (
                <ChannelList key={channel._id} channel={channel} />
            ))}

            {!channels.length && <p>No channels</p>}
        </div>
    );
}
