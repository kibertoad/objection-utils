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
  }

  /**
   * Creates new entity without persisting
   *
   * @param {Object} [attributeValues]
   * @returns {Object} instance of a given Model
   */
  fromJson(attributeValues) {
    return this.model.fromJson(attributeValues);
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
