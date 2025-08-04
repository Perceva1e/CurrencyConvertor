import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { fetchExchangeRates as fetchApi } from '../../services/currencyAPI';
import { type RootState } from '../store';
import { loadFromLocalStorage, LOCAL_STORAGE_BASE_CURRENCY, LOCAL_STORAGE_FAVORITE_CURRENCIES } from '../../utils/helpers';

interface CurrencyState {
  baseCurrency: string;
  favoriteCurrencies: string[];
  exchangeRates: Record<string, number>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

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

export default currencySlice.reducer;