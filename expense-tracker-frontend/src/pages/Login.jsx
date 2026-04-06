import React,{useState} from "react"
import { apiRequest } from "../services/api";
function Login(){
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
                console.log("Login successful");
            } else {
                console.log("Login failed");
            }
        }
    };
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    return (
        <div>
            <h2>LOGIN</h2>
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <br/>
            <br/>
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
            <br/>
            <br/>
            <button onClick={handleLogin}>Login</button>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    )
}
export default Login;