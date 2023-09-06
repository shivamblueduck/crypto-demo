import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  IgrFinancialChart,
  IgrFinancialChartModule,
  IgrFinancialChartCustomIndicatorArgs,
} from 'igniteui-react-charts';

IgrFinancialChartModule.register();

interface CandlestickData {
  date: any;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const FinancialChartIndicatorCustom: React.FC = () => {
  const [data, setData] = useState<CandlestickData[]>([]);

  useEffect(() => {
    // Fetch your financial data here and set it in the "data" state
    // ...

    // For demonstration purposes, let's assume you have fetched the data
    // and set it in the "data" state.
  }, []);

  const applyCustomIndicators = (
    chart: IgrFinancialChart,
    event: IgrFinancialChartCustomIndicatorArgs
  ) => {
    if (event.index === 0) {
      const info = event.indicatorInfo;
      if (!info) {
        console.log('indicatorInfo is undefined');
        return;
      }

      const ds = info.dataSource;
      if (!ds) {
        console.log('dataSource is undefined');
        return;
      }

      const closePrices = ds.closeColumn;
      const volumeData = ds.volumeColumn;

      if (!closePrices || !volumeData || closePrices.length === 0 || volumeData.length === 0) {
        console.log('Missing or empty data columns');
        return;
      }

      const period = 10; // VWMA period

      // Calculate VWMA
      const vwmaValues: number[] = [];
      for (let i = 0; i < closePrices.length; i++) {
        let numerator = 0;
        let denominator = 0;
        for (let j = 0; j < period && i - j >= 0; j++) {
          numerator += closePrices[i - j] * volumeData[i - j];
          denominator += volumeData[i - j];
        }
        const vwma = numerator / denominator;
        vwmaValues.push(vwma);
      }

      // Set VWMA values to the indicator column
      for (let i = 0; i < vwmaValues.length; i++) {
        ds.indicatorColumn[i] = vwmaValues[i];
      }
    }
  };

  return (
    <div className="container sample">
      <div className="container" style={{ height: 'calc(100% - 25px)' }}>
        <IgrFinancialChart
          width="100%"
          height="100%"
          chartType="Candle"
          thickness={2}
          chartTitle="Crypto chart"
          subtitle="Live data"
          yAxisMode="PercentChange"
          yAxisTitle="Percent Changed"
          dataSource={data}
          applyCustomIndicators={applyCustomIndicators}
        />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FinancialChartIndicatorCustom />);
