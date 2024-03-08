import axios from "axios";
export async function getQuote(query: string) {
  //From value hardcoded

  return axios.get(
    `${process.env.FINHUB_ENDPOINT}/quote?symbol=${query}&token=${process.env.FINHUB_API_KEY}`
  );
}
