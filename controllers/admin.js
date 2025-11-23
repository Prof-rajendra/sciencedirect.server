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

    // Normalize title to reduce accidental duplicates (trim)
    const normalizedTitle = title.trim();

    // Use a transaction + findOrCreate to avoid race conditions
    const transaction = await Article.sequelize.transaction();
    try {
      const [article, created] = await Article.findOrCreate({
        where: { title: normalizedTitle },
        defaults: {
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
      }

      // handle Reference
      const [reference] = await Reference.findOrCreate({
        where: { articleId: article.id },
        defaults: { reference_author, reference_title, reference_host, articleId: article.id },
        transaction
      });
      if (!reference.reference_author) {
        await reference.update({ reference_author, reference_title, reference_host }, { transaction });
      }

      // handle Cited
      const [cited] = await Cited.findOrCreate({
        where: { articleId: article.id },
        defaults: { cited_title, cited_host, articleId: article.id },
        transaction
      });
      if (!cited.cited_title) {
        await cited.update({ cited_title, cited_host }, { transaction });
      }

      await transaction.commit();

      return res.status(created ? 201 : 200).json({
        message: created ? "Article created successfully" : "Article updated successfully",
        article,
        reference,
        cited,
      });
    } catch (err) {
      await transaction.rollback();
      // Unique constraint errors may still happen under race conditions
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Article with this title already exists' });
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