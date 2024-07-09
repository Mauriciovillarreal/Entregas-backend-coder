const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: { type: Number, default: 1 },
            name: String
        }
    ]
});

// Middleware to populate product details in different find queries
const autoPopulateProducts = function (next) {
    this.populate('products.product');
    next();
};

cartSchema.pre('find', autoPopulateProducts);
cartSchema.pre('findOne', autoPopulateProducts);
cartSchema.pre('findById', autoPopulateProducts);

const cartModel = mongoose.model('carts', cartSchema);

module.exports = { cartsModel: cartModel };
