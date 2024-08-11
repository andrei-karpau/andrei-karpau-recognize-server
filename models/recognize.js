const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recognize = new Schema ({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    owner: { type: mongoose.Types.ObjectId, require: true, ref: 'userCollection' },
    error: { type: String, required: false },
    public_id: { type: String, required: false },
    status: { type: String, required: false },
    fileName: { type: String, required: false }
});

module.exports = mongoose.model('Task', taskSchema);