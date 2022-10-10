// import "dotenv/config";
// import axios from "axios";

// const apiTest = axios.create();

// apiTest.post("https://cpe-whats-api-test.herokuapp.com/send-message", {
// 	to: "5571999258225",
// 	text: "AAAAAAAAaa",
// 	isTemplate: true,
// });

import api from "./src/api.js";
const senderPhoneId = process.env.PHONE_NUMBER_ID;
const numberToSend = "5571999258225";
const text = "QUALEEE";

api.post(`${senderPhoneId}/messages`, {
	messaging_product: "whatsapp",
	type: "text",
	to: numberToSend,
	text: {
		body: text,
	},
});
