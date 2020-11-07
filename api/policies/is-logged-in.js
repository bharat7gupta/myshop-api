const jwt = require('jsonwebtoken');

/**
 * is-logged-in
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, proceed) {

  if (req.headers['token']) {
    try {
      const decoded = jwt.verify(req.headers['token'], sails.config.custom.jwtKey);
      const userRecord = await User.findOne({
        username: decoded.username,
        userType: decoded.type,
      });

      if (userRecord) {
        return proceed();
      }
    } catch(e) {
      return res.unauthorized({ code: 'FORBIDDEN', message: 'You would need to log in.' });    
    }
  }

  //--•
  // Otherwise, this request did not come from a logged-in user.
  return res.unauthorized({ code: 'FORBIDDEN', message: 'You would need to log in.' });

};
