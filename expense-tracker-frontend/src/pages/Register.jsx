import React,{useState} from "react"
import { apiRequest } from "../services/api";
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
                console.log("Registration failed");
            }
        }
    };
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [name,setName]=useState("");
    return (
        <div>
            <h2>REGISTER</h2>
            <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />
            <br/>
            <br/>
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
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}
export default Register;