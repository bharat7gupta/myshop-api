const jwt = require('jsonwebtoken');

const errorMessages = {
  invalidUsernameOrPassword: 'Invalid username or password.',
  serverError: 'Server Error. Try again later or please call 8105479727',
};

module.exports = {

  friendlyName: 'Login',

  description: 'Login account.',

  inputs: {
    username: {
      type: 'string',
      description: 'Unique username',
    },

    password: {
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".'
    },
  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },

    invalidUsernameOrPassword: {
      statusCode: 400,
      responseType: 'validationError',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },
  },

  fn: async function (inputs, exits) {

    const { username, password } = inputs;

    const jwtKey = sails.config.custom.jwtKey;

    try {
      const user = await User.findOne({ username, password });

      if (!user) {
        exits.invalidUsernameOrPassword(errorMessages.invalidUsernameOrPassword);
        return;
      }

      const token = jwt.sign(
        { username, type: user.userType },
        jwtKey,
        { expiresIn: '365d' }
      );

      await User.updateOne({ username }).set({ token });

      exits.successWithData({ username: user.displayUsername, token });
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }

  }

};
