const errorMessages = {
  serverError: 'Server Error. Try again later or please call 8105479727',
};

module.exports = {

  friendlyName: 'Status',

  description: 'Status inventory.',

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
      const allInventory = await InventoryStatus.find({});

      exits.successWithData(allInventory.map(inv => ({
        barcode: inv.barcode,
        mrp: inv.mrp,
        purchasePrice: inv.purchasePrice,
        sellingPrice: inv.sellingPrice,
        quantity: inv.quantity,
      })));

    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
