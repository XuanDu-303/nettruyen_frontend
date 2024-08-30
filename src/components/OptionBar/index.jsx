import React, { useState, useEffect } from "react";
import { FaChevronDown, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchAllCategory } from "../../services/comicService";

const OptionBar = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);

  const [isSticky, setSticky] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const allCategories = await fetchAllCategory();
      setCategories(allCategories);
    };

    fetchCategories();
  }, []);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`bg-gray-200 px-36 z-10 w-full shadow-md ${
        isSticky ? "fixed top-0 left-0 z-50" : "relative"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex text-black text-sm">
          <Link
            to="/"
            className="px-4 py-[10px] hover:text-purple-600 hover:bg-gray-100"
          >
            <FaHome size="20px" />
          </Link>
          <Link
            to="/truyen-tranh-hot"
            className="px-3 border-gray-300 border-l py-[10px] hover:text-purple-600 hover:bg-gray-100"
          >
            HOT
          </Link>
          <Link
            to="/theo-doi"
            className="px-3 border-gray-300 border-l py-[10px] hover:text-purple-600 hover:bg-gray-100"
          >
            THEO DÕI
          </Link>
          <Link
            to="/lich-su-truyen-tranh"
            className="px-3 border-gray-300 border-l py-[10px] hover:text-purple-600 hover:bg-gray-100"
          >
            LỊCH SỬ
          </Link>
          <div
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
            className="relative border-gray-300 border-l"
          >
            <button className="px-3 py-[10px] z-10 hover:text-purple-600 hover:bg-gray-100 flex items-center">
              THỂ LOẠI{" "}
              <FaChevronDown size="10px" color="black" className="ml-2" />
            </button>
            {isCategoryOpen && (
              <div className="absolute top-10 z-10 px-6 py-2 bg-white shadow-lg w-[600px]">
                <div className="grid grid-flow-col auto-rows-max grid-rows-[repeat(15,_minmax(0,1fr))] gap-x-3">
                  {categories.map((category, i) => (
                    <Link
                      to={`/the-loai/${category.slug}`}
                      key={i}
                      className="block py-[6px] hover:text-purple-500"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className="relative border-gray-300 border-l "
            onMouseEnter={() => setIsRankingOpen(true)}
            onMouseLeave={() => setIsRankingOpen(false)}
          >
            <button className="px-3 py-[10px] hover:text-purple-600 hover:bg-gray-100 flex items-center">
              XẾP HẠNG{" "}
              <FaChevronDown size="10px" color="black" className="ml-2" />
            </button>
            {isRankingOpen && (
              <div className="absolute top-8 mt-2 w-48 bg-white shadow-lg z-10">
                <div className="grid grid-cols-2 gap-x-10 p-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Link
                      to="#"
                      key={i}
                      className="block px-3 py-[10px] text-gray-700 hover:bg-gray-100"
                    >
                      Rk {i + 1}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            to="/tim-truyen"
            className="px-3 border-gray-300 border-l  py-[10px] hover:text-purple-600 hover:bg-gray-100"
          >
            TÌM TRUYỆN
          </Link>
          <Link
            to="/truyen-tranh-con-gai"
            className="px-3 border-gray-300 border-l  py-[10px] hover:text-purple-600 hover:bg-gray-100"
          >
            CON GÁI
          </Link>
          <Link
            to="/truyen-tranh-con-trai"
            className="px-3 border-gray-300 border-l border-r  py-[10px] hover:text-purple-600 hover:bg-gray-100"
          >
            CON TRAI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OptionBar;
