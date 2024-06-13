const mongoose = require('mongoose');

const codeBlockSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true }
});

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema);

module.exports = CodeBlock;
