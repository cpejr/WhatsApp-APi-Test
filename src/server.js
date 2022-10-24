import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from 'url';
import express from "express";
import morgan from "morgan";
import brazilPhoneFormatter from "./utils/brazilPhoneFormatter.js";
import errorHandling from "./utils/errorHandling.js";
import api from "./api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables
const port = process.env.PORT || 4000;
const verifyToken = process.env.VERIFY_TOKEN;

// Starting app
const app = express();
app.listen(port, () => console.log(`Server started at port ${port}`));

// Middlewares
app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorHandling);
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
// Establecer o webhook é opcional! Faça se quiser tratar as mensagens recebidas pelo número
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

export default app;
