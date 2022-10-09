import express from "express";
import morgan from "morgan";
import axios from "axios";

// Starting app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use((err, req, res, next) => {
// 	const status = err.status || 500;
// 	console.error(err.message, err.stack);
// 	return res.status(status).json({ message: err.message });
// });
// app.use(morgan(":url :method :status :response-time ms"));

// Routes
app.get("/", async (req, res, next) => {
	return res.sendStatus(200);
});
app.get("/webhook", (req, res) => {
	const verifyToken = "CpeJuniorTokenVerificador";

	const mode = req.query["hub.mode"];
	const token = req.query["hub.verify_token"];
	const challenge = req.query["hub.challenge"];

	if (!(mode && token)) return res.sendStatus(500);
	if (token !== verifyToken) return res.sendStatus(403);

	return res.status(200).send(challenge);
});
// app.post("/webhook", (req, res) => {
// 	const token = process.env.WHATSAPP_TOKEN;

// 	const metadata = req.body?.entry?.[0]?.changes?.[0]?.value?.metadata;
// 	const messages = req.body?.entry?.[0]?.changes?.[0]?.value?.messages;

// 	if (!(metadata && messages)) return res.sendStatus(404);

// 	console.log("Chegou aqui 1");
// 	const phone_number_id = metadata.phone_number_id;
// 	const from = messages[0].from;
// 	const msg_body = messages[0].text.body;
// 	console.log({ phone_number_id, from, msg_body });
// 	// axios({
// 	// 	method: "POST",
// 	// 	url:
// 	// 		"https://graph.facebook.com/v12.0/" +
// 	// 		phone_number_id +
// 	// 		"/messages?access_token=" +
// 	// 		token,
// 	// 	data: {
// 	// 		messaging_product: "whatsapp",
// 	// 		to: from,
// 	// 		text: { body: "Ack: " + msg_body },
// 	// 	},
// 	// 	headers: { "Content-Type": "application/json" },
// 	// });
// });

export default app;
