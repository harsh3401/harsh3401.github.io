import express, { Request, Response } from "express";
import { WatchList, WatchListStockModel } from "../models";
const router = express.Router();

// add remove and view all watch list data

router.get(
  "/watchlist",
  async (req: Request, res: Response): Promise<Response> => {
    const watchList: WatchList[] = await WatchListStockModel.find();
    console.log(watchList);
    return res.status(200).json(watchList);
  }
);

//portfolio
// stock data

//wallet
//buy sell and transact and quantity
//deleting on selling to 0

export default router;
