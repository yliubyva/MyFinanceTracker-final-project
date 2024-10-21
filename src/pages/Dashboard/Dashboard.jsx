import { useEffect, useState } from "react";
import { supabaseService } from "../../services/supabaseService";
import { Loader } from "../../components/Loader";
import styles from "./Dashboard.module.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, ArcElement, plugins } from 'chart.js';
import { StatCard } from "../../components/StatCard";
import { currencyService } from "../../services/currencyService";
import { ChartContainer } from "../../components/ChartContainer";
import { transactionService } from "../../services/transactionService";
import { Filters } from "../../components/Filters/Filters";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, ArcElement);

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

    const monthOrder = {
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'May': 5,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12
    };

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

    const monthlyChartData = {
        labels: sortedMonthlyTotals.map(item => item.month),
        datasets: [
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
        ],
    };

    const optionsMonthly = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Financial Review by Period' },
        },
    };


    const barChartData = {
        labels: ["Income", "Expenses"],
        datasets: [
            {
                label: 'Finance Overview',
                data: [totalIncome, totalExpenses],
                backgroundColor: [
                    'rgba(61, 172, 145, 1)',
                    'rgba(252, 128, 128, 1)',
                ],
                borderColor: ['rgba(255, 255, 255, 0.1)'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Finance Overview' },
        },
    };

    const doughnutChartData = {
        labels: [
            ...(categoryData.expenseTotals ? Object.keys(categoryData.expenseTotals) : []),
            ...(categoryData.incomeTotals ? Object.keys(categoryData.incomeTotals) : [])
        ],
        datasets: [
            {
                label: 'Category Breakdown',
                data: [
                    ...(categoryData.expenseTotals ? Object.values(categoryData.expenseTotals) : []),
                    ...(categoryData.incomeTotals ? Object.values(categoryData.incomeTotals) : [])
                ],
                backgroundColor: [
                    'rgba(255, 182, 99, 1)',
                    'rgba(139, 121, 241, 1)',
                    'rgba(61, 172, 145, 1)',
                    'rgba(93, 63, 211, 1)',
                    'rgba(218, 252, 128, 1)',
                    'rgba(128, 252, 246, 1)',
                    'rgba(93, 63, 211, 1)',
                    'rgba(105, 159, 99, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(255, 255, 255, 0.1)'],
                borderWidth: 1,
            },
        ],
    };

    const optionsTotalCategories = {
        responsive: true,
        plugins: {
            legend: false,
            title: { display: true, text: 'Financial Breakdown by Category' },
        },
    };

    const expenseDoughnutData = {
        labels: [...(categoryData.expenseTotals ? Object.keys(categoryData.expenseTotals) : []),],
        datasets: [
            {
                label: 'Expenses Breakdown',
                data: [...(categoryData.expenseTotals ? Object.values(categoryData.expenseTotals) : []),],
                backgroundColor: [
                    'rgba(255, 182, 99, 1)',
                    'rgba(139, 121, 241, 1)',
                    'rgba(61, 172, 145, 1)',
                    'rgba(93, 63, 211, 1)',
                    'rgba(218, 252, 128, 1)',
                    'rgba(128, 252, 246, 1)',
                ],
                borderColor: ['rgba(255, 255, 255, 0.1)'],
                borderWidth: 1,
            },
        ],
    };

    const optionsExpenseCategories = {
        responsive: true,
        plugins: {
            legend: false,
            title: { display: true, text: 'Expense Breakdown by Category' },
        },
    };

    const incomeDoughnutData = {
        labels: [...(categoryData.incomeTotals ? Object.keys(categoryData.incomeTotals) : []),],
        datasets: [
            {
                label: 'income Breakdown',
                data: [...(categoryData.incomeTotals ? Object.values(categoryData.incomeTotals) : []),],
                backgroundColor: [
                    'rgba(93, 63, 211, 1)',
                    'rgba(105, 159, 99, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderColor: ['rgba(255, 255, 255, 0.1)'],
                borderWidth: 1,
            },
        ],
    };

    const optionsIncomeCategories = {
        responsive: true,
        plugins: {
            legend: false,
            title: { display: true, text: 'Income Breakdown by Category' },
        },
    };

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
                    <div className={styles.stat1}>
                        <StatCard label="Income"
                            value={loading ? <Loader /> : formattedIncome}
                            loading={loading} />
                    </div>
                    <div className={styles.stat2}>
                        <StatCard label="Expenses"
                            value={loading ? <Loader /> : formatedExpenses}
                            loading={loading} />
                    </div>
                    <div className={styles.stat3}>
                        <StatCard label="Balance"
                            value={loading ? <Loader /> : formattedBalance}
                            loading={loading} />
                    </div>
                </div>

                <div className={styles.stat4}>
                    <ChartContainer data={barChartData} options={options} type="bar" />
                </div>

                <div className={styles.stat5}>
                    <ChartContainer data={monthlyChartData} options={optionsMonthly} type="bar" />
                </div>

                <div className={styles.doughnuts}>
                    <div className={styles.stat6}>
                        <ChartContainer data={doughnutChartData} options={optionsTotalCategories} type="doughnut" />
                    </div>
                    <div className={styles.stat7}>
                        <ChartContainer data={expenseDoughnutData} options={optionsExpenseCategories} type="doughnut" />
                    </div>
                    <div className={styles.stat8}>
                        <ChartContainer data={incomeDoughnutData} options={optionsIncomeCategories} type="doughnut" />
                    </div>
                </div>
            </div>
        </div>
    );
};