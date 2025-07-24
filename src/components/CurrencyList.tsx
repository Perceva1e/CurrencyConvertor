import React, { useState, useMemo, type ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectBaseCurrency, 
  selectExchangeRates, 
  selectFavoriteCurrencies,
  toggleFavoriteCurrency
} from '../store/slices/currencySlice';
import CurrencyCard from './CurrencyCard';
import { FaStar, FaSearch } from 'react-icons/fa';
import { getCurrencyName } from '../utils/helpers';
import { type AppDispatch } from '../store/store';

interface CurrencyItem {
  code: string;
  rate: number;
  isFavorite: boolean;
  name: string;
}

const CurrencyList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const baseCurrency = useSelector(selectBaseCurrency);
  const exchangeRates = useSelector(selectExchangeRates);
  const favoriteCurrencies = useSelector(selectFavoriteCurrencies);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const currencies = useMemo<CurrencyItem[]>(() => {
    if (!exchangeRates || typeof exchangeRates !== 'object') return [];
    
    const allCurrencies = Object.keys(exchangeRates)
      .filter(currency => currency !== baseCurrency)
      .map(currency => ({
        code: currency,
        rate: exchangeRates[currency],
        isFavorite: favoriteCurrencies.includes(currency),
        name: getCurrencyName(currency)
      }));
    
    const filteredCurrencies = allCurrencies.filter(currency => {
      const code = currency.code || '';
      const name = currency.name || '';
      const searchTermLower = (searchTerm || '').toLowerCase();
      
      return (
        code.toLowerCase().includes(searchTermLower) ||
        name.toLowerCase().includes(searchTermLower)
      );
    });
    
    return filteredCurrencies.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.code.localeCompare(b.code);
    });
  }, [exchangeRates, baseCurrency, favoriteCurrencies, searchTerm]);

  const handleToggleFavorite = (currencyCode: string) => {
    dispatch(toggleFavoriteCurrency(currencyCode));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Курсы валют</h2>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Поиск валюты..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="font-medium text-gray-700">Базовая валюта:</div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
            {baseCurrency} - {getCurrencyName(baseCurrency)}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center text-yellow-500 mb-2">
          <FaStar className="mr-2" />
          <h3 className="font-bold">Избранные валюты</h3>
        </div>
        
        {currencies.filter(c => c.isFavorite).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currencies
              .filter(currency => currency.isFavorite)
              .map(currency => (
                <CurrencyCard 
                  key={currency.code}
                  currency={currency} 
                  baseCurrency={baseCurrency}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-700">У вас пока нет избранных валют. Нажмите на звездочку рядом с валютой, чтобы добавить её в избранное.</p>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="font-bold text-gray-700 mb-2">Все валюты</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currencies.map(currency => (
            !currency.isFavorite && (
              <CurrencyCard 
                key={currency.code}
                currency={currency} 
                baseCurrency={baseCurrency}
                onToggleFavorite={handleToggleFavorite}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencyList;