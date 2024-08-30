import React, { useEffect, useState } from "react";
import ComicCard from "./../ComicCard";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import "../../App.css";

const ComicList = ({ comics, totalPages, setCurrentPage, currentPage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getQueryParam = (param) => {
    return new URLSearchParams(location.search).get(param);
  };

  useEffect(() => {
    const newPage = parseInt(getQueryParam("page")) || 1;
    if (newPage !== currentPage) {
      setIsLoading(true);
      setCurrentPage(newPage);
    }
  }, [location.search, currentPage, setCurrentPage]);

  useEffect(() => {
    if (comics.length > 0) {
      setIsLoading(false);
    }
  }, [comics]);

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    if (newPage !== currentPage) {
      setIsLoading(true);
      setCurrentPage(newPage);
      const params = new URLSearchParams(location.search);
      params.set("page", newPage);
      navigate(`?${params.toString()}`);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center text-white min-h-screen">
        Loading...
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {comics.map((comic) => (
          <div key={comic._id}>
            <ComicCard comic={comic} />
          </div>
        ))}
      </div>
      <div className="pagination mt-14">
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination-container"}
          pageClassName={"pagination-page"}
          pageLinkClassName={"pagination-page-link"}
          previousClassName={"pagination-previous"}
          previousLinkClassName={"pagination-previous-link"}
          nextClassName={"pagination-next"}
          nextLinkClassName={"pagination-next-link"}
          breakClassName={"pagination-break"}
          breakLinkClassName={"pagination-break-link"}
          activeClassName={"pagination-active"}
          forcePage={currentPage - 1}
        />
      </div>
    </div>
  );
};

export default ComicList;
