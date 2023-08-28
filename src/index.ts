// main.js
import { config } from 'dotenv';
import {
  Client,
  ClientOptions,
  REST,
  Routes,
  GatewayIntentBits,
  Routes,
  GatewayIntentBits
} from 'discord.js';
import { Ping } from './commands/ping';
import { Mock } from './commands/mock';
import { Cat } from './commands/cat';



config();

const cooldown = new Map<string, Map<string, number>>();
const cooldownTime = 5000;

export const mockTargets = new Set();

export const mockTargets = new Set();

const token = process.env.BOT_TOKEN;
const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
]
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
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
    console.error(error);
  }
}

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

  console.log(`user ${interaction.user.username} (${userID}) ran the '${commandName}' command | Guild: ${interaction.guild} |`
    + ` Channel: ${interaction.channel} | Timestamp: ${interaction.createdAt}`);

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
});

client.on('messageCreate', async (message) => {
  if (!message.inGuild) return;
  if (!message.channel.isTextBased()) return;

  if (mockTargets.has(message.author.id)) {
    await Mock.effect(message);
  }
});

main();