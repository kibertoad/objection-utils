const _ = require('lodash');
const validate = require('validation-utils').validationHelper;

const EntityRepository = require('./entity.repository');

/**
 * Memoization-enabled factory for repositories that instantiates a repository for the same model and db connection
 * only once
 */

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
  return `${knex.client.config.connection.host}/${knex.client.config.connection.database}/${entityModel.name}`;
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

/**
 *
 * @param {Knex} knex
 * @param {Model} entityModel
 * @returns {EntityRepository}
 * @private
 */
function _getCustomRepository(RepositoryClass) {
  return new RepositoryClass(..._getArgumentsExceptFirst(arguments));
}

function _getArgumentsExceptFirst(args) {
  const slicedArgs = [];
  for (let i = 1; i < args.length; i++) {
    slicedArgs.push(args[i]);
  }
  return slicedArgs;
}

const memoizedGetCustomRepository = _.memoize(
  _getCustomRepository,
  (RepositoryClass, knex, entityModel) => {
    return `${knex.client.config.connection.host}/${knex.client.config.connection.database}/${entityModel.name}`;
  }
);

/**
 * Get repository singleton for a given db and entity. Also passes any given arguments in addition to mandatory first
 * three to the constructor
 * @param {class<T>} RepositoryClass
 * @param {Knex} knex
 * @param {Model} entityModel
 * @returns {T}
 */
function getCustomRepository(RepositoryClass, knex, entityModel) {
  validate.inheritsFrom(
    RepositoryClass,
    EntityRepository,
    'Custom repository class must inherit from EntityRepository'
  );
  return memoizedGetCustomRepository(...arguments);
}

module.exports = {
  getRepository,
  getCustomRepository
};
