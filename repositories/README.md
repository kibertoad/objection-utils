# objection-repositories

Repositories are wrappers around specific DB connection and Objection.js Model that expose a number of methods to perform CRUD operations:

**Create new entity without persisting

```js
  /**
   * @param {Object} [attributeValues] - attributes of a new entity
   * @returns {Object} entity instance of a repository Model
   */
  fromJson(attributeValues)
```

**Persist new entity or an array of entities non-recursively (without relations). Note that batch insert only works on PostgreSQL

```js
  /**
   * @param {Object} entity - model instance or parameters for a new entity
   * @param {Object} [trx] - knex transaction instance. If not specified, new implicit transaction will be used.
   * @returns {Promise<Object>} - created entity
   */
  create(instance, trx)
```

**Persist updated entity. If previously set fields are not present, performs an incremental update (does not remove fields unless explicitly set to null)

```js
  /**
   * @param {Object} entity - single entity instance
   * @param {Object} [trx] - knex transaction instance. If not specified, new implicit transaction will be used.
   * @returns {integer} number of affected rows
   */
  update(entity, trx)
```

**Find list of entities with specified attributes

```js
  /**
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object[]>} - search result
   */
  find(attributeValues = {}, withRelations)
```

**Find list of entities with attribute values that are different from specified ones

```js
  /**
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {PromiseLike<Object[]>} - query builder. You can chain additional methods to it or call "await" or then() on it to execute
   */
  findWhereNot(attributeValues = {}, withRelations)
```

**Find list of entities with specified attributes (any of multiple specified values)

```js
  /**
   * Supports both ('attrName', ['value1', 'value2]) and ({attrName: ['value1', 'value2']} formats)
   * @param {string|Object} searchParam - attribute name or search criteria object
   * @param {*[]} attributeValues - attribute values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object[]>}
   */
  findWhereIn(searchParam, attributeValues, withRelations)
```

**Find first entity with specified attributes

```js
  /**
   * @param {Object} attributeValues - values to filter retrieved entities by
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object>}
   */
  findOne(attributeValues = {}, withRelations)
```

**Find entity with specified id (as defined by idColumn entity attribute)

```js
  /**
   * @param {string || number} id - value of id column of the entity
   * @param {string || string[]} [withRelations] - name of relation(s) to eagerly retrieve, as defined in model relationMappings()
   * @returns {Promise<Object>}
   */
  findOneById(id, withRelations) {
```

**Delete entities with specified attributes

```js
  /**
   * @param {Object} attributeValues - values to filter deleted entities by
   * @param {Object} [trx]
   * @returns {PromiseLike<integer>} Query builder. After promise is resolved, returns count of deleted rows
   */
  deleteBy(attributeValues, trx) {
```

**Delete entity with specified id (as defined by idColumn entity attribute)

```js
  /**
   * @param {string || number} id - value of id column of the entity
   * @param {Object} [trx]
   * @returns {PromiseLike<integer>} Query builder. After promise is resolved, returns count of deleted rows
   */
  deleteById(id, trx) {
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

In case you are only instantiating repositories in a single place (and thus don't care about ensuring them to be memoized singletons), you don't
need to use factory and can instantiate EntityRepository directly.

** Extending repositories with custom logic

You can extend base EntityRepository class and pass it as a parameter to the factory to have custom methods in your repositories:

```js
class CustomRepository extends EntityRepository {
  // custom logic
}

const someEntityRepository = repositoryFactory.getCustomRepository(CustomRepository, knex, SomeEntityModel);
```

Note that all constructions arguments will be passed to your custom class verbatim (starting with the second argument).
