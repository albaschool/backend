import path from "path";
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "REST API",
    description: "",
  },
  host: "localhost:3000",
  components: {
    schemas: {
      testScheme: {
        $name: "John Doe",
        $age: 29,
        about: "",
      },
    },
  },
};

const outputFile = path.join(__dirname, "../swagger-output.json");
const endpointsFiles = [path.join(__dirname, "../app.js"), path.join(__dirname, "../routes/*.js")];

const generateSwagger = swaggerAutogen({ openapi: "3.1.1" })(outputFile, endpointsFiles, doc);

export default generateSwagger;
