const { Post } = require("../../models");
const { paginate } = require("../../utils/pagination");
const { uploadToImageKit } = require("../../utils/upload");
const { createLogFile } = require("../../utils/create_logs");
const { parseDate } = require("../../utils/common");

const file_name = "post";
const file_path = "v1_controller";

module.exports.createPost = async (req, res) => {
  try {
    const { id } = req.user;
    const { post_name, description, tags } = req.body;

    //Parse tags safely
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : [...tags];

        if (!Array.isArray(parsedTags)) {
          parsedTags = [parsedTags];
        }
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: "Tags must be a valid JSON array",
        });
      }
    }

    //Image Upload to ImageKit
    let imageUrl = null;

    if (req.file) {
      const uploadResult = await uploadToImageKit(req.file.path);

      if (!uploadResult.status) {
        return res.status(400).json({
          status: false,
          message: "Image upload failed, try again",
        });
      }

      imageUrl = uploadResult.url;
    }

    //Create Post Document
    const newPost = await Post.create({
      userId: id,
      postName: post_name,
      description,
      tags: parsedTags,
      imageUrl,
      uploadTime: new Date(),
    });

    return res.status(201).json({
      status: true,
      data: newPost,
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
    const { id } = req.user;
    const {
      searchText = "",
      startDate,
      endDate,
      tags,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Filter by user_id if provided
    if (id) {
      filter.userId = id;
    }

    //Search by text
    if (searchText) {
      filter.$or = [
        { postName: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } },
      ];
    }

    // Date filter
    if (startDate || endDate) {
      filter.uploadTime = {};

      const start = parseDate(startDate);
      const end = parseDate(endDate);

      if (start) filter.uploadTime.$gte = start;

      if (end) {
        end.setHours(23, 59, 59, 999); // include whole day
        filter.uploadTime.$lte = end;
      }
    }

    // Tag filter
    if (tags) {
      let parsedTags = [];

      try {
        // If tags is JSON array → ["a","b"]
        if (tags.startsWith("[") && tags.endsWith("]")) {
          parsedTags = JSON.parse(tags);
        }
        // If tags is single string → "jain"
        else {
          parsedTags = [tags];
        }
      } catch {
        parsedTags = [tags]; // fallback
      }

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
