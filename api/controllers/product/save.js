const errorMessages = {
  invalidBarcode: 'Invalid barcode.',
  invalidProductName: 'Invalid product name.',
  invalidBrand: 'Invalid brand.',
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

    brand: {
      type: 'string',
      example: 'Colgate',
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
    const { barcode, productName, brand } = inputs;

    if (!barcode || barcode.length < 10) {
      throw exits.validationError(errorMessages.invalidBarcode);
    }
    else if (!productName || productName.trim().length <= 2) {
      throw exits.validationError(errorMessages.invalidProductName);
    }
    else if (brand && brand.trim().length === 0) {
      throw exits.validationError(errorMessages.invalidBrand);
    }

    try {
      const checkIfExistingProduct = await Product.findOne({ barcode });

      if (checkIfExistingProduct && checkIfExistingProduct.productName) {
        exits.alreadyExists(errorMessages.alreadyExists + checkIfExistingProduct.productName);
        return;
      }

      const newProduct = await Product.create({ barcode, productName, brand: brand || '' });

      exits.successWithData(newProduct);
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }
};
