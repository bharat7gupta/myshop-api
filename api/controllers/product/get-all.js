const errorMessages = {
  serverError: 'Server Error. Try again later or please call 8105479727',
};

module.exports = {

  friendlyName: 'Get all products',

  description: 'Get all products',

  inputs: {

  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },
  },

  fn: async function (inputs, exits) {
    try {
      const allProducts = await Product.find({});

      exits.successWithData(allProducts.map(p => ({
        barcode: p.barcode,
        productName: p.productName,
        productShortName: p.productShortName,
      })));

    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
