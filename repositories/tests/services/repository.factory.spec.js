const SimpleModel = require('../models/SimpleModel');
const SimpleModel2 = require('../models/SimpleModel2');

const repositoryFactory = require('../../lib/services/repository.factory');
const EntityRepository = require('../../lib/services/entity.repository');

const dbInitializer = require('../util/dbInitializer');
const dbConfig = require('../util/TestDatabaseConfigs').getDbConfig();

const assert = require('chai').assert;

describe('repository.factory', () => {
  let knex;
  before(() => {
    knex = dbInitializer.initialize(dbConfig);
  });

  describe('getRepository', () => {
    it('happy path', () => {
      const repository = repositoryFactory.getRepository(knex, SimpleModel);
      assert.isDefined(repository);
    });

    it('memoizes repository for same db and model', () => {
      const repository1 = repositoryFactory.getRepository(knex, SimpleModel);
      const repository2 = repositoryFactory.getRepository(knex, SimpleModel);
      assert.equal(repository1, repository2);
    });

    it('instantiates new repository for same db and another model', () => {
      const repository1 = repositoryFactory.getRepository(knex, SimpleModel);
      const repository2 = repositoryFactory.getRepository(knex, SimpleModel2);
      assert.notEqual(repository1, repository2);
    });
  });

  describe('getCustomRepository', () => {
    it('happy path', () => {
      class CustomRepository extends EntityRepository {}
      const repository = repositoryFactory.getCustomRepository(CustomRepository, knex, SimpleModel);
      assert.instanceOf(repository, CustomRepository);
      assert.equal(repository.model, SimpleModel);
      assert.equal(repository.knex, knex);
    });

    it('memoizes repository for same db and model', () => {
      class CustomRepository extends EntityRepository {}
      const repository1 = repositoryFactory.getCustomRepository(
        CustomRepository,
        knex,
        SimpleModel
      );
      const repository2 = repositoryFactory.getCustomRepository(
        CustomRepository,
        knex,
        SimpleModel
      );
      assert.equal(repository1, repository2);
    });

    it('instantiates new repository for same db and another model', () => {
      class CustomRepository extends EntityRepository {}
      const repository1 = repositoryFactory.getCustomRepository(
        CustomRepository,
        knex,
        SimpleModel
      );
      const repository2 = repositoryFactory.getCustomRepository(
        CustomRepository,
        knex,
        SimpleModel2
      );
      assert.notEqual(repository1, repository2);
    });

    it('validates custom class to inherit from EntityRepository', () => {
      class CustomRepository {}
      assert.throws(() => {
        repositoryFactory.getCustomRepository(CustomRepository, knex, SimpleModel);
      }, /Custom repository class must inherit from EntityRepository/);
    });
  });
});
