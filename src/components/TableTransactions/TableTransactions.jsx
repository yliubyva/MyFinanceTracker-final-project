import PropTypes from "prop-types";
import { useState } from "react";
import { currencyService } from "../../services/currencyService";
import { Loader } from "../Loader";
import EditIcon from "../../assets/Edit.svg?react";
import DeleteIcon from "../../assets/Delete.svg?react";
import styles from "./TableTransactions.module.css";


export const TableTransactions = ({ transaction, noResultsMessage, loading, onDelete, onEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const sortedTransactions = [...transaction].sort((a, b) => new Date(b.date) - new Date(a.date));

    const itemsPerPage = 10;
    const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
    const pageNumber = Array.from({ length: totalPages }, (value, index) => {
        return index + 1;
    });

    const indexOfLastTransaction = currentPage * itemsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;

    const currentTransacrion = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);


    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    if (transaction.length === 0) {
        return <p className={styles.message}>{noResultsMessage}</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.head}>
                    <span>Date</span>
                    <span>Type</span>
                    <span>Category</span>
                    <span>Amount</span>
                    <span>Notes</span>
                    <div></div>
                </div>
                <div className={styles.divider}></div>
                {loading ? (
                    <Loader />
                ) : (
                    <div className={styles.row}>
                        {currentTransacrion.map((operation, index) => (
                            <div key={index} className={styles.body}>
                                <span>{operation.date}</span>
                                <span
                                    className={operation.transaction_type === 'income' ? styles.income : styles.expense}
                                >
                                    {operation.transaction_type}
                                </span>
                                <span>{operation.category}</span>
                                <span>{currencyService.formatCurrency(operation.amount, operation.currency)}</span>
                                <span>{operation.notes}</span>
                                <div className={styles.buttons}>
                                    <button className={styles.button} onClick={() => onEdit(operation.id)}><EditIcon className={styles.icon} /></button>
                                    <button className={styles.button} onClick={() => onDelete(operation.id)}><DeleteIcon className={styles.icon} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <div>
                <div className={styles.buttonsPag}>
                    <button
                        className={styles.pagination}
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>

                    {pageNumber.map(pageNumber => (
                        <button
                            className={styles.pagination}
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={currentPage === pageNumber}
                        >
                            {pageNumber}
                        </button>
                    ))}

                    <button
                        className={styles.pagination}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                </div>
            </div>
        </div>
    )
}

TableTransactions.propTypes = {
    transaction: PropTypes.arrayOf(
        PropTypes.shape({
            date: PropTypes.string,
            amount: PropTypes.number,
            type: PropTypes.string,
            category: PropTypes.string,
            currency: PropTypes.string,
            notes: PropTypes.string,
        })
    ),
    loading: PropTypes.bool,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
}