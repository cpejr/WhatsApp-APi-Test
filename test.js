//-------------------------------------------------------------
// Contato via API interna

// import "dotenv/config";
// import axios from "axios";

// const apiMessages = axios.create({
// 	baseURL: process.env.SEND_MESSAGES_URL,
// });

// apiMessages.defaults.headers.common[
// 	"Authorization"
// ] = `Bearer ${process.env.WHATSAPP_TOKEN}`;

// try {
// 	const to = "5571999258225";
// 	const text = "OLAAAA";
// 	await apiMessages.post("send-message", {
// 		to,
// 		type: "text",
// 		data: {
// 			body: text,
// 		},
// 	});

// 	// const name = "Bruno";
// 	// await apiMessages.post("send-message", {
// 	// 	to,
// 	// 	type: "template",
// 	// 	data: {
// 	// 		name: "doctor_app",
// 	// 		language: { code: "pt_BR" },
// 	// 		components: [
// 	// 			{
// 	// 				type: "body",
// 	// 				parameters: [
// 	// 					{
// 	// 						type: "text",
// 	// 						text: name,
// 	// 					},
// 	// 				],
// 	// 			},
// 	// 		],
// 	// 	},
// 	// });
// } catch (err) {
// 	console.log(err.message);
// }

//--------------------------------------------------------------------------------
// Contato direto

const members = {
	Mariana: "5531996562404",
	Tarchi: "5531999911611",
	Nikole: "5511952319116",
	Bruno: "5531983243088",
	Jonas: "5531998333020",
	Gustavo: "5537988153600",
};

import api from "./src/api.js";
const senderPhoneId = process.env.PHONE_NUMBER_ID;
const name = "Gustavo";

// const text = "QUALEEE";

// // Texto comum
// api.post(`${senderPhoneId}/messages`, {
// 	messaging_product: "whatsapp",
// 	type: "text",
// 	to: numberToSend,
// 	text: {
// 		body: text,
// 	},
// });

// Template
try {
	await api.post(`${senderPhoneId}/messages`, {
		messaging_product: "whatsapp",
		type: "template",
		to: members[name],
		template: {
			name: "mensagem_apresentacao",
			language: { code: "pt_BR" },
			components: [
				{
					type: "body",
					parameters: [
						{
							type: "text",
							text: name,
						},
					],
				},
			],
		},
	});
} catch (err) {
	console.log(err.message);
}
