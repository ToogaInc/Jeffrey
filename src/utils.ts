import { CommandInteraction, EmbedBuilder, HexColorString } from 'discord.js';

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
    const randomNumber = Math.floor(randomDecimal * range + 1) + min;

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
        await interaction.reply(`An error has occured, please contact a developer.`);
    }
}

/**
 * Sends an embedded message in the same channel that the user used a slash command.
 * Embed will be constructed in command files.
 * @param embed - Embed with desired information/fields
 * @param interaction - The command interaction to reply to.
 */
export async function sendEmbedMessage(embed: EmbedBuilder, interaction: CommandInteraction): Promise<void> {
    try{
        await interaction.channel?.send({embeds: [embed]});
    }catch {
        console.log(`Could not send embed in ${interaction.channel}`);
        await interaction.reply(`An error has occured, please contact a developer.`);
    }
}

export async function editEmbedReply(embed: EmbedBuilder, interaction: CommandInteraction) {
    try {
        await interaction.editReply({embeds: [embed]});
    }catch{
        console.log(`Could not send embed in ${interaction.channel}`);
        await interaction.reply(`An error has occured, please contact a developer.`);
    }
}

export async function getEmbedColor(rarity: string): Promise<HexColorString> {
    let color: HexColorString;
    if(rarity === 'common') {
        color = `#808080`; //grey
    }else if(rarity === 'uncommon') {
        color = `#00A36C`; //green
    }else if (rarity === 'rare') {
        color = `#FF69B4`; //pink
    }else if (rarity === 'legendary') {
        color = `#D4A017`;// orange gold
    }else{
        color = `#000000` //black (shouldnt show up)
    }
    return color;
}