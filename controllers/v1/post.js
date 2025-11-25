const { Post } = require("../../models");

const { paginate } = require("../../utils/pagination");

const { createLogFile } = require("../../utils/create_logs");

const file_name = "post";
const file_path = "v1_controller";

module.exports.createPost = async (req, res) => {
  try {
    const { id } = req?.user;

    const { post_name, description, tags } = req.body;

    let parsedTags = [];

    // Convert tags string to array
    if (tags) {
      try {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
        if (!Array.isArray(parsedTags)) parsedTags = [parsedTags];
      } catch (e) {
        parsedTags = [];
      }
    }

    let imageUrl = null;

    // If image is uploaded
    if (req.file) {
      imageUrl = `${process.env.HOST_URL}/${req.file.path.replace(/\\/g, "/")}`;
    }

    const post = await Post.create({
      userId: id,
      postName: post_name,
      description,
      tags: parsedTags,
      imageUrl,
    });

    return res.status(201).json({
      status: true,
      data: post,
      message: "Post created successfully",
    });
  } catch (error) {
    await createLogFile("createPost", error, file_name, file_path);
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

module.exports.getPosts = async (req, res) => {
  try {
    const {
      searchText = "",
      startDate,
      endDate,
      tags,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    //Search by text
    if (searchText) {
      filter.$or = [
        { postName: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } },
      ];
    }

    //Date filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    //Tag filter
    if (tags) {
      let parsedTags = [];
      try {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
      } catch {}

      if (parsedTags.length > 0) {
        filter.tags = { $in: parsedTags };
      }
    }

    //Use global pagination
    const result = await paginate(Post, filter, {
      page,
      limit,
      sort: { createdAt: -1 },
    });
    console.log("🚀 ~ post.js:103 ~ result:", result)

    return res.status(200).json({
      status: true,
      data: result.data,
      pagination: result.pagination,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    await createLogFile("getPosts", error, file_name, file_path);
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};
