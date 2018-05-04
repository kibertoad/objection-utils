const _ = require('lodash');
const validationUtils = require('validation-utils');
const NotFoundError = require('../errors/NotFoundError');

class EntityRepository {
  /**
   *
   * @param {Knex} knex - Knex.js instance
   * @param {Model} model - Objection.js Model
   */
  constructor(knex, model) {
    validationUtils.notNil(knex, 'Knex instance is mandatory');
    validationUtils.notNil(model, 'Model is mandatory');
    _validateIsModel(model);

    this.knex = knex;
    this.model = model;
    this.idColumn = model.idColumn;
  }

  /**
   * Creates new entity without persisting
   *
   * @param {Object} [attributeValues] - attributes of a new entity
   * @returns {Object} entity instance of a repository Model
   */
  fromJson(attributeValues) {
    return this.model.fromJson(attributeValues);
  }

  /**
   * Persists new entity or an array of entities.
   * This method does not recursively persist related entities, use createRecursively (to be implemented) for that.
   * Batch insert only works on PostgreSQL
   *
   * @param {Object} entity - model instance or parameters for a new entity
   * @param {Object} [trx] - knex transaction instance. If not specified, new implicit transaction will be used.
   * @returns {PromiseLike<Object>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  create(entity, trx) {
    //Keep the input parameter immutable
    const instanceDto = _.cloneDeep(entity);
    //ToDo implement pre-persistence hooks
    return this.model.query(trx || this.knex).insert(instanceDto);
  }

  /**
   * Persists updated entity. If previously set fields are not present, performs an incremental update (does not remove fields unless explicitly set to null)
   *
   * @param {Object} entity - single entity instance
   * @param {Object} [trx] - knex transaction instance. If not specified, new implicit transaction will be used.
   * @returns {PromiseLike<integer>} number of affected rows
   */
  async update(entity, trx) {
    //Keep the input parameter immutable
    const entityDto = _.cloneDeep(entity);
    //ToDo implement pre-persistence hooks
    const modifiedEntitiesCount = await this.model
      .query(trx || this.knex)
      .update(entityDto)
      .where(this.idColumn, entityDto[this.idColumn]);

    if (modifiedEntitiesCount === 0) {
      throw new NotFoundError(entityDto[this.idColumn]);
    }
    return modifiedEntitiesCount;
  }

  /**
   * Finds list of entities with specified attributes
   *
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {PromiseLike<Object[]>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  find(attributeValues = {}, withRelations) {
    if (_.isArray(withRelations)) {
      withRelations = `[${_.join(withRelations)}]`;
    }

    return this.model
      .query(this.knex)
      .where(attributeValues)
      .eager(withRelations);
    //ToDo implement post-retrieval hooks
  }

  /**
   * Finds list of entities with specified attributes (any of multiple specified values)
   * Supports both ('attrName', ['value1', 'value2]) and ({attrName: ['value1', 'value2']} formats)
   *
   * @param {string|Object} searchParam - attribute name or search criteria object
   * @param {*[]} [attributeValues] - attribute values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {PromiseLike<Object[]>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  findWhereIn(searchParam, attributeValues, withRelations) {
    if (Array.isArray(withRelations)) {
      withRelations = `[${_.join(withRelations)}]`;
    }
    if (_.isString(searchParam)) {
      return this.model
        .query(this.knex)
        .whereIn(searchParam, attributeValues)
        .eager(withRelations);
    } else {
      const builder = this.model.query(this.knex).eager(withRelations);
      _.forOwn(searchParam, (value, key) => {
        if (Array.isArray(value)) {
          builder.whereIn(key, value);
        } else {
          builder.where(key, value);
        }
      });
      return builder;
    }

    //ToDo implement post-retrieval hooks
  }

  /**
   * Finds first entity by given parameters
   *
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object>}
   */
  async findOne(attributeValues = {}, withRelations) {
    const results = await this.find(attributeValues, withRelations);
    return results[0] || null;
  }

  /**
   * @param {Object} attributeValues - values to filter deleted entities by
   * @param {Object} [trx]
   * @returns {PromiseLike<integer>} Query builder. After promise is resolved, returns count of deleted rows
   */
  deleteBy(attributeValues, trx) {
    return this.model
      .query(trx || this.knex)
      .delete()
      .where(attributeValues);
  }
}

//This is only invoked on the startup, so we can make this check non-trivial
function _validateIsModel(model) {
  let parentClass = Object.getPrototypeOf(model);
  while (parentClass.name !== 'Model' && parentClass.name !== '') {
    parentClass = Object.getPrototypeOf(parentClass);
  }
  validationUtils.booleanTrue(
    parentClass.name === 'Model',
    'Parameter is not an Objection.js model'
  );
}

module.exports = EntityRepository;
