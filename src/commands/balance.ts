import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkUsers, checkBalance, changeBalance, addUsers, checkUserWalletsUser, addUserWalletsUser } from '../DBUtils';
import { replyWithEmbed } from '../utils';

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
        let targetBalance;
        let startingBalance;

        //need at least one of these roles to use the 'add' option
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

        //checks if non-higher up attempted to use the 'add' option
        if (!higherUp && add) {
            await interaction.reply('Only officer+ can modify member balances!');
            return;
        }

        //whos(target) balance to check - 
        //'member' option if one is specified. Otherwise, defaults to the command user.
        if (!member || member.id === userID) {
            target = interaction.user;
        } else {
            target = member;
        }

        //checks for target in Users, otherwise adds them
        //checks for target in UserWallets, otherwise adds them
        try {
            const userInUsers = await checkUsers(target.id);
            if (!userInUsers) {
                await addUsers(target.id, target.username);
            }
            const userInWallet = await checkUserWalletsUser(target.id);
            if (!userInWallet) {
                await addUserWalletsUser(target.id);
            }
        } catch {
            console.log(`ERROR: Could not run checkUsers on ${target.id}`)
        }

        //checks targets current balance, then adds 'add' to it (can be negative)
        if (add !== null) {
            try {
                startingBalance = await checkBalance(target.id);
                await changeBalance(target.id, add);
            } catch {
                console.log(`ERROR: Could not run changeBalance command for ${target.id} + (${add})`)
            }
        }

        //checks targets balance
        try {
            targetBalance = await checkBalance(target.id);
            if (!targetBalance) {
                console.log(`ERROR: ${target.id}'s balance is NULL or undefined.`);
                return;
            }
        } catch {
            console.log('error checking balance');
            return;
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${target.displayName}'s Wallet`, iconURL: target.displayAvatarURL() })
            .addFields({ name: ' ', value: `Balance: ${targetBalance}` });

            //if no 'add' was specified, reply with embed of balance
            //otherwise, reply with the balance change, then send embed
        try {
            if (!add) {
                await replyWithEmbed(embed, interaction);
            }
            if (add >= 0) {
                await interaction.reply(`Added ${add} to ${target}'s wallet! (${startingBalance} + ${add} = ${targetBalance})`);
            }
            if (add < 0) {
                await interaction.reply(`Removed ${add * -1} from ${target}'s wallet! (${startingBalance} - ${add * -1} = ${targetBalance})`);
            }
            await interaction.channel!.send({ embeds: [embed] });
        } catch {
            console.log(`ERROR: Failed to send reply and/or embed in ${interaction.channelId}`);
            return;
        }
    }
};