import * as path from "node:path"
import Fastify from "fastify"
import corsPlugin from "@fastify/cors"
import staticPlugin from "@fastify/static"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"


import multerPlugin from "./plugins/multer"
import prismaPlugin from "./plugins/prisma"

import { carSchema, carIdSchema } from "./schemas/cars"

export default async function buildApp() {
    const options = {
        logger: true,
    }

    const app = Fastify(options).withTypeProvider<TypeBoxTypeProvider>()

    await app.register(multerPlugin);
    await app.register(prismaPlugin);

    const corsOptions = {
        origin: "http://localhost:8080"
    }

    app.register(corsPlugin, corsOptions)

    app.get(
        "/cars",
        async () => {
            return await app.prisma.cars.findMany()
        }
    )

    app.post(
        "/cars",
        {
            schema: { body: carSchema }
        },
        async (request, reply) => {
            reply.status(201)
            return await app.prisma.cars.create({
                data: request.body
            })
        }
    )

    app.get(
        "/cars/:id",
        {
            schema: { params: carIdSchema }
        },
        async (request, reply) => {
            const id = request.params.id
            const car = await app.prisma.cars.findUnique({
                where: { id }
            })

            if (!car) {
                reply.status(404)
                throw new Error(`Route GET:/cars/${id} not found`)
            }
            return car
        }
    )

    app.put(
        "/cars/:id",
        {
            schema: {
                params: carIdSchema,
                body: carSchema
            }
        },
        async (request, reply) => {
            const id = request.params.id
            try {
                return await app.prisma.cars.update({
                    where: { id },
                    data: request.body
                })
            } catch (error) {
                reply.status(404)
                throw new Error(`Route PUT :/cars/${id} not found`)
            }
        }
    )

    app.delete(
        "/cars/:id",
        { schema: { params: carIdSchema } },
        async (request, reply) => {
            const id = request.params.id
            try {
                await app.prisma.cars.delete({
                    where: { id }
                })
                reply.status(204).send("")
            } catch (error) {
                reply.status(404)
                throw new Error(`Route DELETE :/cars/${id} not found`)
            }
        }
    )

    app.post(
        "/cars/:id/photo",
        {
            schema: {
                params: carIdSchema
            },
            preHandler: app.upload.single("photo"),
        },
        async (request, reply) => {
            //@ts-ignore
            const id = request.params.id
            //@ts-ignore
            const photoFilename = request.file.filename
            try {
                await app.prisma.cars.update({
                    where: { id },
                    data: { photoFilename }
                })
                reply.status(201).send({ photoFilename })
            } catch (error) {
                reply.status(404)
                throw new Error(`Route POST:/cars/${id}/photo not found`)
            }
        }
    )
    app.register(staticPlugin, { root: path.resolve("upload/"), prefix: "/cars/photos" })
    return app
}