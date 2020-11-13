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

    productShortName: {
      type: 'string',
      example: 'CLGT',
    },

    size: {
      type: 'string',
      example: '200g, 500ml, 10N',
    }
  },

};
