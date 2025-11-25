module.exports = (err, req, res, next) => {
  console.error("Global Error:", err);

  return res.status(err.status || 500).json({
    status: false,
    message: err.message || "Internal server error",
  });
};
