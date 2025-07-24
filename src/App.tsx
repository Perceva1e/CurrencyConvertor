import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import ConverterPage from './pages/ConverterPage';
import RatesPage from './pages/RatesPage';
import { fetchExchangeRates } from './store/slices/currencySlice';
import { type AppDispatch } from './store/store';

const App: React.FC = () => {
  useEffect(() => {
    const loadData = async () => {
      try {
        await (store.dispatch as AppDispatch)(fetchExchangeRates());
      } catch (error) {
        console.error('Ошибка при загрузке курсов валют:', error);
      }
    };
    
    loadData();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ConverterPage />} />
            <Route path="/converter" element={<ConverterPage />} />
            <Route path="/rates" element={<RatesPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;