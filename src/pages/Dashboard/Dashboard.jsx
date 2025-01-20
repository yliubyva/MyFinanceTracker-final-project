import { useEffect, useState } from "react";
import { supabaseService } from "../../services/supabaseService";
import { Loader } from "../../components/Loader";
import styles from "./Dashboard.module.css";
import { StatCard } from "../../components/StatCard";
import { currencyService } from "../../services/currencyService";
import { transactionService } from "../../services/transactionService";
import { Filters } from "../../components/Filters";
import { ChartDoughnut } from "../../components/Charts";
import { ChartBar } from "../../components/Charts";
import { monthOrder } from "../../constants";

export const Dashboard = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [timePeriod, setTimePeriod] = useState('7');
    const [type, setType] = useState('all');
    const [categoryData, setCategoryData] = useState({});
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [exchangeRates, setExchangeRates] = useState({});
    const [monthlyTotals, setMonthlyTotals] = useState([]);
    const [isOpenFilters, setIsOpenFilters] = useState(false);

    const sortedMonthlyTotals = monthlyTotals.sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);

    const toggleFilters = () => {
        setIsOpenFilters(!isOpenFilters);
    }

    const convertCurrency = (amount, selectedCurrency) => {
        if (!exchangeRates || !exchangeRates[selectedCurrency]) return amount;
        const rate = exchangeRates[selectedCurrency];
        return amount * rate;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rates = await currencyService.fetchExchangeRates();
                setExchangeRates(rates);

                const transactions = await supabaseService.fetchFilteredTransactions(timePeriod, type);
                const { income, expenses } = transactionService.calculateTotals(transactions);
                setTotalIncome(income);
                setTotalExpenses(expenses);
                setBalance(income - expenses);

                const categoryTotals = transactionService.calculateCategoryData(transactions);
                setCategoryData(categoryTotals);

                const monthlyTotals = transactionService.calculateMonthlyTotals(transactions);
                setMonthlyTotals(monthlyTotals);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timePeriod, type, selectedCurrency]);

    const handleTimeChange = (event) => setTimePeriod(event.target.value);
    const handleTypeChange = (event) => setType(event.target.value);
    const handleCurrencyChange = (event) => setSelectedCurrency(event.target.value);

    const formattedBalance = currencyService.formatCurrency(convertCurrency(balance, selectedCurrency), selectedCurrency);
    const formattedIncome = currencyService.formatCurrency(convertCurrency(totalIncome, selectedCurrency), selectedCurrency);
    const formatedExpenses = currencyService.formatCurrency(convertCurrency(totalExpenses, selectedCurrency), selectedCurrency);

    return (
        <div>
            <h1>Manage Your Finances</h1>
            <div className={styles.group}>
                <h2 className={styles.title}>My Dashboard</h2>
                <Filters
                    onClick={toggleFilters}
                    isOpen={isOpenFilters}
                    timePeriod={timePeriod}
                    type={type}
                    selectedCurrency={selectedCurrency}
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
                            data: [totalIncome, totalExpenses],
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
                            ...(categoryData.expenseTotals ? Object.keys(categoryData.expenseTotals) : []),
                            ...(categoryData.incomeTotals ? Object.keys(categoryData.incomeTotals) : [])
                        ]}
                        titleChart='Category Breakdown'
                        dataForChart={[
                            ...(categoryData.expenseTotals ? Object.values(categoryData.expenseTotals) : []),
                            ...(categoryData.incomeTotals ? Object.values(categoryData.incomeTotals) : [])
                        ]}
                        titleOptions='Financial Breakdown by Category'
                    />

                    <ChartDoughnut
                        labels={[...(categoryData.expenseTotals ? Object.keys(categoryData.expenseTotals) : []),]}
                        titleChart='Expenses Breakdown'
                        dataForChart={[...(categoryData.expenseTotals ? Object.values(categoryData.expenseTotals) : []),]}
                        titleOptions='Expense Breakdown by Category'
                    />

                    <ChartDoughnut
                        labels={[...(categoryData.incomeTotals ? Object.keys(categoryData.incomeTotals) : []),]}
                        titleChart='Income Breakdown'
                        dataForChart={[...(categoryData.incomeTotals ? Object.values(categoryData.incomeTotals) : []),]}
                        titleOptions='Income Breakdown by Category'
                    />
                </div>
            </div>
        </div>
    );
};