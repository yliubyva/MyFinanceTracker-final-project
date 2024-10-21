import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./FormTransaction.module.css";
import { categories, currencies } from "../../constants";



export const FormTransaction = ({ onSave, transaction }) => {

    const [date, setDate] = useState(transaction?.date || "");
    const [amount, setAmount] = useState(transaction?.amount || "");
    const [type, setType] = useState(transaction?.transaction_type || "");
    const [category, setCategory] = useState(transaction?.category || "");
    const [currency, setCurrency] = useState(transaction?.currency || "USD");
    const [notes, setNotes] = useState(transaction?.notes || "");
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [errors, setErrors] = useState({});

    const today = new Date().toLocaleDateString('en-CA');

    useEffect(() => {
        if(type) {
            setFilteredCategories(categories[type])
        }
    }, [type]);

    useEffect(() => {
        if (transaction) {
            setDate(transaction.date);
            setAmount(transaction.amount);
            setType(transaction.transaction_type);
            setCategory(transaction.category);
            setCurrency(transaction.currency);
            setNotes(transaction.notes || "");
        }
    }, [transaction]);

    const onClear = () => {
        setDate("");
        setAmount("");
        setType("");
        setCategory("");
        setCurrency("USD");
        setNotes("");
    };

    const handleAmountBlur = () => {
        if (amount) {
            const number = parseFloat(amount.replace(/,/g, "").replace(/[^0-9.]/g, ""));
            const formattedValue = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(number);
            setAmount(formattedValue);
        }
    };
    
    const handleDateChange = (event) => setDate(event.target.value);
    const handleAmountChange = (event) => setAmount(event.target.value);
    const handleTypeChange = (event) => setType(event.target.value);
    const handleCategoryChange = (event) => setCategory(event.target.value);
    const handleCurrencyChange = (event) => setCurrency(event.target.value);
    const handleNotesChange = (event) => setNotes(event.target.value);

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = {}

        if (!date) {
            validationErrors.date = "Date is required";
        } 

        if (!type) {
            validationErrors.type = "Type is required";
        }

        if (!category) {
            validationErrors.category = "Category is required";
        }

        const amountString = typeof amount === "number" ? amount.toString() : amount;

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
            date, 
            type,
            category,
            amount: parsedAmount,
            currency,
            notes,
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
                    value={date}
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
                    value={amount}
                    onChange={handleAmountChange}
                    onBlur={handleAmountBlur}
                    placeholder="200"
                    className={styles.input}
                />
               
            </div>
            <p className={styles.error}>{errors.amount}</p>

            <div className={styles.field}>
                <label htmlFor="type">Type</label>
                <select className={styles.select} name="type" id="type" value={type || ""} onChange={handleTypeChange}>
                    <option value="" disabled>select</option>
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                </select>
                
            </div>
            <p className={styles.error}>{errors.type}</p>

            <div className={styles.field}>
                <label htmlFor="category">Category</label>
                <select className={styles.select} name="category" id="category" value={category} onChange={handleCategoryChange}>
                    <option value="" disabled>select</option>
                    {filteredCategories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
                
            </div>
            <p className={styles.error}>{errors.category}</p>

            <div className={styles.field}>
                <label htmlFor="currency">Currency</label>
                <select className={styles.select} name="currency" id="currency" value={currency} onChange={handleCurrencyChange}>
                    {currencies.map((curr, index) => (
                        <option key={index} value={curr}>{curr}</option>
                    ))}
                </select>
            </div>

            <div className={styles.field}>
                <label htmlFor="notes">Notes</label>
                <textarea 
                    name="notes"
                    id="notes"
                    value={notes} 
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