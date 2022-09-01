import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client.js";
import {
  validationErrorMiddleware,
  validate,
  carSchema,
} from "./lib/validation/index.js";
import cors from "cors";
import { initMulterMiddleware } from "./lib/middleware/multer.js";

const app = express();
const corsOptions = {
  origin: "http://localhost:8080",
};
const upload = initMulterMiddleware();

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (request, response) => {
  response.status(200).json({ message: "Server Running" });
});

//GET /cars route - get all resources
app.get("/cars", async (request, response) => {
  const cars = await prisma.cars.findMany();
  response.status(200).json(cars);
});

//GET /cars/:id - get a resource
app.get("/cars/:id(\\d+)", async (request, response, next) => {
  const carId = Number(request.params.id);

  const car = await prisma.cars.findUnique({
    where: { id: carId },
  });

  if (!car) {
    response.status(404);
    return next(`Cannot GET /cars/${carId}`);
  }

  response.json(car);
});

//POST /cars route - create a resource
app.post("/cars", validate({ body: carSchema }), async (request, response) => {
  const carData = request.body;

  const car = await prisma.cars.create({
    data: carData,
  });

  response.status(201).json(car);
});

//PUT /cars/:id route - update a resource
app.put(
  "/cars/:id(\\d+)",
  validate({ body: carSchema }),
  async (request, response, next) => {
    const carId = Number(request.params.id);

    const carData = request.body;
    try {
      const car = await prisma.cars.update({
        where: { id: carId },
        data: carData,
      });
      response.status(200).json(car);
    } catch (error) {
      response.status(404);
      next(`Cannot PUT /cars/${carId}`);
    }
  }
);

//DELETE /cars/:id - delete a resource
app.delete("/cars/:id(\\d+)", async (request, response, next) => {
  const carId = Number(request.params.id);

  try {
    const car = await prisma.cars.delete({
      where: { id: carId },
    });
    response.status(204).end();
  } catch (error) {
    response.status(404);
    next(`Cannot DELETE /cars/${carId}`);
  }
});

//POST /cars/:id/photo - add a photo to a resource
app.post(
  "/cars/:id(\\d+)/photo",
  upload.single("photo"),
  async (request, response, next) => {
    if (!request.file) {
      response.status(400);
      return next("No photo file uploaded.");
    }

    const photoFilename = request.file.filename;
    const carId = Number(request.params.id);
    try {
      await prisma.cars.update({
        where: { id: carId },
        data: { photoFilename },
      });

      response.status(201).json(photoFilename);
    } catch (error) {
      response.status(404);
      next(`Cannot POST /cars/${carId}/photo`);
    }
  }
);

app.use("/cars/photos", express.static("uploads"));
app.use(validationErrorMiddleware);

export default app;
