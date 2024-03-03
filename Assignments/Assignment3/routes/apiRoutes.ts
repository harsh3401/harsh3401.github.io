import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
dotenv.config();
function formatDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  return formattedDate;
}
function error_middleware(
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
  const query = req.query["q"] ?? "";
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
      error_middleware(response.data, res, response.status.valueOf(), "0");
    })
    .catch((error) => {
      console.error(error);
      res.send("error");
    });
});

router.get("/company-news", (req: Request, res: Response) => {
  const query = String(req.query["ticker"]);
  let TODAY: Date | string = new Date();
  //TODO:Value check
  let PREVIOUS_MONTH: Date | string = new Date(TODAY);
  PREVIOUS_MONTH.setDate(TODAY.getDate() - 30);
  PREVIOUS_MONTH = formatDate(PREVIOUS_MONTH);
  TODAY = formatDate(TODAY);

  console.log(
    `${process.env.FINHUB_ENDPOINT}/company-news?symbol=${query}&token=${process.env.FINHUB_API_KEY}&from=${PREVIOUS_MONTH}&to=${TODAY}`
  );
  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/company-news?symbol=${query}&token=${process.env.FINHUB_API_KEY}&from=${PREVIOUS_MONTH}&to=${TODAY}`
    )
    .then((response: AxiosResponse) => {
      error_middleware(response.data, res, response.status.valueOf());
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
  //From value hardcoded
  console.log(
    `${process.env.FINHUB_ENDPOINT}/quote?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
  );
  axios
    .get(
      `${process.env.FINHUB_ENDPOINT}/quote?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
    )
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
  let TODAY: Date | string = new Date();
  //TODO:Value check
  let PREVIOUS_MONTHS: Date | string = new Date(TODAY);
  PREVIOUS_MONTHS.setDate(TODAY.getDate() - 181);
  PREVIOUS_MONTHS = formatDate(PREVIOUS_MONTHS);
  TODAY = formatDate(TODAY);
  axios
    .get(
      `${process.env.POLYGON_ENDPOINT}/${query}/range/1/day/${PREVIOUS_MONTHS}/${TODAY}?adjusted=true&sort=asc&apiKey=${process.env.POLYGON_API_KEY}`
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
});

export default router;
