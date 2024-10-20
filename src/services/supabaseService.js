import { supabase } from "./supabaseClient";

class SupabaseService {
  async fetchTransactions() {
    try {
      const { data, error } = await supabase.from("transactions").select("*");

      if (error) {
        console.error("Error fetching transactions:", error);
        return { error };
      }

      return { data };
    } catch (err) {
      console.error("Unexpected error", err);
      return { error: err };
    }
  }

  async insertTransaction(newTransaction) {
    try {
      const { error } = await supabase.from("transactions").insert([
        {
          date: newTransaction.date,
          transaction_type: newTransaction.type,
          category: newTransaction.category,
          amount: newTransaction.amount,
          currency: newTransaction.currency,
          notes: newTransaction.notes,
        },
      ]);

      if (error) {
        console.error("Error inserting transactions:", error);
        return { error };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error", err);
      return { error: err };
    }
  }

  async updateTransaction(transactionToEdit, updatedTransaction) {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          date: updatedTransaction.date,
          transaction_type: updatedTransaction.type,
          category: updatedTransaction.category,
          amount: updatedTransaction.amount,
          currency: updatedTransaction.currency,
          notes: updatedTransaction.notes,
        })
        .match({ id: transactionToEdit.id });

      if (error) {
        console.error("Error updating transactions:", error);
        return { error };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error", err);
      return { error: err };
    }
  }

  async deleteTransaction(id) {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .match({ id });

      if (error) {
        console.error("Error deleting transactions:", error);
        return { error };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error", err);
      return { error: err };
    }
  }

  async getTotalIncome() {
    const { data, error } = await this.fetchTransactions();

    if (error) {
        return { error };
    }

    const totalIncome = data
        .filter(transaction => transaction.transaction_type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    return { totalIncome };
  }

  async getTotalExpenses() {
    const { data, error } = await this.fetchTransactions();

    if (error) {
        return { error };
    }

    const totalExpenses = data
        .filter(transaction => transaction.transaction_type === "expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    return { totalExpenses };
  }

  async fetchFilteredTransactions(timePeriod, type) {
    const { data, error } = await this.fetchTransactions();
    if(error) {
      console.error("Error fetching transactions: ", error);
      return [];
    }

    const now = new Date();
    const filteredData = data.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const diffInDays = (now - transactionDate) / (1000 * 3600 * 24);

      return diffInDays <= parseInt(timePeriod);
    });

    const typeFilteredData = filteredData.filter(transaction => {
      return type === 'all' || transaction.transaction_type === type;
    });

    return typeFilteredData;
  }
}

export const supabaseService = new SupabaseService();