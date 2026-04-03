const BASE_URL = "http://localhost:5000";

export async function apiRequest(endpoint, method = "GET", data = null) {
    const url = BASE_URL + endpoint;

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const options = {
        method: method,
        headers: headers
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}