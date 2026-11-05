const paginate = async (model, filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 }, populate } = options;
  const skip = (page - 1) * Number(limit);

  let query = model.find(filter).sort(sort).skip(skip).limit(Number(limit));

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((p) => {
        query = query.populate(p);
      });
    } else {
      query = query.populate(populate);
    }
  }

  const results = await query;
  const totalResults = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalResults / Number(limit));

  return {
    results,
    page: Number(page),
    limit: Number(limit),
    totalPages,
    totalResults,
  };
};

module.exports = paginate;
