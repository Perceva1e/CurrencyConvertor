import React from 'react';
import { FaStar } from 'react-icons/fa';

interface CurrencyCardProps {
  currency: {
    code: string;
    rate: number;
    isFavorite: boolean;
    name: string;
  };
  baseCurrency: string;
  onToggleFavorite: (code: string) => void;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({ 
  currency, 
  baseCurrency, 
  onToggleFavorite 
}) => {
  const { code, rate, isFavorite, name } = currency;
  const reverseRate = rate ? 1 / rate : 0;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold">{code}</h3>
          <p className="text-sm text-gray-500">{name}</p>
        </div>
        <button 
          onClick={() => onToggleFavorite(code)}
          className={`p-2 rounded-full ${isFavorite ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'}`}
          aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <FaStar size={18} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm text-gray-600">1 {baseCurrency}</p>
          <p className="text-lg font-bold text-blue-600">
            {rate ? rate.toFixed(4) : 'N/A'} {code}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">1 {code}</p>
          <p className="text-lg font-bold">
            {reverseRate.toFixed(4)} {baseCurrency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyCard;