import express from "express";
import "express-async-errors";

const app = express();

app.get("/", (request, response) => {
  response.json({ message: "Server Running" });
});

export default app;
