const SimpleModel = require('../models/SimpleModel');
const ExtendedCommonModel = require('../models/ExtendedCommonModel');

const EntityRepository = require('../../lib/services/entity.repository');

const dbInitializer = require('../util/dbInitializer');
const dbConfig = require('../util/TestDatabaseConfigs').POSTGRESQL_CONFIG;

const assert = require('chai').assert;

const TABLE_NAME = 'models';

describe('entity.repository', () => {
  let knex;
  let entities;
  before(() => {
    knex = dbInitializer.initialize(dbConfig).knex;
    entities = new EntityRepository(knex, SimpleModel);
    return dbInitializer.createDb(knex);
  });
  beforeEach(() => {
    dbInitializer.cleanDb(knex);
  });

  after(async () => {
    await dbInitializer.dropDb(knex);
    await knex.destroy();
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

  describe('create', () => {
    it('happy path', async () => {
      await entities.create({ name: 'dummyName' });
      const retrievedEntities = await knex(TABLE_NAME).select();
      assert.equal(retrievedEntities.length, 1);
      const [entity] = retrievedEntities;
      assert.equal(entity.name, 'dummyName');
    });
  });

  describe('update', () => {
    it('happy path', async () => {
      const persistedEntity = await entities.create({ name: 'dummyName' });
      await entities.update({
        ...persistedEntity,
        name: 'updatedName'
      });

      const retrievedEntities = await knex(TABLE_NAME).select();
      assert.equal(retrievedEntities.length, 1);
      const [entity] = retrievedEntities;
      assert.equal(entity.name, 'updatedName');
    });
  });

  describe('find', () => {
    it('happy path', async () => {
      await entities.create({ name: 'dummyName' });
      await entities.create({ name: 'dummyName' });
      await entities.create({ name: 'testName' });

      const retrievedEntities = await entities.find({
        name: 'dummyName'
      });

      assert.equal(retrievedEntities.length, 2);
      const [entity] = retrievedEntities;
      assert.equal(entity.name, 'dummyName');
    });
  });

  describe('findOne', () => {
    it('happy path', async () => {
      await entities.create({ name: 'dummyName' });
      await entities.create({ name: 'dummyName' });
      await entities.create({ name: 'testName' });

      const entity = await entities.findOne({
        name: 'dummyName'
      });

      assert.equal(entity.name, 'dummyName');
    });
  });
});
