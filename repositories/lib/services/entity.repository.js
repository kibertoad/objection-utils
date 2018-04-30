const _ = require('lodash');
const validationUtils = require('validation-utils');

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
   * @returns {Promise<Object>} - created entity
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
   * @returns {integer} number of affected rows
   */
  update(entity, trx) {
    //Keep the input parameter immutable
    const entityDto = _.cloneDeep(entity);
    //ToDo implement pre-persistence hooks
    return this.model
      .query(trx || this.knex)
      .update(entityDto)
      .where(this.idColumn, entityDto[this.idColumn]);
  }

  /**
   * Finds list of entities with specified attributes
   *
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object[]>}
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
