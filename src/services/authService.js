import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";

const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    if(response.status === 200) {
      toast.success('Đăng kí thành công');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.message);
      console.error('Đăng kí thất bại:', error.response.data.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
};

const login = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/login', userData);
    const data = response.data;
    if(response.status === 200) {
      toast.success('Đăng nhập thành công');
    }
    const auth_state = {
      current: data.result,
      isAuthenticated: true,
    };
    localStorage.setItem("token", JSON.stringify(data.token));
    localStorage.setItem("auth", JSON.stringify(auth_state));
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.message);
      console.error('Đăng nhập thất bại:', error.response.data.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
};

const logout = async () => {
  const response = await axiosInstance.post(
    `auth/logout`
  );;
  toast.success('Đã đăng xuất');
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("auth");
    
    const auth = { isAuthenticated: false };
    localStorage.setItem("auth", JSON.stringify(auth));
  return response;
};

export { register , login, logout } ;