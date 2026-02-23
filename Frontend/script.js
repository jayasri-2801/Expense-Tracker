document.addEventListener("DOMContentLoaded", () => {

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const addBtn = document.getElementById("addExpenseBtn");

const API_URL = "https://expense-tracker-backend-oqxi.onrender.com/expenses";

// Load expenses
loadExpenses();

function loadExpenses() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            expenseList.innerHTML = "";
            let total = 0;

            data.forEach(exp => {
                createExpense(exp._id, exp.name, exp.amount, exp.paid);
                total += exp.amount;
            });

            totalAmount.innerText = total;
        });
}

// Add Expense
addBtn.addEventListener("click", () => {

    const name = expenseName.value.trim();
    const amount = expenseAmount.value.trim();

    if (!name || !amount) {
        alert("Please enter valid details!");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            amount: parseFloat(amount),
            paid: false
        })
    })
    .then(res => res.json())
    .then(() => {
        expenseName.value = "";
        expenseAmount.value = "";
        loadExpenses();
    });
});

function createExpense(id, name, amount, paid) {

    const li = document.createElement("li");
    if (paid) li.classList.add("paid");

    const span = document.createElement("span");
    span.textContent = `${name} - ₹${amount}`;

    const paidBtn = document.createElement("button");
    paidBtn.textContent = "Paid";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    // Toggle Paid
    paidBtn.addEventListener("click", () => {
        fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paid: !paid })
        }).then(loadExpenses);
    });

    // Delete
    deleteBtn.addEventListener("click", () => {
        fetch(API_URL + "/" + id, { method: "DELETE" })
        .then(loadExpenses);
    });

    // Edit
    editBtn.addEventListener("click", () => {
        const newAmount = prompt("Enter new amount:");
        if (!newAmount) return;

        fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: parseFloat(newAmount) })
        }).then(loadExpenses);
    });

    li.append(span, paidBtn, editBtn, deleteBtn);
    expenseList.appendChild(li);
}

});





























































