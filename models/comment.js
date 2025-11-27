const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    text: { type: DataTypes.TEXT, allowNull: false }
  }, {
    timestamps: true
  });

  return Comment;
};
