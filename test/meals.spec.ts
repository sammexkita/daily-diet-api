import { afterAll, beforeAll, describe, expect, it, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest"
import { execSync } from "node:child_process";

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback -all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a meal', async () => {
    const new_meal = await request(app.server)
    .post('/meals')
    .send({
      name: 'Meals Test',
      description: 'This is a meal test',
      date_hour: new Date(),
      within_dietary: true
    })

    expect(new_meal.body).toEqual(
      expect.objectContaining({
        name: 'Meals Test',
        description: 'This is a meal test',
      })
    )
  })

  it('should be able to update a meal', async () => {
    const new_meal = await request(app.server)
    .post('/meals')
    .send({
      name: 'Yakisoba',
      description: 'This is a good Yakisoba',
      date_hour: new Date(),
      within_dietary: true
    })

    const { id } = new_meal.body;
    const cookies = new_meal.get('Set-Cookie')

    const update_meal = await request(app.server)
    .patch(`/meals/${id}`)
    .set('Cookie', cookies)
    .send({
      name: 'Yakisoba #02'
    })

    expect(update_meal.body).toEqual([
      expect.objectContaining({
        name: 'Yakisoba #02',
        description: 'This is a good Yakisoba',
      })
    ])
  })  

  it('should be able to delete an specific meal', async () => {
    const new_meal = await request(app.server)
    .post('/meals')
    .send({
      name: 'Misoshiru',
      description: 'The best Misoshiru',
      date_hour: new Date(),
      within_dietary: true
    })

    const { id } = new_meal.body;
    const cookies = new_meal.get('Set-Cookie')

    await request(app.server)
    .delete(`/meals/${id}`)
    .set('Cookie', cookies)
    .expect(200)
  })

  it('should be able to list user\' meals', async () => {
    const new_meal = await request(app.server)
    .post('/meals')
    .send({
      name: 'Ramen',
      description: 'The best Ramen',
      date_hour: new Date(),
      within_dietary: true
    })

    const cookies = new_meal.get('Set-Cookie')

    const allMeals = await request(app.server)
    .get('/meals')
    .set('Cookie', cookies)
    
    expect(allMeals.body).toEqual([
      expect.objectContaining({
        name: 'Ramen',
        description: 'The best Ramen',
      })
    ])
  })

  it('should be able to list an specific meal', async() => {
    const new_meal = await request(app.server)
    .post('/meals')
    .send({
      name: 'Takoyaki',
      description: 'The best Osaka\' Takoyaki',
      date_hour: new Date(),
      within_dietary: true
    })

    const { id } = new_meal.body;
    const cookies = new_meal.get('Set-Cookie')

    const getMeal = await request(app.server)
    .get(`/meals/${id}`)
    .set('Cookie', cookies)

    expect(getMeal.body).toEqual(
      expect.objectContaining({
        name: 'Takoyaki',
        description: 'The best Osaka\' Takoyaki',
      })
    )
  })
})