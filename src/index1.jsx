import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { IgrFinancialEventArgs } from 'igniteui-react-charts';
import { IgrFinancialChartCustomIndicatorArgs } from 'igniteui-react-charts';
import { IgrFinancialChart } from 'igniteui-react-charts';
import { IgrFinancialChartModule } from 'igniteui-react-charts';
import { StocksUtility } from './StocksUtility';
import { useState, useEffect } from "react";

IgrFinancialChartModule.register();

interface CandlestickData {
  date: any;
  open: number;
  high: number;
  low: number;
  close: number;
  volume:number;
}



export default class FinancialChartIndicatorCustom  extends React.Component<{}, {data:CandlestickData[]}> {

    // public data: any[];
    
   
    constructor(props: any) {
        super(props);
        this.state ={
          data:[]
          }
        
        // console.log("This data",data)
        this.applyCustomIndicators = this.applyCustomIndicators.bind(this);
    }


    componentDidMount(): void {
    
    
        console.log("Set Interval started")
        let data_bybit = this.getStockData().then((data:any)=>{
          console.log("Res",data)
          const filteredArrays = [];
          
        // Use a for loop to iterate through the list and filter out the first five elements
        for (let i = 0; i < data.length; i++) {
            const filteredArray = data[i].slice(0, 6);
            // Slice the first five elements
  
            const date = new Date(parseInt(filteredArray[0]));
            filteredArray[0] = date.getTime();
  
            filteredArray[1] = parseInt(filteredArray[1])
            filteredArray[2] = parseInt(filteredArray[2])
            filteredArray[3] = parseInt(filteredArray[3])
            filteredArray[4] = parseInt(filteredArray[4])
            filteredArray[5]= parseInt(filteredArray[5])
  
            // Format the date as '02 Apr 2017 00:00 Z'
            let datapoint = {
                
                date: filteredArray[0],
                open: parseInt(filteredArray[1]),
                high: parseInt(filteredArray[2]),
                low: parseInt(filteredArray[3]),
                close: parseInt(filteredArray[4]),
                volume: parseInt(filteredArray[5])
  
            }
  
            filteredArrays.push(datapoint);
            // Add the filtered array to the result
        }
  
        // NfilteredArray[], filteredArrays contains the filtered arrays
        console.log("filteredArrays", filteredArrays);
       
  
        this.setState({data: filteredArrays},()=>console.log("data is everywher",this.state.data))
        
          
        });

     
    }
  



    
    
    
    public render(): JSX.Element {
        return (
          
            <div className="container sample" >
              
                {/* <div className="container">
                    <IgrFinancialChart
                        width="100%"
                        height="100%"
                        chartType="candle"
                        zoomSliderType="none"
                        dataSource={this.state.data}
                        // indicatorTypes="Volume"
                        // customIndicatorNames="Custom Indicator (Price Changes)"
                        // applyCustomIndicators={this.applyCustomIndicators}
                        />
                </div> */}
                <div className="container" style={{height: "calc(100% - 25px)"}}>
                    <IgrFinancialChart 
                    // width="100%" height="100%"
                   
                    // chartType="candle"
                    // zoomSliderType="none"
                        // chartType="Candle"
                        // isToolbarVisible="false"
                        
                        // xAxisEnhancedIntervalPreferMoreCategoryLabels="false"
                        // markerTypes="None"

                        width="100%"
                    height="100%"
                    chartType="Candle"
                    thickness={2}
                    chartTitle="Crypto chart"
                    subtitle="Live data"
                    yAxisMode="PercentChange"
                    yAxisTitle="Percent Changed"
                    // negativeOutlines="rgb(213, 94, 0)"
                    // negativeBrushes="Transparent"
                    // brushes="Transparent"
                    // zoomSliderType="None"
                        dataSource={this.state.data}
                        
                        />
                </div>
                
            </div>
        );
    }

    public applyCustomIndicators(chart: IgrFinancialChart, event: IgrFinancialChartCustomIndicatorArgs) {

        if (event.index === 0) {
            const info = event.indicatorInfo;
            if (!info) {
              console.log("indicatorInfo is undefined");
              return;
            }
      
            const ds = info.dataSource;
            if (!ds) {
              console.log("dataSource is undefined");
              return;
            }
      
            const closePrices = ds.closeColumn;
            const volumeData = ds.volumeColumn;
      
            if (!closePrices || !volumeData || closePrices.length === 0 || volumeData.length === 0) {
              console.log("Missing or empty data columns");
              return;
            }
      
            const period = 10; // VWMA period
      
            // Calculate VWMA
            const vwmaValues = [];
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
    }
    

    public getStockData(): any {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const dateEnd = new Date(year, month, 1);
        const dateStart = new Date(year - 2, month, 1);
        
        
        async function fetchBybitData(): Promise<any[]> {
          const myHeaders: Headers = new Headers();
          myHeaders.append("Content-Type", "application/json");
        
          const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
        
          const apiUrl: string = "https://api.bybit.com/v5/market/kline?symbol=BTCUSDT&interval=1&category=linear";
        
          try {
            
            const response: Response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const result: string = await response.text();
            return JSON.parse(result).result.list;
          } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error to handle it further up the call stack if needed
          }
        }
        

        return fetchBybitData();
    }

    public getStockDatawithLimit(): any {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const dateEnd = new Date(year, month, 1);
      const dateStart = new Date(year - 2, month, 1);
      
      
      async function fetchBybitData(): Promise<any[]> {
        const myHeaders: Headers = new Headers();
        myHeaders.append("Content-Type", "application/json");
      
        const requestOptions: RequestInit = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
      
        const apiUrl: string = "https://api.bybit.com/v5/market/kline?symbol=BTCUSDT&interval=1&limit=1&category=linear";
      
        try {
          
          const response: Response = await fetch(apiUrl, requestOptions);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const result: string = await response.text();
          return JSON.parse(result).result.list;
        } catch (error) {
          console.error('Error:', error);
          throw error; // Re-throw the error to handle it further up the call stack if needed
        }
      }
      

      return fetchBybitData();
  }
}

// rendering above class to the React DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FinancialChartIndicatorCustom/>);
