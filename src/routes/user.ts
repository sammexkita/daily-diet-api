import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { knex } from "../database";

interface MealProps {
  id: string;
  session_id: string;
  name: string;
  description: string;
  date_hour: Date;
  within_dietary: boolean;
}

export async function userRoutes(app: FastifyInstance) {
  app.get('/metrics',{
    preHandler: [checkSessionIdExists]
  },async (req, reply) => {
    const { sessionId } = req.cookies;

    const meals:MealProps[] = await knex('meals').where({
      session_id: sessionId
    }).select().orderBy('date_hour', 'asc')

    let within_dietary = 0;
    let out_dietary = 0;
  
    meals.map(meal => {
      meal.within_dietary ? ( 
        within_dietary += 1
      ) : (
        out_dietary += 1
      )
    })


    function getMaxMealsInDietPerDay(meals: MealProps[]): number {
      const filteredMeals = meals.filter((meal) => meal.within_dietary)
    
      if (filteredMeals.length === 0) {
        return 0
      }
    
      filteredMeals.sort((a, b) => new Date(a.date_hour).getTime() - new Date(b.date_hour).getTime())
    
      const mealsByDay: MealProps[][] = []
      let currentDay = new Date(filteredMeals[0].date_hour)
      let currentDayMeals: MealProps[] = []
      for (const meal of filteredMeals) {
        if (new Date(meal.date_hour).toDateString() === currentDay.toDateString()) {
          currentDayMeals.push(meal)
        } else {
          mealsByDay.push(currentDayMeals)
          currentDay = new Date(meal.date_hour)
          currentDayMeals = [meal]
        }
      }
      mealsByDay.push(currentDayMeals)
      
      let maxMealsInDietPerDay = 0
      for (const dayMeals of mealsByDay) {
        const mealsInDiet = dayMeals.length
    
        if (mealsInDiet > maxMealsInDietPerDay) {
          maxMealsInDietPerDay = mealsInDiet
        }
      }
    
      return maxMealsInDietPerDay
    }

    const metrics = {
      total_of_meals: meals.length,
      within_dietary,
      out_dietary,
      longest_streak: getMaxMealsInDietPerDay(meals)
    }

    return reply.send(metrics)
  })  
}