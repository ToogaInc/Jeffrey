import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const Ping = {
  info: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Tells you the bot\'s ping (ms)'),

  run: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.reply(`${interaction.client.ws.ping}ms`);
  }
};
