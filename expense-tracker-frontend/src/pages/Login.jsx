import React,{useState} from "react"
import { apiRequest } from "../services/api";
import { Link } from  "react-router-dom";
import { useNavigate } from  "react-router-dom";
import "../styles.css";

function Login(){
    const navigate = useNavigate();
    const handleLogin = async () => {
        const response = await apiRequest("/auth/login", "POST", {
            email: email,
            password: password
        });
        if (response==null){
            console.log("Login failed");
        }
        else{
            if (response.status === "success") {
                var token=response.data.token;
                localStorage.setItem("token", token);
                navigate("/me");
                console.log("Login successful");
            } else {
                console.log("Login failed");
            }
        }
    };
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    return (
        <div className="container">
            <h2>LOGIN</h2>
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
            <button onClick={handleLogin}>Login</button>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    )
}
export default Login;