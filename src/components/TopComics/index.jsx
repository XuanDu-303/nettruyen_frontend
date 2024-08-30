import React, { useState, useEffect } from "react";
import {
  fetchComicBySlug,
  getTopComics,
  incViewsComic,
} from "../../services/comicService";
import { Link, useParams } from "react-router-dom";
import { ImEye } from "react-icons/im";

const TopComics = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [viewsComic, setViewsComic] = useState(0);
  const { slug } = useParams();

  useEffect(() => {
    const fetchTopComics = async () => {
      try {
        const topComics = await getTopComics(period);
        const comics = await Promise.all(
          topComics.map(async (topComic) => {
            const comicDetail = await fetchComicBySlug(topComic.slug);
            return { ...comicDetail, views: topComic.views };
          })
        );
        setComics(await Promise.all(comics));
      } catch (error) {
        console.error(`Error fetching top comics of the ${period}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopComics();
  }, [period, viewsComic]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const topColors = [
    "text-yellow-500 shadow-yellow-200 border-yellow-100",
    "text-purple-500 shadow-purple-200 border-purple-100",
    "text-blue-500 shadow-blue-200 border-blue-100",
    "text-gray-500 shadow-gray-200 border-gray-100",
  ];

  const handleComicClick = async (slug) => {
    try {
      const views = await incViewsComic(slug);
      setViewsComic(views);
    } catch (error) {
      console.error("Error increasing views:", error);
    }
  };

  return (
    <div className=" w-full border-x border-b bg-white sticky top-14">
      <div className="flex text-[15px] font-[400] justify-between">
        <button
          className={`${
            period === "month"
              ? "bg-white text-black border-t-2"
              : "bg-gray-100 text-gray-700 hover:border-t-2 hover:text-black hover:py-[2px]"
          } w-1/3 border-purple-700 py-1 `}
          onClick={() => setPeriod("month")}
        >
          Top Tháng
        </button>
        <button
          className={`${
            period === "week"
              ? "bg-white text-black border-t-2"
              : "bg-gray-100 text-gray-700 hover:text-black hover:border-t-2 "
          } w-1/3 border-purple-700 py-1`}
          onClick={() => setPeriod("week")}
        >
          Top Tuần
        </button>
        <button
          className={`${
            period === "day"
              ? "bg-white text-black border-t-2"
              : "bg-gray-100 text-gray-700 hover:text-black hover:border-t-2"
          } w-1/3 border-purple-700 py-1`}
          onClick={() => setPeriod("day")}
        >
          Top Ngày
        </button>
      </div>
      <div className="w-full h-50 flex flex-col">
        {comics.length > 0 &&
          comics !== null &&
          comics.map((comic, index) => {
            const lastChapter = comic.item.chapters[0].server_data.slice(-1)[0];

            const chapterName = lastChapter.chapter_name;
            const chapterApiData = lastChapter.chapter_api_data;
            const chapterId = chapterApiData.substring(
              chapterApiData.lastIndexOf("/") + 1
            );

            const chapterUrl = `/truyen-tranh/${comic.item.slug}/chapter-${chapterName}/${chapterId}`;
            const thumb = `https://img.otruyenapi.com/uploads/comics/${comic.item.slug}-thumb.jpg`

            return (
              <div
                className="w-full px-2 flex items-center gap-3 hover:bg-gray-100 transition duration-200 ease-in-out"
                key={index}
                onClick={
                  slug === comic.item.slug
                    ? null
                    : () => handleComicClick(comic.item.slug)
                }
              >
                <Link to={`/truyen-tranh/${comic.item.slug}`} className="">
                  <div className="flex py-3 border-b justify-between items-center gap-2">
                    <p
                      className={`text-[20px] min-w-7 font-semibold h-8 flex items-center justify-center ${
                        index < 3 ? topColors[index] : topColors[3]
                      }`}
                    >
                      {index + 1 <= 7 ? `0${index + 1}` : index + 1}
                    </p>
                    <div className="flex justify-between items-start gap-2">
                      <img
                        className={`h-12 min-w-14 object-cover rounded-md border shadow-lg ${
                          index < 3 ? topColors[index] : topColors[3]
                        }`}
                        src={thumb}
                        alt={comic.item.name}
                      />
                      <div className="flex-col h-12 flex justify-between">
                        <p className="w-[220px] text-sm font-medium truncate text-gray-800">
                          {comic.item.name}
                        </p>
                        <div className="flex justify-between">
                          <p className=" text-xs min-w-20 font-medium truncate text-gray-800">
                            <Link
                              to={chapterUrl}
                              className="hover:text-blue-500"
                            >
                              Chapter {chapterName}
                            </Link>
                          </p>
                          <p className="justify-start gap-1 flex items-center text-xs font-medium line-clamp-1 truncate overflow-clip text-gray-500">
                            <ImEye size={13} />
                            <span className="italic">{comic.views}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TopComics;
