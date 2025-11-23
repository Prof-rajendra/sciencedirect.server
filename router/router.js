const router = require('express').Router();
const { login, createArticle, getAllArticles, getArticleById, createAdmin, deleteArticleById } = require('../controllers/admin');
const authMiddleware = require('../middleware/middleware');

router.post('/articles', authMiddleware, createArticle );
router.get('/articles', getAllArticles );
router.get('/articles/:id', getArticleById );
router.post('/admin', createAdmin);
router.delete('/articles/:id', authMiddleware, deleteArticleById );
router.post('/login', login );

router.get('/', (req, res) => {
    res.send('Admin Router is working');
});
module.exports = router;