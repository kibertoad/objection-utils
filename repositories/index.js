const repositoryFactory = require('./lib/services/repository.factory');
const NotFoundError = require('./lib/errors');

module.exports = {
  NotFoundError,
  repositoryFactory
};
