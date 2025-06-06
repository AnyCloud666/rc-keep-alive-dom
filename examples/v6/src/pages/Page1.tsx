import { Suspense, useEffect, useMemo, useState } from 'react';

// import { useActivated, useUnActivated } from 'rc-keep-alive-dom';
import { useActivated, useUnActivated } from '../../../../src';
import Chart from '../components/chart';
// import './App.css'

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('mounted');
  }, []);

  useActivated(() => {
    console.log('activated----------------------');
  });

  useUnActivated(() => {
    console.log('unactivated-----------------------');
  });

  const option = useMemo<echarts.EChartsOption>(() => {
    return {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    };
  }, []);

  return (
    <div style={{ height: '200vh', overflow: 'auto' }}>
      <h1>Page 1</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} type="submit">
          count is {count}
        </button>
      </div>

      <Suspense>
        <div style={{ width: 500, height: 300, border: '1px solid #ccc' }}>
          <Chart
            option={option}
            mergeOption={true}
            // style={{ width: 'fit-content', height: 'fit-content' }}
          />
        </div>
      </Suspense>
    </div>
  );
}

export default App;
