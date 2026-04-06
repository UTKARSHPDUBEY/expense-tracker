import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";

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
                    console.log("Error fetching user");
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
                console.log("Error fetching expenses");
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
                setAmount("");
                setCategory("");
                setDescription("");
            } else {
                console.log("Failed to add expense");
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
                console.log("Failed to delete expense");
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
        <div>
            <h2>DASHBOARD</h2>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            {expenses.map((expense)=> (
                <div key={expense.id}>
                    <p>{expense.category}-{expense.amount}-{expense.description}</p>
                    <button onClick={() => handleDelete(expense.id)}>Delete</button>
                </div>
            ))}
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

            <p>Monthly Total: {monthlyTotal}</p>
            {categorySummary.map((cat)=> (
                <div key={cat.category}>
                    <p>{cat.category}-{cat.total}</p>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;