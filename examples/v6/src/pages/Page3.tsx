import { useEffect, useState } from 'react';
import reactLogo from '../assets/react.svg';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Page 2 is mounted');
  }, []);

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Page 3</h1>
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
    </>
  );
}

export default App;
