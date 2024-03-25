import { Response } from "express";
interface news_format {
  [key: string]: String;
}
export function error_middleware(
  stock_data: any,
  res: Response,
  status_code: number,
  valid_attribute: null | string = null
) {
  if (status_code == 200) {
    stock_data =
      valid_attribute === null ? stock_data : stock_data[valid_attribute];
    console.log(stock_data);
    if (stock_data === null) {
      stock_data = { Error: "Stock not found" };
      res.status(404);
    }
  } else {
    stock_data = { Error: "External API error" };
    res.status(502);
  }
  res.json(stock_data);
}

export function news_format_validator(news_object: news_format) {
  const validator_keys = ["image", "url", "headline", "datetime"];
  for (const key of validator_keys) {
    if (news_object[key] === null || news_object[key] == "") {
      return false;
    }
    return true;
  }
}
