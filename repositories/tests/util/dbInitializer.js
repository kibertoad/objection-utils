const Knex = require('knex');
const { dbCleaner } = require('knex-utils');

const DEFAULT_TABLES = ['models'];

function initialize(knexConfig) {
  const knex = Knex(knexConfig);
  return {
    config: knexConfig,
    knex: knex
  };
}

function dropDb(knex) {
  return knex.schema.dropTableIfExists('models');
}

function createDb(knex) {
  return knex.schema.createTableIfNotExists(`models`, function(table) {
    table.increments('id');
    table.string('name');
    table.string('description');
  });
}

function cleanDb(knex) {
  return _cleanTables(knex);
}

async function _cleanTables(knex, tables = DEFAULT_TABLES) {
  return dbCleaner.cleanDb(knex, tables, console);
}

module.exports = {
  cleanDb,
  createDb,
  dropDb,
  initialize
};
