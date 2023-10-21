import { Link } from 'react-router-dom';
import { toTimestamp } from '../../../helpers/helpers';
import styles from './channel_list.module.css';

export function ChannelPreview({ channel, username }) {
    const latestMsg = channel.latestMessage;
    const author =
        latestMsg && latestMsg.user.username !== username ? latestMsg.user.username : 'You';

    return (
        <Link to={`/channels/${channel._id}`} state={{ channelName: channel.name }}>
            <article className={styles.channel}>
                <div className={styles.details}>
                    <span className={styles.name}>{channel.name}</span>
                    {latestMsg && <span>{toTimestamp(latestMsg.timestamp)}</span>}
                </div>

                <div className={styles.participants}>
                    {channel.participants.length}{' '}
                    {channel.participants.length > 1 ? 'participants' : 'participant'}
                </div>

                {latestMsg ? (
                    <div className={styles.message_preview}>
                        <span>{author}:</span> {latestMsg.text}
                    </div>
                ) : (
                    <div className={styles.message_preview}>No messages here yet!</div>
                )}
            </article>
        </Link>
    );
}
