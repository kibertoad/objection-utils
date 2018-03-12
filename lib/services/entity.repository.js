const _ = require('lodash');
const validationUtils = require('validation-utils');
const transaction = require('objection').transaction;

class EntityRepository {
	constructor(knex, model) {
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
		try {
			return this.model.fromJson(attributeValues);
		} catch (e) {
			//logger.error(`Error while validating ${JSON.stringify(attributeValues)}. Error: `, e);
			throw e;
		}
	}

}

//This is only invoked on the startup, so we can make this check non-trivial
function _validateIsModel(model) {
	let parentClass = Object.getPrototypeOf(model);
	while (parentClass.name !== 'Model' && parentClass.name !== '') {
		parentClass = Object.getPrototypeOf(parentClass);
	}
	validationUtils.booleanTrue(parentClass.name === 'Model', 'Parameter is not an Objection.js model');
}

module.exports = EntityRepository;
