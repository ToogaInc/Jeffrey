import { CommandInteraction, EmbedBuilder } from 'discord.js';

export const numberEmojis: string[] = [
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

export async function rng(min: number, max: number): Promise<number> {
    const randomDecimal = Math.random();

    const range = max - min + 1;
    const randomNumber = Math.floor(randomDecimal * range) + min;

    return randomNumber
}

export async function replyWithEmbed(embed: EmbedBuilder, interaction: CommandInteraction): Promise<void> {
    try {
        await interaction.reply({ embeds: [embed] });
        console.log(`replied with embed in ${interaction.channelId}`);
    } catch {
        console.log(`ERROR: could not send embed in ${interaction.channelId}`);
        return;
    }
}