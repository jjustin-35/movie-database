import configs from "../config";

export const getImageUrl = (path: string, size: string = "w500") => {
  if (!path) return "";
  return `${configs.IMAGE_BASE_URL}/${size}${path}`;
};

export const getYoutubeUrl = (id: string) => {
  return `https://www.youtube.com/watch?v=${id}`;
};

export const getApiUrl = (
  apiPath: string,
  params?: Record<string, string | number>,
  language: string = "zh-TW"
) => {
  const originUrl = new URL(`${configs.API_BASE_URL}${apiPath}`);
  originUrl.searchParams.append("api_key", process.env.API_KEY || "");
  originUrl.searchParams.append("language", language);
  if (params) {
    if (Object.keys(params).length === 0) return null;
    Object.entries(params).forEach(([key, value]) => {
      if (!value) return;
      const valueString = typeof value === "number" ? value.toString() : value;
      originUrl.searchParams.append(key, valueString);
    });
  }
  return originUrl.toString();
};
