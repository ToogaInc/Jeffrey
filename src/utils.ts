import { ChatInputCommandInteraction, CommandInteraction, Embed, EmbedBuilder, Message, User } from 'discord.js';

/**
 * Chooses a random number between min and max
 * @param {number} min - the lowest possible number
 * @param {number} max - the highest possible number
 * @returns {Promise<number>} - returns the random number
 */
export async function rng(min: number, max: number): Promise<number> {
    const randomDecimal = Math.random();
    const range = max - min + 1;
    const randomNumber = Math.floor(randomDecimal * range) + min;
    return randomNumber;
};

/**
 * Replies to the command user with an embedded message.
 * Embed will be constructed in command files.
 * @param {EmbedBuilder} embed - Embed with desired information/fields
 * @param {ChatInputCommandInteraction} interaction - The command interaction to reply to.
 */
export async function replyWithEmbed(embed: EmbedBuilder, interaction: ChatInputCommandInteraction): Promise<void> {
    try {
        await interaction.reply({ embeds: [embed] });
        console.log(`Replied with embed in ${interaction.channelId}`);
    } catch {
        console.log(`ERROR: could not send embed in ${interaction.channelId}`);
        return;
    }
};

/**
 * Attempts to delete specified message.
 * 
 * @param {Message} m -  a discord message
 * @returns {Promise<boolean>} - Whether or not the message was successfully deleted
 */
export async function tryDelete(m: Message): Promise<boolean> {
    try{
        m.delete();
        return true;
    }catch(err){
        console.error('could not delete message', err);
        return false;
    }
};

/**
 * Function that takes a previously created embed, and attempts to DM it to the specified member
 * 
 * @param {EmbedBuilder} embed - The embed message to send. 
 * @param {User} member - Which member to dm
 */
export async function tryToDMEmbed(embed: EmbedBuilder, member: User): Promise<boolean>{
    try{
        await member.send({embeds: [embed]});
        console.log(`Sent message to ${member.id}`)
        return true;
    }catch(err){
        console.error(`Could not send message to ${member.id}`, err);
        return false;
    }
};
