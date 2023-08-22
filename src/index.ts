// main.js
import { config } from 'dotenv';
import {
  Client,
  ClientOptions,
  REST,
  GatewayIntentBits,
  Routes
} from 'discord.js';
import { Ping } from './commands/ping';
import { Mock } from './commands/mock';
import { Cat } from './commands/cat';

config();

const token = process.env.BOT_TOKEN;
const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;
const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
]

const options: ClientOptions = {
  intents: intents,
};

const client = new Client(options);

client.login(token);

client.once('ready', () => {
  console.log(`Logged in as ${client.user!.tag}`);
});

const rest = new REST({ version: '10' }).setToken(token!);

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientID!, guildID!),
      {
        body: [
          Ping.info.toJSON(),
          Mock.info.toJSON(),
          Cat.info.toJSON()
        ]
      }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

export const mockTargets = new Set();

client.on('messageCreate', async message => {
  if (!message.inGuild) return;
  if (!message.channel.isTextBased()) return;

  if (mockTargets.has(message.author.id)) {
    let shouldBeLower = true;
    let length = message.content.length;
    let userMessage = message.content
    let mockMessageArray = [...userMessage];

    for (let i = 0; i < length; i++) {
      if (userMessage[i].toUpperCase() !== userMessage[i].toLowerCase()) {
        if (shouldBeLower) {
          mockMessageArray[i] = userMessage[i].toLowerCase();
        } else {
          mockMessageArray[i] = userMessage[i].toUpperCase();
        }
        shouldBeLower = !shouldBeLower;
      }
    }
    let mockMessage = mockMessageArray.join('');

    await message.delete();
    console.log(`${message.author.username} (${message.author.id}) tried to send the message "${message.content}"`
      + ` in ${message.channel}, but they are being mocked!`);

    await message.channel.send(`${message.author} says "${mockMessage}"`);
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await Ping.run(interaction);
  }
  if (commandName === 'mock') {
    await Mock.run(interaction);
  }
  if (commandName === 'cat') {
    await Cat.run(interaction);
    console.log(`${interaction.user} used the cat command in ${interaction.channel}`);
  }
});

main();