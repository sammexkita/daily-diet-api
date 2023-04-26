import { FastifyInstance } from "fastify";
import { knex } from "../database";

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async (req, reply) => {
    const table = await knex('meals').select();
    return reply.send(table);
  })
}