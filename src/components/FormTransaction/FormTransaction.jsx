import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./FormTransaction.module.css";
import { categories, currencies } from "../../constants";

export const FormTransaction = ({ onSave, transaction }) => {
    const [transactionDetails, setTransactionDetails] = useState({
        date: transaction?.date || "",
        amount: transaction?.amount || "",
        type: transaction?.transaction_type || "",
        category: transaction?.category || "",
        currency: transaction?.currency || "USD",
        notes: transaction?.notes || "",
    });
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [errors, setErrors] = useState({});
    
    const today = new Date().toLocaleDateString('en-CA');

    useEffect(() => {
        if(transactionDetails.type && categories) {
            setFilteredCategories(categories[transactionDetails.type] || []);
        }
    }, [transactionDetails.type, categories]);

    useEffect(() => {
        if (transaction) {
            setTransactionDetails({
                date: transaction.date || "",
                amount: transaction.amount || "",
                type: transaction.transaction_type || "",
                category: transaction.category || "",
                currency: transaction.currency || "USD",
                notes: transaction.notes || "",
            });
        }
    }, [transaction]);

    const onClear = () => {
        setTransactionDetails((prev) => ({
            ...prev,
            date: "",
            amount: "",
            type: "",
            category: "",
            currency: "",
            notes: "",
        }))
    };

    const handleAmountBlur = () => {
        if (transactionDetails.amount) {
            const number = parseFloat(transactionDetails.amount.replace(/,/g, "").replace(/[^0-9.]/g, ""));
            const formattedValue = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(number);
            setTransactionDetails((prev) => ({
                ...prev,
                amount: formattedValue,
            }))
        }
    };
    
    const handleDateChange = (e) => setTransactionDetails((prev) => ({...prev, date: e.target.value}));
    const handleAmountChange = (e) => setTransactionDetails((prev) => ({...prev, amount: e.target.value}));
    const handleTypeChange = (e) => setTransactionDetails((prev) => ({...prev, type: e.target.value}));
    const handleCategoryChange = (e) => setTransactionDetails((prev) => ({...prev, category: e.target.value}));
    const handleCurrencyChange = (e) => setTransactionDetails((prev) => ({...prev, currency: e.target.value}));
    const handleNotesChange = (e) => setTransactionDetails((prev) => ({...prev, notes: e.target.value}));

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = {}

        if (!transactionDetails.date) {
            validationErrors.date = "Date is required";
        } 

        if (!transactionDetails.type) {
            validationErrors.type = "Type is required";
        }

        if (!transactionDetails.category) {
            validationErrors.category = "Category is required";
        }

        const amountString = typeof transactionDetails.amount === "number" ? transactionDetails.amount.toString() : transactionDetails.amount;

        const parsedAmount = parseFloat(amountString.replace(/,/g, "").replace(/[^0-9.]/g, "")); 
        if (isNaN(parsedAmount)) {
            validationErrors.amount = "Valid amount is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        const transactionData = {
            id: transaction?.id, 
            date: transactionDetails.date, 
            type: transactionDetails.type,
            category: transactionDetails.category,
            amount: parsedAmount,
            currency: transactionDetails.currency,
            notes: transactionDetails.notes,
        };

        onSave(transactionData);
        onClear();
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.field}>
                <label htmlFor="date">Date</label>
                <input 
                    type="date"
                    name="date"
                    id="date"
                    value={transactionDetails.date}
                    onChange={handleDateChange}
                    max={today}
                    className={styles.input}
                />
                
            </div>
            <p className={styles.error}>{errors.date}</p>

            <div className={styles.field}>
                <label htmlFor="amount">Amount</label>
                <input 
                    type="text" 
                    name="amount"
                    id="amount"
                    value={transactionDetails.amount}
                    onChange={handleAmountChange}
                    onBlur={handleAmountBlur}
                    placeholder="200"
                    className={styles.input}
                />
               
            </div>
            <p className={styles.error}>{errors.amount}</p>

            <div className={styles.field}>
                <label htmlFor="type">Type</label>
                <select className={styles.select} name="type" id="type" value={transactionDetails.type || ""} onChange={handleTypeChange}>
                    <option value="" disabled>select</option>
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                </select>
                
            </div>
            <p className={styles.error}>{errors.type}</p>

            <div className={styles.field}>
                <label htmlFor="category">Category</label>
                <select className={styles.select} name="category" id="category" value={transactionDetails.category} onChange={handleCategoryChange}>
                    <option value="" disabled>select</option>
                    {filteredCategories?.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
                
            </div>
            <p className={styles.error}>{errors.category}</p>

            <div className={styles.field}>
                <label htmlFor="currency">Currency</label>
                <select className={styles.select} name="currency" id="currency" value={transactionDetails.currency} onChange={handleCurrencyChange}>
                    {currencies?.map((curr, index) => (
                        <option key={index} value={curr}>{curr}</option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <label htmlFor="notes">Notes</label>
                <textarea 
                    name="notes"
                    id="notes"
                    value={transactionDetails.notes} 
                    onChange={handleNotesChange} 
                    className={styles.textarea}
                    placeholder="Add any notes (optional)">
                </textarea>
            </div>

            <div>
                <button className={styles.save} type="submit">save</button>
            </div>
        </form>
    )
}

FormTransaction.propTypes = {
    onSave: PropTypes.func.isRequired,
    transaction: PropTypes.object,
}