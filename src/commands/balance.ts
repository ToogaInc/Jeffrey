import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, User } from 'discord.js';
import { addOrSubtractWallet, findOrAddToUser, checkOrStartWallet } from '../DBMain';
import { replyWithEmbed } from '../utils';

export const Wallet = {
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

    run: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        if (!interaction.guild) {
            await interaction.reply('This command can only be done in a server.');
            return;
        }
        const userID = interaction.user.id;
        const member = interaction.options.getUser('member');
        const add = interaction.options.getInteger('add');

        

        //checks if non-higher up attempted to use the 'add' option
        if (add) {
            const getRole = interaction.guild.roles.cache;
            //need at least one of these roles to use the 'add' option
            const role = [
                getRole.find(role => role.name.toLowerCase() === 'moderator'),
                getRole.find(role => role.name.toLowerCase() === 'officer'),
                getRole.find(role => role.name.toLowerCase() === 'head raid leader')
            ];

            const commandUser = await interaction.guild.members.fetch(userID);

            let higherUp = false;
            for (const currentRole of role) {
                if (!currentRole) {
                    console.log(`ERROR finding higher up role(s) for balance command`);
                    continue;
                }
                if (commandUser.roles.cache.has(currentRole.id)) {
                    higherUp = true;
                    break;
                }
            }
            if(!higherUp){
                await interaction.reply('Only officer+ can modify member balances!');
                return;
            }
        }

        // whos balance to check (target) =
        //'member' option if one is specified. Otherwise, defaults to the command user.
        let target: User;
        if (!member || member.id === userID) {
            target = interaction.user;
        } else {
            target = member;
        }

        //checks for target in Users, otherwise adds them
        await findOrAddToUser(target.id, target.username, target.displayName);

        const startingBalance = await checkOrStartWallet(target.id);
        let displayBalance = startingBalance;
        //checks targets current balance, then adds 'add' to it (can be negative)
        if (add !== null) {
            await addOrSubtractWallet(target.id, add);
            displayBalance += add;
        }

        //checks if balance is valid
        if (!startingBalance && startingBalance !== 0) {
            console.log(`ERROR: ${target.id}'s balance is NULL or undefined.`);
            await interaction.reply('An error has occured, please contact a developer')
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${target.displayName}'s Wallet`, iconURL: target.displayAvatarURL() })
            .addFields({ name: ' ', value: `Balance: ${displayBalance}` });

        //if no 'add' was specified, reply with embed of balance
        //otherwise, reply with the balance change, then send embed
        try {
            if (!add) {
                await replyWithEmbed(embed, interaction);
                return;
            }
            if (add > 0) {
                await interaction.reply(`Added ${add} to ${target}'s wallet! (${startingBalance} + ${add} = ${startingBalance + add})`);
            }
            if (add < 0) {
                await interaction.reply(`Removed ${add * -1} from ${target}'s wallet! (${startingBalance} - ${add * -1} = ${startingBalance + add})`);
            }
            await interaction.channel!.send({ embeds: [embed] });
        } catch {
            console.log(`ERROR: Could not send msg embed in ${interaction.channelId}`);
            return;
        }

    }
};