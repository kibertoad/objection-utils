const ObjectionModel = require('objection').Model;

class SimpleModel extends ObjectionModel {

	static get jsonSchema() {
		return {
			title: 'SimpleModel',
			type: 'object',
			required: [],
			additionalProperties: false,

			properties: {
				name: { type: ['string', 'null'] }
			}
		};
	}
}

module.exports = SimpleModel;
