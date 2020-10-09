const successMessage = (res, message) => {
  res.status(200).json({ success: true, message });
};

const errorMessage = (res, message) => {
  res.status(400).json({ success: false, message });
};

module.exports = { successMessage, errorMessage };
