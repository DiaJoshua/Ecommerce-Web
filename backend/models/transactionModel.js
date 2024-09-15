const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true }, // Change to String if you are sending phone as a string
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  address: { type: String, required: true },
  transactionId: { type: String, required: true },
  status: { type: String, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);