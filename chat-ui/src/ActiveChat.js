
import './ActiveChat.css';
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom"
import Message from './Message';
let socket = new SockJS("https://chat-backend-service.povorozniuk.com/chat-messages");

let stompClient = Stomp.over(socket);

stompClient.debug = function () { };

function ActiveChat() {

    const { id } = useParams();

    const [messages, setMessages] = useState([]);
    const [hasUserData, setHasUserData] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const inputNameRef = useRef(null);
    const bottomRef = useRef();

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [messages]);

    const onKeyDown = (e) => {
        if (e.metaKey && e.which === 13) {
            handleSendMessage()
        }
    }

    useEffect(() => {
        const name = localStorage.getItem('name');
        const userId = localStorage.getItem('uid');
        if (name && userId) {
            setHasUserData(true);
        }
    }, [])

    useEffect(() => {
        if (!wsConnected) {
            makeWsConnection();
        }
    }, [])

    const makeWsConnection = () => {
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        stompClient.subscribe("/topic/" + id, onMessageReceived)
        setWsConnected(true)
    }

    const onMessageReceived = (payload) => {
        setMessages(m => [...m, JSON.parse(payload.body)])
        // console.log("onMessageReceived " + payload.body);
    }

    const onError = (error) => {
        console.error('Could not connect ' + error)
    };

    const handleSendMessage = event => {
        const messageInput = document.getElementById('message-input');

        if (!messageInput.innerText || messageInput.innerText.length === 0) return;
        const msg = {
            chatId: id,
            senderId: localStorage.getItem('uid'),
            data: messageInput.innerText,
            senderName: localStorage.getItem('name')
        }
        // console.log('sending' + JSON.stringify(msg))
        stompClient.send("/app/message", JSON.stringify(msg), {});

        messageInput.innerHTML = '';

    }

    const handleJoinChat = event => {
        event.preventDefault();
        if(!inputNameRef.current.value){
            return;
        }
        localStorage.setItem('name', inputNameRef.current.value)
        const uid = localStorage.getItem('uid')
        if (!uid) {
            const uid = crypto.randomUUID();
            localStorage.setItem('uid', uid);
        }
        setHasUserData(true)
    }


    if (!hasUserData) {
        return (
            <div className='chat-container'>
                <form>
                    <input ref={inputNameRef} type="text" name="name" id='name' placeholder='Name' />
                    <input className='join-chat' type="submit" value="Join Chat" onClick={handleJoinChat} />
                </form>
            </div>
        )
    } else {
        return (
            <div className='main-container'>
                <div className='container'>
                    <Helmet>
                        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0" />
                        <meta name="apple-mobile-web-app-capable" content="yes" />
                    </Helmet>
                    <div className='messages-area'>
                        {messages.map(message => (
                            <Message key={message.messageId} name={message.senderName} data={message.data} senderId={message.senderId} userId={localStorage.getItem('uid')} />
                        ))}
                        <div className='dummy' ref={bottomRef}></div>
                    </div>


                    <div className="actions">
                        <div className='actions__message-input'>
                            <div className="message-wrapper">
                                <div
                                    id="message-input"
                                    className="message-text"
                                    onKeyDown={onKeyDown}
                                    contentEditable>
                                </div>
                            </div>
                        </div>
                        <div className='actions__send' onClick={handleSendMessage}>
                            <img src="https://i.ibb.co/mzsqv9S/send-button.png" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default ActiveChat;
