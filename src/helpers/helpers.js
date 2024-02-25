const domain =
    import.meta.env.VITE_MODE === 'prod'
        ? import.meta.env.VITE_PROD_API
        : import.meta.env.VITE_DEV_API;

export async function fetchData(endpoint, method, form) {
    const options = {
        credentials: 'same-origin',
        method: method,
    };

    if (form) options.body = new URLSearchParams(form);

    try {
        return await fetch(`${domain}${endpoint}`, options);
    } catch (err) {
        return err;
    }
}

export function sortFriends(friendsList) {
    const incoming = friendsList.filter((friend) => friend.status === 'incoming');
    const requested = friendsList.filter((friend) => friend.status === 'requested');
    const accepted = friendsList.filter((friend) => friend.status === 'accepted');

    return [...incoming, ...requested, ...accepted];
}

export function sortChannels(channelList) {
    const hasMessages = channelList
        .filter((channel) => channel.latestMessage)
        .sort(latestMessageFirst);
    const empty = channelList.filter((channel) => !channel.latestMessage);

    return [...hasMessages, ...empty];
}

export function toTimestamp(timestamp, useHour12) {
    const date = new Date(timestamp);

    const dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: useHour12 };

    const dateString = date.toLocaleDateString(navigator.language, dateOptions);
    const timeString = date.toLocaleTimeString(navigator.language, timeOptions);

    return `${dateString} ${timeString}`;
}

function latestMessageFirst(msgA, msgB) {
    const [dateA, dateB] = [
        new Date(msgA.latestMessage.timestamp).getTime(),
        new Date(msgB.latestMessage.timestamp).getTime(),
    ];

    return dateB - dateA;
}

export function closeModal(e, setIsModalShowing, closeMenu) {
    // Allows closing upon clicking outside modal (or dedicated close button)
    if (e.target.tagName === 'DIALOG' || e.target.id === 'close') {
        e.currentTarget.closest('dialog').close();
        setIsModalShowing(false);

        if (closeMenu) closeMenu();
    }
}
