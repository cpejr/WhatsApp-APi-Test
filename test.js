import "dotenv/config";
import axios from "axios";

const apiTest = axios.create();

apiTest.post("https://cpe-whats-api-test.herokuapp.com/send-message", {
	to: "5571999258225",
	type: "text",
	data: {
		text: { body: "OPAAA" },
	},
});

// import api from "./src/api.js";
// const senderPhoneId = process.env.PHONE_NUMBER_ID;
// const numberToSend = "5571999258225";
// const text = "QUALEEE";

// Texto comum
// api.post(`${senderPhoneId}/messages`, {
// 	messaging_product: "whatsapp",
// 	type: "text",
// 	to: numberToSend,
// 	text: {
// 		body: text,
// 	},
// });

// Template
// try {
// 	await api.post(`${senderPhoneId}/messages`, {
// 		messaging_product: "whatsapp",
// 		type: "template",
// 		to: numberToSend,
// 		template: {
// 			name: "doctor_app",
// 			language: { code: "pt_BR" },
// 			components: [
// 				{
// 					type: "body",
// 					parameters: [
// 						{
// 							type: "text",
// 							text: "João Pedro Lima Pirajá",
// 						},
// 					],
// 				},
// 			],
// 		},
// 	});
// } catch (err) {
// 	console.log(err.message);
// }
