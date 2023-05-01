import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date_hour: z.string(),
      within_dietary: z.boolean(),
    });

    const { name, description, date_hour, within_dietary } = createMealBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, 
      })
    }

    const meal = {
      id: randomUUID(),
      session_id: sessionId,
      name,
      description,
      date_hour,
      within_dietary
    };

    await knex('meals').insert(meal);

    return reply.send(meal);
  })

  app.get('/', {
    preHandler: [checkSessionIdExists]
  }, async (req, reply) => {
    const sessionId = req.cookies.sessionId;

    const meals = await knex('meals').where({
      session_id: sessionId
    }).select()

    return reply.send(meals)
  })

  app.get('/:id',{
    preHandler: [checkSessionIdExists]
  }, async (req, reply) => {
    const listSpecificMealParamsScheme = z.object({
      id: z.string().uuid(),
    })

    const { id } = listSpecificMealParamsScheme.parse(req.params);

    let sessionId = req.cookies.sessionId

    const meal = await knex('meals').where({
      id,
      session_id: sessionId
    }).select().first();

    if (!meal) {
      return reply.status(400).send({
        error: 'Meal not found'
      })
    }

    return reply.send(meal);
  })

  app.patch('/:id',{
   preHandler: [checkSessionIdExists] 
  }, async (req, reply) => {
    const updateMealParamsScheme = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateMealParamsScheme.parse(req.params);

    let sessionId = req.cookies.sessionId

    const meal = await knex('meals').where({
      id,
      session_id: sessionId
    }).select();

    if (meal.length == 0) {
      return reply.status(400).send({
        error: 'Meal not found'
      })
    }

    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date_hour: z.string(),
      within_dietary: z.boolean(),
    }).partial().refine(({name, description, date_hour, within_dietary}) =>
      name !== undefined || description !== undefined || date_hour !== undefined || within_dietary !== undefined, 
      { message: 'One of the fields must be defined' }
    );

    const body = updateMealBodySchema.parse(req.body);

    const updated_meal = await knex('meals')
    .where('id', id)
    .update(body)
    .returning(['id', 'name', 'description', 'date_hour', 'within_dietary'])

    return reply.send(updated_meal)
  })

  app.delete('/:id', {
    preHandler: [checkSessionIdExists]
  }, async (req, reply) => {
    const DeleteSpecificMealParamsScheme = z.object({
      id: z.string().uuid(),
    })

    const { id } = DeleteSpecificMealParamsScheme.parse(req.params);

    let sessionId = req.cookies.sessionId

    const meal = await knex('meals').where({
      id,
      session_id: sessionId
    }).select();

    if (meal.length == 0) {
      return reply.status(400).send({
        error: 'Meal not found'
      })
    }

    await knex('meals').where({
      id
    }).del()

    return reply.send();
  })
}