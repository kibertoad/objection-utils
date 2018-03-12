const SimpleModel = require('../models/SimpleModel');
const SimpleModel2 = require('../models/SimpleModel2');

const repositoryFactory = require('../../lib/services/repository.factory');

const dbInitializer = require('../util/dbInitializer');
const dbConfig = require('../util/TestDatabaseConfigs').POSTGRESQL_CONFIG;

const assert = require('chai').assert;

describe('repository.factory', () => {
	let knex;
	let entities;
	before(async () => {
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
});
