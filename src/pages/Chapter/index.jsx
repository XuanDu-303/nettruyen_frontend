import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchChapterImages,
  fetchComicBySlug,
  incViewsChapter,
  incViewsComic,
} from "../../services/comicService";
import {
  addReplyToComment,
  createComment,
  deleteComment,
  getAllComments,
  toggleDislike,
  toggleLike,
} from "../../services/commentService";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FaHome } from "react-icons/fa";
import Comment from "./Comment";
const Chapter = () => {
  const navigate = useNavigate();
  const { slug, chapterName, chapterId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comicDetail, setComicDetail] = useState(null);
  const [disableNextButton, setDisableNextButton] = useState(true);
  const [disablePrevButton, setDisablePrevButton] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(chapterId);
  const [selectedValue, setSelectedValue] = useState(
    `${chapterId}-${chapterName.replace("chapter-", "")}`
  );
  const [period, setPeriod] = useState("nettruyen");
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [comments, setComments] = useState("");
  const [sticky, setSticky] = useState(false);
  const [updateComment, setUpdateComment] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (chapterId) {
          setLoading(true);
          const images = await fetchChapterImages(chapterId);
          setImages(images);
          setIsExpanded(false);
        } else {
          throw new Error("No chapterId found in URL parameters");
        }
      } catch (error) {
        console.error("Error fetching chapter images:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [chapterId, chapterName, slug]);

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchComicBySlug(slug);
        setComicDetail(data);
        const server_data = [...data.item.chapters[0].server_data];
        const lastChapter = server_data[server_data.length - 1];
        const lastChapterId = lastChapter.chapter_api_data.substring(
          lastChapter.chapter_api_data.lastIndexOf("/") + 1
        );
        const firstChapter = server_data[0];

        const firstChapterId = firstChapter.chapter_api_data.substring(
          lastChapter.chapter_api_data.lastIndexOf("/") + 1
        );
        setDisableNextButton(lastChapterId === chapterId ? true : false);
        setDisablePrevButton(firstChapterId === chapterId ? true : false);
        setSelectedValue(`${chapterId}-${chapterName.replace("chapter-", "")}`);
      } catch (error) {
        console.error("Error fetching comic detail:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComicDetail();
  }, [chapterId, chapterName, slug]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (chapterId) {
          const comments = await getAllComments(chapterId);
          setComments(comments);
        } else {
          throw new Error("No chapterId found in URL parameters");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(error.message);
      }
    };
    fetchComments();
  }, [chapterId, updateComment]);

  useEffect(() => {
    const handleComicClick = async () => {
      try {
        await incViewsChapter(chapterId);
        await incViewsComic(slug);
      } catch (error) {
        console.error("Error increasing views:", error);
      }
    };
    handleComicClick();
  }, [slug, chapterId]);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 118);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChapterChange = (event) => {
    const [chapterId, chapterName] = event.target.value.split("-");
    setSelectedValue(event.target.value);
    setSelectedChapter(chapterId);
    navigate(`/truyen-tranh/${slug}/chapter-${chapterName}/${chapterId}`);
  };

  const handlePrevChapter = useCallback(() => {
    const currentIndex = comicDetail.item.chapters[0].server_data.findIndex(
      (chapter) => chapter.chapter_api_data.endsWith(selectedChapter)
    );
    const prevChapter =
      comicDetail.item.chapters[0].server_data[currentIndex - 1];
    if (prevChapter) {
      const prevChapterId = prevChapter.chapter_api_data.substring(
        prevChapter.chapter_api_data.lastIndexOf("/") + 1
      );
      setSelectedChapter(prevChapterId);
      navigate(
        `/truyen-tranh/${slug}/chapter-${prevChapter.chapter_name}/${prevChapterId}`
      );
    }
  }, [comicDetail, navigate, selectedChapter, slug]);

  const handleNextChapter = useCallback(() => {
    const currentIndex = comicDetail.item.chapters[0].server_data.findIndex(
      (chapter) => chapter.chapter_api_data.endsWith(selectedChapter)
    );
    const nextChapter =
      comicDetail.item.chapters[0].server_data[currentIndex + 1];
    if (nextChapter) {
      const nextChapterId = nextChapter.chapter_api_data.substring(
        nextChapter.chapter_api_data.lastIndexOf("/") + 1
      );
      setSelectedChapter(nextChapterId);
      navigate(
        `/truyen-tranh/${slug}/chapter-${nextChapter.chapter_name}/${nextChapterId}`
      );
    }
  }, [comicDetail, navigate, selectedChapter, slug]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        handlePrevChapter();
      } else if (event.key === "ArrowRight") {
        handleNextChapter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNextChapter, handlePrevChapter]);

  const handleInputClick = () => {
    setIsExpanded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await createComment({
        chapterId: chapterId,
        content: inputValue,
      });
      if (success) {
        setUpdateComment(!updateComment);
        setInputValue("");
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const handleSubmitReply = async (parentId, content) => {
    const newReply = {
      parentId,
      chapterId,
      content,
    };
    try {
      const success = await addReplyToComment({ ...newReply });

      if (success) {
        setUpdateComment(!updateComment);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await toggleLike(commentId)
      setUpdateComment(!updateComment);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  }
  
  const handleDisLike = async (commentId) => {
    try {
      await toggleDislike(commentId)
      setUpdateComment(!updateComment);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      setUpdateComment(!updateComment);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center text-white min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-black py-3 flex flex-col justify-center item-center">
      {comicDetail && (
        <h4 className="text-xl p-2 font-semibold bg-white mx-[170px] ">
          <a
            href={`/truyen-tranh/${comicDetail.item.slug}`}
            className="text-blue-500 hover:underline"
          >
            {comicDetail.item.name}
          </a>{" "}
          - {chapterName}
        </h4>
      )}
      <div
        className={`${
          sticky
            ? "w-full bg-gray-200 sticky top-0 py-1 rounded-sm z-10 gap-1 my-2"
            : " bg-white mx-[170px] py-3"
        } flex gap-1 justify-center items-center`}
      >
        <a href="/">
          <FaHome size={24} className="text-red-400 mr-2 hover:text-red-600" />
        </a>
        <button
          disabled={disablePrevButton}
          onClick={handlePrevChapter}
          className={`${
            disablePrevButton ? " bg-gray-300" : "bg-red-400 hover:bg-red-600"
          } 
          px-[6px] py-[6px] rounded-tl rounded-bl`}
        >
          <GrFormPrevious size={20} color="white" />
        </button>
        {comicDetail && (
          <select
            value={selectedValue}
            onChange={handleChapterChange}
            className={`${
              sticky
                ? "border p-1 w-72 outline-none"
                : `border p-1 w-52 outline-none`
            }`}
          >
            {[...comicDetail.item.chapters[0].server_data]
              .sort(
                (a, b) =>
                  parseInt(b.chapter_name, 10) - parseInt(a.chapter_name, 10)
              )
              .map((chapter) => {
                const chapterId = chapter.chapter_api_data.substring(
                  chapter.chapter_api_data.lastIndexOf("/") + 1
                );

                return (
                  <option
                    key={chapterId}
                    value={`${chapterId}-${chapter.chapter_name}`}
                  >
                    Chapter {chapter.chapter_name}
                  </option>
                );
              })}
          </select>
        )}
        <button
          disabled={disableNextButton}
          onClick={handleNextChapter}
          className={`${
            disableNextButton ? " bg-gray-300" : "bg-red-400  hover:bg-red-600"
          } px-[6px] py-[6px] rounded-tr rounded-br`}
        >
          <GrFormNext size={20} color="white" />
        </button>
      </div>
      <div className="flex flex-col my-3 bg-white mx-[170px]">
        {images.length === 0 ? (
          <div className="text-center">No images available</div>
        ) : (
          <div className="flex flex-col items-center">
            {images.map((imageUrl, index) =>
              index === 0 
              || index === images.length - 1 
              ? (
                <div key={index} className="">
                  <img
                    src={imageUrl}
                    alt={`Chapter ${chapterName} - Image ${index + 1}`}
                    className="max-w-full"
                    style={{
                      clipPath: "inset(83px 0 0 0)",
                      marginTop: "-83px",
                    }}
                  />
                </div>
              ) : (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Chapter ${chapterName} - Image ${index + 1}`}
                  className="max-w-full"
                />
              )
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col px-5 py-8 justify-center items-center bg-white mx-[170px]">
        <hr className="border border-b border-gray-300 w-full" />

        <div className="flex flex-col w-full text-[15px] py-3 font-[400]">
          <div className="flex w-56 h-11 border">
            <button
              className={`${
                period === "nettruyen"
                  ? "bg-white text-black border-t-2 border-purple-700"
                  : "bg-gray-100 text-gray-700 hover:border-t-2 hover:text-black"
              } w-1/2`}
              onClick={() => setPeriod("nettruyen")}
            >
              NetTruyen
            </button>
            <button
              className={`${
                period === "facebook"
                  ? "bg-white text-black border-t-2 border-purple-700"
                  : "bg-gray-100 text-gray-700 hover:border-t-2 hover:text-black"
              } w-1/2`}
              onClick={() => setPeriod("facebook")}
            >
              Facebook
            </button>
          </div>

          {/* Main input field */}
          {period === "nettruyen" ? (
            <div className="flex flex-col">
              <form className="" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className={`w-full px-2 border border-gray-300 mt-3 focus:outline-none focus:ring-2 focus:ring-purple-700 transition-all duration-300 ${
                    isExpanded ? "h-24 pb-16 " : "h-16 pb-9 "
                  }`}
                  required
                  value={inputValue}
                  onClick={handleInputClick}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`${
                    isExpanded
                      ? ""
                      : "Mời bạn thảo luận, vui lòng không spam, share link kiếm tiền, thiếu lành mạnh,... để tránh bị khóa tài khoản"
                  } `}
                />

                {isExpanded && (
                  <div className="mt-1 flex gap-1 w-[80%]">
                    <button
                      type="submit"
                      className="w-32 bg-blue-400 text-white"
                    >
                      Gửi đi
                    </button>
                  </div>
                )}
              </form>
              {comments && (
                <div className="ml-5 mt-10 flex flex-col gap-3">
                  {comments.map((comment, index) => (
                    <Comment
                      key={index}
                      comment={comment}
                      handleLike={handleLike}
                      handleDisLike={handleDisLike}
                      handleSubmitReply={handleSubmitReply}
                      handleDeleteComment={handleDeleteComment}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form>
              <input
                type="text"
                className={`w-full px-2 border border-gray-300 mt-3 pb-9 focus:outline-none focus:ring-2 focus:ring-purple-700 transition-all duration-300 ${
                  isExpanded ? "h-16" : "h-16"
                }`}
                value={inputValue}
                onClick={handleInputClick}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`${
                  isExpanded
                    ? ""
                    : "Mời bạn thảo luận, vui lòng không spam, share link kiếm tiền, thiếu lành mạnh,... để tránh bị khóa tài khoản"
                } `}
              />
              <div className="mt-1 flex gap-1 w-[80%]">
                <button type="submit" className="w-32 bg-blue-400 text-white">
                  Post
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chapter;
