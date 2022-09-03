"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carIdSchema = exports.carSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.carSchema = typebox_1.Type.Object({
    brand: typebox_1.Type.String(),
    model: typebox_1.Type.String(),
    year: typebox_1.Type.Optional(typebox_1.Type.Integer()),
    color: typebox_1.Type.Optional(typebox_1.Type.String()),
}, { additionalProperties: false });
exports.carIdSchema = typebox_1.Type.Object({ id: typebox_1.Type.Number() });
//# sourceMappingURL=cars.js.map