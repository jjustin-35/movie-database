import configs from "../config";

export const getImageUrl = (path: string, size: string = "w500") => {
  if (!path) return "/images/placeholder.png";
  return `${configs.IMAGE_BASE_URL}/${size}${path}`;
};

export const getYoutubeUrl = (id: string) => {
  return `https://www.youtube.com/watch?v=${id}`;
};

export const getApiUrl = (
  apiPath: string,
  params?: Record<string, string | number>
) => {
  const originUrl = new URL(`${configs.API_BASE_URL}${apiPath}`);
  originUrl.searchParams.append("api_key", configs.API_KEY);
  if (params) {
    if (Object.keys(params).length === 0) return null;
    Object.entries(params).forEach(([key, value]) => {
      originUrl.searchParams.append(key, value.toString());
    });
  }
  return originUrl.toString();
};
