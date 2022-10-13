
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateChat.css';

export default function CreateChat() {

  const inputNameRef = useRef(null);
  const [name, setName] = useState(null);


  useEffect(() => {
    const name = localStorage.getItem('name');
    if(name){
      setName(name)
    }
    const uid = localStorage.getItem('uid');
    // console.log('Current UID' + uid)
    if (!uid) {
      localStorage.setItem('uid', crypto.randomUUID());
    }
    // console.log(localStorage.getItem('uid'))
  }, [])

  const navigate = useNavigate();

  const handleCreateChat = event => {
    event.preventDefault();

    if(!name){
      localStorage.setItem('name', inputNameRef.current.value)
      setName(inputNameRef.current.value)
    }

    if(!localStorage.getItem('name')){
      return;
    }
    const request = {
      senderName: name,
      senderId: localStorage.getItem('uid')
    }


    fetch("https://chat-backend-service.povorozniuk.com/createChat", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
      .then(res => res.json())
      .then(res => navigate('/' + res.chatId))
      .then(res => window.location.reload())
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className='chat-container'>
      <form>
        {name ? "" : <input ref={inputNameRef} type="text" name="name" id='name' placeholder='Your Name' />}
        <input className='create-chat' type="submit" value="Create Chat" onClick={handleCreateChat} />
      </form>
    </div>
  );
}
