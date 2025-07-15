export const formatDate = (date: string | Date) => {
  if (!date) return "";
  const newDate = new Date(date);
  return newDate.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
