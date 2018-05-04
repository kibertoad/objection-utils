const repositoryFactory = require('./lib/services/repository.factory');
const EntityRepository = require('./lib/services/entity.repository');
const NotFoundError = require('./lib/errors/NotFoundError');

module.exports = {
  EntityRepository,
  NotFoundError,
  repositoryFactory
};
