import axiosInstance from "../utils/axiosConfig";

const fetchNewComics = async (slug) => {
  try {
    const response = await fetch(
      `https://otruyenapi.com/v1/api/danh-sach/dang-phat-hanh`
    );
    const data = await response.json();

    const comics = data.data.items;

    return comics;
  } catch (error) {
    console.error(`Error fetching chapters for slug: ${slug}`, error);
    return [];
  }
};

const fetchAllCategory = async () => {
  try {
    const response = await fetch(`https://otruyenapi.com/v1/api/the-loai`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const categories = data.data.items;

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const search = async (searchTerm, currentPage = 1) => {
  try {
    const response = await fetch(
      `https://otruyenapi.com/v1/api/tim-kiem?keyword=${searchTerm}&page=${currentPage}`
    );

    const text = await response.text();

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const fetchAllComics = async (startFrom = 0, limit = 36) => {
  const baseUrl = "https://otruyenapi.com/v1/api/danh-sach/truyen-moi";
  let allComics = [];
  let currentPage = Math.floor(startFrom / 24) + 1;
  let comicsFetched = 0;
  let firstPageResponse = null;

  while (comicsFetched < limit) {
    try {
      const response = await fetch(`${baseUrl}?page=${currentPage}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (firstPageResponse === null) {
        firstPageResponse = await data;
      }

      const comics = data.data.items;
      const comicsToAdd = comics.slice(startFrom % 24);

      allComics = [...allComics, ...comicsToAdd];
      comicsFetched += comicsToAdd.length;

      if (comicsFetched >= limit) {
        break;
      }

      currentPage++;
      startFrom = 0;
    } catch (error) {
      console.error("Error fetching data from API:", error);
      throw error;
    }
  }
  const comics = allComics.slice(0, limit)

  return { comics, firstPageResponse };
};

const fetchComicBySlug = async (slug) => {
  const baseUrl = "https://otruyenapi.com/v1/api/truyen-tranh";
  try {
    const response = await fetch(`${baseUrl}/${slug}`);

    if (!response.ok) {
      throw new Error(`Error fetching comic details for slug: ${slug}`);
    }

    const comicDetail = await response.json();

    // const time = comicDetail.data.item.chapters[0].server_data.map(async (chapter, index) => {
    //   const time = await fetchUpdatedTime(chapter.chapter_api_data)
    //   return time
    // });

    const data = comicDetail.data

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const fetchUpdatedTime = async (chapterId) => {
  try {
    const response = await fetch(`https://sv1.otruyencdn.com/v1/api/chapter/${chapterId}`);
    const data = await response.json();

    const chapterPath = data.data.item.chapter_path;

    const dateMatch = chapterPath.match(/uploads\/(\d{8})\//);
    const date = dateMatch ? dateMatch[1] : null;

    return date;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchChapterImages = async (chapterId) => {
  const apiEndpoint = `https://sv1.otruyencdn.com/v1/api/chapter/${chapterId}`;
  try {
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const uploads = (data.data.item.chapter_image || [])
      .map((image) => {
        if (image && image.image_file) {
          return `${data.data.domain_cdn || ""}/${
            data.data.item.chapter_path || ""
          }/${image.image_file}`;
        }
        return null;
      })
      .filter((url) => url);

    return uploads;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const getMetricsBySlug = async (slug) => {
  try {
    const result = await axiosInstance.get(`/comic/metrics/${slug}`);
    return result.data;
  } catch (error) {
    console.error("Error sending data to backend:", error);
    throw error;
  }
};

const toggleFollowComic = async (comicId) => {
  try {
    const result = await axiosInstance.put(`/comic/follow`, { comicId });

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const getWishlistsUser = async (page = 1, items = 36) => {
  try {
    const result = await axiosInstance.get(
      `/user/wishlists?page=${page}&items=${items}`
    );
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const getHistorysUser = async (page = 1, items = 36) => {
  try {
    const result = await axiosInstance.get(
      `/user/history?page=${page}&items=${items}`
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const incViewsComic = async (slug) => {
  try {
    const result = await axiosInstance.post(`/comic/view-comic/${slug}`);

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const incViewsChapter = async (id) => {
  try {
    const result = await axiosInstance.post(`/comic/view-chapter/${id}`);

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const getTopComics = async (period) => {
  try {
    const result = await axiosInstance.get(
      `/comic/top-comics?period=${period}`
    );

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const saveIdComics = async (comics) => {
  let allComics = [];

  for (let comic of comics) {
    allComics.push({
      externalId: comic._id,
      slug: comic.slug,
    });
  }
  
  await axiosInstance.post("/comic/bulk-update/comics", {
    comics: allComics,
  });
};

const saveChapters = async (chapters, comicId, slug) => {
  try {
    await axiosInstance.post("/comic/bulk-update/chapters", {
      chapters, comicId, slug
    });

  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
};

export {
  fetchNewComics,
  fetchAllCategory,
  fetchAllComics,
  fetchComicBySlug,
  fetchChapterImages,
  fetchUpdatedTime,
  getMetricsBySlug,
  toggleFollowComic,
  getWishlistsUser,
  incViewsComic,
  getTopComics,
  search,
  incViewsChapter,
  saveChapters,
  saveIdComics,
  getHistorysUser
};
