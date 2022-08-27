import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client.js";
import {
  validationErrorMiddleware,
  validate,
  carSchema,
} from "./lib/validation/index.js";

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).json({ message: "Server Running" });
});

//GET /cars route - get all resources
app.get("/cars", async (request, response) => {
  const cars = await prisma.cars.findMany();
  response.status(200).json(cars);
});

//POST /cars route - create a resource
app.post("/cars", validate({ body: carSchema }), async (request, response) => {
  const carData = request.body;

  const car = await prisma.cars.create({
    data: carData,
  });

  response.status(201).json(car);
});

app.use(validationErrorMiddleware);

export default app;
