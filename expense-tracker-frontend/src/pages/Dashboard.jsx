import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import "../styles.css";

function Dashboard() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [expenses, setExpenses]=useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiRequest("/auth/me", "GET");

            if (response == null) {
                console.log("Failed to fetch user");
            } else {
                if (response.status === "success") {
                    setName(response.data.name);
                    setEmail(response.data.email);
                } else {
                    console.log(response.message);
                }
            }
        };
        
        fetchUser();
        fetchExpenses();
        fetchMonthlySummary();
        fetchCategorySummary();
    }, []);
    const fetchExpenses = async () => {
        const response = await apiRequest("/expenses", "GET");

        if (response == null) {
            console.log("Failed to fetch expenses");
        } else {
            if (response.status === "success") {
                setExpenses(response.data);
            } else {
                console.log(response.message);
            }
        }
    };
    const handleAddExpense =async ()=>{
        const response = await apiRequest("/expenses", "POST",{
            amount: amount,
            category: category,
            description: description,
            expense_datetime: new Date().toISOString()
        }); 
        if (response==null){
            console.log("Failed to add expense");
        }
        else{
            if (response.status === "success") {
                console.log(response.message);
                fetchExpenses();
                fetchMonthlySummary();
                fetchCategorySummary();
                setAmount("");
                setCategory("");
                setDescription("");
            } else {
                console.log(response.message);
            }
        }
    };
    const handleDelete = async (id) => {
        const response = await apiRequest(`/expenses/${id}`, "DELETE");

        if (response == null) {
            console.log("Failed to delete expense");
        } else {
            if (response.status === "success") {
                console.log(response.message);
                fetchExpenses();
            } else {
                console.log(response.message);
            }
        }
    };
    const [amount,setAmount]=useState("");
    const [category,setCategory]=useState("");
    const [description,setDescription]=useState("");
    
    const [monthlyTotal,setMonthlytotal]=useState(0);
    const month1=new Date().toISOString()
    const month2=month1.split("-")[1];
    const year=month1.split("-")[0];
    const month=year+"-"+month2;
    const fetchMonthlySummary = async () => {
        const response = await apiRequest(`/expenses/summary/monthly?month=${month}`, "GET");

        if (response == null) {
            console.log("Failed to fetch expenses");
        } else {
            if (response.status === "success") {
                setMonthlytotal(response.data.expense);
            } else {
                console.log("Error fetching expenses");
            }
        }
    };
    const [categorySummary,setCategorySummary]=useState([]);
    const fetchCategorySummary = async() => {
        const response = await apiRequest(`/expenses/summary/category?month=${month}`,"GET");
        if (response==null){
            console.log("Failed to fetch expenses");
        }
        else{
            if (response.status==="success"){
                setCategorySummary(response.data);
            }
            else{
                console.log("Error fetching expenses");
            }
        }
    };


    return (
        <div className="dashboard-container">
            <h2>DASHBOARD</h2>
            <div className="user-info">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
            </div>

            <div className="expense-form">
                <input 
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e)=>setAmount(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />
                <button onClick={handleAddExpense}>Add Expense</button>
            </div>

            {expenses.map((expense)=> (
                <div key={expense.id} className="expense-item">
                    <span><strong>{expense.category}</strong>: ${expense.amount} - {expense.description}</span>
                    <button onClick={() => handleDelete(expense.id)}>Delete</button>
                </div>
            ))}

            <div className="summary-section">
                <h3>Summary</h3>
                <p><strong>Monthly Total:</strong> ${monthlyTotal}</p>
                {categorySummary.map((cat)=> (
                    <div key={cat.category} className="category-summary">
                        <p>{cat.category}: ${cat.total}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;