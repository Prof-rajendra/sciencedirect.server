const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Article = sequelize.define("Article", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    journalTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    volume: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    part: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    authors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    authors_university: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    highlight: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    introduction: {
        type: DataTypes.STRING,
    },
    abstract: {
        type: DataTypes.STRING,
    },
})

module.exports = Article;
