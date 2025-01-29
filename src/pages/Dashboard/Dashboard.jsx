import { useEffect, useState } from "react";
import { supabaseService } from "../../services/supabaseService";
import styles from "./Dashboard.module.css";
import { StatCard } from "../../components/StatCard";
import { currencyService } from "../../services/currencyService";
import { transactionService } from "../../services/transactionService";
import { Filters } from "../../components/Filters";
import { ChartDoughnut } from "../../components/Charts";
import { ChartBar } from "../../components/Charts";
import { monthOrder } from "../../constants";

export const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [isOpenFilters, setIsOpenFilters] = useState(false);
    const [financials, setFinancials] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
    });

    const [filters, setFilters] = useState({
        timePeriod: '7',
        type: 'all',
        selectedCurrency: 'USD',
    });

    const [data, setData] = useState({
        categoryData: {},
        exchangeRates: {},
        monthlyTotals: [],
    });

    const sortedMonthlyTotals = data.monthlyTotals.sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);

    const toggleFilters = () => {
        setIsOpenFilters(!isOpenFilters);
    }

    const convertCurrency = (amount, selectedCurrency) => {
        if (!data.exchangeRates || !data.exchangeRates[selectedCurrency]) return amount;
        const rate = data.exchangeRates[selectedCurrency];
        return amount * rate;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rates = await currencyService.fetchExchangeRates();                
                setData((prev) => ({...prev, exchangeRates: rates}));

                const transactions = await supabaseService.fetchFilteredTransactions(filters.timePeriod, filters.type);
                const { income, expenses } = transactionService.calculateTotals(transactions);
                setFinancials({
                    totalIncome: income,
                    totalExpenses: expenses,
                    balance: income - expenses,
                });

                const categoryTotals = transactionService.calculateCategoryData(transactions);

                const monthlyTotals = transactionService.calculateMonthlyTotals(transactions);
                setData((prev) => ({
                    ...prev,
                    categoryData: categoryTotals,
                    monthlyTotals: monthlyTotals,
                }));
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters.timePeriod, filters.type, filters.selectedCurrency]);

    const handleTimeChange = (e) => setFilters((prev) => ({...prev, timePeriod: e.target.value}));
    const handleTypeChange = (e) => setFilters((prev) => ({...prev, type: e.target.value}));
    const handleCurrencyChange = (e) => setFilters((prev) => ({...prev, selectedCurrency: e.target.value}));

    const formattedBalance = currencyService.formatCurrency(convertCurrency(financials.balance, filters.selectedCurrency), filters.selectedCurrency);
    const formattedIncome = currencyService.formatCurrency(convertCurrency(financials.totalIncome, filters.selectedCurrency), filters.selectedCurrency);
    const formatedExpenses = currencyService.formatCurrency(convertCurrency(financials.totalExpenses, filters.selectedCurrency), filters.selectedCurrency);

    return (
        <div>
            <h1>Manage Your Finances</h1>
            <div className={styles.group}>
                <h2 className={styles.title}>My Dashboard</h2>
                <Filters
                    onClick={toggleFilters}
                    isOpen={isOpenFilters}
                    timePeriod={filters.timePeriod}
                    type={filters.type}
                    selectedCurrency={filters.selectedCurrency}
                    onChangeTime={handleTimeChange}
                    onChangeType={handleTypeChange}
                    onChangeCurrency={handleCurrencyChange}
                />
            </div>
            <div className={styles.grid}>
                <div className={styles.summary}>
                    <StatCard label="Income"
                        value={formattedIncome}
                        loading={loading}
                    />
                    <div className={styles.center}>
                        <StatCard label="Expenses"
                            value={formatedExpenses}
                            loading={loading}
                        />
                    </div>
                    <div className={styles.end}>
                        <StatCard label="Balance"
                            value={formattedBalance}
                            loading={loading}
                        />
                    </div>
                </div>
                <ChartBar
                    labels={["Income", "Expenses"]}
                    datasets={[
                        {
                            label: 'Finance Overview',
                            data: [financials.totalIncome, financials.totalExpenses],
                            backgroundColor: [
                                'rgba(61, 172, 145, 1)',
                                'rgba(252, 128, 128, 1)',
                            ],
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                        }
                    ]}
                    title="Finance Overview"
                />
                <ChartBar
                    labels={sortedMonthlyTotals.map(item => item.month)}
                    datasets={[
                        {
                            label: 'Income',
                            data: sortedMonthlyTotals.map(item => item.income),
                            backgroundColor: 'rgba(61, 172, 145, 1)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Expenses',
                            data: sortedMonthlyTotals.map(item => item.expenses),
                            backgroundColor: 'rgba(252, 128, 128, 1)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                        }
                    ]}
                    title='Financial Review by Period'
                />

                <div className={styles.doughnuts}>
                    <ChartDoughnut
                        labels={[
                            ...(data.categoryData.expenseTotals ? Object.keys(data.categoryData.expenseTotals) : []),
                            ...(data.categoryData.incomeTotals ? Object.keys(data.categoryData.incomeTotals) : [])
                        ]}
                        titleChart='Category Breakdown'
                        dataForChart={[
                            ...(data.categoryData.expenseTotals ? Object.values(data.categoryData.expenseTotals) : []),
                            ...(data.categoryData.incomeTotals ? Object.values(data.categoryData.incomeTotals) : [])
                        ]}
                        titleOptions='Financial Breakdown by Category'
                    />

                    <ChartDoughnut
                        labels={[...(data.categoryData.expenseTotals ? Object.keys(data.categoryData.expenseTotals) : []),]}
                        titleChart='Expenses Breakdown'
                        dataForChart={[...(data.categoryData.expenseTotals ? Object.values(data.categoryData.expenseTotals) : []),]}
                        titleOptions='Expense Breakdown by Category'
                    />

                    <ChartDoughnut
                        labels={[...(data.categoryData.incomeTotals ? Object.keys(data.categoryData.incomeTotals) : []),]}
                        titleChart='Income Breakdown'
                        dataForChart={[...(data.categoryData.incomeTotals ? Object.values(data.categoryData.incomeTotals) : []),]}
                        titleOptions='Income Breakdown by Category'
                    />
                </div>
            </div>
        </div>
    );
};