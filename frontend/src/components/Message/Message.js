import React from 'react';
import './Message.css';
import ReactEmoji from 'react-emoji';

const Message = ({ message: {client, text}, name }) => {
    let isSentByCurrentClient = false;

    const trimmedName = name.trim().toLowerCase();

    if(client === trimmedName) {
        isSentByCurrentClient = true;
    }

    return (
        isSentByCurrentClient 
            ? (
                <div className="messageContainer justifyStart">
                    <p className="sentText pr-10">{trimmedName}</p>
                    <div className="messageBox backgroundBlue">
                        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
                    </div>
                </div>
            )
            : (
                <div className="messageContainer justifyStart">
                    <div className="messageBox backgroundLight">
                        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
                    </div>
                    <p className="sentText pl-10">{client}</p>
                </div>
            )
    )
};

export default Message;