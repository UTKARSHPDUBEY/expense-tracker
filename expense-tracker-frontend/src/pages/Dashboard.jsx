import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";

function Dashboard() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

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
    }, []);

    return (
        <div>
            <h2>DASHBOARD</h2>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
        </div>
    );
}

export default Dashboard;