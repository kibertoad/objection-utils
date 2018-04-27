# objection-utils
Utils for Objection.js ORM


Recommended repository initialization and exposal pattern (JSDoc is used to assist with autocompletion):


```js
const { repositoryFactory } = require('objection-utils');
const knex = require('../db/application.db').getKnexInstance(); //replace with how you provide knex in your application
const SomeEntityModel = require('../models/some-entity.model');
const AnotherEntityModel = require('../models/some-entity.model');

const someEntityRepository = repositoryFactory.getRepository(knex, SomeEntityModel);
const anotherEntityRepository = repositoryFactory.getRepository(knex, AnotherEntityModel);

module.exports = {
	/**
	 * @type EntityRepository
	 */
	someEntityRepository,

	/**
	 * @type EntityRepository
	 */
	anotherEntityRepository
};

```