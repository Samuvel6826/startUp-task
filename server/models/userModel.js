const mongoose = require('mongoose');

// User Schema
const usersSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    trim: true
  },
  age: {
    type: Number,
    default: null,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: 'Prefer not to say',
    trim: true
  },
  subject: {
    type: String,
    enum: ['Tamil', 'English', 'Mathematics', 'Science', 'Social'],
    required: [true, 'Subject is required'],
    trim: true
  },

  marks: {
    type: Number,
    default: 0,
    required: [true, 'Marks is required'],
    trim: true
  },


},
  {
    versionKey: false,
    collection: 'test-1',
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false }
  });

// User Model
const usersModel = mongoose.model('test-1', usersSchema);
module.exports = usersModel;