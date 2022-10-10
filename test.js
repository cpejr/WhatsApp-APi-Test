// import api from "./src/api.js";
import "dotenv/config";
import axios from "axios";

const apiTest = axios.create({
	baseURL: "https://cpe-whats-api-test.herokuapp.com",
});

apiTest.post("send-message", {
	to: "5571999258225",
	text: "FUNCIONAAAAA",
});

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
