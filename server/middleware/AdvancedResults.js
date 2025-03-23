const advancedResults = (model, populate, filter = {}) => async (req, res, next) => {
    try {
      let query;
      
      // Copy request query and merge with filter
      const reqQuery = { ...req.query, ...filter };
  
      // Fields to exclude from filtering
      const removeFields = ["select", "sort", "page", "limit"];
  
      // Remove excluded fields from reqQuery
      removeFields.forEach((param) => delete reqQuery[param]);
  
      // Convert query object to string and replace operators (e.g., $gt, $gte, etc.)
      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      );
  
      // Finding resource
      query = model.find(JSON.parse(queryStr));
  
      // Select fields
      if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
      }
  
      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt"); // Default sorting by latest
      }
  
      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const total = await model.countDocuments(JSON.parse(queryStr));
  
      query = query.skip(startIndex).limit(limit);
  
      // Populate if needed
      if (populate) {
        query = query.populate(populate);
      }
  
      // Executing query
      const results = await query;
  
      // Advanced Results Response
      res.advancedResults = {
        success: true,
        count: results.length,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          next: startIndex + limit < total ? page + 1 : null,
          prev: startIndex > 0 ? page - 1 : null,
        },
        data: results,
      };
  
      next();
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = advancedResults;