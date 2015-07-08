module.exports = {
  attributes: function attributes (res, responseCode, attributes) {
    res.status(responseCode).json({
      statusCode: responseCode,
      attributesWithErrors: attributes,
      message: 'Please provide a valid ' + attributes.join(', ')
    })
  },

  message: function message (res, responseCode, errorMessage) {
    res.status(responseCode).json({
      statusCode: responseCode,
      message: errorMessage
    })
  }
}
