import { useEffect, useState } from "react";
import "./App.css";

  const API=   "https://expense-tracker-back-hu6i.onrender.com/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // ================= FETCH =================
  const fetchExpenses = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch expenses");

      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ================= ADD =================
  const addExpense = async () => {
    if (!name || !amount) {
      alert("Enter valid details");
      return;
    }

    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          amount: parseFloat(amount),
        }),
      });

      setName("");
      setAmount("");
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error.message);
    }
  };

  // ================= DELETE =================
  const deleteExpense = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    fetchExpenses();
  };

  // ================= TOGGLE PAID =================
  const togglePaid = async (id, currentStatus) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: !currentStatus }),
    });
    fetchExpenses();
  };

  // ================= EDIT =================
  const editExpense = async (id, oldAmount) => {
    const newAmount = prompt("Enter new amount:", oldAmount);
    if (!newAmount) return;

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(newAmount) }),
    });

    fetchExpenses();
  };

  // ================= TOTAL =================
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="App">
      <h1 className="logo">💰 Personal Expense Tracker</h1>

      <div className="expense-form">
        <input
          type="text"
          placeholder="Enter expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={addExpense}>Add Expense</button>
      </div>

      <h2>Total: ₹ {total}</h2>

      <div className="expense-container">
        {expenses.map((exp) => (
          <div
            key={exp._id}
            className={`expense-card ${exp.paid ? "paid" : ""}`}
          >
            <h3>
              {exp.name} - ₹{exp.amount}
            </h3>

            <button
              onClick={() => togglePaid(exp._id, exp.paid)}
            >
              {exp.paid ? "Unpaid" : "Paid"}
            </button>

            <button
              onClick={() =>
                editExpense(exp._id, exp.amount)
              }
            >
              Edit
            </button>

            <button
              onClick={() => deleteExpense(exp._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;