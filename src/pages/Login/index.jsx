import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { login } from "../../services/authService";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      if(result.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full focus:outline-none max-w-md">
        <h2 className="text-2xl py-2 font-bold text-gray-900 mb-6 relative">
          ĐĂNG NHẬP
          <div className="absolute bottom-0 left-0 w-12 h-1 rounded-md bg-red-500"></div>
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm pb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full focus:outline-none p-1 px-3 border border-gray-300 rounded-[5px]"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm pb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
              className="w-full focus:outline-none p-1 px-3 border border-gray-300 rounded-[5px]"
            />
          </div>
          <div className="flex justify-end">
            <a href="/register" className="text-blue-500 text-sm">
              Đăng ký
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-[4px] font-semibold"
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className="w-full flex items-center bg-red-500 hover:bg-red-600 text-white rounded-[4px] font-semibold mt-3"
          >
            <div className="border-gray-300 border-r px-2 py-2">
              <FaGoogle size="20px" color="white" />
            </div>
            <span className="mx-auto py-2">Đăng ký bằng tài khoản Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
