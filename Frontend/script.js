const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const addBtn = document.getElementById("addExpenseBtn");

const API_URL = "http://localhost:5000/expenses";

// Load expenses when page loads
window.addEventListener("DOMContentLoaded", () => {
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
});

// Add Expense
addBtn.addEventListener("click", () => {
    const name = expenseName.value;
    const amount = expenseAmount.value;

    if (name === "" || amount === "") {
        alert("Please enter valid details!");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            amount: parseFloat(amount)
        })
    })
    .then(res => res.json())
    .then(newExpense => {
        createExpense(newExpense._id, newExpense.name, newExpense.amount, newExpense.paid);
        expenseName.value = "";
        expenseAmount.value = "";
        reloadTotal();
    });
});

function createExpense(id, name, amount, paid) {

    const li = document.createElement("li");

    if (paid) {
        li.classList.add("paid");
    }

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
        })
        .then(() => {
            li.classList.toggle("paid");
        });
    });

    // Delete
    deleteBtn.addEventListener("click", () => {
        fetch(API_URL + "/" + id, { method: "DELETE" })
        .then(() => {
            expenseList.removeChild(li);
            reloadTotal();
        });
    });

    // Edit
    editBtn.addEventListener("click", () => {
        const newAmount = prompt("Enter new amount:");
        if (!newAmount) return;

        fetch(API_URL + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: parseFloat(newAmount) })
        })
        .then(() => {
            span.textContent = `${name} - ₹${newAmount}`;
            reloadTotal();
        });
    });

    li.appendChild(span);
    li.appendChild(paidBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    expenseList.appendChild(li);
}

// Reload Total
function reloadTotal() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            let total = 0;
            data.forEach(exp => total += exp.amount);
            totalAmount.innerText = total;
        });
}