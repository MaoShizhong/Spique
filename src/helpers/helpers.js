const domain =
    import.meta.env.VITE_MODE === 'prod'
        ? import.meta.env.VITE_PROD_API
        : import.meta.env.VITE_DEV_API;

export async function fetchData(endpoint, method, form) {
    const options = {
        credentials: 'include',
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
