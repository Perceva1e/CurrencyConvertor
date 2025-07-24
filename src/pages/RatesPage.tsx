import React from 'react';
import CurrencyList from '../components/CurrencyList';

const RatesPage: React.FC = () => {
  return (
    <div className="py-6">
      <CurrencyList />
    </div>
  );
};

export default RatesPage;