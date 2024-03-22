import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { getQuote } from "../helpers/apiLayer";
import { formatDate } from "../helpers/formatter";
import { error_middleware, news_format_validator } from "../helpers/middleware";
dotenv.config();

async function validation_middleware(
  ticker: string,
  endpoint: string,
  res: Response,
  validation_attribute = null
) {
  if (ticker === "" || ticker === null || ticker === undefined) {
    try {
      const response = await axios.get(endpoint);
      error_middleware(response, res, response.status.valueOf());
    } catch (error) {
      res.json({ Error: "API Error" });
    }
  }
}

const router = express.Router();
// APIS
//TODO:Empty recommendation
router.get("/search", (req: Request, res: Response) => {
  const query = req.query["search_string"] ?? "";
  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/search?q=${query}&token=${process.env.FINHUB_API_KEY}`
    )
    .then((response: AxiosResponse) => {
      console.log(response.status.valueOf());
      error_middleware(response.data, res, response.status.valueOf(), "result");
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/company-details", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);
  console.log(
    `${process.env.FINHUB_ENDPOINT}/stock/profile2?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
  );
  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/stock/profile2?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
    )
    .then((response: AxiosResponse) => {
      error_middleware(response.data, res, response.status.valueOf());
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/recommendation-trends", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);
  console.log(
    `${process.env.FINHUB_ENDPOINT}/stock/recommendation?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
  );
  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/stock/recommendation?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
    )
    .then((response: AxiosResponse) => {
      error_middleware(response.data, res, response.status.valueOf());
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/company-news", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);
  let NEXT_DATE: Date | string = new Date();
  //TODO:Value check
  let PREVIOUS_MONTH: Date | string = new Date(NEXT_DATE);
  PREVIOUS_MONTH.setDate(NEXT_DATE.getDate() - 30);
  PREVIOUS_MONTH = formatDate(PREVIOUS_MONTH);
  NEXT_DATE = formatDate(NEXT_DATE);
  // TODO:News count
  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/company-news?symbol=${query}&token=${process.env.FINHUB_API_KEY}&from=${PREVIOUS_MONTH}&to=${NEXT_DATE}`
    )
    .then((response: AxiosResponse) => {
      const newsObjectList: any = response.data;
      const news_data: any = [];
      for (const newsObject of newsObjectList) {
        if (news_format_validator(newsObject)) {
          news_data.push(newsObject);
        }
      }
      res.json(news_data);
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/insider-sentiment", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);
  //From value hardcoded
  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/stock/insider-sentiment?symbol=${query}&token=${process.env.FINHUB_API_KEY}&from=2022-01-01`
    )
    .then((response: AxiosResponse) => {
      error_middleware(response.data, res, response.status.valueOf(), "data");
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/quote", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);
  getQuote(query)
    .then((response: AxiosResponse) => {
      error_middleware(response.data, res, response.status.valueOf());
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/company-peers", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);

  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/stock/peers?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
    )
    .then((response: AxiosResponse) => {
      error_middleware(response.data, res, response.status.valueOf());
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/company-earnings", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);
  console.log(
    `${process.env.FINHUB_ENDPOINT}/stock/earnings?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
  );
  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/stock/earnings?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
    )
    .then((response: AxiosResponse) => {
      error_middleware(response.data, res, response.status.valueOf());
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/historical-data", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);
  const range = String(req.query["range"]);
  getQuote(query)
    .then((quote) => {
      const quoteTime = quote.data["t"];
      const marketOpen =
        new Date().getTime() - new Date(quoteTime * 1000).getTime() < 300000;

      let NEXT_DATE: Date | string = new Date();
      //TODO:Value check
      let PREVIOUS_DATE: Date | string = new Date(NEXT_DATE);
      if (range == "day") {
        if (marketOpen) {
          PREVIOUS_DATE.setDate(NEXT_DATE.getDate() - 1);
        } else {
          NEXT_DATE.setDate(NEXT_DATE.getDate() - 1);
          PREVIOUS_DATE.setDate(NEXT_DATE.getDate() - 1);
        }
      } else {
        PREVIOUS_DATE.setDate(NEXT_DATE.getDate() - 181);
      }
      PREVIOUS_DATE = formatDate(PREVIOUS_DATE);
      NEXT_DATE = formatDate(NEXT_DATE);
      axios
        .get(
          `${process.env.POLYGON_ENDPOINT}/${query}/range/1/day/${PREVIOUS_DATE}/${NEXT_DATE}?adjusted=true&sort=asc&apiKey=${process.env.POLYGON_API_KEY}`
        )
        .then((response: AxiosResponse) => {
          error_middleware(
            response.data,
            res,
            response.status.valueOf(),
            "results"
          );
        })
        .catch((error) => {
          console.error(error);
          res.send("error");
        });
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

export default router;
