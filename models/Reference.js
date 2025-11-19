const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reference = sequelize.define("Reference", {
    reference_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    reference_author: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    reference_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reference_host: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    articleId: {
        type: DataTypes.UUID,
        allowNull: false,
    }
})

module.exports = Reference