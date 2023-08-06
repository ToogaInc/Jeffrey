// main.js
import { config } from 'dotenv';
import { Client, ClientOptions, GatewayIntentBits, REST, Routes } from 'discord.js';
import { data as pingData, execute as pingExecute } from './commands/ping';

config();

const token = process.env.BOT_TOKEN;
const clientID = process.env.CLIENT_ID;

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
];

const options: ClientOptions = {
  intents: intents,
};

const client = new Client(options);

client.once('ready', () => {
  console.log(`Logged in as ${client.user!.tag}`);
});

const rest = new REST({ version: '10' }).setToken(token!);

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientID!), { body: [pingData.toJSON()] });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await pingExecute(interaction);
  }
});


client.login(token);

export default client;

main();
