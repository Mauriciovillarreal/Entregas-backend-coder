function authAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    return next()
  }
  return res.status(401).send('error de autorización')
}

const authUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.session.user 
    req.user = user 
    return next()
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports = { authAdmin, authUser }
