import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import apiRoutes from "./routes/apiRoutes";
import userRoutes from "./routes/userRoutes";
dotenv.config();

const PORT = process.env.PORT ?? 8080;
const app: Express = express();

// TODO:Any Fix
app.use(bodyParser.json());

app.use("/api", apiRoutes);
app.use("/user", userRoutes);

//Swagger
// app.use(
//   "/doc",
//   swaggerUi.serve,
//   swaggerUi.setup(undefined, {
//     swaggerOptions: {
//       url: "swagger_output.json",
//     },
//   })
// );

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING!);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
