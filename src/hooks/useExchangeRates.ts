import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch} from '../store/store';
import { fetchExchangeRates, selectExchangeRates } from '../store/slices/currencySlice';

export const useExchangeRates = () => {
  const dispatch: AppDispatch = useDispatch();
  const exchangeRates = useSelector(selectExchangeRates);
  
  useEffect(() => {
    if (Object.keys(exchangeRates).length === 0) {
      dispatch(fetchExchangeRates());
    }
  }, [dispatch, exchangeRates]);
  
  return exchangeRates;
};