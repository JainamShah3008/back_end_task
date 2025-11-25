module.exports.paginate = async (model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    projection = null,
  } = options;
  console.log("🚀 ~ pagination.js:8 ~ options:", options)

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter, projection).sort(sort).skip(skip).limit(Number(limit)),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};
