import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { fetchExchangeRates as fetchApi } from '../../services/currencyAPI';
import { type RootState } from '../store';

const DEFAULT_RUSSIAN_CURRENCY = 'RUB';
const DEFAULT_CURRENCY = 'USD';

const LOCAL_STORAGE_BASE_CURRENCY = 'baseCurrency';
const LOCAL_STORAGE_FAVORITE_CURRENCIES = 'favoriteCurrencies';

interface CurrencyState {
  baseCurrency: string;
  favoriteCurrencies: string[];
  exchangeRates: Record<string, number>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const loadFromLocalStorage = (): { baseCurrency: string, favoriteCurrencies: string[] } => {
  let baseCurrency = localStorage.getItem(LOCAL_STORAGE_BASE_CURRENCY);
  if (!baseCurrency) {
    baseCurrency = navigator.language.includes('ru') ? DEFAULT_RUSSIAN_CURRENCY : DEFAULT_CURRENCY;
  }
  const favoriteCurrencies = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_FAVORITE_CURRENCIES) || '[]'
  ) as string[];
  
  return { baseCurrency, favoriteCurrencies };
};

const initialState: CurrencyState = {
  ...loadFromLocalStorage(),
  exchangeRates: {},
  status: 'idle',
  error: null
};

export const fetchExchangeRates = createAsyncThunk(
  'currency/fetchExchangeRates',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const baseCurrency = state.currency.baseCurrency;
    return await fetchApi(baseCurrency);
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setBaseCurrency(state, action: PayloadAction<string>) {
      state.baseCurrency = action.payload;
      localStorage.setItem(LOCAL_STORAGE_BASE_CURRENCY, action.payload);
    },
    toggleFavoriteCurrency(state, action: PayloadAction<string>) {
      const currency = action.payload;
      const index = state.favoriteCurrencies.indexOf(currency);
      if (index >= 0) {
        state.favoriteCurrencies.splice(index, 1);
      } else {
        state.favoriteCurrencies.push(currency);
      }
      localStorage.setItem(
        LOCAL_STORAGE_FAVORITE_CURRENCIES,
        JSON.stringify(state.favoriteCurrencies)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.exchangeRates = action.payload.conversion_rates;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch exchange rates';
      });
  },
});

export const { setBaseCurrency, toggleFavoriteCurrency } = currencySlice.actions;

export const selectBaseCurrency = (state: RootState) =>
  state.currency.baseCurrency || DEFAULT_CURRENCY;

export const selectFavoriteCurrencies = (state: RootState) =>
  state.currency.favoriteCurrencies || [];

export const selectExchangeRates = (state: RootState) =>
  state.currency.exchangeRates || {};

export const selectStatus = (state: RootState) =>
  state.currency.status || 'idle';

export const selectError = (state: RootState) =>
  state.currency.error || null;

export default currencySlice.reducer;