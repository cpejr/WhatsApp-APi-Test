import "dotenv/config";
import express from "express";
import morgan from "morgan";
import brazilPhoneFormatter from "./utils/brazilPhoneFormatter.js";
import errorHandling from "./utils/errorHandling.js";
import api from "./api.js";

// Environment variables
const port = process.env.PORT || 4000;
const verifyToken = process.env.VERIFY_TOKEN;

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
			const msg_body = req.body.entry[0].changes[0].value.messages[0]?.text
				?.body
				? `Eu sou um robô, eu não vou ser seu amigo e responder normal. Desculpa :(`
				: "Eu não gosto de gifs ou seja lá o que isso for. Não mande mais :)";
			try {
				await api.post(`${phone_number_id}/messages`, {
					messaging_product: "whatsapp",
					type: "text",
					to: from,
					text: {
						body: msg_body,
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
app.post("/send-message", async (req, res, next) => {
	if (!req.body?.to) return res.sendStatus(400);

	const { phoneNumbeId, to, type, data } = req.body;
	if (type !== "template" && type !== "text") return res.sendStatus(400);

	const senderPhoneId = phoneNumbeId || process.env.PHONE_NUMBER_ID;
	console.log(senderPhoneId);
	try {
		await api.post(`${senderPhoneId}/messages`, {
			messaging_product: "whatsapp",
			type,
			to,
			[type]: data,
		});

		return res.sendStatus(200);
	} catch (err) {
		next(err);
	}
});

export default app;
