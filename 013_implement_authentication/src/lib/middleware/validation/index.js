import addFormats from "ajv-formats";
import { Validator, ValidationError } from "express-json-validator-middleware";

const validator = new Validator({
  coerceTypes: true,
});

addFormats(validator.ajv, ["date-time"])
  .addKeyword("kind")
  .addKeyword("modifier");

export const validate = validator.validate;

export const validationErrorMiddleware = (error, request, response, next) => {
  if (error instanceof ValidationError) {
    response.status(422).send({
      errors: error.validationErrors,
    });
    next();
  } else {
    next(error);
  }
};

export * from "./car.js";
