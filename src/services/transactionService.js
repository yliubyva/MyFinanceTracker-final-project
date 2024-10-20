import { categories } from "../constants";
import { currencyService } from "../services/currencyService";

class TransactionService {
  constructor(selectedCurrency) {
    this.selectedCurrency = selectedCurrency;
  }

  calculateTotals(transactions) {
    const income = transactions
      .filter((transaction) => transaction.transaction_type === "income")
      .reduce(
        (sum, transaction) =>
          sum +
          currencyService.convertCurrency(
            transaction.amount,
            transaction.currency,
            this.selectedCurrency
          ),
        0
      );

    const expenses = transactions
      .filter((transaction) => transaction.transaction_type === "expense")
      .reduce(
        (sum, transaction) =>
          sum +
          currencyService.convertCurrency(
            transaction.amount,
            transaction.currency,
            this.selectedCurrency
          ),
        0
      );

    return { income, expenses };
  }

  calculateMonthlyTotals(transactions) {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "long",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }

      const amountInSelectedCurrency = currencyService.convertCurrency(
        transaction.amount,
        transaction.currency,
        this.selectedCurrency
      );
      if (transaction.transaction_type === "income") {
        monthlyData[month].income += amountInSelectedCurrency;
      } else if (transaction.transaction_type === "expense") {
        monthlyData[month].expenses += amountInSelectedCurrency;
      }
    });

    return Object.keys(monthlyData)
      .filter(
        (month) =>
          monthlyData[month].income > 0 || monthlyData[month].expenses > 0
      )
      .map((month) => ({
        month,
        income: monthlyData[month].income,
        expenses: monthlyData[month].expenses,
      }));
  }

  calculateCategoryData(transactions) {
    const expenseTotals = this.initializeCategoryTotals(categories.expense);
    const incomeTotals = this.initializeCategoryTotals(categories.income);

    transactions.forEach((transaction) => {
      if (
        transaction.transaction_type === "expense" &&
        expenseTotals.hasOwnProperty(transaction.category)
      ) {
        expenseTotals[transaction.category] +=
          this.convertToSelectedCurrency(transaction);
      } else if (
        transaction.transaction_type === "income" &&
        incomeTotals.hasOwnProperty(transaction.category)
      ) {
        incomeTotals[transaction.category] +=
          this.convertToSelectedCurrency(transaction);
      }
    });

    return { expenseTotals, incomeTotals };
  }

  initializeCategoryTotals(categoryList) {
    return categoryList.reduce((totals, category) => {
      totals[category] = 0;
      return totals;
    }, {});
  }

  convertToSelectedCurrency(transaction) {
    return currencyService.convertCurrency(
      transaction.amount,
      transaction.currency,
      this.selectedCurrency
    );
  }
}

export const transactionService = new TransactionService("USD"); 
