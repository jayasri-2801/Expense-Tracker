// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const Expense = require("./model/expense");

// const app = express();

// app.use(express.json());
// app.use(cors());


// mongoose.connect("mongodb+srv://Jayasri:Jayasri2816@cluster0.3ku3lfd.mongodb.net/expenseDB?appName=Cluster0")
// .then(() => console.log("✅ MongoDB Connected"))
// .catch(err => console.log("❌ MongoDB Error:", err));

// // const expenseSchema = new mongoose.Schema({
// //     name: String,
// //     amount: Number,
// //     paid: { type: Boolean, default: false }
// // });

// // const Expense = mongoose.model("Expense", expenseSchema);

// // GET
// app.get("/expenses", async (req, res) => {
//     const expenses = await Expense.find();
//     res.json(expenses);
// });

// // POST
// app.post("/expenses", async (req, res) => {
//     const newExpense = new Expense({name: req.body.name, amount : req.body.amount});
//     const saved = await newExpense.save();
//     res.status(201).json(saved);
// });

// // PUT
// app.put("/expenses/:id", async (req, res) => {
//     const updated = await Expense.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//     );
//     res.json(updated);
// });

// // DELETE
// app.delete("/expenses/:id", async (req, res) => {
//     await Expense.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted" });
// });

// app.listen(3000, () => {
//     console.log("🚀 Server running on port 3000");
// });


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Expense = require("./model/expense");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection

mongoose.connect("mongodb+srv://Jayasri:Jayasri2816@cluster0.3ku3lfd.mongodb.net/expenseDB?appName=Cluster0")

    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err.message));



// ===================== ROUTES =====================

// CREATE
app.post("/expenses", async (req, res) => {
    try {
        const { name, amount } = req.body;

        if (!name || amount == null) {
            return res.status(400).json({ message: "Name and amount required" });
        }

        const newExpense = new Expense({ name, amount });
        const savedExpense = await newExpense.save();

        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ
app.get("/expenses", async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE
app.put("/expenses/:id", async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE
app.delete("/expenses/:id", async (req, res) => {
    try {
        const deleted = await Expense.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




const port =process.env.port||3000;
app.listen(port, () => {
    console.log("Server running on port ",port);
});

