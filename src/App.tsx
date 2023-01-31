import React, {useEffect} from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import Table from './features/Table/Table'

function App() {
  return (
    <div className="wrapper">
      <Table />
    </div>
  );
}

export default App;
