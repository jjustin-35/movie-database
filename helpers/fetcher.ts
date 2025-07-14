const fetcher = async (...args: Parameters<typeof fetch>) => {
  const resp = await fetch(...args);
  return resp.json();
};

export default fetcher;
