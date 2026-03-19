const slugify = require('slugify');
const Tag = require('../models/Tag');
const AppError = require('../utils/AppError');
const { logAction } = require('./auditLogService');

const listTags = async () => Tag.find({ isActive: true }).sort({ name: 1 });

const listAllTags = async () => Tag.find().sort({ createdAt: -1 });

const createTag = async (payload, actor) => {
  const slug = slugify(payload.name, { lower: true, strict: true });
  const exists = await Tag.findOne({
    $or: [{ name: payload.name }, { slug }],
  });

  if (exists) {
    throw new AppError('Tag already exists', 409);
  }

  const tag = await Tag.create({
    name: payload.name,
    slug,
    description: payload.description,
    isActive: payload.isActive !== undefined ? payload.isActive : true,
  });

  await logAction({
    actorId: actor._id,
    actorRole: actor.role,
    action: 'TAG_CREATED',
    targetType: 'Tag',
    targetId: tag._id,
    metadata: tag.toObject(),
  });

  return tag;
};

const updateTag = async (tagId, payload, actor) => {
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new AppError('Tag not found', 404);
  }

  if (payload.name) {
    tag.name = payload.name;
    tag.slug = slugify(payload.name, { lower: true, strict: true });
  }
  if (payload.description !== undefined) tag.description = payload.description;
  if (payload.isActive !== undefined) tag.isActive = payload.isActive;
  await tag.save();

  await logAction({
    actorId: actor._id,
    actorRole: actor.role,
    action: 'TAG_UPDATED',
    targetType: 'Tag',
    targetId: tag._id,
    metadata: payload,
  });

  return tag;
};

const deleteTag = async (tagId, actor) => {
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new AppError('Tag not found', 404);
  }

  await tag.deleteOne();

  await logAction({
    actorId: actor._id,
    actorRole: actor.role,
    action: 'TAG_DELETED',
    targetType: 'Tag',
    targetId: tag._id,
  });

  return { message: 'Tag deleted successfully' };
};

module.exports = {
  listTags,
  listAllTags,
  createTag,
  updateTag,
  deleteTag,
};
