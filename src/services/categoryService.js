import axiosInstance from "../utils/axiosConfig";

const fetchCategoryBySlug = async (slug, currentPage) => {
  const baseUrl = `https://otruyenapi.com/v1/api/the-loai/${slug}`;
  try {
    const response = await fetch(
      `${baseUrl}?page=${currentPage}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};


export { fetchCategoryBySlug } ;