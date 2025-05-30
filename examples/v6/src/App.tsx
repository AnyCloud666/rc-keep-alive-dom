import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Router from './router';

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Suspense>
          <Router />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
