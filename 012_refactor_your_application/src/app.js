import express from "express";
import "express-async-errors";

import carsRoutes from "./routes/cars.js";

import { validationErrorMiddleware } from "./lib/middleware/validation/index.js";
import { initCorsMiddleware } from "./lib/middleware/cors.js";

const app = express();

app.use(express.json());
app.use(initCorsMiddleware());

app.use("/cars", carsRoutes);

app.use(validationErrorMiddleware);

export default app;
