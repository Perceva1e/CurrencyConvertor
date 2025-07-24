import axios from 'axios';

interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

export const fetchExchangeRates = async (baseCurrency: string): Promise<ExchangeRateResponse> => {
  const response = await axios.get<ExchangeRateResponse>(`${API_URL}/${baseCurrency}`);
  return response.data;
};