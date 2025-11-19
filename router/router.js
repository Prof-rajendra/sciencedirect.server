const router = require('express').Router();
const { login, createArticle, getAllArticles, getArticleById } = require('../controllers/admin');
const authMiddleware = require('../middleware/middleware');

router.post('/articles', authMiddleware, createArticle );
router.get('/articles', getAllArticles );
router.get('/articles/:id', getArticleById );

router.get('/', (req, res) => {
    res.send('Admin Router is working');
});
router.post('/login', login );
module.exports = router;