import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store/store';
import { fetchExchangeRates } from '../store/slices/currencySlice';

export const useExchangeRates = () => {
  const dispatch: AppDispatch = useDispatch();
  const exchangeRates = useSelector((state: RootState) => state.currency.exchangeRates || {});
  
  useEffect(() => {
    if (Object.keys(exchangeRates).length === 0) {
      dispatch(fetchExchangeRates());
    }
  }, [dispatch, exchangeRates]);
  
  return exchangeRates;
};