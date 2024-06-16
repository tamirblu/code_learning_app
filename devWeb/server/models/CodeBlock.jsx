const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator')

// mongoose.set('strictQuery', false)

const CodeBlockSchema = new mongoose.Schema({
    index: Number,
    title: String,
    code: String
});
CodeBlockSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const CodeBlock = mongoose.model('CodeBlock', CodeBlockSchema);

module.exports = CodeBlock;

// export const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema)
// Import mongoose

// Define the schema


// Define the model

// Export the model
