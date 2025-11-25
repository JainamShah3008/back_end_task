const router = require("express").Router();
const userAuth = require("../../middlewares/auth");
const uploadTo = require("../../middlewares/multer");

const postController = require("../../controllers/v1/post");

const validate = require("../../middlewares/validate");
const {
  createPostValidation,
} = require("../../middlewares/validations/v1/post_validation");

router.post(
  "/post-create",
  userAuth,
  uploadTo("posts").single("post_image"),
  validate(createPostValidation),
  postController.createPost
);

router.get("/get-posts", userAuth, postController.getPosts);

module.exports = router;
