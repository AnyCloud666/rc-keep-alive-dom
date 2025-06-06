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
        src="https://cn.bing.com/search?q=%e7%99%be%e5%ba%a6&qs=SC&pq=baid&sk=HS1&sc=12-4&cvid=4A1397EBD52C4CC6B4B940A91E2475BD&FORM=QBRE&sp=2&lq=0"
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
