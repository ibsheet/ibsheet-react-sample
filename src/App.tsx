import React from 'react';
import { Layout } from './layout/Layout';
import './App.css'
import loader from '@ibsheet/loader';

loader.load({
  name: 'ibsheet',
  baseUrl: 'https://demo.ibsheet.com/ibsheet/v8/samples/customer-sample/assets/ibsheet',
  locales: ['ko'],
  // plugins: ['excel', 'common', 'dialog']
})

const App: React.FC = () => {
  return (
    <Layout />
  );
}

export default App
