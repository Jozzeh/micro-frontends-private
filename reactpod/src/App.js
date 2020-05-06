import React, {useState} from 'react';
import './App.css';
import { MessageBus } from '@podium/browser';

function App() {
  const messageBus = new MessageBus();

  const [messager, setMessage] = useState('Message events...');

  messageBus.subscribe('internalchannel', 'newMessage', event => {
    if(event.payload.message !== messager){
      console.log('message received from ' + event.payload.from);
      setMessage(event.payload.message);
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src="/reactpod-assets/logo.svg" className="App-logo" alt="logo" />
        <p>
          Created with create-react-app and added podium build script in root
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {messager}
        </a>
      </header>
    </div>
  );
}

export default App;
