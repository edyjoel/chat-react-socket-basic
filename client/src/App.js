import './App.css';
import io from "socket.io-client";
import { useState, useEffect } from 'react';

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message);
    const newMessage = {
      body: message,
      from: 'Me'
    }
    setMessages([newMessage, ...messages]);
    setMessage('');
  }

  useEffect(() => {
    const receiveMessage = message => {
      console.log(message);
      setMessages([message, ...messages]);
    }

    socket.on('message', receiveMessage);

    return () => {
      socket.off('message', receiveMessage);
    }
  }, [messages]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-md">
        <h1 className='text-2xl font-bold my-2'>Chat React</h1>
        <input type="text" onChange={e => setMessage(e.target.value)} value={message} className="p-2 text-black w-full rounded-md" placeholder="Write a message..." />
        <ul className='h-80 overflow-y-auto'>
          {messages.map((message, index) => (
            <li key={index} className={`p-2 my-2 table text-sm rounded-md max-w-xs ${message.from === 'Me' ? 'bg-purple-700 ml-auto' : 'bg-zinc-700'}`}>
              <p>{message.from}: {message.body}</p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
