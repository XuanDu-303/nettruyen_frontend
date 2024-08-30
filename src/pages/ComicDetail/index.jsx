import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  fetchComicBySlug,
  getMetricsBySlug,
  toggleFollowComic,
  incViewsComic,
  saveChapters,
  fetchUpdatedTime,
} from "../../services/comicService";
import { formatDate, timeAgo } from "../../utils/timeAgo";
import { FaUser } from "react-icons/fa";
import { ImConnection, ImCross } from "react-icons/im";
import { MdSell, MdOutlineArrowDropDown } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { FaHeart, FaPlus } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import TopComics from "../../components/TopComics";
import RecentHistory from "../../components/RecentHistory";
const ComicDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [comicDetail, setComicDetail] = useState(null);
  const [viewsComic, setViewsComic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [updatedComic, setUpdateComic] = useState(false);
  const [chapterViewsMap, setChapterViewsMap] = useState(null);
  const [chapterTimes, setChapterTimes] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleComicClick = async () => {
      try {
        const views = await incViewsComic(slug);
        console.log(views);
      } catch (error) {
        console.error("Error increasing views:", error);
      }
    };
    handleComicClick();
  }, [slug]);

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        const data = await fetchComicBySlug(slug);
        const views = await getMetricsBySlug(slug);

        if (data.item && data.item.chapters.length > 0) {
          const chapterTimes = await Promise.all(
            [...data.item.chapters[0].server_data]
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

        const chapterViewsMap = new Map();
        views.chapters.forEach((chapter) => {
          chapterViewsMap.set(chapter.externalId, chapter.views);
        });
        const chapterIds = [...data.item.chapters[0].server_data].map(
          (chapter) => ({
            chapterNumber: chapter.chapter_name,
            externalId: chapter.chapter_api_data.split("/").pop(),
          })
        );

        await saveChapters(chapterIds, data.item._id, slug);
        setChapterViewsMap(chapterViewsMap);
        setViewsComic(views);
        setIsFollowed(views.isFollowed);
        setComicDetail(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchComicDetail();
  }, [slug, updatedComic]);

  const handleToggleFollow = async () => {
    try {
      const updatedComic = await toggleFollowComic(viewsComic._id);
      setUpdateComic(updatedComic);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  const handleLastChapter = async () => {
    try {
      const chapters = [...comicDetail.item.chapters[0].server_data];

      const chapterId = chapters[0].chapter_api_data.substring(
        chapters[0].chapter_api_data.lastIndexOf("/") + 1
      );
      navigate(
        `/truyen-tranh/${comicDetail.item.slug}/chapter-${chapters[0].chapter_name}/${chapterId}`
      );
    } catch (error) {
      console.error("Failed to handleFirstChapter:", error);
    }
  };

  const handleFirstChapter = async () => {
    try {
      const chapters = [...comicDetail.item.chapters[0].server_data];

      const firstChapter = chapters[chapters.length - 1];

      const chapterId = firstChapter.chapter_api_data.substring(
        firstChapter.chapter_api_data.lastIndexOf("/") + 1
      );
      navigate(
        `/truyen-tranh/${comicDetail.item.slug}/chapter-${firstChapter.chapter_name}/${chapterId}`
      );
    } catch (error) {
      console.error("Failed to handleLastChapter:", error);
    }
  };

  const chapters = comicDetail?.item?.chapters[0]?.server_data.sort(
    (a, b) => parseInt(b.chapter_name, 10) - parseInt(a.chapter_name, 10)
  );

  const chaptersToShow = showMore ? chapters : chapters?.slice(0, 17);

  const truncatedContent =
    comicDetail &&
    (comicDetail.item.content.length > 150
      ? comicDetail.item.content
          .replace(/<\/?p>/g, "")
          .replace(/&nbsp;/g, "")
          .substring(0, 150) + "..."
      : comicDetail.item.content.replace(/<\/?p>/g, "").replace(/&nbsp;/g, ""));

  if (loading)
    return <p className="text-center min-h-screen mx-auto">Loading...</p>;
  if (!comicDetail) return <p>Error loading comic details.</p>;

  return (
    <div className="bg-white pt-10 pb-8 w-full flex px-3 gap-6">
      <div className="w-2/3 flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col w-full justify-center items-center ">
          <div className="text-[22px] text-center text-black pt-2 px-3">
            {comicDetail.item.name.toUpperCase()}
          </div>
          <i className="text-[14px] text-gray-500">
            [Cập nhật lúc: {formatDate(comicDetail.item.updatedAt)}]
          </i>
          <div className="flex gap-3 mt-3 w-full">
            <img
              src={comicDetail.seoOnPage.seoSchema.image}
              alt={comicDetail.item.name}
              className="w-3/6 max-h-[260px] max-w-[200px] object-cover"
            />
            <div className="flex flex-col w-full px-5 gap-2 text-[17px] text-[#777676]">
              <div className="flex w-full items-start gap-2">
                <div className="flex items-center w-[28%] gap-1">
                  <FaPlus size={14} />
                  Tên khác
                </div>
                <div className="w-[72%]">{comicDetail.seoOnPage.titleHead}</div>
              </div>
              <div className="flex w-full items-start gap-2">
                <div className="flex items-center w-[28%] gap-1">
                  <FaUser size={13} />
                  Tác giả
                </div>
                <div className="w-[72%]">
                  {comicDetail.item.author.map((author) => author).join(", ")}
                </div>
              </div>
              <div className="flex w-full items-start gap-2">
                <div className="flex items-center w-[28%] gap-1">
                  <ImConnection size={14} />
                  Tình trạng
                </div>
                <div className="w-[72%]">
                  {comicDetail.item.status === "ongoing"
                    ? "Đang tiến hành"
                    : "Tạm ngưng"}
                </div>
              </div>
              <div className="flex w-full items-start gap-2">
                <div className="flex items-center w-[28%] gap-1">
                  <MdSell size={14} />
                  Thể loại
                </div>
                <div className="w-[72%] overflow-hidden line-clamp-4 text-ellipsis">
                  {comicDetail.breadCrumb.map((ctg, index) => (
                    <span key={index}>
                      <Link
                        key={index}
                        to={ctg.slug}
                        className="text-blue-700 hover:underline hover:text-purple-500"
                      >
                        {ctg.name}
                      </Link>
                      <span className="text-gray-500">
                        {index < comicDetail.breadCrumb.length - 1 && " - "}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center w-[28%] gap-1">
                  <IoEyeSharp size={14} />
                  Lượt xem
                </div>
                <div className="flex items-center w-[72%]">
                  {viewsComic.views || 0}
                </div>
              </div>
              <div className="flex items-center mt-5 gap-2 text-black">
                <button
                  onClick={handleToggleFollow}
                  className={`flex items-center gap-2 ${
                    isFollowed
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  } }  text-white px-[12px] py-[7px] rounded-md text-[14px]`}
                >
                  {isFollowed ? (
                    <>
                      <ImCross size={10} className="mt-[1px]" />
                      Bỏ theo dõi
                    </>
                  ) : (
                    <>
                      <FaHeart size={15} />
                      Theo dõi
                    </>
                  )}
                </button>
                <span className=" font-semibold">
                  {viewsComic.followers || 0}
                </span>
                <span className="text-[15px]">Người Đã Theo Dõi</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handleFirstChapter}
                  className={`flex items-center gap-2 bg-orange-400 hover:bg-orange-500 px-4 text-white py-[7px] rounded-md text-[14px]`}
                >
                  Đọc từ đầu
                </button>
                <button
                  onClick={handleLastChapter}
                  className={`flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-[12px] py-[7px] rounded-md text-[14px]`}
                >
                  Đọc mới nhất
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="text-blue-700 w-full  mt-2 flex items-center gap-1">
            <IoDocumentTextOutline size={20} />
            NỘI DUNG TRUYỆN {comicDetail.item.name}
          </div>
          <hr className="border w-full mt-2 border-b-[1px] border-blue-500" />
          <p className="text-[15px] text-gray-800">
            {isExpanded
              ? comicDetail.item.content
                  .replace(/<\/?p>/g, "")
                  .replace(/&nbsp;/g, "")
              : truncatedContent}
          </p>
          {comicDetail.item.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:underline mt-2"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
          <div className="w-full text-blue-700 text-[16px] mt-2 flex items-center gap-2">
            <FaList />
            DANH SÁCH CHƯƠNG
          </div>
          <hr className="border w-full mt-2 border-b-[1px] border-blue-500" />
          <div className="flex justify-between px-2">
            <h2 className="my-2 flex text-[16px] items-center">
              Số chương <MdOutlineArrowDropDown size={25} />
            </h2>
            <div className="w-2/5 flex pr-4 justify-between">
              <h2 className="my-2">Cập nhật</h2>
              <h2 className="my-2">Lượt xem</h2>
            </div>
          </div>
          <div className="w-full">
            <ul className="border text-[14.3px] py-1 px-2 rounded-md">
              {chaptersToShow.map((chapter) => {
                const chapterId = chapter.chapter_api_data.substring(
                  chapter.chapter_api_data.lastIndexOf("/") + 1
                );

                const updatedTime = chapterTimes.find(
                  (ct) => ct.chapterId === chapterId
                )?.updatedTime;

                const viewsChapter = chapterViewsMap.get(chapterId) || 0;

                return (
                  <div
                    key={chapterId}
                    className="flex justify-between border-b py-1 border-dotted border-gray-300 w-full"
                  >
                    <div>
                      <Link
                        to={`/truyen-tranh/${comicDetail.item.slug}/chapter-${chapter.chapter_name}/${chapterId}`}
                        className="hover:text-blue-500"
                      >
                        Chapter {chapter.chapter_name}
                      </Link>
                    </div>
                    <div className="w-[38%] flex mr-6 italic text-gray-400 justify-between">
                      <span className="mx-1">
                        {updatedTime
                          ? timeAgo(String(updatedTime), "YYYYMMDD")
                          : "N/A"}
                      </span>
                      <span>{viewsChapter} views</span>
                    </div>
                  </div>
                );
              })}
            </ul>
            <div className="flex justify-center">
              {chapters.length > 17 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-2 text-blue-500 hover:text-blue-700"
                >
                  {showMore ? null : "Show More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/3 space-y-5">
        <RecentHistory />
        <TopComics />
      </div>
    </div>
  );
};

export default ComicDetail;
