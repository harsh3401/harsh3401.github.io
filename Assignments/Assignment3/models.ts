import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "watchlist" } })
export class WatchList {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public ticker!: string;

  @prop({ required: true, type: String })
  public corporationName!: string;

  @prop({ required: true, type: Number })
  public stockPrice!: number;

  @prop({ required: true, type: Number })
  public change!: number;

  @prop({ required: false, type: Number })
  public changePercent!: number;
}

export const WatchListStockModel = getModelForClass(WatchList);
