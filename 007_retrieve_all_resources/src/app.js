import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client.js";

const app = express();

app.get("/", (request, response) => {
  response.status(200).json({ message: "Server Running" });
});

//GET /cars route
app.get("/cars", async (request, response) => {
  const cars = await prisma.cars.findMany();
  response.status(200).json(cars);
});

export default app;
