import { useEffect, useState } from "react";
import { supabaseService } from "../../services/supabaseService";
import { TableTransactions } from "../../components/TableTransactions";
import { Modal } from "../../components/Modal";
import { FormTransaction } from "../../components/FormTransaction";
import { Button } from "../../components/Button";
import SearchIcon from "../../assets/Search.svg?react";
import AddIcon from "../../assets/Add.svg?react";
import styles from "./Transactions.module.css";


export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpenModal, setIsEditModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filterType, setFilterType] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    // const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const { data, error } = await supabaseService.fetchTransactions();
                setTransactions(data);
                setFilteredTransactions(data);
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false);
            }
        }

        getTransactions();
    }, []);

    useEffect(() => {
        let filtered = [...transactions];

        if (searchQuery) {
            filtered = filtered.filter(transaction => {
                const matchesCategory = transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesType = transaction.transaction_type.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesNotes = transaction.notes.toLowerCase().includes(searchQuery.toLowerCase());

                const transactionDate = new Date(transaction.date).toLocaleDateString('en-CA');
                const matchesDate = transactionDate.includes(searchQuery);

                const matchesAmount = transaction.amount.toString().includes(searchQuery);

                return matchesCategory || matchesType || matchesDate || matchesAmount || matchesNotes;
            });
        }


        setFilteredTransactions(filtered);
    }, [searchQuery, transactions]);

    const resetFilters = () => {
        setFilteredTransactions(transactions);
    }

    const handleSaveTransaction = async (newTransaction) => {
        let result;
        if (transactionToEdit) {
            result = await supabaseService.updateTransaction(transactionToEdit, newTransaction);
        } else {
            result = await supabaseService.insertTransaction(newTransaction);
        }

        if (result.error) {
            console.error('Error saving transaction:', result.error);
        } else {
            const { data, error } = await supabaseService.fetchTransactions();
            if (!error) {
                setTransactions(data);
                setFilteredTransactions(data);
            }
        }

        setTransactionToEdit(null);
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    }

    const handleDeleteTransaction = async (id) => {
        const result = await supabaseService.deleteTransaction(id);

        if (result.error) {
            console.error('Error deleting transaction:', result.error);
        } else {
            const { data, error } = await supabaseService.fetchTransactions();
            if (!error) {
                setTransactions(data);
                setFilteredTransactions(data);
            }
        }
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleEditTransaction = (id) => {
        const transactionToEdit = transactions.find(transaction => transaction.id === id);
        setTransactionToEdit(transactionToEdit);
        setIsEditModalOpen(true);
    }

    const handleAddTransaction = () => setIsModalOpen(true);
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Transactions</h1>
            <div className={styles.head}>
                <form onSubmit={(event) => event.preventDefault()} className={styles.form}>
                    <input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
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
                transaction={filteredTransactions}
                noResultsMessage="No transactions found."
                onTypeFilter={setFilterType}
                onCategoryFilter={setFilterCategory}
                resetFilters={resetFilters}
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
                loading={loading}
            />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
                <FormTransaction onSave={handleSaveTransaction} />
            </Modal>

            <Modal isOpen={isEditOpenModal} onClose={() => setIsEditModalOpen(false)} title="Edit Transaction">
                <FormTransaction onSave={handleSaveTransaction} transaction={transactionToEdit} />
            </Modal>

        </div>
    )
}
