const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  age: { type: Number, default: 0 },
  gender: { type: String, default: '' },
  height: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  goalWeight: { type: Number, default: 0 },
  activityLevel: { type: String, default: 'moderate' },
  dietPreference: { type: String, default: 'balanced' },
  medicalConditions: { type: String, default: '' },
  allergies: { type: String, default: '' },
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
