declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    CORS_ENDPOINT: string;
    FINHUB_ENDPOINT: string;
    POLYGON_ENDPOINT: string;
    FINHUB_API_KEY: string;
    POLYGON_API_KEY: string;
  }
}
