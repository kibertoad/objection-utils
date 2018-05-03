const ObjectionModel = require('objection').Model;

class SimpleModel extends ObjectionModel {
  static get tableName() {
    return 'models';
  }

  static get jsonSchema() {
    return {
      title: 'SimpleModel',
      type: 'object',
      required: [],
      additionalProperties: false,

      properties: {
        id: { type: ['integer'] },
        name: { type: ['string'] },
        surname: { type: ['string', 'null'] },
        description: { type: ['string', 'null'] }
      }
    };
  }
}

module.exports = SimpleModel;
