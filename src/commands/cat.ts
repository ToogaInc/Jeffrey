import axios from 'axios';
import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const Cat = {
    info: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Sends a picture of a cat!'),

    run: async (interaction: CommandInteraction): Promise<void> => {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        const catUrl = response.data[0].url;

        const embed = new EmbedBuilder()
            .setTitle('Meow 🐱')
            .setImage(catUrl);

        await interaction.reply({ embeds: [embed] });
    }
};
