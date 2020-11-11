/**
 * InventoryEntry.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    inventoryId: {
      type: 'number',
    },
    barcode: {
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
