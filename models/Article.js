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
        unique: true // added: ensure DB enforces uniqueness
    },
    coverImage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    volume: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    part: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.STRING,
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
        type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    introduction: {
        type: DataTypes.TEXT,
    },
    abstract: {
        type: DataTypes.TEXT,
    },
    issue_title: {
        type: DataTypes.STRING,
    },
    issue_author_details:{
        type: DataTypes.TEXT,
    }
})

module.exports = Article;
