import { JeffreyGotchaURLs } from "../JeffreyGacha";
import { GachaInvs, Users, UserWallets } from "../JeffreyDB";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { rng } from '../utils';

export const Roll = {
    info: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll for Jeffrey\'s!'),

    run: async (interaction: CommandInteraction): Promise<void> => {
        if (!interaction.guild) {
            await interaction.reply('this command can only be done in a server');
            return;
        }
        let currentBalance;
        const userID = interaction.user.id;
        try {
            const [userInstance] = await UserWallets.findOrCreate({ where: { userid: userID } });

            if (userInstance) {
                console.log(`user found or created: ${userInstance.userid}`);
            }
        } catch {
            console.log("could not findorcreate target");
        }

        try {
            currentBalance = await UserWallets.findOne({ where: { userid: userID } });
        } catch {
            console.log(`ERROR: Could not chekc balance for ${userID}`);
        }

        if(!currentBalance){
            console.log(`${userID}'s currentBalance is NULL or undefined`);
            return;
        }
        if(currentBalance.balance < 5) {
            await interaction.reply('not enough JeffreyCoins!');
            return;
        }
        const rndm = await rng(1, 3);
        let raritySelect: 'Common' | 'Uncommon' | 'Rare';

        if (rndm === 1){
            raritySelect = 'Common';
        }else if(rndm === 2){
            raritySelect = 'Uncommon';
        }else if(rndm === 3){
            raritySelect = 'Rare';
        }
        else {
            console.log('error choosing random rarity for Roll command');
            return;
        }
        const rarity = JeffreyGotchaURLs[raritySelect];
        const chooseGacha = await rng(0, rarity.length - 1);
        const gacha = rarity[chooseGacha];
        await interaction.reply(`you pulled a **${raritySelect}** rarity Jeffrey! ${gacha}`); 
    }
};