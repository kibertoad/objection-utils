const Knex = require('knex');

function initialize(knexConfig) {
  const knex = Knex(knexConfig);
  return {
    config: knexConfig,
    knex: knex
  };
}

module.exports = {
  initialize
};
