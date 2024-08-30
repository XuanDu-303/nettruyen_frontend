import React, { useState, useRef, useEffect } from "react";
import { BsChatFill } from "react-icons/bs";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLike,
  AiOutlineDislike,
} from "react-icons/ai";
import { timeAgo } from "../../utils/timeAgo";
import ReplyForm from "./ReplyForm";
import { ImRedo2 } from "react-icons/im";
import { HiDotsHorizontal } from "react-icons/hi";

const Comment = ({
  comment,
  depth = 1,
  handleLike,
  handleDisLike,
  handleSubmitReply,
  handleDeleteComment,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const popupRef = useRef(null);

  const [currentAuth, setCurrentAuth] = useState(false);
  
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    const authObject = JSON.parse(auth || '{}');
    const current = authObject?.current;
    setCurrentAuth(current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const marginLeft = depth < 3 ? `ml-10` : "ml-0";

  return (
    <div>
      <div className="flex flex-col px-2 gap-1 border">
        <div className="space-x-3">
          <span className="text-blue-700 font-bold">
            {comment.user.username}
          </span>
          <span className="text-blue-500 italic text-xs">
            Chapter {comment.chapter.chapterNumber}
          </span>
        </div>
        <hr />
        <div className="flex gap-2">
          {comment.parentId ? (
            <span className="flex gap-1 items-end text-blue-500 font-semibold italic">
              <ImRedo2 />
              {comment.parentId.user.username}
            </span>
          ) : (
            ""
          )}
          <span>{comment.content}</span>
        </div>
        <div className="flex items-center py-2 text-sm gap-3 text-blue-500">
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleReplyClick}
          >
            <BsChatFill /> Trả lời
          </div>
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => handleLike(comment._id)}
          >
            {comment.likedBy.some((user) => user._id === currentAuth?._id) ? (
              <AiFillLike />
            ) : (
              <AiOutlineLike />
            )}{" "}
            {comment.likes}
          </div>
          <div
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => handleDisLike(comment._id)}
          >
            {comment.dislikedBy.some(
              (user) => user._id === currentAuth?._id
            ) ? (
              <AiFillDislike />
            ) : (
              <AiOutlineDislike />
            )}{" "}
            {comment.dislikes}
          </div>

          <div className="relative" ref={popupRef}>
            <span
              className="cursor-pointer"
              onClick={() => setOpenPopup(!openPopup)}
            >
              <HiDotsHorizontal />
            </span>
            <div
              onClick={() => handleDeleteComment(comment._id)}
              className={`absolute cursor-pointer bottom-8 right-0 translate-x-11 shadow-md text-black bg-white border rounded-sm whitespace-nowrap ${
                openPopup ? "block" : "hidden"
              }`}
            >
              {comment.user._id === currentAuth?._id ? (
                <div className="cursor-pointer p-2 hover:bg-slate-300">Xóa Comment</div>
              ) : null}

              <div className="cursor-pointer p-2 hover:bg-slate-300">Báo Cáo</div>
              <div></div>
            </div>
          </div>
          <span>{timeAgo(comment.createdAt)}</span>
        </div>
      </div>
      {isReplying && (
        <ReplyForm
          parentId={comment._id}
          handleSubmitReply={handleSubmitReply}
          handleReplyClick={handleReplyClick}
        />
      )}
      <div>
        {comment.replies && comment.replies.length > 0 && (
          <div className={`mt-2 space-y-2 ${marginLeft}`}>
            {comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                depth={depth + 1}
                handleLike={handleLike}
                handleDisLike={handleDisLike}
                handleSubmitReply={handleSubmitReply}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
