const expenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    paid: { type: Boolean, default: false }
});

const Expense = mongoose.model("Expense", expenseSchema);