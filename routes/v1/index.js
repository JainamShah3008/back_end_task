const router = require("express").Router();

const userRoute = require("./user");
const postRoute = require("./post");

router.use("/user", userRoute);
router.use("/post", postRoute);

module.exports = router;
