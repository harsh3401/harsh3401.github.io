import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
@modelOptions({ schemaOptions: { collection: "watchlist" } })
export class WatchList {
  @prop({ required: true, type: String })
  public id!: mongoose.Types.ObjectId;

  @prop({ required: true, type: String, unique: true })
  public ticker!: string;

  @prop({ required: true, type: String })
  public corporationName!: string;

  //TODO:Storage Mechanism check
  // @prop({ required: true, type: Number })
  // public stockPrice!: number;

  // @prop({ required: true, type: Number })
  // public change!: number;

  // @prop({ required: false, type: Number })
  // public changePercent!: number;
}

@modelOptions({ schemaOptions: { collection: "portfolio" } })
export class Portfolio {
  @prop({ type: String })
  public id?: mongoose.Types.ObjectId;

  @prop({ required: true, type: String, unique: true })
  public ticker!: string;

  @prop({ type: String })
  public corporationName?: string;

  @prop({ required: true, type: Number })
  public quantity!: number;

  @prop({ required: true, type: Number })
  public averageCost!: number;

  @prop({ required: true, type: Number })
  public totalCost!: number;
}

@modelOptions({ schemaOptions: { collection: "wallet" } })
export class Wallet {
  @prop({ required: true, type: String })
  public id!: mongoose.Types.ObjectId;

  @prop({ required: true, type: Number, unique: true })
  public balance!: number;
}

export const WatchListStockModel = getModelForClass(WatchList);

export const PortfolioModel = getModelForClass(Portfolio);

export const WalletModel = getModelForClass(Wallet);
