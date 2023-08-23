import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { numberEmojis } from '../utils';

export const Poll = {
    info: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a poll for users to vote on.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to poll')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('choice1')
                .setDescription('Enter choice 1')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('choice2')
                .setDescription('Enter choice 2')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('choice3')
                .setDescription('Enter choice 3')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('choice4')
                .setDescription('Enter choice 4')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('choice5')
                .setDescription('Enter choice 5')
                .setRequired(false)),

    run: async (interaction: CommandInteraction): Promise<void> => {
        const questionString = interaction.options.get('question')?.value;

        if (!questionString || typeof questionString !== 'string') return;

        if (questionString.length > 256) {
            interaction.reply(`Question is too long. (max 256 char.)`);
        }
        
        const choices = [];
        for (let i = 1; i <= 5; i++) {
            const choice = interaction.options.get(`choice${i}`)?.value;
            if (choice) {
                choices.push(choice);
            }
        }
        if (choices.length === 0){
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
                { name: ' ', value: '** **' }
            );
        for (let i = 0; i < choices.length; i++) {
            embed.addFields(
                { name: ' ', value: `${numberEmojis[i]}  ${choices[i]}` },
            )
            if(i + 1 < choices.length){
            embed.addFields(
                { name: ' ', value: '** **' },
            )
            }
        };
        
        await interaction.channel!.send({ embeds: [embed] }).then(async embedMessage => {
            interaction.reply({ content: 'Poll created!', ephemeral: true });
            for (let i = 0; i < choices.length; i++) {
                try {
                    await embedMessage.react(`${numberEmojis[i]}`);
                }
                catch {
                    console.log('error reacting');
                }
            }
        });
    }
};
