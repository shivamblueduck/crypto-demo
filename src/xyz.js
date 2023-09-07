import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import products from './products.json';

const App = () => {
  const [data, setData] = React.useState(products);
  const [pausedTimer, setPausedTimer] = React.useState(true);
  const [buttonLabel, setButtonLabel] = React.useState('Start');
  const changeIntervalRef = React.useRef(null);

  // Start or stop our "live" data
  const onStartStopClick = () => {
    updateButtonLabel();

    if (pausedTimer) {
      startDataChange();
      setPausedTimer(!pausedTimer);
    } else {
      pauseDataChange();
      setPausedTimer(!pausedTimer);
    }
  };

  const updateButtonLabel = () => {
    pausedTimer ? setButtonLabel('Stop') : setButtonLabel('Start');
  };

  // Kicks off when we click on the "Start" button and updates data randomly every second
  const startDataChange = () => {
    clearInterval(changeIntervalRef.current);
    changeIntervalRef.current = setInterval(() => {
      let newData = randomizeData(data);
      setData(newData);
    }, 1000);
  };

  // Pauses the data being updated
  const pauseDataChange = () => {
    clearInterval(changeIntervalRef.current);
  };

  // Randomly selects a set of data items from our data and updates the UnitsInStock field
  const randomizeData = (passedData) => {
    let newData = passedData.slice();

    for (
      let i = Math.round(Math.random() * 10);
      i < newData.length;
      i += Math.round(Math.random() * 10)
    ) {
      updateStock(newData[i]);
    }

    return newData;
  };

  // Randomly adds or removes 0-4 from UnitsInStock and changes the changeType from negative to positive.
  const updateStock = (passedRow) => {
    let oldUnitsInStock = passedRow.UnitsInStock;

    let updatedUnitsInStock = updateStockValue();

    updatedUnitsInStock < 0
      ? (passedRow.changeType = 'negative')
      : (passedRow.changeType = 'positive');

    passedRow.isChanged = true;
    passedRow.UnitsInStock = oldUnitsInStock - updatedUnitsInStock;
  };

  const updateStockValue = () => {
    return Math.floor(Math.random() * 4) * (Math.round(Math.random()) ? 1 : -1);
  };

  const InStockCell = (props) => {
    const checkChange = props.dataItem.isChanged || false;
    const field = props.field || '';
    const value = props.dataItem[field];

    if (checkChange === true) {
      let changeType = props.dataItem.changeType;
      let cellColors = {};

      changeType === 'positive'
        ? ((cellColors.color = 'green'),
          (cellColors.backgroundColor = '#bfdbc3'))
        : ((cellColors.color = 'red'),
          (cellColors.backgroundColor = '#ffd1d1'));

      return (
        <td
          style={{
            color: cellColors.color,
            background: cellColors.backgroundColor,
          }}
          colSpan={props.colSpan}
          role={'gridcell'}
          aria-colindex={props.ariaColumnIndex}
          aria-selected={props.isSelected}
        >
          {value === null ? '' : props.dataItem[field].toString()}
        </td>
      );
    } else {
      // Handles our initial rendering of the cells
      return (
        <td
          colSpan={props.colSpan}
          role={'gridcell'}
          aria-colindex={props.ariaColumnIndex}
          aria-selected={props.isSelected}
        >
          {value === null ? '' : props.dataItem[field].toString()}
        </td>
      );
    }
  };

  return (
    <>
      <Button onClick={onStartStopClick}>{buttonLabel}</Button>
      <Grid data={data}>
        <Column field="ProductID" title="ID" width="80px" filterable={false} />
        <Column field="ProductName" title="Name" width="250px" />
        <Column
          field="UnitsInStock"
          title="In Stock"
          filter="numeric"
          width="100px"
          cell={InStockCell}
        />
        <Column
          field="UnitPrice"
          title="Price"
          filter="numeric"
          width="150px"
        />
      </Grid>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('my-app'));
