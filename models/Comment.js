const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Please provide a comment.'],
    maxlength: 250,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // points to the User who made the comment
    ref: 'User',
    required: [true, 'Please provide the user who created the comment.']
  },
  location: {
    type: String,                         // match this type to the Location _id type
    ref: 'Location',                      // reference to Location model
    required: [true, 'Please specify the location this comment belongs to.']
  },
}, { timestamps: true });                 // Generate 'createdAt' and 'updatedAt' by default

module.exports = mongoose.model('Comment', CommentSchema);
