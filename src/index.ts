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
import { Poll } from './commands/poll';

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
          Cat.info.toJSON(),
          Poll.info.toJSON()
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

const cooldown = new Map<string, Map<string, number>>();
const cooldownTime = 5000;

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  const userID = interaction.user.id;

  if (!cooldown.has(commandName)) {
    cooldown.set(commandName, new Map<string, number>());
  }
  const cooldownMap = cooldown.get(commandName)!;

  if (cooldownMap.has(userID) && cooldownMap.get(userID)! > Date.now()) {
    const cooldownRemaining = (cooldownMap.get(userID)! - Date.now()) / 1000;
    await interaction.reply(`Please wait ${cooldownRemaining.toFixed(1)} seconds.`);
    return;
  }
  cooldownMap.set(userID, Date.now() + cooldownTime);

  for (const [commandName, cooldownMap] of cooldown) {
    if (cooldownMap.has(userID) && cooldownMap.get(userID)! <= Date.now()) {
      cooldownMap.delete(userID);
    }
  }

  console.log(`user ${interaction.user.username} (${userID}) ran the '${commandName}' command | Guild: ${interaction.guild} |`
    + ` Channel: ${interaction.channel} | Timestamp: ${interaction.createdAt}`);

  if (commandName === 'ping') {
    await Ping.run(interaction);
  }
  if (commandName === 'mock') {
    await Mock.run(interaction);
  }
  if (commandName === 'cat') {
    await Cat.run(interaction);
  }
  if (commandName === 'poll') {
    await Poll.run(interaction);
  }
});

main();