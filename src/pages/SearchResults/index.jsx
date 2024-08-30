import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { saveIdComics, search } from "../../services/comicService";
import ComicList from "../../components/ComicList";
import TopComics from "../../components/TopComics";
import RecentHistory from "../../components/RecentHistory";

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword");

    const searchTerm = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await search(keyword, currentPage);
        await saveIdComics(results.data.items);
        setResults(results.data.items);
        setTotalPages(results.data.params.pagination.totalItemsPerPage);
      } catch (error) {
        console.error("Failed to fetch results:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    searchTerm();
  }, [location.search, currentPage]);

  if (loading)
    return (
      <div className="flex items-center justify-center text-white min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="min-h-screen text-center w-full">Không có kết quả nào phù hợp</div>;

  return (
    <div className="bg-white pt-10 pb-8 w-full flex px-3 gap-6 justify-between">
      <div className="w-2/3 px-3 pb-20">
        {results &&
          (results.length > 0 ? (
            <ComicList comics={results} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
          ) : (
            <div className="min-h-screen text-center w-full">
              Không có kết quả nào phù hợp
            </div>
          ))}
      </div>
      <div className="w-1/3 space-y-5">
        <RecentHistory />
        <TopComics />
      </div>
    </div>
  );
};

export default SearchResults;
