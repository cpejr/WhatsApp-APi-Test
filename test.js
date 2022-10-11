//-------------------------------------------------------------
// Contato via API interna

import "dotenv/config";
import axios from "axios";

const apiMessages = axios.create({
	baseURL: process.env.SEND_MESSAGES_URL,
});

apiMessages.defaults.headers.common[
	"Authorization"
] = `Bearer ${process.env.WHATSAPP_TOKEN}`;

try {
	const to = "5531996562404";

	const text = "AAAA";
	await apiMessages.post("send-message", {
		to,
		type: "text",
		data: {
			body: text,
		},
	});

	// const name = "Mariana";
	// await apiMessages.post("send-message", {
	// 	to,
	// 	type: "template",
	// 	data: {
	// 		name: "doctor_app",
	// 		language: { code: "pt_BR" },
	// 		components: [
	// 			{
	// 				type: "body",
	// 				parameters: [
	// 					{
	// 						type: "text",
	// 						text: name,
	// 					},
	// 				],
	// 			},
	// 		],
	// 	},
	// });
} catch (err) {
	console.log(err.message);
}

//--------------------------------------------------------------------------------
// Contato direto

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
