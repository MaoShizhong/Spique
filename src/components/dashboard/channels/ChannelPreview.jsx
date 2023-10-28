import { Link } from 'react-router-dom';
import { toTimestamp } from '../../../helpers/helpers';
import styles from './channel_list.module.css';

export function ChannelPreview({ channel, username }) {
    const latestMsg = channel.latestMessage;

    let author;
    if (latestMsg && !latestMsg.user) {
        author = 'deleted account';
    } else if (latestMsg && latestMsg.user.username !== username) {
        author = latestMsg.user.username;
    } else {
        author = 'You';
    }

    return (
        <Link
            to={`/channels/${channel._id}`}
            state={{ channelName: channel.name }}
            className={styles.channel}
            aria-label={`Link to channel: ${channel.name}. ${
                latestMsg
                    ? `Last message sent on ${toTimestamp(latestMsg.timestamp)}`
                    : 'No messages.'
            }`}
        >
            <article>
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
