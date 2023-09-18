import { ChatInputCommandInteraction, REST, Routes } from "discord.js";
import { Balance } from "../commands/balance";
import { Cat } from "../commands/cat";
import { DM } from "../commands/dm";
import { Mock } from "../commands/mock";
import { Ping } from "../commands/ping";
import { Poll } from "../commands/poll";
import { Roll } from "../commands/roll";

//individual command cooldown/rate limit
const cooldown = new Map<string, Map<string, number>>();
const cooldownTime = 3000;

//List of all commands
const CMD_LIST = [
    Ping,
    Mock,
    Cat,
    Poll,
    Balance,
    Roll,
    DM
];
/**
 * Function to initialize all of the bots commands (making them usable/visable to discord users)
 * Also uses to add choice options for commands that need it.
 * 
 * @param {string} token - bot token
 * @param {string} clientID - bots discord account ID
 * @param {string} guildID - discord server ID
 */
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
/**
 * Function to be called on 'interactionCreate' event. 
 * Checks which command was used, and runs said command.
 * 
 * @param {ChatInputCommandInteraction} interaction - A slash command interaction
 */
export async function checkAndRunCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const { commandName } = interaction;
    const userID = interaction.user.id;

    const cooldown = await checkCmdCD(commandName, userID);
    if (!cooldown) {
        console.log(
            `User ${interaction.user.username} (${userID}) ran the '${commandName}' command | Guild: ${interaction.guild} |`
            + ` Channel: ${interaction.channel} | Timestamp: ${interaction.createdAt.toUTCString()}`
        );

        for (let i = 0; i < CMD_LIST.length; i++) {
            if (commandName === CMD_LIST[i].info.name) {
                CMD_LIST[i].run(interaction);
            } else {
                continue;
            }
        }
    } else {
        await interaction.reply(`Please wait ${cooldown.toFixed(1)} seconds.`);
    }
}
/**
 * Function to check if the user is on cooldown for a specific command, when they try and use it.
 * 
 * @param {string} commandName - Name of the command being used 
 * @param {string} userID - Discord ID of the command user
 * @returns {Promise<number>} - The time remaining on the users command cooldown. Returns 0 if it was not on cooldown.
 */
export async function checkCmdCD(commandName: string, userID: string): Promise<number> {
    if (!cooldown.has(commandName)) {
        cooldown.set(commandName, new Map<string, number>());
    }
    const cooldownMap = cooldown.get(commandName)!;

    if (cooldownMap.has(userID) && cooldownMap.get(userID)! > Date.now()) {
        const cooldownRemaining = (cooldownMap.get(userID)! - Date.now()) / 1000;
        return cooldownRemaining;
    } else {
        cooldownMap.set(userID, Date.now() + cooldownTime);
        return 0;
    }
}