// main.js
import { config } from 'dotenv';
import {
  Client,
  ClientOptions,
  REST,
  GatewayIntentBits
} from 'discord.js';
import { Mock } from './commands/mock';
import { DB } from './DB/JeffreyDB';
import { checkAndRunCommand, initCmds } from './utils/cmdUtils';

config();

const token = process.env.BOT_TOKEN;
const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
];

const options: ClientOptions = { intents: intents };

const client = new Client(options);
client.login(token);

client.once('ready', () => {
  console.log(`Logged in as ${client.user!.tag}`);
  DB.test();
  DB.sync();
});

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');
    await initCmds(token!, clientID!, guildID!);
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  await checkAndRunCommand(interaction);
});

client.on('messageCreate', async (message) => {
  if (!message.inGuild) return;
  if (!message.channel.isTextBased()) return;

  if (mockTargets.has(message.author.id)) {
    await Mock.effect(message);
  }
});
export const mockTargets = new Set();

main();