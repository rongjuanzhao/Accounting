import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

export default mongoose.model('Bill', billSchema); 