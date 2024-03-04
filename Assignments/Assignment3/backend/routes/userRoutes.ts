import express, { Request, Response } from "express";
import { WatchList, WatchListStockModel } from "../models";

const router = express.Router();

// add remove and view all watch list data

router.get(
  "/watchlist",
  async (req: Request, res: Response): Promise<Response> => {
    const watchList: WatchList[] = await WatchListStockModel.find();
    return res.status(200).json(watchList);
  }
);

router.delete(
  "/watchlist-item/:id",
  async (req: Request, res: Response): Promise<Response> => {
    const watchListItemId = req.params.id;
    const deleteResponse = await WatchListStockModel.findByIdAndDelete(
      watchListItemId
    );

    if (deleteResponse !== null) return res.status(200).json();
    return res.status(404).json();
  }
);

router.post(
  "/watchlist-item",
  async (req: Request, res: Response): Promise<Response> => {
    const watchListItem = req.body;
    const insertResponse = await WatchListStockModel.updateOne(
      {
        ticker: watchListItem.ticker,
      },
      {
        $setOnInsert: watchListItem,
      },
      { upsert: true }
    );
    if (insertResponse.upsertedCount == 1) return res.status(201).json();
    if (insertResponse.matchedCount == 1) return res.status(409).json();
    return res.status(400).json();
  }
);

//portfolio
// stock data
//wallet
//buy sell and transact and quantity
//deleting on selling to 0

export default router;
