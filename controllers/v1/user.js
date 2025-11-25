const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");

const { createLogFile } = require("../../utils/create_logs");

const file_name = "user";
const file_path = "v1_controller";

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        status: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      status: true,
      data: { token, user },
      message: "Signup successful",
    });
  } catch (error) {
    //Save error log in db
    await createLogFile("signup", error, file_name, file_path);
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid password.",
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Success response
    return res.status(200).json({
      status: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      message: "Login successful",
    });
  } catch (error) {
    await createLogFile("login", error, file_name, file_path);
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};
