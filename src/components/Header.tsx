import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaExchangeAlt, 
  FaChartLine, 
  FaCog, 
  FaUserCircle 
} from 'react-icons/fa';
import SettingsModal from './SettingsModal';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { DEFAULT_CURRENCY } from '../utils/helpers';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const baseCurrency = useSelector((state: RootState) => state.currency.baseCurrency || DEFAULT_CURRENCY);
  const location = useLocation();

  useEffect(() => {
    if (isSettingsOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isSettingsOpen]);
  
  const navItems: NavItem[] = [
    { path: '/converter', label: 'Конвертер', icon: <FaExchangeAlt /> },
    { path: '/rates', label: 'Курсы валют', icon: <FaChartLine /> },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-lg mr-3">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            </div>
            <h1 className="text-xl font-bold">Конвертер Валют</h1>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-white bg-opacity-20' 
                        : 'hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="mr-2">Базовая валюта:</span>
              <span className="font-bold">{baseCurrency}</span>
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Настройки"
            >
              <FaCog size={20} />
            </button>
            
            <div className="p-2">
              <FaUserCircle size={24} />
            </div>
          </div>
        </div>
        
        {/* Мобильная навигация */}
        <nav className="md:hidden mt-3">
          <ul className="flex justify-around">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex flex-col items-center px-2 py-1 ${
                    isActive(item.path) ? 'text-blue-200' : ''
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs mt-1">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </header>
  );
};

export default Header;