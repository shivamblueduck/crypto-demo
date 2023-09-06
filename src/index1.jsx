import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { IgrFinancialChart, IgrFinancialChartModule, IgrFinancialChartCustomIndicatorArgs } from 'igniteui-react-charts';
import { StocksUtility } from './StocksUtility';
import { log } from 'console';

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
    const fetchData = async () => {
      try {
        const stockData = await getStockData();
        const filteredArrays = stockData.map((item: any) => {
          const date = new Date(parseInt(item[0]));
          return {
            date: date.getTime(),
            open: parseInt(item[1]),
            high: parseInt(item[2]),
            low: parseInt(item[3]),
            close: parseInt(item[4]),
            volume: parseInt(item[5]),
          };
        });
        setData(filteredArrays);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const fetchDatalimit = async () => {
      try {
        const stockData = await getStockDataLimit();
        const filteredArrays = stockData.map((item: any) => {
          const date = new Date(parseInt(item[0]));
          return {
            date: date.getTime(),
            open: parseInt(item[1]),
            high: parseInt(item[2]),
            low: parseInt(item[3]),
            close: parseInt (item[4]),
            volume: parseInt(item[5]),
          };
        });
        console.log("Limited array ",filteredArrays)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000 * 5) // in milliseconds
    return () => clearInterval(intervalId)
   


    
  },[]);

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

  const getStockData = async (): Promise<any[]> => {
    const apiUrl =
      'https://api.bybit.com/v5/market/kline?symbol=BTCUSDT&interval=1&category=linear&limit=2000';
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const result = await response.json();
  
      if (result && result.result && result.result.list) {
        // Extract the data you need from the API response and return it
        return result.result.list;
      } else {
        throw new Error('Data structure from API is not as expected');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to handle it further up the call stack if needed
    }
  };
  const getStockDataLimit = async (): Promise<any[]> => {
    const apiUrl =
      'https://api.bybit.com/v5/market/kline?symbol=BTCUSDT&interval=1&category=linear&limit=1';
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const result = await response.json();
  
      if (result && result.result && result.result.list) {
        // Extract the data you need from the API response and return it
        return result.result.list;
      } else {
        throw new Error('Data structure from API is not as expected');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to handle it further up the call stack if needed
    }
  };
  

  return (
    <div className="container sample">
      <div className="container" style={{ height: 'calc(100% - 25px)' }}>
        <IgrFinancialChart
          width="100%"
          height="100%"
          chartType="Candle"
          // thickness={2}
          // chartTitle="Crypto chart"
          // subtitle="Live data"
          // yAxisMode="PercentChange"
          // yAxisTitle="Percent Changed"
          titleAlignment="Left"          
          titleLeftMargin="25"          
          titleTopMargin="10"          
          titleBottomMargin="10"          
          subtitle="Currency in USDT"          
          subtitleAlignment="Right"          
          subtitleLeftMargin="25"          
          subtitleTopMargin="5"          
          subtitleBottomMargin="10"          
          subtitleTextColor="green"          
          xAxisLabelTextColor="green"          
          xAxisTitleTextColor="green"          
          yAxisLabelLocation="OutsideRight"          
          yAxisMode="Numeric"          
          yAxisTitle="Financial Prices"          
          yAxisTitleLeftMargin="10"         
          yAxisTitleRightMargin="5"          
          yAxisLabelLeftMargin="0"          
          yAxisLabelTextColor="green"
          dataSource={data}
        />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FinancialChartIndicatorCustom />);
