import { CustomError } from "../ErrorHandler";
import { MostWantedItems } from "../models/MostWantedItems";

export const getTopFiveMostWantedItems = async () => {
  try {
    const topFiveItems = await MostWantedItems.findAll({
      order: [["count", "DESC"]],
      limit: 5,
    });

    return topFiveItems.map(item => ({
      [item.itemId]: item.count,
    }));
  } catch (error) {
    console.error(error);
    throw new CustomError("Error fetching the most wanted items", 500);
  }
};
