const authUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.session.passport.user
    req.user = user
    return next()
  } else {
    return res.status(401).send('error de autorización')
  }
}

function authAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    return next()
  }
  return res.status(401).send('error de autorización')
}

const authPremium = (req, res, next) => {
  if (req.user?.role === 'premium') {
    return next()
  }
  return res.status(401).send('error de autorización')
}

module.exports = { authAdmin, authUser, authPremium }
