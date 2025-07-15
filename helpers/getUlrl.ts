import configs from "../config";

export const getImageUrl = (path: string, size: string = "w500") => {
  if (!path) return "/images/placeholder.png";
  return `${configs.IMAGE_BASE_URL}/${size}${path}`;
};

export const getYoutubeUrl = (id: string) => {
  return `https://www.youtube.com/watch?v=${id}`;
};
