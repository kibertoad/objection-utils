const repositoryFactory = require('./lib/services/repository.factory');
const NotFoundError = require('./lib/errors/NotFoundError');

module.exports = {
  NotFoundError,
  repositoryFactory
};
