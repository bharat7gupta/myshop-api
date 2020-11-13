const errorMessages = {
  invalidBarcode: 'Invalid barcode.',
  invalidProductName: 'Invalid product name.',
  invalidProductShortName: 'Invalid product short name.',
  alreadyExists: 'Product already exists with name: ',
  serverError: 'Server Error. Try again later or please call 8105479727',
};

module.exports = {

  friendlyName: 'Save product',

  description: 'Save product.',

  inputs: {
    barcode: {
      type: 'string',
      example: '800100024728',
    },

    productName: {
      type: 'string',
      example: 'Colgate Salt',
    },

    productShortName: {
      type: 'string',
      example: 'CLGT SLT',
    },

    size: {
      type: 'string',
      example: '200g, 500ml, 10N',
    },
  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },

    validationError: {
      statusCode: 400,
      responseType: 'validationError',
    },

    alreadyExists: {
      statusCode: 400,
      responseType: 'validationError',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },
  },

  fn: async function (inputs, exits) {
    const { barcode, productName, productShortName = '', size = '' } = inputs;

    if (!barcode || barcode.length < 10) {
      throw exits.validationError(errorMessages.invalidBarcode);
    }
    else if (!productName || productName.trim().length <= 2) {
      throw exits.validationError(errorMessages.invalidProductName);
    }
    else if (productShortName && productShortName.trim().length === 0) {
      throw exits.validationError(errorMessages.invalidProductShortName);
    }

    try {
      const checkIfExistingProduct = await Product.findOne({ barcode });

      if (checkIfExistingProduct && checkIfExistingProduct.productName) {
        await Product.updateOne({ barcode }).set({ productName, productShortName, size });

        exits.successWithData({ ...checkIfExistingProduct, productName, productShortName });
        return;
      }

      const newProduct = await Product.create({ barcode, productName, productShortName, size });

      exits.successWithData({ barcode, productName, productShortName, size });
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }
};
