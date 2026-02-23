const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 🔹 MongoDB Atlas Connection
mongoose.connect("mongodb+srv://Jayasri:Jayasri2816@cluster0.3ku3lfd.mongodb.net/expenseDB?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));



//  GET 
app.get("/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST 
app.post("/expenses", async (req, res) => {
    try {
        const newExpense = new Expense({
            name: req.body.name,
            amount: req.body.amount
        });

        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ PUT - Update Expense (amount / paid)
app.put("/expenses/:id", async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ DELETE - Delete Expense
app.delete("/expenses/:id", async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense Deleted Successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Server Start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
