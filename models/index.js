const { Sequelize } = require('sequelize');
const path = require('path');

const dbFile = process.env.DATABASE_FILE || 'database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', dbFile),
  logging: false
});

const User = require('./user')(sequelize);
const Post = require('./post')(sequelize);
const Comment = require('./comment')(sequelize);
const Like = require('./like')(sequelize);

User.hasMany(Post, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

User.belongsToMany(Post, { through: Like, as: 'LikedPosts', foreignKey: 'userId' });
Post.belongsToMany(User, { through: Like, as: 'Likers', foreignKey: 'postId' });

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Like
};
