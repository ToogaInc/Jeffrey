import { ChatInputCommandInteraction, REST, Routes } from "discord.js";
import { Balance } from "../commands/balance";
import { Cat } from "../commands/cat";
import { DM } from "../commands/dm";
import { Mock } from "../commands/mock";
import { Ping } from "../commands/ping";
import { Poll } from "../commands/poll";
import { Roll } from "../commands/roll";

const cooldown = new Map<string, Map<string, number>>();
const cooldownTime = 5000;

const CMD_LIST = [
    Ping,
    Mock,
    Cat,
    Poll,
    Balance,
    Roll,
    DM
];

export async function initCmds(token: string, clientID: string, guildID: string): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(token);

    Poll.addChoiceOptions();
    DM.addChoiceOptions();

    const cmdInfo = CMD_LIST.map(cmd => cmd.info.toJSON());
    await rest.put(
        Routes.applicationGuildCommands(clientID, guildID),
        {
            body: cmdInfo
        }
    );
};

export async function checkAndRunCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const { commandName } = interaction;
    const userID = interaction.user.id;

    if (!cooldown.has(commandName)) {
        cooldown.set(commandName, new Map<string, number>());
    }
    const cooldownMap = cooldown.get(commandName)!;

    if (cooldownMap.has(userID) && cooldownMap.get(userID)! > Date.now() && interaction.user.id !== '218823980524634112') {
        const cooldownRemaining = (cooldownMap.get(userID)! - Date.now()) / 1000;
        await interaction.reply(`Please wait ${cooldownRemaining.toFixed(1)} seconds.`);
        return;
    }
    cooldownMap.set(userID, Date.now() + cooldownTime);

    console.log(`User ${interaction.user.username} (${userID}) ran the '${commandName}' command | Guild: ${interaction.guild} |`
        + ` Channel: ${interaction.channel} | Timestamp: ${interaction.createdAt.toUTCString()}`);

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
    if (commandName === 'balance') {
        await Balance.run(interaction);
    }
    if (commandName === 'roll') {
        await Roll.run(interaction);
    }
    if (commandName === 'dm') {
        await DM.run(interaction);
    }
}