import { CommandInteraction, EmbedBuilder } from 'discord.js';

export const NUMBER_EMOJIS: string[] = [
    "1⃣",
    "2⃣",
    "3⃣",
    "4⃣",
    "5⃣",
    "6⃣",
    "7⃣",
    "8⃣",
    "9⃣",
    "🔟"
];
/**
 * Chooses a random number between min and max
 * @param min - the lowest possible number
 * @param max - the highest possible number
 * @returns - returns the random number
 */
export async function rng(min: number, max: number): Promise<number> {
    const randomDecimal = Math.random();

    const range = max - min + 1;
    const randomNumber = Math.floor(randomDecimal * range) + min;

    return randomNumber
}
/**
 * Replies to the command user with an embedded message.
 * Embed will be constructed in command files.
 * @param embed - Embed with desired information/fields
 * @param interaction - The command interaction to reply to.
 */
export async function replyWithEmbed(embed: EmbedBuilder, interaction: CommandInteraction): Promise<void> {
    try {
        await interaction.reply({ embeds: [embed] });
        console.log(`replied with embed in ${interaction.channelId}`);
    } catch {
        console.log(`ERROR: could not send embed in ${interaction.channelId}`);
        return;
    }
}