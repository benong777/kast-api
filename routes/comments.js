const express = require('express');
const router = express.Router({ mergeParams: true });   // mergeParams needed to access :locationId from parent routes

const {
  getAllComments,
  getComment,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/comments');

// Define comment routes relative to /:locationId/comments/
// e.g. POST /:locationId/comments
router.route('/').post(createComment).get(getAllComments);    /*  '/:locationId/comments'  */
router.route('/:commentId').get(getComment).delete(deleteComment).patch(updateComment);

module.exports = router;