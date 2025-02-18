import { AppDataSource } from "../dataSource";
import { MostWantedItems } from "../entities/MostWantedItems";
import { CustomError } from "../ErrorHandler";

export const getTopFiveMostWantedItems = async () => {
  const mostWantedRepository = AppDataSource.getRepository(MostWantedItems);

  try {
    const topFiveItems = await mostWantedRepository.find({
      order: {
        count: "DESC", 
      },
      take: 5, 
    });

    return topFiveItems.map(item => ({
      [item.itemId]: item.count,
    }));
  } catch (error) {
    console.error(error);
    throw new CustomError("Error fetching the most wanted items", 500);
  }
};
