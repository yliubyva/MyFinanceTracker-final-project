import { useEffect, useState } from "react";
import { supabaseService } from "../../services/supabaseService";
import { TableTransactions } from "../../components/TableTransactions";
import { Modal } from "../../components/Modal";
import { FormTransaction } from "../../components/FormTransaction";
import { Button } from "../../components/Button";
import SearchIcon from "../../assets/Search.svg?react";
import AddIcon from "../../assets/Add.svg?react";
import styles from "./Transactions.module.css";
import { Confirmation } from "../../components/Confirmation/Confirmation";

export const Transactions = () => {
    const [modals, setModals] = useState({
        isAddModalOpen: false,
        isEditModalOpen: false,
        isConfirmationModalOpen: false,
    });

    const [filters, setFilters] = useState({
        filterType: "",
        filterCategory: "",
        searchQuery: "",
    });

    const [transactionData, setTransactionData] = useState({
        transactions: [],
        filteredTransactions: [],
        transactionToEdit: null,
        transactionIdToDelete: null,
    });

    const [status, setStatus] = useState({
        loading: true,
        error: null,
        noResults: false,
    });

    const openModal = (modalName) => {
        setModals((prev) => ({...prev, [modalName]: true}));
    };

    const closeModal = (modalName) => {
        setModals((prev) => ({...prev, [modalName]: false}));
    };

    useEffect(() => {
        setStatus((prev) => ({
            ...prev,
            loading: true,
            error: null,
            noResults: false,
        }))
        const getTransactions = async () => {
            try {
                const { data, error } = await supabaseService.fetchTransactions();

                if (error) {
                    throw new Error(error.message);
                }

                if (data.length === 0) {
                    setStatus((prev) => ({ ...prev, noResults: true }))
                } else {
                    setTransactionData((prev) => ({
                        ...prev,
                        transactions: data,
                        filteredTransactions: data,
                    }))
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setStatus((prev) => ({ ...prev, loading: false }))
            }
        }

        getTransactions();
    }, []);

    useEffect(() => {
        let filtered = [...transactionData.transactions]; 

        if (filters.searchQuery) {
            filtered = filtered.filter(transaction => {
                const query = filters.searchQuery.toLowerCase();

                return (
                    transaction.category.toLowerCase().includes(query) ||
                    transaction.transaction_type.toLowerCase().includes(query) ||
                    transaction.notes.toLowerCase().includes(query) ||
                    new Date(transaction.date).toLocaleDateString('en-CA').includes(query) ||
                    transaction.amount.toString().includes(query)
                )
            });
        }

        setTransactionData((prev) => ({ ...prev, filteredTransactions: filtered }))
        setStatus((prev) => ({...prev, noResults: filtered.length === 0}));
    }, [filters.searchQuery, transactionData.transactions]);

    const resetFilters = () => {
        setTransactionData((prev) => ({
            ...prev,
            filteredTransactions: transactionData.transactions,
        }))
    }

    const handleSaveTransaction = async (newTransaction) => {
        let result;
        if (transactionData.transactionToEdit) {
            result = await supabaseService.updateTransaction(transactionData.transactionToEdit, newTransaction);
        } else {
            result = await supabaseService.insertTransaction(newTransaction);
        }

        if (result.error) {
            console.error('Error saving transaction:', result.error);
        } else {
            const { data, error } = await supabaseService.fetchTransactions();
            if (!error) {
                setTransactionData((prev) => ({
                    ...prev,
                    transactions: data,
                    filteredTransactions: data,
                }))
            }
        }

        setTransactionData((prev) => ({ ...prev, transactionToEdit: null }));
        closeModal("isAddModalOpen");
        closeModal("isEditModalOpen");
    }

    const handleDeleteTransaction = async () => {
        if (!transactionData.transactionIdToDelete) {
            return;
        }

        const result = await supabaseService.deleteTransaction(transactionData.transactionIdToDelete);

        if (result.error) {
            console.error('Error deleting transaction:', result.error);
        } else {
            const { data, error } = await supabaseService.fetchTransactions();
            if (!error) {
                setTransactionData((prev) => ({
                    ...prev,
                    transactions: data,
                    filteredTransactions: data,
                }))
            }
        }

        closeModal("isConfirmationModalOpen");
    }

    const handleSearchChange = (event) => {
        setFilters((prev) => ({ ...prev, searchQuery: event.target.value }));
    }

    const handleEditTransaction = (id) => {
        const transactionToEdit = transactionData.transactions.find(transaction => transaction.id === id);
        setTransactionData((prev) => ({ ...prev, transactionToEdit: transactionToEdit }));

        openModal("isEditModalOpen");
    }

    const handleAddTransaction = () => openModal("isAddModalOpen");

    const handleConfirmToDelete = (id) => {
        setTransactionData((prev) => ({ ...prev, transactionIdToDelete: id }));
        openModal("isConfirmationModalOpen");
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Transactions</h1>
            <div className={styles.head}>
                <form onSubmit={(event) => event.preventDefault()} className={styles.form}>
                    <input
                        type="search"
                        placeholder="Search..."
                        value={filters.searchQuery}
                        onChange={handleSearchChange}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.search}>
                        <SearchIcon className={styles.icon} />
                    </button>
                </form>
                <Button onClick={handleAddTransaction}>
                    <AddIcon className={styles.icon} />
                    Add Transaction
                </Button>
            </div>

            <TableTransactions
                transaction={transactionData.filteredTransactions}
                noResults={status.noResults}
                onTypeFilter={(newType) =>
                    setFilters((prev) => ({ ...prev, filterType: newType }))
                }
                onCategory={(newCategory) =>
                    setFilters((prev) => ({ ...prev, filterCategory: newCategory }))
                }
                resetFilters={resetFilters}
                onDelete={handleConfirmToDelete}
                onEdit={handleEditTransaction}
                loading={status.loading}
            />
            <Modal
                isOpen={modals.isAddModalOpen}
                onClose={() => closeModal("isAddModalOpen")}
                title="Add Transaction"
            >
                <FormTransaction onSave={handleSaveTransaction} />
            </Modal>

            <Modal
                isOpen={modals.isEditModalOpen}
                onClose={() => closeModal("isEditModalOpen")}
                title="Edit Transaction"
            >
                <FormTransaction onSave={handleSaveTransaction} transaction={transactionData.transactionToEdit} />
            </Modal>

            <Modal
                isOpen={modals.isConfirmationModalOpen}
                onClose={() => closeModal("isConfirmationModalOpen")}
                title="Are you sure you want to delete this transaction?"
            >
                <Confirmation
                    onDelete={handleDeleteTransaction}
                    onClose={() => closeModal("isConfirmationModalOpen")}
                />
            </Modal>
        </div>
    )
}