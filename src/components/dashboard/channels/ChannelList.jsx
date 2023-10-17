import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter } from '../Filter';

export function ChannelList({ channels }) {
    const [filteredChannels, setFilteredChannels] = useState(channels);

    const inputRef = useRef(null);

    function filterChannels(searchBar) {
        const filtered = channels.filter((channel) => channel.name.includes(searchBar.value));

        setFilteredChannels(searchBar.value ? filtered : channels);
    }

    return (
        <>
            <Filter callback={filterChannels} ref={inputRef} />

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
