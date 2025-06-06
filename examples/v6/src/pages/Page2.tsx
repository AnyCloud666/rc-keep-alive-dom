import { useEffect, useState } from 'react';
import reactLogo from '../assets/react.svg';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Page 2 is mounted');
  }, []);

  const onMoveIframe = () => {
    const ifr = document.getElementById('iframe');
    const container = document.querySelector('.iframe-container');
    container?.appendChild(ifr);
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Page 2</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} type="submit">
          count is {count}
        </button>
        <button onClick={onMoveIframe} type="submit">
          move iframe
        </button>
      </div>

      <iframe
        id="iframe"
        src="https://anycloud666.github.io/rc-keep-alive-dom/components/keep-alive-outlet"
        style={{
          width: 500,
          height: 1000,
        }}
      />
      <div className="iframe-container"></div>
    </>
  );
}

export default App;
