const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cited = sequelize.define("Cited", {
    cited_id: {
         type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    cited_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cited_host: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    articleId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
})

module.exports = Cited