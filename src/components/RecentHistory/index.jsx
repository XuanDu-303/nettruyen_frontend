import React, { useState, useEffect } from "react";
import {
  fetchComicBySlug,
  getHistorysUser,
  getTopComics,
  incViewsComic,
} from "../../services/comicService";
import { Link, useParams } from "react-router-dom";
import { ImEye } from "react-icons/im";

const RecentHistory = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewsComic, setViewsComic] = useState(0);
  const { slug } = useParams();

  const auth = localStorage.getItem('auth');
  const authObject = JSON.parse(auth || '{}');
  const authStatus = authObject.isAuthenticated === false;

  useEffect(() => {
    const fetchRecentHistory = async () => {
      try {
        const response = await getHistorysUser(1, 5);
        console.log(response);
        const comics = await Promise.all(
          response.result.map(async (topComic) => {
            const comicDetail = await fetchComicBySlug(topComic.slug);
            return { ...comicDetail, views: topComic.views };
          })
        );
        setComics(await Promise.all(comics));
      } catch (error) {
        console.error(`Error fetching RecentHistory`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentHistory();
  }, [viewsComic]);
  
  const handleComicClick = async (slug) => {
    try {
      const views = await incViewsComic(slug);
      setViewsComic(views);
    } catch (error) {
      console.error("Error increasing views:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }


  return (
    <div className={`w-full border border-b bg-white sticky top-14 px-2 ${authStatus ? 'hidden' : 'block'}`}>
      <div className="flex items-center justify-between py-3">
        <div className='text-[17px] text-blue-500'>Lịch sử đọc truyện</div>
        <a href="/lich-su-truyen-tranh" className='text-[13px] italic hover:underline hover:text-blue-500'>Xem tất cả</a>
      </div>
      <hr />
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
                className="w-full flex items-center gap-3 hover:bg-gray-100 transition duration-200 ease-in-out"
                key={index}
                onClick={
                  slug === comic.item.slug
                    ? null
                    : () => handleComicClick(comic.item.slug)
                }
              >
                <Link to={`/truyen-tranh/${comic.item.slug}`} className="">
                  <div className="flex py-3 border-b justify-between items-center gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <img
                        className={`h-16 min-w-[70px] object-cover rounded-sm border shadow-lg`}
                        src={thumb}
                        alt={comic.item.name}
                      />
                      <div className="flex flex-col gap-6 justify-between">
                        <p className="w-[245px] text-sm font-medium truncate  text-gray-800">
                          {comic.item.name}
                        </p>
                        <div className="flex justify-between">
                          <p className=" text-xs min-w-20 font-medium line-clamp-1 truncate overflow-clip text-gray-800">
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
  )
}

export default RecentHistory