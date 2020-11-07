module.exports = {

  attributes: {
    barcode: {
      type: 'string',
      required: true,
      maxLength: 15,
      example: '800100024728',
    },

    productName: {
      type: 'string',
      required: true,
      example: 'Colgate Salt',
    },

    brand: {
      type: 'string',
      example: 'Colgate',
    },
  },

};