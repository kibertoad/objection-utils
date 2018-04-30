/**
 * Represent an "Entity was not found" error
 * @class ValidationError
 * @extends {Error}
 */
class NotFoundError extends Error {
  constructor(entityId, message) {
    message = message || `Entity with id ${entityId} does not exist`;
    super(message);
  }
}

module.exports = NotFoundError;
