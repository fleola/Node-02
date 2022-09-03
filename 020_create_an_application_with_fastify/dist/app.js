"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("node:path"));
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const static_1 = __importDefault(require("@fastify/static"));
const multer_1 = __importDefault(require("./plugins/multer"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const cars_1 = require("./schemas/cars");
async function buildApp() {
    const options = {
        logger: true,
    };
    const app = (0, fastify_1.default)(options).withTypeProvider();
    await app.register(multer_1.default);
    await app.register(prisma_1.default);
    const corsOptions = {
        origin: "http://localhost:8080"
    };
    app.register(cors_1.default, corsOptions);
    app.get("/cars", async () => {
        return await app.prisma.cars.findMany();
    });
    app.post("/cars", {
        schema: { body: cars_1.carSchema }
    }, async (request, reply) => {
        reply.status(201);
        return await app.prisma.cars.create({
            data: request.body
        });
    });
    app.get("/cars/:id", {
        schema: { params: cars_1.carIdSchema }
    }, async (request, reply) => {
        const id = request.params.id;
        const car = await app.prisma.cars.findUnique({
            where: { id }
        });
        if (!car) {
            reply.status(404);
            throw new Error(`Route GET:/cars/${id} not found`);
        }
        return car;
    });
    app.put("/cars/:id", {
        schema: {
            params: cars_1.carIdSchema,
            body: cars_1.carSchema
        }
    }, async (request, reply) => {
        const id = request.params.id;
        try {
            return await app.prisma.cars.update({
                where: { id },
                data: request.body
            });
        }
        catch (error) {
            reply.status(404);
            throw new Error(`Route PUT :/cars/${id} not found`);
        }
    });
    app.delete("/cars/:id", { schema: { params: cars_1.carIdSchema } }, async (request, reply) => {
        const id = request.params.id;
        try {
            await app.prisma.cars.delete({
                where: { id }
            });
            reply.status(204).send("");
        }
        catch (error) {
            reply.status(404);
            throw new Error(`Route DELETE :/cars/${id} not found`);
        }
    });
    app.post("/cars/:id/photo", {
        schema: {
            params: cars_1.carIdSchema
        },
        preHandler: app.upload.single("photo"),
    }, async (request, reply) => {
        //@ts-ignore
        const id = request.params.id;
        //@ts-ignore
        const photoFilename = request.file.filename;
        try {
            await app.prisma.cars.update({
                where: { id },
                data: { photoFilename }
            });
            reply.status(201).send({ photoFilename });
        }
        catch (error) {
            reply.status(404);
            throw new Error(`Route POST:/cars/${id}/photo not found`);
        }
    });
    app.register(static_1.default, { root: path.resolve("upload/"), prefix: "/cars/photos" });
    return app;
}
exports.default = buildApp;
//# sourceMappingURL=app.js.map