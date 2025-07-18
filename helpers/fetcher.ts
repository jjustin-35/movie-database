export const fetcher = async (...args: Parameters<typeof fetch>) => {
  const resp = await fetch(...args);
  return resp.json();
};

export const multiFetcher = async (urls: string[]) => {
  const promises = urls.map((url) => fetcher(url));
  const results = await Promise.all(promises);
  return results;
};
