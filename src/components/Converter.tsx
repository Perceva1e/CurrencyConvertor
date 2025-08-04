import React, { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { FaExchangeAlt, FaSpinner } from 'react-icons/fa';
import Select, { type SingleValue } from 'react-select';
import { convertCurrency, formatCurrency, DEFAULT_CURRENCY } from '../utils/helpers';
import { type RootState } from '../store/store';

interface CurrencyOption {
  value: string;
  label: string;
}

const Converter: React.FC = () => {
  const baseCurrency = useSelector((state: RootState) => state.currency.baseCurrency || DEFAULT_CURRENCY);
  const exchangeRates = useSelector((state: RootState) => state.currency.exchangeRates || {});
  const status = useSelector((state: RootState) => state.currency.status || 'idle');
  
  const currencies = useMemo(() => 
    exchangeRates ? Object.keys(exchangeRates) : []
  , [exchangeRates]);
  
  const [fromCurrency, setFromCurrency] = useState<string>(baseCurrency);
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('');
  const [lastChanged, setLastChanged] = useState<'from' | 'to'>('from');

  useEffect(() => {
    if (currencies.length > 0 && !currencies.includes(toCurrency)) {
      setToCurrency(currencies[0]);
    }
  }, [currencies, toCurrency]);

  useEffect(() => {
    if (status !== 'succeeded' || Object.keys(exchangeRates).length === 0) return;
    
    if (lastChanged === 'from' && fromAmount) {
      const amount = parseFloat(fromAmount.replace(',', '.')) || 0;
      const result = convertCurrency(
        amount, 
        fromCurrency, 
        toCurrency, 
        baseCurrency, 
        exchangeRates
      );
      setToAmount(formatCurrency(result));
    } else if (lastChanged === 'to' && toAmount) {
      const amount = parseFloat(toAmount.replace(',', '.')) || 0;
      const result = convertCurrency(
        amount, 
        toCurrency, 
        fromCurrency, 
        baseCurrency, 
        exchangeRates
      );
      setFromAmount(formatCurrency(result));
    }
  }, [
    fromCurrency, 
    toCurrency, 
    fromAmount, 
    toAmount, 
    exchangeRates, 
    baseCurrency, 
    lastChanged, 
    status
  ]);

  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*[,.]?\d*$/.test(value) || value === '') {
      setFromAmount(value);
      setLastChanged('from');
    }
  };

  const handleToAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*[,.]?\d*$/.test(value) || value === '') {
      setToAmount(value);
      setLastChanged('to');
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setLastChanged('from');
  };

  const currencyOptions: CurrencyOption[] = useMemo(() => 
    currencies.map(currency => ({
      value: currency,
      label: currency,
    }))
  , [currencies]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Конвертер валют</h2>
        <p className="text-gray-600">Актуальные курсы в реальном времени</p>
      </div>
      
      {status === 'loading' && (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
      )}
      
      {status === 'failed' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">Ошибка загрузки курсов валют. Попробуйте обновить страницу.</p>
        </div>
      )}
      
      {status === 'succeeded' && (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Из:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Сумма"
                />
                <div className="w-40">
                  <Select<CurrencyOption>
                    value={{ value: fromCurrency, label: fromCurrency }}
                    onChange={(option: SingleValue<CurrencyOption>) => 
                      option && setFromCurrency(option.value)
                    }
                    options={currencyOptions}
                    className="text-lg"
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={swapCurrencies}
              className="p-3 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors"
              aria-label="Поменять валюты местами"
            >
              <FaExchangeAlt size={20} />
            </button>
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                В:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={toAmount}
                  onChange={handleToAmountChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Сумма"
                />
                <div className="w-40">
                  <Select<CurrencyOption>
                    value={{ value: toCurrency, label: toCurrency }}
                    onChange={(option: SingleValue<CurrencyOption>) => 
                      option && setToCurrency(option.value)
                    }
                    options={currencyOptions}
                    className="text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-600">Текущий курс:</p>
                <p className="text-xl font-bold">
                  1 {fromCurrency} = {formatCurrency(
                    convertCurrency(1, fromCurrency, toCurrency, baseCurrency, exchangeRates)
                  )} {toCurrency}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Обратный курс:</p>
                <p className="text-xl font-bold">
                  1 {toCurrency} = {formatCurrency(
                    convertCurrency(1, toCurrency, fromCurrency, baseCurrency, exchangeRates)
                  )} {fromCurrency}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Converter;