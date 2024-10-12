import { useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import Image from './components/Image';

export default function App() {
  const [component, setComponent] = useState('Analyze');

  function activeComponent() {
    setComponent((prevComponent) => (prevComponent === 'Chat' ? 'Analyze' : 'Chat'));
  }

  return (
    <>
      <main>
        <span className='mask'>DocHealth AI</span>
        <h2>What can I do for you?</h2>

        <div id='app-container'>
          <button onClick={activeComponent}>
            {component} ✨
          </button>
        </div>

        {component === 'Analyze' ? <Chat/> : <Image/>}
      </main>
    </>
  );
}
