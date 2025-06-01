import { useEffect, useState } from 'react';
import viteLogo from '/vite.svg';

import { useActivated, useUnActivated } from '../../../../src/KeepAlive';
// import './App.css'

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('mounted');
  }, []);

  useActivated(() => {
    console.log('activated');
  });

  useUnActivated(() => {
    console.log('unactivated');
  });

  return (
    <div style={{ height: '200vh', overflow: 'auto' }}>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Page 1</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} type="submit">
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
