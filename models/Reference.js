const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reference = sequelize.define("Reference", {
    reference_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    reference_author: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    }, 
    reference_title: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    reference_host: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    articleId: {
        type: DataTypes.UUID,
    }
})

module.exports = Reference