import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ChannelList({ channels }) {
    const [filteredChannels, setFilteredChannels] = useState(channels);

    return (
        <>
            {/* filter search bar here */}
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
