import express, { Router } from "express";
import prisma from "../lib/prisma/client.js";

import { validate, carSchema } from "../lib/middleware/validation/index.js";
import { initMulterMiddleware } from "../lib/middleware/multer.js";

const upload = initMulterMiddleware();

const router = Router();

//GET /cars route - get all resources
router.get("/", async (request, response) => {
  const cars = await prisma.cars.findMany();
  response.status(200).json(cars);
});

//GET /cars/:id - get a resource
router.get("/:id(\\d+)", async (request, response, next) => {
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
router.post("/", validate({ body: carSchema }), async (request, response) => {
  const carData = request.body;

  const car = await prisma.cars.create({
    data: carData,
  });

  response.status(201).json(car);
});

//PUT /cars/:id route - update a resource
router.put(
  "/:id(\\d+)",
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
router.delete("/:id(\\d+)", async (request, response, next) => {
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
router.post(
  "/:id(\\d+)/photo",
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

router.use("/photos", express.static("uploads"));

export default router;
