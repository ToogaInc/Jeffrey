import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkUsers, checkBalance, changeBalance } from '../DBUtils';

export const Balance = {
    info: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows you a users JeffreyCoin balance')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Which member you would like to check (defaults to self)')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('add')
                .setDescription('Add to balance, negative number to subtract. (officer+ only)')
                .setRequired(false)),

    run: async (interaction: CommandInteraction): Promise<void> => {
        if (!interaction.guild) {
            await interaction.reply('This command can only be done in a server.');
            return;
        }
        const userID = interaction.user.id;
        const member = interaction.options.getUser('member');
        const getRole = interaction.guild.roles.cache;
        const add = (interaction.options as any).getInteger('add');
        let target;
        let higherUp = false;
        let targetBalance

        const role = [
            getRole.find(role => role.name.toLowerCase() === 'moderator'),
            getRole.find(role => role.name.toLocaleLowerCase() === 'officer'),
            getRole.find(role => role.name.toLocaleLowerCase() === 'head raid leader')
        ];

        const length = role.length;
        const commandUser = await interaction.guild.members.fetch(userID);

        for (let i = 0; i < length; i++) {
            if (!role[i]) {
                console.log(`ERROR finding higher up role(s) for balance command`);
                return;
            }
            if (commandUser.roles.cache.has(role[i]!.id)) {
                higherUp = true;
            }
        }

        if (!higherUp && add) {
            await interaction.reply('Only officer+ can modify member balances!');
            return;
        }

        if (!member || member.id === userID) {
            target = interaction.user;
        } else {
            target = member;
        }

        try {
            const userInUsers = await checkUsers(target.id);
        } catch {
            console.log(`ERROR: Could not run checkUsers on ${target.id}`)
        }

        if (add !== null) {
            try {
                await changeBalance(target.id, add);
            } catch {
                console.log(`ERROR: Could not run changeBalance command for ${target.id} + (${add})`)
            }
        }
        
        try {
            const targetBalance = await checkBalance(target.id);
            if(!targetBalance){
                console.log(`ERROR: ${target.id}'s balance is NULL or undefined.`);
                return;
            }
        } catch {
            console.log('error checking balance');
            return;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${target.displayName}'s Wallet`, iconURL: target.displayAvatarURL() })
            .addFields({ name: ' ', value: `Balance: ${targetBalance!.balance}` });
            
        try {
            await interaction.reply({ embeds: [embed] });
        } catch {
            console.log(`Failed to send embed in ${interaction.channelId}`);
        }
    }
};