const express = require('express');
const {
  getUsers,
  getUser,
  getMe,
  updateMe
} = require('../controllers/usercontroller');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

// All routes below this are protected
router.use(protect);

// Routes for the current logged-in user
router.get('/me', getMe);
router.put('/me', updateMe);

// Routes restricted to Admins
router.use(restrictTo('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser);

module.exports = router;
