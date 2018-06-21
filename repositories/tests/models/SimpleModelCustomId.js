const ObjectionModel = require('objection').Model;

class SimpleModelCustomId extends ObjectionModel {
  static get tableName() {
    return 'models';
  }

  static get idColumn() {
    return 'code';
  }

  static get jsonSchema() {
    return {
      title: 'SimpleModelCustomId',
      type: 'object',
      required: [],
      additionalProperties: false,

      properties: {
        code: { type: ['string'] },
        name: { type: ['string'] },
        surname: { type: ['string', 'null'] },
        description: { type: ['string', 'null'] }
      }
    };
  }
}

module.exports = SimpleModelCustomId;
