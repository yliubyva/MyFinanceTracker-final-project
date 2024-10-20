class CurrencyService {
    constructor() {
        this.apiUrl = `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_CURRENCY_API_KEY}/latest/USD`;
        this.exchangeRates = null;
    }

    async fetchExchangeRates() {
        if (!this.exchangeRates) {
            try {
                const response = await fetch(this.apiUrl);
                const data = await response.json();
                this.exchangeRates = data.conversion_rates;
            } catch (error) {
                console.error("Error fetching exchange rates:", error);
                throw new Error("Faailed to fetch exchange rates");
            }
        }
        return this.exchangeRates;
    }

    convertCurrency(amount, fromCurrency, toCurrency) {
        if (!this.exchangeRates || !this.exchangeRates[fromCurrency] || !this.exchangeRates[toCurrency]) {
            throw new Error("Exchange rates not loaded or invalid carrency");
        }

        if (fromCurrency === toCurrency) {
            return amount;
        }

        const rate = this.exchangeRates[fromCurrency];
        const targetRate = this.exchangeRates[toCurrency];
        return (amount / rate) * targetRate;
    }

    formatCurrency(amount, currency) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency, 
            minimumFractionDigits: 2,
        });
        return formatter.format(amount);
    }
}

export const currencyService = new CurrencyService();