const AuditLog = require('../models/AuditLog');

const logAction = async ({ actorId, actorRole, action, targetType, targetId, metadata = {} }) =>
  AuditLog.create({
    actorId,
    actorRole,
    action,
    targetType,
    targetId,
    metadata,
  });

module.exports = {
  logAction,
};
