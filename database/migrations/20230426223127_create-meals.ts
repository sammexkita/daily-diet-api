import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').index().notNullable()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('date_hour').defaultTo(knex.fn.now()).notNullable()
    table.boolean('within_dietary').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}