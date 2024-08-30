import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { logo } from "../../assets";
import {
  FaUser,
  FaChevronDown,
  FaRegEdit,
  FaBook,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoDiamondOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdSearch } from "react-icons/md";

const Navbar = () => {
  const isAuthenticated =
    JSON.parse(localStorage.getItem("auth") || "{}").isAuthenticated === true;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);  
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/tim-truyen?keyword=${keyword}`);
      setKeyword('');
    } else return
  };

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <nav className=" bg-purple-950 p-[9px] px-36 z-10">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <a href="/">
            <img src={logo} alt="Logo" />
          </a>
        </div>

        {/* Search Bar */}
        <div className="w-2/5 flex items-center justify-center">
          <input
            type="text"
            placeholder="Tìm truyện..."
            value={keyword}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-1 px-2 w-full bg-white text-black placeholder-gray-400 focus:outline-none rounded-l-sm"
          />
          <div onClick={handleSearch} className="bg-white hover:bg-gray-200 cursor-pointer rounded-r-sm font-bold h-[32px] px-2 flex items-center justify-center"><MdSearch size={18}/></div>
        </div>

        {/* Avatar and Name */}
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="flex items-center cursor-pointer">
            <FaUser color="white" size="13px" className="" />
            <span className="text-white ml-2 text-sm">Tài khoản</span>
            &nbsp;
            <FaChevronDown color="white" size="10" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute border-gray-500 right-0 top-4 mt-2 w-36 z-20 bg-white rounded-lg shadow-lg py-2">
              {isAuth ? (
                <>
                  <Link
                    to="/Account"
                    className="flex items-center gap-1 text-sm px-4 py-1 text-gray-800 hover:bg-gray-200"
                  >
                    <FaUser color="black" size="10px" className="" />
                    Trang cá nhân
                  </Link>
                  <Link
                    to="/theo-doi"
                    className="flex items-center gap-1 text-sm px-4 py-1 text-gray-800 hover:bg-gray-200"
                  >
                    <FaBook color="black" size="10px" className="" />
                    Truyện theo dõi
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-1 text-sm px-4 py-1 text-gray-800 hover:bg-gray-200"
                  >
                    <IoDiamondOutline color="black" size="10px" className="" />
                    Linh thạch
                  </Link>
                  <Link
                    to="/logout"
                    className="flex items-center gap-1 text-sm px-4 py-1 text-gray-800 hover:bg-gray-200"
                  >
                    <FaSignOutAlt color="black" size="10px" className="" />
                    Thoát
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-1 text-sm px-4 py-1 text-gray-800 hover:bg-gray-200"
                  >
                    <FaUser color="black" size="10px" className="" />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-1 text-sm px-4 py-1 text-gray-800 hover:bg-gray-200"
                  >
                    <FaRegEdit color="black" size="10px" className="" />
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
