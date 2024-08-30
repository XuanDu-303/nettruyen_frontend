import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { register } from "../../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const result = await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log("Registration successful", result);
      // Xử lý thành công, có thể chuyển hướng hoặc hiển thị thông báo
    } catch (error) {
      console.error("Registration failed", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full focus:outline-none max-w-md">
        <h2 className="text-2xl py-2 font-bold text-gray-900 mb-6 relative">
          ĐĂNG KÝ
          <div className="absolute bottom-0 left-0 w-12 h-1 rounded-md bg-red-500"></div>
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-sm pb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="w-full focus:outline-none p-1 px-3 border border-gray-300 rounded-[5px]"
            />
          </div>
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
          <div>
            <label htmlFor="confirm-password" className="text-sm pb-2">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu"
              required
              className="w-full focus:outline-none p-1 px-3 border border-gray-300 rounded-[5px]"
            />
          </div>
          <div className="flex justify-end">
            <a href="/login" className="text-blue-500 text-sm">
              Đăng nhập
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-[4px] font-semibold"
          >
            Đăng ký
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

export default Register;
