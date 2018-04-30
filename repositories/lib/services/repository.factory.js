const _ = require('lodash');
const EntityRepository = require('./entity.repository');

/**
 *
 * @param {Knex} knex
 * @param {Model} entityModel
 * @returns {EntityRepository}
 * @private
 */
function _getRepository(knex, entityModel) {
  return new EntityRepository(knex, entityModel);
}

const memoizedGetRepository = _.memoize(_getRepository, (knex, entityModel) => {
  return `${knex.config.connection.host}/${knex.config.connection.database}/${entityModel.name}`;
});

/**
 * Get repository singleton for a given db and entity
 * @param {Knex} knex
 * @param {Model} entityModel
 * @returns {EntityRepository}
 */
function getRepository(knex, entityModel) {
  return memoizedGetRepository(knex, entityModel);
}

module.exports = {
  getRepository
};
