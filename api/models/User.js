
module.exports = {

  attributes: {

    username: {
      type: 'string',
      required: true,
      maxLength: 200,
      example: 'bharat'
    },

    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },

    userType: {
      type: 'string',
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
    },

    token: {
      type: 'string',
      description: 'Users token on login',
    }
  },
};
