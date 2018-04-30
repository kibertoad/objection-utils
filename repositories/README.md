# objection-repositories

Repositories are wrappers around specific DB connection and Objection.js Model that expose a number of methods to perform CRUD operations:

**Create new entity without persisting

```js
  /**
   * @param {Object} [attributeValues] - attributes of a new entity
   * @returns {Object} entity instance of a repository Model
   */
  fromJson(attributeValues) {
```

**Persist new entity or an array of entities non-recursively (without relations). Note that batch insert only works on PostgreSQL

```js
  /**
   * @param {Object} entity - model instance or parameters for a new entity
   * @param {Object} [trx] - knex transaction instance. If not specified, new implicit transaction will be used.
   * @returns {Promise<Object>} - created entity
   */
  create(instance, trx) {
```

**Persist updated entity. If previously set fields are not present, performs an incremental update (does not remove fields unless explicitly set to null)

```js
  /**
   * @param {Object} entity - single entity instance
   * @param {Object} [trx] - knex transaction instance. If not specified, new implicit transaction will be used.
   * @returns {integer} number of affected rows
   */
  update(entity, trx) {
```

**Find list of entities with specified attributes

```js
  /**
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object[]>} - search result
   */
  find(attributeValues = {}, withRelations) {
```

**Find first entity with specified attributes

```js
  /**
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object>}
   */
  findOne(attributeValues = {}, withRelations) {
```


Recommended repository initialization and exposal pattern (JSDoc is used to assist with autocompletion):


```js
const { repositoryFactory } = require('objection-repositories');
const knex = require('../db/application.db').getKnexInstance(); //replace with how you provide knex in your application
const SomeEntityModel = require('../models/some-entity.model');
const AnotherEntityModel = require('../models/another-entity.model');

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