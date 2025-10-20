const Location = require('../models/Location');   // Location Model
const Comment = require('../models/Comment');   // Comment Model
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllComments = async (req, res) => {
  const comments = await Comment.find({ location: req.params.locationId }).populate('createdBy', 'name email').sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ comments, count: comments.length });
};

const getComment = async (req, res) => {
  const { commentId, locationId } = req.params;

  const comment = await Comment.findOne({ _id: commentId, location: req.params.locationId })
    .populate('createdBy', 'name email')    // show who created it
    .populate('location', 'name address');  // show location info

  if (!comment) {
    throw new NotFoundError(`No comment with id ${commentId}`)
  }
  res.status(StatusCodes.OK).json({ comment })
};

const createComment = async (req, res) => {
  const locationId = req.params.locationId;  // from route param
  const userId = req.user.userId;            // set by auth middleware
  const { comment } = req.body;

  // Verify target location exists
  const location = await Location.findById(locationId);
  if (!location) {
    throw new NotFoundError(`No location with id: ${locationId}`);
  }

  // Create comment linked to location and user
  const newComment = await Comment.create({
    location: locationId,
    createdBy: userId,
    comment
  });

  res.status(StatusCodes.CREATED).json({ comment: newComment });
};

const updateComment = async (req, res) => {
  const {
    body: { comment },
    user: { userId },
    params: { commentId },
  } = req;

  if (!comment) {
    throw new BadRequestError('Comment field cannot be empty.');
  }

  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId, createdBy: userId },
    req.body,
    {                       // ***** OPTIONAL *****
      new: true,            // return new updated comment if successful
      runValidators: true,  // Run validation defined in ../models/Comment.js
    }
  );

  if (!updatedComment) {
    throw new NotFoundError(`No comment with id ${commentId}`);
  }

  res.status(StatusCodes.OK).json({ comment: updatedComment });
};

const deleteComment = async (req, res) => {
  const {
    user: { userId },       // nested destructuring - getting from Auth middleware
    params: { commentId }   // destructure the id from the route  '/:id' and rename to 'commentId'
  } = req

  const comment = await Comment.findOneAndDelete({ _id: commentId, createdBy: userId });

  if (!comment) {
    throw new NotFoundError(`No comment with id ${commentId}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'Comment deleted successfully'});
};

module.exports = {
  getAllComments,
  getComment,
  createComment,
  updateComment,
  deleteComment
}