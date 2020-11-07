const jwt = require('jsonwebtoken');

const errorMessages = {
  success: 'Logged out successfully',
  serverError: 'Server Error. Try again later or please call 8105479727',
};

module.exports = {

  friendlyName: 'Logout',

  description: 'Log out of this app.',

  extendedDescription: ``,

  exits: {
    success: {
      statusCode: 200,
      responseType: 'success',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    }
  },

  fn: async function () {
    try {
      const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
      const { username } = decodedData;

      await User.updateOne({ username }).set({ token: '' });

      exits.success(errorMessages.success);
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }

  }

};
