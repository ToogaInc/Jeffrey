import "dotenv/config";
import { add } from "./util";

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;

console.log(add(10, 15));

// https://discord.js.org/#/