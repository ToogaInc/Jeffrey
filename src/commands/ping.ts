import { SlashCommandBuilder } from 'discord.js';
import client from '../index';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Tells you the bot\'s ping (ms)');

export async function execute(interaction: any) {
  await interaction.reply(`${client.ws.ping}ms`);
}