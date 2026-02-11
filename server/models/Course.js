const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, 
  duration: String, 
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  oldPrice: Number,
  thumbnail: String,
  isBundle: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  
  lessons: [LessonSchema],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);