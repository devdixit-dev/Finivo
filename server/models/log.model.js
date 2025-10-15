import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  method: {
    type: String
  },
  url: {
    type: String
  }
});

const Log = mongoose.model('Log', logSchema);

export default Log;