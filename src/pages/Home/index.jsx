import React, { useState, useEffect } from "react";
import ComicSlider from "../../components/ComicSlider";
import ComicList from "../../components/ComicList";
import { fetchAllComics, saveIdComics } from "../../services/comicService";
import TopComics from "../../components/TopComics";
import RecentHistory from "../../components/RecentHistory";

const Home = () => {
  const [comics, setComics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComics = async () => {
      const limit = 36;
      const startFrom = (currentPage - 1) * limit;

      try {
        setCurrentPage(currentPage)
        const { comics, firstPageResponse } = await fetchAllComics(startFrom, limit);
        await saveIdComics(comics);
        setComics(comics);
        const totalComics = firstPageResponse.data.params.pagination.totalItems;
        setTotalPages(Math.ceil(totalComics / limit));
      } catch (error) {
        console.error("Error fetching comics:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="bg-white pt-8 w-full flex justify-center items-center h-screen">
        <p className="text-2xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white py-8 w-full ">
      <div className="text-xl text-blue-500 font-semibold my-3 mx-3">
        Truyện đề cử {">"}
      </div>
      <ComicSlider />
      <div className="text-xl text-blue-500 font-semibold my-3 mt-8 mx-3">
        Truyện mới cập nhật {">"}
      </div>
      <div className="w-full px-3 flex justify-between gap-6">
        <div className="w-2/3 pb-20">
          <ComicList
            comics={comics}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <div className="w-1/3 space-y-5">
          <RecentHistory />
          <TopComics />
        </div>
      </div>
    </div>
  );
};

export default Home;
