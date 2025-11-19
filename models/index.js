const Article = require('./Article');
const Reference = require('./Reference');
const Cited = require('./Cited');

Article.hasMany(Reference, { foreignKey: "articleId", as: "references" });
Reference.belongsTo(Article, { foreignKey: "articleId", as: "article" });

Article.hasMany(Cited, { foreignKey: "articleId", as: "cited" });
Cited.belongsTo(Article, { foreignKey: "articleId", as: "article" });