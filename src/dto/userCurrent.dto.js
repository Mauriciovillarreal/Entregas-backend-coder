class UserCurrentDto {
    constructor(user) { 
        this._id = user._id
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.role = user.role
        this.cart = user.cart,
        this.fullname = `${user.first_name} ${user.last_name}`
    }
}

module.exports = UserCurrentDto
