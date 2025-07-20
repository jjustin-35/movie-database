import { OrderType } from "@/constants/type";

const data = [
    {
        name: "熱門",
        type: OrderType.popularity,
    },
    {
        name: "評分",
        type: OrderType.voteAverage,
    },
    {
        name: "發布日期",
        type: OrderType.releaseDate,
    },
];

export default data;