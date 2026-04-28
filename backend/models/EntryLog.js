const mongoose = require('mongoose');

const entryLogSchema = new mongoose.Schema({
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // flat owner
  flatNumber: String,
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  status: {
    type: String,
    enum: ['entered', 'exited', 'denied'],
    default: 'entered'
  },
  gatePassNumber: String,
  loggedBy: { type: String, default: 'system' }
}, { timestamps: true });

module.exports = mongoose.model('EntryLog', entryLogSchema);
