import React, { useState, useEffect } from "react";
import ComicList from "../../components/ComicList";
import { getWishlistsUser } from "../../services/comicService";
import TopComics from "../../components/TopComics";
import RecentHistory from "../../components/RecentHistory";

const Wishlist = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setLoading(true);
        const response = await getWishlistsUser(currentPage, 20);
        setComics(response.result);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch wishlists:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, [currentPage]);

  if (loading)
    return (
      <div className="flex items-center justify-center text-white min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  return (
    <div className="bg-white pt-10 pb-8 w-full flex px-3 gap-6 justify-between">
        <div className="w-2/3">
          <div className="text-xl text-blue-500 font-semibold py-3">
            Truyện đang theo dõi {">"}
          </div>
            <div className="w-full">
              {comics && totalPages !== null ? (
                comics.length > 0 ? <ComicList
                  comics={comics}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                /> : <div className="min-h-screen text-center w-full">Bạn chưa theo dõi bộ truyện nào cả!!</div>
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

export default Wishlist;
