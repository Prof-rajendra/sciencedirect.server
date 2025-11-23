const Article = require("../models/Article.js");
const Reference = require("../models/Reference.js");
const Cited = require("../models/Cited.js");
const Admin = require("../models/Admin.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const checkAdmin = await Admin.findOne({ where: { username } });

        if (!checkAdmin) {
            return res.status(401).json({ message: "Admin doesn't exist." });
        }

        // If using plaintext (not recommended)
        // if (checkAdmin.password !== password) {
        //     return res.status(401).json({ message: "Invalid username or password." });
        // }

        // If using hashed passwords
        const validPassword = await bcrypt.compare(password, checkAdmin.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign(
            { id: checkAdmin.id, username: checkAdmin.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.createArticle = async (req, res) => {
  try {
    const {
      journalTitle,
      title,
      coverImage,
      volume,
      part,
      date,
      authors,
      authors_university,
      link,
      highlight,
      introduction,
      abstract,
      reference_author,
      reference_title,
      reference_host,
      cited_title,
      cited_host,
      issue_title,
      issue_author_details
    } = req.body;

    // Validate required fields (keep as before)
    if (
      !journalTitle ||
      !title ||
      !coverImage ||
      !volume ||
      !part ||
      !date ||
      !authors ||
      !authors_university ||
      !link ||
      !highlight ||
      !introduction ||
      !abstract ||
      !reference_author ||
      !reference_title ||
      !reference_host
    ) {
      return res.status(400).json({
        message: "All required fields are missing or invalid",
      });
    }

    const normalizedTitle = title.trim();

    // Find existing article — do not create a new one
    const existingArticle = await Article.findOne({ where: { title: normalizedTitle } });
    if (!existingArticle) {
      return res.status(404).json({
        message: "Article not found. This endpoint only updates existing articles.",
      });
    }

    const transaction = await Article.sequelize.transaction();
    try {
      // Update article columns
      const updatedArticle = await existingArticle.update({
        journalTitle,
        title: normalizedTitle,
        coverImage,
        volume,
        part,
        date,
        authors,
        authors_university,
        link,
        highlight,
        introduction,
        abstract,
        issue_title,
        issue_author_details
        },
        transaction
      });

      if (!created) {
        // Update existing article
        await article.update({
          journalTitle,
          coverImage,
          volume,
          part,
          date,
          authors,
          authors_university,
          link,
          highlight,
          introduction,
          abstract,
          issue_title,
          issue_author_details
      }, { transaction });

      // Update or create Reference for this article
      let reference = await Reference.findOne({ where: { articleId: updatedArticle.id }, transaction });
      if (reference) {
        await reference.update({ reference_author, reference_title, reference_host }, { transaction });
      } else {
        reference = await Reference.create({
          reference_author,
          reference_title,
          reference_host,
          articleId: updatedArticle.id
        }, { transaction });
      }

      // Update or create Cited for this article
      let cited = await Cited.findOne({ where: { articleId: updatedArticle.id }, transaction });
      if (cited) {
        await cited.update({ cited_title, cited_host }, { transaction });
      } else {
        cited = await Cited.create({
          cited_title,
          cited_host,
          articleId: updatedArticle.id
        }, { transaction });
      }

      await transaction.commit();

      return res.status(200).json({
        message: "Article updated successfully",
        article: updatedArticle,
        reference,
        cited,
      });
    } catch (err) {
      await transaction.rollback();
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Conflict updating article (unique constraint).' });
      }
      throw err;
    }

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [
        { model: Reference, as: "references" },
        { model: Cited, as: "cited" },
      ],
      order: [
        ["updatedAt", "DESC"],
        ["createdAt", "DESC"]
      ],
    });
    res.status(200).json({
      articles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id, {
      include: [
        { model: Reference, as: "references" },
        { model: Cited, as: "cited" },
      ],
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json({
      article,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Delete article by ID
exports.deleteArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }
    await article.destroy();
    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: "Name, username, and password are required." });
    }
    // Check if username already exists
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(409).json({ message: "Username already exists." });
    }
    const newAdmin = await Admin.create({ name, username, password });
    res.status(201).json({
      message: "Admin created successfully",
      admin: { id: newAdmin.id, name: newAdmin.name, username: newAdmin.username }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};