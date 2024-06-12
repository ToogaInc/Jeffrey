import axios from 'axios';
import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const Cat = {
    info: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Sends a picture of a cat!'),

    run: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        let catUrl: string;

        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            catUrl = response.data[0].url;
        } catch {
            console.log(`ERROR: Problem accessing (https://api.thecatapi.com/v1/images/search)`
                + ` through axios. (cat.ts - line 12-13 )`);
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Meow 🐱')
            .setImage(catUrl);

        await interaction.reply({ embeds: [embed] });
    }
};
