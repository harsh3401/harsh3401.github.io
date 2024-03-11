import express, { Request, Response } from "express";
import { getQuote } from "../helpers/apiLayer";
import { PortfolioModel, WatchList, WatchListStockModel } from "../models";
import { WalletModel } from "./../models";

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
    const watchListItem: { ticker: string } = req.body;
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

//buy
router.post(
  "/buy-stock",
  async (req: Request, res: Response): Promise<Response> => {
    const transactionItem: { ticker: string; quantity: number } = req.body;

    if (
      transactionItem.hasOwnProperty("quantity") &&
      transactionItem.hasOwnProperty("ticker")
    ) {
      const portfolioItem = await PortfolioModel.findOne({
        ticker: transactionItem.ticker,
      });
      //validation logic
      const quoteResponse = await getQuote(transactionItem.ticker);
      //hardcoded
      const STOCK_PRICE = quoteResponse.data["c"];
      const value = STOCK_PRICE * transactionItem.quantity;
      //Qry hardcoded
      //wallet hardcoded bug
      const Wallet = await WalletModel.findOne({});
      if (Wallet === null) {
        return res.status(503).json({ Transaction: "Failed no wallet linked" });
      }
      if (Wallet && value < Wallet?.balance) {
        if (portfolioItem === null) {
          //validation
          await PortfolioModel.create({
            ticker: transactionItem.ticker,
            quantity: transactionItem.quantity,
            totalCost: value,
            averageCost: STOCK_PRICE,
          });

          Wallet.balance = Wallet.balance - value;
          await Wallet.save();

          return res.status(201).json({ Transaction: "success" });
        } else {
          // update the same value
          //check wallet balance and execute transaction
          const quantity = transactionItem.quantity + portfolioItem.quantity;
          const totalCost = portfolioItem.totalCost + value;
          const averageCost = totalCost / quantity;

          portfolioItem.totalCost = totalCost;
          portfolioItem.averageCost = averageCost;
          portfolioItem.quantity = quantity;

          await portfolioItem.save();

          Wallet.balance = Wallet.balance - value;
          await Wallet.save();
          //return success
          return res.status(201).json({ Transaction: "success" });
        }
      } else {
        return res.status(400).json({ Error: "Insufficient Balance" });
      }
    }
    return res.status(400).json({ Error: "Bad Transaction" });
  }
);

// //sell

router.post(
  "/sell-stock",
  async (req: Request, res: Response): Promise<Response> => {
    const transactionItem: { ticker: string; quantity: number } = req.body;
    //validation logic
    if (
      transactionItem.hasOwnProperty("quantity") &&
      transactionItem.hasOwnProperty("ticker")
    ) {
      const portfolioItem = await PortfolioModel.findOne({
        ticker: transactionItem.ticker,
      });
      if (portfolioItem === null) {
        //404 not found
        return res.status(404).json({ Error: "Stock Not In Portfolio" });
      } else {
        //check portfolio item and execute transaction
        if (portfolioItem.quantity < transactionItem.quantity) {
          return res.status(404).json({ Error: "Not enough stock" });
        } else {
          //finhub call for price
          const quoteResponse = await getQuote(transactionItem.ticker);
          //hardcoded
          const STOCK_PRICE = quoteResponse.data["c"];
          const value = STOCK_PRICE * transactionItem.quantity;
          const Wallet = await WalletModel.findOne();
          if (Wallet) {
            const quantity = portfolioItem.quantity - transactionItem.quantity;
            const totalCost = portfolioItem.totalCost - value;
            const averageCost = totalCost / quantity;
            if (transactionItem.quantity < portfolioItem.quantity) {
              portfolioItem.totalCost = totalCost;
              portfolioItem.averageCost = averageCost;
              portfolioItem.quantity = quantity;
              portfolioItem.save();
            } else if (transactionItem.quantity === portfolioItem.quantity) {
              //exact match case
              await portfolioItem.deleteOne();
            }
            Wallet.balance = Wallet.balance + value;
            Wallet.save();
            //return success
            return res.status(201).json({ Transaction: "success" });
            //Update wallet balance
            //post transaction cleanup for quantity and remove portfolio object if qty 0
          } else {
            return res.status(404).json({ Error: "No wallet linked" });
          }
        }
      }
    }
    return res.status(400).json({ Error: "Bad Transaction" });
  }
);

// // stock data
// //wallet

router.get(
  "/wallet-balance",
  async (req: Request, res: Response): Promise<Response> => {
    const watchList = await WalletModel.findOne();
    return res.status(200).json({ balance: watchList?.balance });
  }
);
// //backup not to change prod db
//TODO:25000 hardcoded
router.get(
  "/wallet-reset",
  async (req: Request, res: Response): Promise<Response> => {
    const wallet = await WalletModel.findOne();
    if (wallet != null) {
      wallet.balance = 25000;
      await wallet.save();
    } else {
      await WalletModel.create({ balance: 25000 });
    }
    return res.status(200).json({ Reset: "Wallet Reset to 25000" });
  }
);

export default router;
