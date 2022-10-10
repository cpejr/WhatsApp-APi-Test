import "dotenv/config";
import axios from "axios";

const apiTest = axios.create();

apiTest.post("https://cpe-whats-api-test.herokuapp.com/send-message", {
	to: "5571999258225",
	text: "AAAAAAAAaa",
	isTemplate: true,
});

// import api from "./src/api.js";
// const senderPhoneId = process.env.PHONE_NUMBER_ID;
// const numberToSend = "5571999258225";
// const token = process.env.WHATSAPP_TOKEN;
// const text = "oxe";

// api.post(`${senderPhoneId}/messages?access_token=${token}`, {
// 	messaging_product: "whatsapp",
// 	type: "text",
// 	to: numberToSend,
// 	text: {
// 		body: text,
// 	},
// });
