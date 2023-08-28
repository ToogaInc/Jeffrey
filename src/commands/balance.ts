import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { UserWallets } from '../JeffreyDB';

export const Balance = {
    info: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Shows you a users JeffreyCoin balance')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Which member you would like to check (defaults to self)')
                .setRequired(false)),
    run: async (interaction: CommandInteraction): Promise<void> => {
        const userID = interaction.user.id;
        const member = interaction.options.getUser('member');
        let target;

        if (!member || member.id === userID) {
            target = userID;
        }
        else {
            target = member.id;
        }
        try {

            const [userInstance, created] = await UserWallets.findOrCreate({ where: { userid: target } });

            if (userInstance) {
                console.log(`target found or created: ${userInstance.userid}`);
            }
        } catch {
            console.log("could not findorcreate target");
        }

        try {
            const checkBalance = await UserWallets.findOne({ where: { userid: target } });
            if (checkBalance) {
                interaction.reply(`${checkBalance.balance}`)
            }
        } catch {
            console.log('error');
        }
    }
};
