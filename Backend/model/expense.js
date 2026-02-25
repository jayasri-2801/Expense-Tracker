// const mongoose = require("mongoose");

// const expenseSchema = new mongoose.Schema({
//     name: String,
//     amount: Number,
//     paid: { type: Boolean, default: false }
// });

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
