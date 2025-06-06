import * as echarts from 'echarts';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react';
import { useActivated, useTransition, useUnActivated } from '../../../../src';
// import { useActivated, useTransition, useUnActivated } from 'rc-keep-alive-dom';

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
      chart.current?.resize();
    }, []);

    useEffect(() => {
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        chart.current?.dispose();
        chart.current = undefined;
      };
    }, [drawChart, onResize]);

    useTransition(
      (t) => {
        if (t?.type === 'end') {
          console.log(
            'resize========================',
            chartRef.current?.clientHeight,
            chartRef.current?.clientWidth,
          );
          drawChart();
        }
      },
      { onlyEmitOnce: true },
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
      <>
        <button
          type="button"
          onClick={() => {
            chart.current?.dispose();
          }}
        >
          销毁图表
        </button>
        <button
          type="button"
          onClick={() => {
            drawChart();
          }}
        >
          重写绘制图表
        </button>
        <div
          ref={chartRef}
          style={{
            width: '100%',
            height: '100%',
            ...style,
          }}
        ></div>
      </>
    );
  },
);
export default Chart;
