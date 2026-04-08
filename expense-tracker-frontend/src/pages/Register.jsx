import React,{useState} from "react"
import { apiRequest } from "../services/api";
import { Link } from  "react-router-dom";
import "../styles.css";

function Register(){
    const handleRegister =async ()=>{
        const response = await apiRequest("/auth/register", "POST",{
            name :name,
            email: email,
            password: password
        }); 
        if (response==null){
            console.log("Registration failed");
        }
        else{
            if (response.status === "success") {
                console.log(response.message);
            } else {
                console.log(response.message);
            }
        }
    };
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [name,setName]=useState("");
    return (
        <div className="container">
            <h2>REGISTER</h2>
            <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    )
}
export default Register;