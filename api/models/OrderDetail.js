/**
 * OrderDetail.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    orderId: {
      type: 'number',
    },
    barcode: {
      type: 'string',
    },
    productName: {
      type: 'string',
    },
    size: {
      type: 'string',
    },
    mrp: {
      type: 'number',
    },
    purchasePrice: {
      type: 'number',
    },
    sellingPrice: {
      type: 'number',
    },
    quantity: {
      type: 'number',
    }
  },

};
