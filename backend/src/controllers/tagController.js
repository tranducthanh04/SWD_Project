const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const tagService = require('../services/tagService');

const listTags = catchAsync(async (_req, res) => {
  const data = await tagService.listTags();
  successResponse(res, { data });
});

const listAllTags = catchAsync(async (_req, res) => {
  const data = await tagService.listAllTags();
  successResponse(res, { data });
});

const createTag = catchAsync(async (req, res) => {
  const data = await tagService.createTag(req.body, req.user);
  successResponse(res, { statusCode: 201, message: 'Tạo thẻ thành công', data });
});

const updateTag = catchAsync(async (req, res) => {
  const data = await tagService.updateTag(req.params.id, req.body, req.user);
  successResponse(res, { message: 'Cập nhật thẻ thành công', data });
});

const deleteTag = catchAsync(async (req, res) => {
  const data = await tagService.deleteTag(req.params.id, req.user);
  successResponse(res, { message: data.message });
});

module.exports = {
  listTags,
  listAllTags,
  createTag,
  updateTag,
  deleteTag,
};
