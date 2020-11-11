const errorMessages = {
  serverError: 'Server Error. Try again later or please call 8105479727',
  barcodeNotPresent: 'Invalid barcode: ',
  noProducts: 'No products provided',
};

module.exports = {

  friendlyName: 'Add',

  description: 'Add inventory.',

  inputs: {
    products: {
      type: 'json'
    }
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

    barcodeNotPresent: {
      statusCode: 400,
      responseType: 'validationError',
    },

    noProducts: {
      statusCode: 400,
      responseType: 'validationError',
    },

  },

  fn: async function (inputs, exits) {
    const { products = [] } = inputs;

    if (products.length === 0) {
      exits.noProducts(errorMessages.noProducts);
      return;
    }

    try {
      // check if all barcodes are existing
      const barcodes = products.map(p => p.barcode);
      const barcodeListStr = barcodes.map(barcode => `'${barcode}'`).join('');
      const barcodesQuery = 'select barcode from product where barcode in (' + barcodeListStr + ');';
      const barcodesResult = await sails.sendNativeQuery(barcodesQuery);

      if (barcodesResult.rows.length < barcodes.length) {
        let barcodeNotPresent = '';

        for(let i=0; i<barcodes.length; i++) {
          const barcodeExists = barcodesResult.rows.find(barcode => barcode === barcodes[i]);

          if (!barcodeExists) {
            barcodeNotPresent = barcodes[i];
            break;
          }
        }

        exits.barcodeNotPresent(errorMessages.barcodeNotPresent + barcodeNotPresent);
        return;
      }

      // fetch inventory status
      const inventoryStatus = await InventoryStatus.find({
        where: { barcode : barcodes },
        select: ['barcode', 'mrp', 'purchasePrice', 'sellingPrice', 'quantity'],
      });

      const newInventory = await InventoryMaster.create({}).fetch();
      const inventoryId = newInventory.id;

      for (let i=0; i<products.length; i++) {
        const { barcode, mrp, purchasePrice, sellingPrice, quantity } = products[i];

        const inventoryProduct = await InventoryEntry.create({
          inventoryId,
          barcode,
          mrp,
          purchasePrice,
          sellingPrice,
          quantity
        })
        .fetch();

        // insert if record does not exist else update existing record
        const isExistingRecord = inventoryStatus && inventoryStatus.find(is => is.barcode === barcode);

        if (isExistingRecord) {
          await InventoryStatus.updateOne({ barcode })
            .set({ mrp, purchasePrice, sellingPrice, quantity });
        } else {
          await InventoryStatus.create(
            { barcode, mrp, purchasePrice, sellingPrice, quantity }
          ).fetch();
        }
      }

      exits.successWithData(newInventory);
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
