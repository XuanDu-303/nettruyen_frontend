import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";

const createComment = async ({
  chapterId,
  content,
  // name,
  // email,
}) => {
  try {
    const result = await axiosInstance.post(`/comment/${chapterId}`, {
      // name,
      // email,
      content,
    });
    console.log(result.data.success);

    return result.data.success;
  } catch (error) {
    console.error("Error sending data to backend:", error);
    if (error.response && error.response.status === 401) {
      toast.error("Bạn cần đăng nhập để bình luận");
    } 
    if (error.response && error.response.status === 404){
      toast.error(error.response.data.message);
    }
  }
};

const addReplyToComment = async ({
  chapterId,
  content,
  // name,
  // email,
  parentId,
}) => {
  try {
    const result = await axiosInstance.post(`/comment/reply/${chapterId}`, {
      // name,
      // email,
      content,
      parentId,
    });
    console.log(result.data.success);

    return result.data.success;
  } catch (error) {
    console.error("Error sending data to backend:", error);
    if (error.response && error.response.status === 401) {
      toast.error("Bạn cần đăng nhập để bình luận");
    } 
    if (error.response && error.response.status === 404){
      toast.error(error.response.data.message);
    }
  }
};

const getAllComments = async (chapterId) => {
  try {
    const result = await axiosInstance.get(`/comment/${chapterId}`);
    console.log(result.data)
    return result.data;
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
};

const deleteComment = async (commentId) => {
  try {
    const result = await axiosInstance.delete(`/comment/${commentId}`);
    console.log(result.data)
    return result.data;
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
}

const toggleLike = async (commentId) => {
  try {
    const result = await axiosInstance.put(`/comment/like/${commentId}`);
    console.log(result.data)
    return result.data;
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
}

const toggleDislike = async (commentId) => {
  try {
    const result = await axiosInstance.put(`/comment/dislike/${commentId}`);
    console.log(result.data)
    return result.data;
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
}

export { createComment, getAllComments, addReplyToComment, toggleLike, toggleDislike, deleteComment };
