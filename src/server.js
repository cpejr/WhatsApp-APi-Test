import "dotenv/config";
import express from "express";
import morgan from "morgan";
import brazilPhoneFormatter from "./utils/brazilPhoneFormatter.js";
import errorHandling from "./utils/errorHandling.js";
import api from "./api.js";

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
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/webhook", (req, res, next) => {
	const mode = req.query["hub.mode"];
	const token = req.query["hub.verify_token"];
	const challenge = req.query["hub.challenge"];

	if (!(mode && token) || token !== verifyToken) {
		return res.sendStatus(403);
	}

	return res.status(200).send(challenge);
});
app.post("/webhook", async (req, res, next) => {
	if (req.body.object) {
		if (req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
			const phone_number_id =
				req.body.entry[0].changes[0].value.metadata.phone_number_id;
			const from = brazilPhoneFormatter(
				req.body.entry[0].changes[0].value.messages[0].from
			);
			const msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
			try {
				await api.post(`${phone_number_id}/messages`, {
					messaging_product: "whatsapp",
					type: "text",
					to: from,
					text: {
						body: `Você enviou: "${msg_body}"`,
					},
				});
			} catch (err) {
				return next(err);
			}
		}
		res.sendStatus(200);
	} else {
		res.sendStatus(404);
	}
});
app.post("/send-message", (req, res, next) => {
	if (!req.body?.to) return res.sendStatus(400);

	const { isTemplate, phoneNumbeId, to, text } = req.body;
	const senderPhoneId = phoneNumbeId || process.env.PHONE_NUMBER_ID;
	const opts = isTemplate
		? {
				type: "template",
				template: {
					name: "hello_world",
					language: { code: "en_US" },
				},
		  }
		: {
				type: "text",
				text: {
					body: text,
				},
		  };
	try {
		api.post(`${senderPhoneId}/messages?access_token=${token}`, {
			messaging_product: "whatsapp",
			to,
			...opts,
		});

		return res.sendStatus(200);
	} catch (err) {
		next(err);
	}
});

export default app;
