const jwt = require('jsonwebtoken');

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

    usernameOrMobileRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    badUsernamePasswordCombo: {
      statusCode: 403,
      responseType: 'unauthorized'
    },
  },

  fn: async function (inputs) {

    const jwtKey = sails.config.custom.jwtKey;

    const user = await User.findOne({ username: 'inventory' });

    this.res.json(user);

  }

};
