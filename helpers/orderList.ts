import { Movie, OrderType } from "@/constants/type";

export const orderList = ({order, type, list}: {order: "asc" | "desc", type: OrderType, list: Movie[]}) => {
    const newList = [...list].sort((a, b) => {
      const [aValue, bValue] = (() => {
        if (type === "release_date") {
          return [new Date(a.release_date).getTime(), new Date(b.release_date).getTime()];
        }
        return [a[type], b[type]];
      })();

      if (order === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    return newList;
};