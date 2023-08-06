import { GuildMember, SlashCommandBuilder } from "discord.js";

export function logMessage(message: string) {
    console.log('[${new Date().toLocaleString()}] ${message}');
}

export interface discordRoleID {
    id: string;
    name: string;
}

export const discordRoles: discordRoleID[] = [
    { id: '1136943065551085569', name: 'admin' },
    { id: '1136943145905565767', name: 'Staff'},
    { id: '1136943250209509397', name: 'Raider' }
];

export const discordRoleIDs: string[] = discordRoles.map(role => role.id);

export async function fetchMember(interaction: any): Promise<GuildMember | null> {
    if (interaction?.member) {
      if (interaction.member instanceof GuildMember) {
        return interaction.member;
      } else if (interaction.member.guild) {
        try {
          const member = await interaction.member.guild.members.fetch(interaction.user.id);
          return member;
        } catch (error) {
          console.error('Error fetching member:', error);
        }
      }
    }
    return null;
  }

  export function createCommand(name: string, description: string) {
    return new SlashCommandBuilder()
    .setName(name)
    .setDescription(description);
}
  



