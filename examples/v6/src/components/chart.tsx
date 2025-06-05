import * as echarts from 'echarts';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react';
// import { useActivated, useTransition, useUnActivated } from '../../../../src';
import { useActivated, useTransition, useUnActivated } from 'rc-keep-alive-dom';

const Chart = forwardRef(
  (
    {
      style,
      /** 所需图表配置 */
      option,
      /** 合并option */
      mergeOption,
    }: {
      style?: CSSProperties;
      option: echarts.EChartsOption;
      mergeOption?: boolean;
    },
    ref,
  ) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chart = useRef<echarts.ECharts>(undefined);
    const drawChart = useCallback(() => {
      const chartDom = chartRef.current!;

      chart.current = echarts.getInstanceByDom(chartDom);
      if (!chart.current) {
        // 如果不存在，就进行初始化。
        chart.current = echarts.init(chartDom);
      }
      if (option) {
        chart.current?.setOption(option, mergeOption);
      }
    }, [option, mergeOption]);

    const onResize = useCallback(() => {
      console.log('resize');

      chart.current?.resize();
    }, []);

    useEffect(() => {
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        chart.current?.dispose();
      };
    }, [drawChart, onResize]);

    useTransition(
      (t) => {
        console.log('t: ', t);
        if (t?.type === 'end') {
          drawChart();
        }
      },
      // { onlyEmitOnce: true },
    );

    useActivated(() => {
      window.addEventListener('resize', onResize);
    });

    useUnActivated(() => {
      window.removeEventListener('resize', onResize);
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          setOption: (option: echarts.EChartsOption, mergeOption?: boolean) => {
            chart.current?.setOption(option, mergeOption);
          },
        };
      },
      [],
    );

    return (
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '100%',
          ...style,
        }}
      ></div>
    );
  },
);
export default Chart;
