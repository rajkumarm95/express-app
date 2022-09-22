const mongoose = require('mongoose')
/**
 * @schema productSchema
 */
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    published: Boolean,
    image: String,
    createdAt: {
        type: Date,
        default: () => Date.now(),
      },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
      },
});

module.exports = mongoose.model('Product', productSchema)