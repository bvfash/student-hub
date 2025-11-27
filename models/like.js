const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
    // junction
  }, {
    timestamps: true
  });

  return Like;
};
