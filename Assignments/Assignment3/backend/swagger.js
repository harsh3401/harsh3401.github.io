const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/userRoutes.ts"];

swaggerAutogen(outputFile, endpointsFiles);
