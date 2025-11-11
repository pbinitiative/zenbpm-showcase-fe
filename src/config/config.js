import { Configuration } from "src/api-client";

const configuration = new Configuration({
  basePath: process.env.API || "api",
});

export default configuration;
