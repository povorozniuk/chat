

const Message = ({ name, data, senderId, userId }) => {

    if (userId === senderId) {
        return (
            <div className='msg-container msg-container__outgoing'>
                <p className='msg-container__sender-name'>{name}</p>
                <div className='msg-container__message'>
                    <span className='msg-container__message-text'>{data}</span>
                </div>
                <div className='msg-container__avatar'>
                    <div className='msg-container__avatar-text'>{name.charAt(0)}</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className='msg-container'>
                <p className='msg-container__sender-name'>{name}</p>
                <div className='msg-container__message'>
                    <span className='msg-container__message-text'>{data}</span>
                </div>
                <div className='msg-container__avatar'>
                    <div className='msg-container__avatar-text'>{name.charAt(0)}</div>
                </div>
            </div>
        );
    }

}

export default Message;