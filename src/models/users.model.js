const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    first_name: String,
    last_name: String,
    email: { 
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: { 
        type: String, 
        required: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
        required: true
    }
});

userSchema.pre('find', function (next) {
    this.populate('cart');
    next();
});

const usersModel = model('users', userSchema);

module.exports = {
    usersModel
}