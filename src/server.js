import "dotenv/config";
import express from "express";
import morgan from "morgan";
import axios from "axios";
import brazilPhoneFormatter from "./utils/brazilPhoneFormatter.js";

// Env variables
const port = process.env.PORT;
const verifyToken = process.env.VERIFY_TOKEN;
const token = process.env.WHATSAPP_TOKEN;

// Starting app
const app = express();
app.listen(port, () => console.log(`Server is listening in port ${port}.`));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((err, req, res, next) => {
	const status = err.status || 500;
	console.error(err.message, err.stack);
	return res.status(status).json({ message: err.message });
});
app.use(morgan(":url :method :status :response-time ms"));

// Routes
app.get("/webhook", (req, res) => {
	const mode = req.query["hub.mode"];
	const token = req.query["hub.verify_token"];
	const challenge = req.query["hub.challenge"];

	if (!(mode && token)) return res.sendStatus(500);
	if (token !== verifyToken) return res.sendStatus(403);

	return res.status(200).send(challenge);
});
app.post("/webhook", (req, res) => {
	const metadata = req.body?.entry?.[0]?.changes?.[0]?.value?.metadata;
	const messages = req.body?.entry?.[0]?.changes?.[0]?.value?.messages;

	if (!(metadata && messages)) return res.sendStatus(404);

	const phone_number_id = metadata.phone_number_id;
	const from = brazilPhoneFormatter(messages[0].from);
	const msg_body = messages[0].text.body;

	axios({
		method: "POST",
		url:
			"https://graph.facebook.com/v12.0/" +
			phone_number_id +
			"/messages?access_token=" +
			token,
		data: {
			messaging_product: "whatsapp",
			to: from,
			text: { body: "Ack: " + msg_body },
		},
		headers: { "Content-Type": "application/json" },
	});
});

export default app;
