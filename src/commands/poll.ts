import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { numberEmojis } from '../utils';

const MAX_CHOICES = 5;

export const Poll = {
    info: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll for users to vote on.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to poll')
                .setRequired(true)),

    addChoiceOptions: () => {
        for (let i = 0; i < MAX_CHOICES; i++) {
            Poll.info.addStringOption(option =>
                option.setName(`choice${i + 1}`)
                    .setDescription(`Choice ${i + 1}`)
                    .setRequired(false));
        }
    },
    run: async (interaction: CommandInteraction): Promise<void> => {
        if (!interaction.guild) { //Checks if the command is NOT done in a server
            await interaction.reply('This command can only be done in a server.');
            return;
        }
        const questionString = interaction.options.get('question')?.value;

        if (!questionString || typeof questionString !== 'string') return;

        if (questionString.length > 256) {//char limit 
            interaction.reply(`Question is too long. (max 256 char.)`);
        }

        const choices = [];
        for (let i = 1; i <= 5; i++) {
            const choice = interaction.options.get(`choice${i}`)?.value;
            if (choice) {
                choices.push(choice);
            }
        }
        if (choices.length === 0) {//No choices by user = Yes and No
            choices.push('Yes');
            choices.push('No');
        }

        const embed = new EmbedBuilder()
            .setTitle(`${questionString}`)
            .setAuthor({
                name: interaction.user.displayName,
                iconURL: interaction.user.displayAvatarURL()
            })
            .addFields(
                { name: ' ', value: '** **' }//Discord embed spacing to look nicer
            );
        for (let i = 0; i < choices.length; i++) {
            embed.addFields(
                { name: ' ', value: `${numberEmojis[i]}  ${choices[i]}` },
            )
            if (i + 1 < choices.length) {
                embed.addFields(
                    { name: ' ', value: '** **' },//more spacing
                )
            }
        };

try {
    const embedMessage = await interaction.channel!.send({ embeds: [embed] }); //send created embed
    interaction.reply({ content: 'Poll created!', ephemeral: true });

    // React to the embed with emojis
    for (let i = 0; i < choices.length; i++) {
        try {
            await embedMessage.react(`${numberEmojis[i]}`);
        } catch {
            console.log('ERROR: Could not react with emoji.');
        }
    }
} catch {
    console.log(`ERROR: Could not send embed in ${interaction.channelId}`);
}

    }
};