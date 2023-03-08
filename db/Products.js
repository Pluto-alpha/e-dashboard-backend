const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory!"]
    },
    price: {
        type: Number,
        required: [true, "price is mandatory!"]
    },
    category: {
        type: String,
        required: [true, "category is mandatory!"]
    },
    company: {
        type: String,
        required: [true, "company name is mandatory!"]
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('products', ProductsSchema);