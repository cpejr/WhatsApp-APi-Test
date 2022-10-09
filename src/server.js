import "dotenv/config";
import express from "express";
import morgan from "morgan";
import axios from "axios";
import brazilPhoneFormatter from "./utils/brazilPhoneFormatter.js";
import errorHandling from "./utils/errorHandling.js";

// Environment variables
const port = process.env.PORT || 4000;
const verifyToken = process.env.VERIFY_TOKEN;
const token = process.env.WHATSAPP_TOKEN;

// Starting app
const app = express();
app.listen(port, () => console.log(`Server started at port ${port}`));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorHandling);
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
	if (req.body.object) {
		if (
			req.body.entry &&
			req.body.entry[0].changes &&
			req.body.entry[0].changes[0] &&
			req.body.entry[0].changes[0].value.messages &&
			req.body.entry[0].changes[0].value.messages[0]
		) {
			const phone_number_id =
				req.body.entry[0].changes[0].value.metadata.phone_number_id;
			const from = brazilPhoneFormatter(
				req.body.entry[0].changes[0].value.messages[0].from
			);
			const msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
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
		}
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
});

export default app;
