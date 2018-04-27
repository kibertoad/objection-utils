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

/**
 *
 * @type {Function}
 * @param {Knex} knex
 * @param {Model} entityModel
 * @returns {EntityRepository}
 */
const getRepository = _.memoize(_getRepository, (knex, entityModel) => {
  return `${knex.config.connection.host}/${knex.config.connection.database}/${entityModel.name}`;
});

module.exports = {
  getRepository
};
