const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cited = sequelize.define("Cited", {
    cited_id: {
         type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    cited_title: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    cited_host: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    articleId: {
        type: DataTypes.UUID,
    }
})

module.exports = Cited