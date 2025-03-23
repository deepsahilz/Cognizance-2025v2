import axios from "axios";
import { toast } from "react-toastify";

let token;

try {
  token = localStorage.getItem("token");
  console.log(token);
} catch (error) {
  console.error("Error parsing token from localStorage:", error);
}

console.log(token); // Now accessible here too


const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
    // baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
});

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.config.showToast) {
            toast.success(response.config.toastMessage || "Success!", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored"
            });
        }
        return response;
    },
    (error) => {
        if (error.response) {
            toast.error(error.response.data.error || "Something went wrong!", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored"
            });
        } else {
            toast.error("Network error. Please check your connection.", {
                position: "bottom-right",
                autoClose: 3000,
                theme: "colored"
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;