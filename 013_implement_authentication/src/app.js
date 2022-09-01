import express from "express";
import "express-async-errors";

import carsRoutes from "./routes/cars.js";
import authRoutes from "./routes/auth.js";

import { validationErrorMiddleware } from "./lib/middleware/validation/index.js";
import { initCorsMiddleware } from "./lib/middleware/cors.js";
import { initSessionMiddleware } from "./lib/middleware/session.js";
import { passport } from "./lib/middleware/passport.js";

const app = express();

app.use(initSessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(initCorsMiddleware());

app.use("/cars", carsRoutes);
app.use("/auth", authRoutes);

app.use(validationErrorMiddleware);

export default app;
