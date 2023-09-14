// main.js
import { config } from 'dotenv';
import {
  Client,
  ClientOptions,
  REST,
  Routes,
  GatewayIntentBits,
  ChatInputCommandInteraction
} from 'discord.js';
import { Ping } from './commands/ping';
import { Mock } from './commands/mock';
import { Cat } from './commands/cat';
import { Wallet } from './commands/balance';
import { Poll } from './commands/poll';
import { Roll } from './commands/roll';
import { DB } from './JeffreyDB';
import { ViewJeffrey } from './commands/viewjeffrey';

config();

const cooldown = new Map<string, Map<string, number>>();
const cooldownTime = 5000;

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
          Poll.info.toJSON(),
          Wallet.info.toJSON(),
          Roll.info.toJSON(),
          ViewJeffrey.info.toJSON()
        ]
      }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}
Poll.addChoiceOptions();

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  const userID = interaction.user.id;

  if (!cooldown.has(commandName)) {
    cooldown.set(commandName, new Map<string, number>());
  }
  const cooldownMap = cooldown.get(commandName)!;

  if (cooldownMap.has(userID) && cooldownMap.get(userID)! > Date.now() && interaction.user.id !== '218823980524634112') {
    const cooldownRemaining = (cooldownMap.get(userID)! - Date.now()) / 1000;
    await interaction.reply(`Please wait ${cooldownRemaining.toFixed(1)} seconds.`);
  }
  cooldownMap.set(userID, Date.now() + cooldownTime);

  console.log(
    `user ${interaction.user.username} (${userID}) ran the '${commandName}' command | Guild: ${interaction.guild} |`
    + ` Channel: ${interaction.channel} | Timestamp: ${interaction.createdAt.getUTCDate()}`);

  if (commandName === 'ping') {
    await Ping.run(interaction);
  }
  if (commandName === 'mock') {
    console.log(`${interaction.user} is attempting to use the mock command.`);
    await Mock.run(interaction);
    console.log(`Current mock list: ${Array.from(mockTargets)}`);
  }
  if (commandName === 'cat') {
    await Cat.run(interaction);
  }
  if (commandName === 'poll') {
    await Poll.run(interaction as ChatInputCommandInteraction);
  }
  if (commandName === 'balance') {
    await Wallet.run(interaction as ChatInputCommandInteraction);
  }
  if (commandName === 'roll') {
    await Roll.run(interaction as ChatInputCommandInteraction);
  }
  if(commandName === 'viewjeffrey'){
    await ViewJeffrey.run(interaction);
  }
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