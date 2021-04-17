const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const config = require('config')

module.exports = async (req, res, next) => {
  // Get the access and refresh token from cookies
  let accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  // Check if access token is present
  if (!accessToken) {
    const err = new Error('Not Authenticated')
    err.statusCode = 403
    next(err)
    return err
  }
  try {
    try {
      // Verify the access token
      const decodedAccessToken = jwt.verify(accessToken, config.get('accessToken.secret'))

      // Get the user id from the payload of access token
      req.userId = decodedAccessToken.userId
    } catch (err) {
      // Generate the new access token only if it is expired and not if it is invalid
      if (err.name !== 'TokenExpiredError') {
        throw err
      }

      // Check if refresh token is present
      if (!refreshToken) {
        const err = new Error('Not Authenticated')
        err.statusCode = 403
        throw err
      }

      // Verify the refresh token
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        config.get('refreshToken.secret')
      )

      // Get the user id from the payload of refresh token
      req.userId = decodedRefreshToken.userId

      // Generate the new access token
      const newAccessTokenId = uuidv4()
      accessToken = jwt.sign({
        userId: decodedRefreshToken.userId,
        sessionId: newAccessTokenId
      },
        config.get('accessToken.secret'),
        { expiresIn: config.get('accessToken.expiry') })

      // Store the access token into the cookie
      res.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 60 * 60 * 1000)
      })
    }
  } catch (err) {
    err.statusCode = 401
    next(err)
    return err
  }
  next()
}
