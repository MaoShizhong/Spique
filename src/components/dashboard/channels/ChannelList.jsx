import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter } from '../Filter';

export function ChannelList({ channels }) {
    const [filteredChannels, setFilteredChannels] = useState(channels);

    function filterFriends(e) {
        const filtered = channels.filter((channel) => channel.name.includes(e.target.value));

        setFilteredChannels(filtered);
    }

    return (
        <>
            <Filter callback={filterFriends} />

            <div>
                {!filteredChannels.length ? (
                    <p>No channels</p>
                ) : (
                    filteredChannels.map((channel) => (
                        <Link key={channel._id} to={`/channels/${channel._id}`}>
                            <div>{channel.name}</div>
                        </Link>
                    ))
                )}
            </div>
        </>
    );
}
