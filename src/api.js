import "dotenv/config";
import axios from "axios";

const api = axios.create({
	baseURL: process.env.API_URL,
});

api.defaults.headers.common[
	"Authorization"
] = `Bearer ${process.env.WHATSAPP_TOKEN}`;

export default api;
