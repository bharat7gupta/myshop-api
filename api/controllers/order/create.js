const errorMessages = {
  serverError: 'Server Error. Try again later or please call 8105479727',
  barcodeNotPresent: 'Invalid barcode: ',
  noProducts: 'No products provided',
};

module.exports = {

  friendlyName: 'Create Order',

  description: 'Create Order.',

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

    noProducts: {
      statusCode: 400,
      responseType: 'validationError',
    },

    barcodeNotPresent: {
      statusCode: 400,
      responseType: 'validationError',
    },

    outOfStock: {
      statusCode: 400,
      responseType: 'validationError',
    }
  },

  fn: async function (inputs, exits) {
    const { products = [] } = inputs;
    const barcodes = products.map(p => p.barcode);

    if (products.length === 0) {
      exits.noProducts(errorMessages.noProducts);
      return;
    }

    try {
      const barcodeListStr = barcodes.map(barcode => `'${barcode}'`).join(', ');
      const barcodesQuery = 'select P.barcode, P.productName, P.size, Inv.mrp, Inv.purchasePrice, Inv.sellingPrice, Inv.quantity from product P inner join InventoryStatus Inv on P.barcode = Inv.barcode where P.barcode in (' + barcodeListStr + ');';
      const productsResult = await sails.sendNativeQuery(barcodesQuery);

      if (productsResult.rows.length < barcodes.length) {
        let barcodeNotPresent = '';

        for(let i=0; i<barcodes.length; i++) {
          const barcodeExists = productsResult.rows.find(barcode => barcode === barcodes[i]);

          if (!barcodeExists) {
            barcodeNotPresent = barcodes[i];
            break;
          }
        }

        exits.barcodeNotPresent(errorMessages.barcodeNotPresent + barcodeNotPresent);
        return;
      }

      const newOrder = await Order.create({}).fetch();
      const orderId = newOrder.id;

      for (let i=0; i<products.length; i++) {
        const { barcode, quantity } = products[i];
        const currentInventoryStatus = productsResult.rows.find((inv) => inv.barcode === barcode);

        if (currentInventoryStatus < quantity) {
          return exits.outOfStock(`${currentInventoryStatus.productName} is out of stock`);
        }

        const orderEntry = {
          orderId,
          barcode,
          productName: currentInventoryStatus.productName,
          size: currentInventoryStatus.size,
          mrp: currentInventoryStatus.mrp,
          purchasePrice: currentInventoryStatus.purchasePrice,
          sellingPrice: currentInventoryStatus.sellingPrice,
          quantity
        };

        const orderProduct = await OrderDetail.create(orderEntry).fetch();

        await InventoryStatus.updateOne({ barcode }).set({ quantity: currentInventoryStatus.quantity - quantity });
      }

      exits.successWithData(newOrder);

    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
