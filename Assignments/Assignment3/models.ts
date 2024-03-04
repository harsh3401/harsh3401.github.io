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
  @prop({ required: true, type: String })
  public id!: mongoose.Types.ObjectId;

  @prop({ required: true, type: String, unique: true })
  public ticker!: string;

  @prop({ required: true, type: String })
  public corporationName!: string;
}

@modelOptions({ schemaOptions: { collection: "wallet" } })
export class Wallet {
  @prop({ required: true, type: String })
  public id!: mongoose.Types.ObjectId;

  @prop({ required: true, type: String, unique: true })
  public balance!: number;
}

export const WatchListStockModel = getModelForClass(WatchList);
