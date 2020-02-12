export const formValidation = (value, rules) => {
	let validity = true;

	if(rules.required && validity) {
		validity = value.trim() !== '';
	}

	if(rules.minLength && validity) {
		validity = value.length >= rules.minLength
	}

	if(rules.maxLength && validity) {
		validity = value.length <= rules.maxLength
	}

	return validity;
}