const API_KEY = '9e4e9ddb34553939ac47b56d';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

export const CurrencyService = {
  getExchangeRate: async (fromCurrency, toCurrency) => {
    try {
      const url = `${BASE_URL}/${API_KEY}/latest/${fromCurrency}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      return {
        rate: data.conversion_rates[toCurrency],
        timestamp: data.time_last_update_unix,
        success: true
      };
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return {
        rate: null,
        timestamp: null,
        success: false,
        error: error.message
      };
    }
  },

  convertAmount: (amount, rate) => {
    if (!amount || !rate) return '';
    return (parseFloat(amount) * rate).toFixed(2);
  },

  reverseConvertAmount: (amount, rate) => {
    if (!amount || !rate) return '';
    return (parseFloat(amount) / rate).toFixed(2);
  }
};