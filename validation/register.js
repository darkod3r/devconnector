const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!validator.isLength(data.name, { min: 0, max: 32 })) {
    errors.name = "name must be between 2 and 32 chars";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
