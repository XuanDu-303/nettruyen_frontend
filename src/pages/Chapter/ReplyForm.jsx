import React, { useState } from "react";

const ReplyForm = ({ parentId, handleSubmitReply, handleReplyClick }) => {
  const [content, setContent] = useState("");

  const handleReplySubmit = (e) => {
    e.preventDefault();
    handleSubmitReply(parentId, content);
    handleReplyClick(false);
    setContent("");
  };

  return (
    <form
      onSubmit={handleReplySubmit}
      className="mt-1 flex flex-col"
    >
      <input
        type="text"
        className={`w-full px-2 border border-gray-300 mt-3 focus:outline-none focus:ring-2 focus:ring-purple-700 h-24 pb-16`}
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-1 flex gap-1 w-[80%]">
        <button type="submit" className="w-32 bg-blue-400 text-white">
          Gửi đi
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;
