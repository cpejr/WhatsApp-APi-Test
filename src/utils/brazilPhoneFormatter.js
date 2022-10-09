const BRAZIL_REGION = 55;
const DIGIT_TO_ADD = 9;

export default function brazilPhoneFormatter(phone) {
	const region = phone.slice(0, 2);
	if (!(region === BRAZIL_REGION)) return phone;

	return phone.split("").splice(2, 0, DIGIT_TO_ADD).join("");
}
