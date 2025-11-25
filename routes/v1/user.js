const router = require("express").Router();
const userAuth = require("../../middlewares/auth");

const userController = require("../../controllers/v1/user");

const validate = require("../../middlewares/validate");
const {
  signupValidation,
  loginValidation,
} = require("../../middlewares/validations/v1/user_validation");

router.post("/signup", validate(signupValidation), userController.signup);

router.post("/login", validate(loginValidation), userController.login);

module.exports = router;
