// Import the required module
const mongoose = require('mongoose');

// Define the schema for the CodeBlock model
const CodeBlockSchema = new mongoose.Schema({
    index: { type: String, unique: true },
    title: { type: String, unique: true },
    code: String
});
// Define the toJSON method to format the returned object
CodeBlockSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
// Define the CodeBlock model
const CodeBlock = mongoose.model('CodeBlock', CodeBlockSchema);

module.exports = CodeBlock;
