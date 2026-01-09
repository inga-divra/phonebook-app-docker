const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }

    const className = type === 'success' ? 'notification-msg' : 'notification-msg-error';

    return (
        <div className={className}>
            {message}
        </div>
    );
}

export default Notification;
