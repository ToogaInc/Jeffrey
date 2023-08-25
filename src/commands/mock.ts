import { CommandInteraction, Message, SlashCommandBuilder } from 'discord.js';
import { mockTargets } from '../index';

export const Mock = {
    info: new SlashCommandBuilder()
        .setName('mock')
        .setDescription('Mocks designated member')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Choose which member you want to be mocked')
                .setRequired(true)),

    run: async (interaction: CommandInteraction): Promise<void> => {
        if (!interaction.guild) { //Checks if the command is NOT done in a server
            await interaction.reply('This command can only be done in a server.');
            return;
        }
        //Looks for 'staff' role in server (case insensitive)     
        const role = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'staff');

        if (!role) {
            await interaction.reply('There is no "staff" role on this server.'
                + ' Contact a developer for more information.');
            return;
        }
        //Finds the users ID, then checks if the user has a valid role
        const commandUser = await interaction.guild.members.fetch(interaction.user.id);

        if (!commandUser.roles.cache.has(role.id)) {
            await interaction.reply('You do not have permission to use this command.');
            return;
        }

        const target = interaction.options.getUser('member');

        if (!target) {
            await interaction.reply('Cannot find specified member');
            return;
        }
        if (target.id === commandUser.id) {
            await interaction.reply('You can\'t mock yourself!');
            return;
        }
        if (target.id === interaction.client.user.id) {
            await interaction.reply('Please don\'t mock me UwU.');
            return;
        }
        mockTargets.add(target.id);
        await interaction.reply(`Sure thing, I will begin mocking ${target}!`);
    },
    effect: async (message: Message): Promise<void> => {
        let shouldBeLower = true; // Whether the character should be made lowercase (set to true), or uppercase (set to false).
        let length = message.content.length; // Length of the user's message
        let userMessage = message.content; // Original user message
        let mockMessage = ""; // The resulting mocked message
    
        // Loop through each character in the user's message
        for (let i = 0; i < length; i++) {
            // Check if the character is a letter (excluding non-alphabetic characters)
            if (userMessage[i].toUpperCase() !== userMessage[i].toLowerCase()) {
                if (shouldBeLower) {
                    mockMessage += userMessage[i].toLowerCase(); // Make it lowercase
                } else {
                    mockMessage += userMessage[i].toUpperCase(); // Make it uppercase
                }
                shouldBeLower = !shouldBeLower; // Toggle the case for the next character
            }
        }
    
        // Attempt to delete the original message
        try {
            await message.delete();
            console.log(`${message.author.username} (${message.author.id}) tried to send the message "${message.content}" in ${message.channel}, but they are being mocked!`);
        } catch {
            console.log(`ERROR: could not delete ${message.author.username} (${message.author.id}) message in ${message.channel}`);
        }
    
        // Attempt to send the mocked message
        try {
            await message.channel.send(`${message.author} says "${mockMessage}"`);
        } catch {
            console.log(`ERROR: could not send message "${mockMessage}" in ${message.channel}`);
        }
    }
};