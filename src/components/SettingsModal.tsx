import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setBaseCurrency } from '../store/slices/currencySlice';
import Select, { type SingleValue, type StylesConfig } from 'react-select';
import { getCurrencyName } from '../utils/helpers';
import { type RootState } from '../store/store';

interface CurrencyOption {
  value: string;
  label: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const baseCurrency = useSelector((state: RootState) => state.currency.baseCurrency);
  const exchangeRates = useSelector((state: RootState) => state.currency.exchangeRates);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(baseCurrency);
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  
  useEffect(() => {
    setSelectedCurrency(baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    if (exchangeRates && typeof exchangeRates === 'object') {
      const options = Object.keys(exchangeRates).map(currency => ({
        value: currency,
        label: `${currency} - ${getCurrencyName(currency)}`,
      }));
      setCurrencyOptions(options);
    } else {
      setCurrencyOptions([]);
    }
  }, [exchangeRates]);

  const handleSave = () => {
    dispatch(setBaseCurrency(selectedCurrency));
    onClose();
  };
  
  const customStyles: StylesConfig<CurrencyOption, false> = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, 
      position: 'absolute',
      width: '100%',
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
      fontWeight: 'bold'
    })
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-60">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Настройки</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Базовая валюта
            </label>
            <Select<CurrencyOption>
              value={{ 
                value: selectedCurrency, 
                label: `${selectedCurrency} - ${getCurrencyName(selectedCurrency)}`
              }}
              onChange={(option: SingleValue<CurrencyOption>) => 
                option && setSelectedCurrency(option.value)
              }
              options={currencyOptions}
              styles={customStyles}
              className="text-base react-select-container"
              classNamePrefix="react-select"
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuShouldScrollIntoView={true}
            />
            <p className="mt-2 text-sm text-gray-500">
              Эта валюта будет использоваться по умолчанию для конвертации и отображения курсов
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;