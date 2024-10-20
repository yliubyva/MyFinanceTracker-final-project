import styles from "./Filters.module.css";
import ArrowIcon from "../../assets/Arrow.svg?react";
import PropTypes from "prop-types";

export const Filters = ({ 
    onClick, 
    isOpen, 
    timePeriod, 
    type, 
    selectedCurrency, 
    onChangeTime, 
    onChangeType, 
    onChangeCurrency 
}) => {
    return (
        <div className={styles.filtersButtonGroup}>
        <div className={styles.div}>
            <span>Filters</span>
            <button onClick={onClick} className={`${styles.toggle} ${isOpen ? styles.rotate : ''}`}>
                <ArrowIcon className={styles.icon} />
            </button>
        </div>

        <div className={`${styles.filters} ${isOpen ? styles.open : styles.close}`}>
            <label className={styles.time}>
                <p className={styles.titleFilter}>Time Period:</p>
                <select className={styles.select} value={timePeriod} onChange={onChangeTime}>
                    <option value="1">1 Day</option>
                    <option value="7">7 Days</option>
                    <option value="30">1 Month</option>
                    <option value="90">3 Months</option>
                    <option value="180">6 Months</option>
                    <option value="365">1 Year</option>
                </select>
            </label>
            <label className={styles.type}>
                <p className={styles.titleFilter}>Type:</p>
                <select className={styles.select} value={type} onChange={onChangeType}>
                    <option value="all">All</option>
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                </select>
            </label>
            <label className={styles.curr}>
                <p className={styles.titleFilter}>Currency:</p>
                <select className={styles.select} value={selectedCurrency} onChange={onChangeCurrency}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="UAH">UAH</option>
                </select>
            </label>
        </div>
    </div>
    )
}

Filters.propTypes = {
    onClick: PropTypes.func,
    isOpen: PropTypes.bool,
    timePeriod: PropTypes.string,
    type: PropTypes.string, 
    selectedCurrency: PropTypes.string,
    onChangeTime: PropTypes.func,
    onChangeType: PropTypes.func,
    onChangeCurrency: PropTypes.func,
}