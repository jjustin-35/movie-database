import configs from "@/config";

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

