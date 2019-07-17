const ObjectionModel = require('objection').Model;

class CompositeKeyModel extends ObjectionModel {
  static get tableName() {
    return 'models';
  }

  static get idColumn() {
    return ['name', 'code'];
  }

  static get jsonSchema() {
    return {
      title: 'CompositeKeyModel',
      type: 'object',
      required: [],
      additionalProperties: false,

      properties: {
        name: { type: ['string'] },
        code: { type: ['string'] },
        description: { type: ['string', 'null'] }
      }
    };
  }
}

module.exports = CompositeKeyModel;
