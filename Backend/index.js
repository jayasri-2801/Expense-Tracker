const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://Jayasri:Jayasri2816@cluster0.3ku3lfd.mongodb.net/expenseDB?appName=Cluster0")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

const expenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    paid: { type: Boolean, default: false }
});

const Expense = mongoose.model("Expense", expenseSchema);

// GET
app.get("/expenses", async (req, res) => {
    const expenses = await Expense.find();
    res.json(expenses);
});

// POST
app.post("/expenses", async (req, res) => {
    const newExpense = new Expense(req.body);
    const saved = await newExpense.save();
    res.status(201).json(saved);
});

// PUT
app.put("/expenses/:id", async (req, res) => {
    const updated = await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updated);
});

// DELETE
app.delete("/expenses/:id", async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});