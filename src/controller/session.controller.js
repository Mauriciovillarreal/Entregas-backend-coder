const passport = require('passport')
const UserCurrentDto = require('../dto/userCurrent.dto')
const { usersModel } = require('../dao/MONGO/models/users.model')

class SessionController {
  githubAuth = passport.authenticate('github', { scope: 'user:email' })

  githubCallback = (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/login' }, async (err, user) => {
      if (err) {
        console.error('Error en autenticación de GitHub:', err)
        return res.status(500).json({ message: 'Authentication error' })
      }
      if (!user) {
        console.log('No se encontró usuario')
        return res.redirect('/login')
      }
      req.logIn(user, async (err) => {
        if (err) {
          console.error('Error al iniciar sesión:', err)
          return res.status(500).json({ message: 'Login error' })
        }
        // Actualizar la última conexión
        user.last_connection = new Date()
        await user.save()

        console.log('Sesión iniciada correctamente:', user)
        req.session.user = user
        return res.redirect('http://localhost:5173/')
      })
    })(req, res, next)
  }

  getCurrentUser = async (req, res) => {
    if (req.isAuthenticated()) {
      const userDto = new UserCurrentDto(req.user)
      res.json({ user: userDto })
    } else {
      res.status(401).json({ error: 'Not authenticated' })
    }
  }

  login = (req, res, next) => {
    passport.authenticate('login', async (error, user, info) => {
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' })
      }
      if (!user) {
        return res.status(401).json({ error: 'Email or password incorrect' })
      }
      req.logIn(user, async (error) => {
        if (error) {
          return res.status(500).json({ error: 'Internal Server Error' })
        }
        // Actualizar la última conexión
        user.last_connection = new Date()
        await user.save()

        return res.status(200).json({
          message: 'Login successful',
          first_name: user.first_name,
          email: user.email,
          role: user.role,
          last_name: user.last_name,
          cart: user.cart
        })
      })
    })(req, res, next)
  }

  register = (req, res, next) => {
    passport.authenticate('register', (error, user, info) => {
      if (error) {
        return next(error)
      }
      if (!user) {
        return res.status(400).json({ message: 'Error registering user' })
      }
      req.logIn(user, (error) => {
        if (error) {
          return next(error)
        }
        return res.status(200).json({ success: true, message: 'User registered successfully' })
      })
    })(req, res, next)
  }

  logout = (req, res) => {
    const userId = req.user._id // Obtener el ID del usuario para actualizar la última conexión
    req.session.destroy(async (error) => {
      if (error) {
        return res.status(500).json({ status: 'error', error: error.message })
      } else {
        // Actualizar la última conexión en logout
        await usersModel.findByIdAndUpdate(userId, { last_connection: new Date() })

        return res.status(200).json({ status: 'success', message: 'Logout successful' })
      }
    })
  }
}

module.exports = new SessionController()
