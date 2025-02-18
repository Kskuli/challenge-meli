import { Request, Response } from "express";
import { getTopFiveMostWantedItems }  from "../services/mostWantedItems.service";
import { CustomError } from "../ErrorHandler";

export const getTopMostWantedItemsController = async (req: Request, res: Response): Promise<any> => {
  try {
    const topItems = await getTopFiveMostWantedItems(); 
    return res.json(topItems);
  } catch (error) {
    console.error("Error fetching the most wanted items:", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
