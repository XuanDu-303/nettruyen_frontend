import React, { useEffect, useState } from "react";
import { IoChatbubble } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { timeAgo } from "../../utils/timeAgo";
import { Link } from "react-router-dom";
import {
  fetchComicBySlug,
  getMetricsBySlug,
  fetchUpdatedTime,
} from "../../services/comicService";
import { ImEye } from "react-icons/im";

const ComicCard = ({ comic, slider = false }) => {
  const [metrics, setMetrics] = useState({});
  const [comicDetail, setComicDetail] = useState(null);
  const [chapterTimes, setChapterTimes] = useState([]);

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        const data = await fetchComicBySlug(comic.slug);
        setComicDetail(data);
        const metrics = await getMetricsBySlug(comic.slug);
        setMetrics(metrics);

        if (data.item && data.item.chapters.length > 0) {
          const chapterTimes = await Promise.all(
            [...data.item.chapters[0].server_data]
              .slice(-3)
              .sort(
                (a, b) =>
                  parseInt(b.chapter_name, 10) - parseInt(a.chapter_name, 10)
              )
              .map(async (chapter) => {
                const chapterId = chapter.chapter_api_data.substring(
                  chapter.chapter_api_data.lastIndexOf("/") + 1
                );
                const updatedTime = await fetchUpdatedTime(chapterId);
                return { chapterId, updatedTime };
              })
          );
          setChapterTimes(chapterTimes);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchComicDetail();
  }, [comic.slug]);

  return slider ? (
    <div className="w-[188px] h-56">
      <Link to={`/truyen-tranh/${comic.slug}`} className="h-56 relative">
        <img
          src={`https://img.otruyenapi.com/uploads/comics/${comic.slug}-thumb.jpg`}
          alt={comic.slug}
          className="w-full h-full object-cover "
        />
        <div className="absolute bg-opacity-80 bg-black bottom-0 left-0 right-0">
          <h3 className="text-white truncate text-center px-1">{comic.name}</h3>
          <div className="flex justify-between px-3 pb-2 pt-1">
            <p className="text-white text-xs">Chapter: {comic.chaptersLatest[0].chapter_name}</p>
            <p className="text-white text-xs">
              {comicDetail && timeAgo(String(comicDetail.item.updatedAt))}
            </p>
          </div>
        </div>
      </Link>
    </div>
  ) : (
    <div className="w-[154px]">
      <Link to={`/truyen-tranh/${comic.slug}`} className="relative">
        <img
          src={`https://img.otruyenapi.com/uploads/comics/${comic.slug}-thumb.jpg`}
          alt={comic.slug}
          className="w-full rounded border border-gray-200 max-h-[200px] object-cover"
        />
        <div className="absolute flex items-center text-gray-200 rounded-b justify-between p-[3px] px-3 bg-opacity-70 bg-black bottom-0 left-0 right-0">
          <div className="flex items-center text-[13px] gap-[3px]">
            <ImEye size={13} />
            <span className="">{metrics.views || 0}</span>
          </div>
          <div className="flex items-center text-[13px] gap-[3px]">
            <IoChatbubble size={13} />
            <span className="">{metrics.totalComments || 0}</span>
          </div>
          <div className="flex items-center text-[13px] gap-[3px]">
            <FaHeart size={13} />
            <span className="">{metrics.followers || 0}</span>
          </div>
        </div>
      </Link>
      <Link to={`/truyen-tranh/${comic.slug}`}>
        <div>{comicDetail?.item?.name}</div>
      </Link>

      <div className="space-y-1 mt-1">
        {comicDetail &&
          comicDetail.item &&
          comicDetail.item.chapters.length > 0 &&
          [...comicDetail.item.chapters[0].server_data]
            .slice(-3)
            .sort(
              (a, b) =>
                parseInt(b.chapter_name, 10) - parseInt(a.chapter_name, 10)
            )
            .map((chapter, index) => {
              const chapterId = chapter.chapter_api_data.substring(
                chapter.chapter_api_data.lastIndexOf("/") + 1
              );
              const updatedTime = chapterTimes.find(
                (ct) => ct.chapterId === chapterId
              )?.updatedTime;

              return (
                <div key={index} className="flex items-center justify-between w-full">
                  <Link
                    to={`/truyen-tranh/${comicDetail.item.slug}/chapter-${chapter.chapter_name}/${chapterId}`}
                    className="hover:text-blue-500 text-[14px]"
                  >
                    Chapter {chapter.chapter_name}
                  </Link>
                  <div className="text-xs text-gray-400 italic mt-[1px]">
                    {updatedTime
                      ? timeAgo(String(updatedTime), "YYYYMMDD")
                      : "N/A"}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default ComicCard;
