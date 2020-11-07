module.exports = async function validationError(errorMessage) {
	const errorCode = this.res.get('X-Exit');

	return this.res.json({
		code: errorCode,
		message: errorMessage
	});
};
