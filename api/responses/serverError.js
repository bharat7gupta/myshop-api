module.exports = async function serverError(errorMessage) {
	return this.res.json({
		code: 'serverError',
		message: errorMessage
	});
};
