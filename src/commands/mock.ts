import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const Mock = {
  info: new SlashCommandBuilder()
    .setName('mock')
    .setDescription("Mocks designated member")
    .addStringOption(option =>
        option.setName('member')
            .setDescription('Choose which member you want to be mocked')
            .setRequired(true)),
    
  run: async (interaction: CommandInteraction): Promise<void> => {
    run: async (interaction: CommandInteraction): Promise<void> => {
        if (!interaction.guild){ //checks if the command is NOT done in a server
            interaction.reply(`This command can only be done in a server.`);
            return;
        }
            //Looks for "staff" role in server       
          const role = interaction.guild.roles.cache.find(role => role.name === "staff");

          if (!role) { 
            interaction.reply(`There is no "staff" role on this server. Contact a developer for more information.`);
            return;
          }
            //Finds the users ID, then checks if the user has a valid role
          const member = await interaction.guild.members.fetch(interaction.user.id);

          if (!member.roles.cache.has(role.id)) {
            interaction.reply(`You do not have permission to use this command.`);
            return;
          }
          
          const target = interaction.options.getUser('member');

          if(!target){
            interaction.reply(`Cannot find specified member`);
            return;
          }
          if (target.id === member.id){
            interaction.reply(`You can\'t mock yourself!`);
            return;
          }
          if (target.id === interaction.client.user.id){
            interaction.reply(`Please don\'t mock me UwU.`);
            return;
          }
        }
    }
};
