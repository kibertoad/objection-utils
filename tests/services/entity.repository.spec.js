const SimpleModel = require('../models/SimpleModel');
const ExtendedCommonModel = require('../models/ExtendedCommonModel');

const EntityRepository = require('../../lib/services/entity.repository');

const dbInitializer = require('../util/dbInitializer');
const dbConfig = require('../util/TestDatabaseConfigs').POSTGRESQL_CONFIG;

const assert = require('chai').assert;

describe('entity.repository', () => {
  let knex;
  let entities;
  before(() => {
    knex = dbInitializer.initialize(dbConfig);
    entities = new EntityRepository(knex, SimpleModel);
  });

  describe('constructor', () => {
    it('validates intermediary subclasses correctly', () => {
      const repository = new EntityRepository(knex, ExtendedCommonModel);
      assert.isDefined(repository);
    });
  });

  describe('fromJson', () => {
    it('happy path', () => {
      const entity = entities.fromJson({ name: 'dummyName' });
      assert.deepEqual(entity, {
        name: 'dummyName'
      });
    });
  });
});
