import { Type } from "@sinclair/typebox";

export const carSchema = Type.Object(
    {
        brand: Type.String(),
        model: Type.String(),
        year: Type.Optional(Type.Integer()),
        color: Type.Optional(Type.String()),
    },
    { additionalProperties: false }
);

export const carIdSchema = Type.Object({ id: Type.Number() })