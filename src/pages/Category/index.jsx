import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComicList from "../../components/ComicList";
import TopComics from "../../components/TopComics";
import { fetchCategoryBySlug } from "../../services/categoryService";
import { saveIdComics } from "../../services/comicService";
import { sortingOptions } from "../../constants/";
import RecentHistory from "../../components/RecentHistory";

const Category = () => {
  const { slug } = useParams();
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titlePage, setTitlePage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState("Ngày cập nhật");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        const response = await fetchCategoryBySlug(slug, currentPage);
        await saveIdComics(response.data.items);

        
        setComics(response.data.items);
        setTitlePage(response.data.titlePage);
        setTotalPages(response.data.params.pagination.totalItemsPerPage);
      } catch (error) {
        console.error("Failed to fetch wishlists:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, [currentPage, slug]);

  if (loading)
    return (
      <div className="flex items-center justify-center text-white min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  return (
    <div className="bg-white pt-10 pb-8 w-full flex px-3 gap-6 justify-between">
      <div className="w-2/3 flex flex-col">
        <div className="w-full flex flex-col items-center">
          <div className="text-2xl pb-2 pt-3">
            Truyện thể loại{" "}
            <span className="font-bold">
              {titlePage}
            </span>
          </div>
          <div>
            <div className="flex gap-1">
              <div className={`${selectedStatus === "all" ? "bg-blue-400 text-white border border-blue-400" : "bg-none text-gray-800 hover:bg-gray-200 border"} py-1 px-6 cursor-pointer rounded-md`} onClick={() => setSelectedStatus("all")}>
                Tất cả
              </div>
              <div className={`${selectedStatus === "completed" ? "bg-blue-400 text-white border border-blue-400" : "bg-none text-gray-800 hover:bg-gray-200"} py-1 px-6 cursor-pointer border rounded-md`} onClick={() => setSelectedStatus("completed")}>
                Hoàn thành
              </div>
              <div className={`${selectedStatus === "ongoing" ? "bg-blue-400 text-white border border-blue-400" : "bg-none text-gray-800 hover:bg-gray-200 border"} py-1 px-6 cursor-pointer rounded-md`} onClick={() => setSelectedStatus("ongoing")}>
                Đang tiến hành
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full my-5 text-gray-600">
            <div className="text-md">Sắp sếp theo:</div>
            <div className="grid grid-cols-4 gap-1">
              {sortingOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  className={`rounded px-3 py-1 text-center text-[13px] font-semibold cursor-pointer ${ option === selectedOption ? " bg-amber-500 text-white border border-amber-500" : " hover:bg-gray-200 border"}`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          {comics && totalPages !== null ? (
            comics.length > 0 ? (
              <ComicList
                comics={comics}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            ) : (
              <div className="min-h-screen text-center w-full">
                Bạn chưa theo dõi bộ truyện nào cả!!
              </div>
            )
          ) : (
            <div className="min-h-screen">{}</div>
          )}
        </div>
      </div>
      <div className="w-1/3 space-y-5">
        <RecentHistory />
        <TopComics />
      </div>
    </div>
  );
};

export default Category;
