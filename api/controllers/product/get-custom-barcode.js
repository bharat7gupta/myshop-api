const CUSTOM_BARCODE_PREFIX = '999';
const CUSTOM_BARCODE_SUFFIX = '999';

const errorMessages = {
  serverError: 'Server Error. Try again later or please call 8105479727',
};

module.exports = {

  friendlyName: 'Get custom barcode',

  description: '',

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
    let newCode = 0;
    let newBarcode = '';
    let padZeros = '';

    try {
      const barcodes = await sails.sendNativeQuery("select barcode from product where barcode like '999%999';");

      if (!barcodes || barcodes.rows.length === 0) {
        newCode = "1";
      } else {
        let code = '';

        for(let i=0; i<barcodes.rows.length; i++) {
          code = barcodes.rows[i].barcode.substr(3, 7);
          newCode = newCode < Number(code) ? Number(code) : newCode;
        }

        newCode = "" + (Number(newCode) + 1);
      }

      for (let i=0; i<7 - newCode.length; i++) {
        padZeros += '0';
      }

      newBarcode = `${CUSTOM_BARCODE_PREFIX}${padZeros}${newCode}${CUSTOM_BARCODE_SUFFIX}`;

      exits.successWithData({
        customBarcode: newBarcode,
      });
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
