# objection-utils
Utils for Objection.js ORM


Recommended usage pattern (JSDoc is used to assist with autocompletion):


```js
const { repositoryFactory } = require('objection-utils');
const knex = require('../db/application.db').getKnexInstance(); //replace with how you provide knex in your application
const SomeEntityModel = require('../models/some-entity.model');

const someEntityRepository = repositoryFactory.getRepository(knex, SomeEntityModel);

module.exports = {
	/**
	 * @type EntityRepository
	 */
	someEntityRepository
};

```