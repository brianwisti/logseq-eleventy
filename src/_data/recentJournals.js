// Just the journal pages

const journals = require("./journals.js");

module.exports = function () {
  return journals().slice(0, 5);
};
