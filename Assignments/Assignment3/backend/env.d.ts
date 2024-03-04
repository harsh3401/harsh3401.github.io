declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    CORS_ENDPOINT: string;
    FINHUB_ENDPOINT: string;
    POLYGON_ENDPOINT: string;
    FINHUB_API_KEY: string;
    POLYGON_API_KEY: string;
    DB_CONNECTION_STRING: string;
  }
}
