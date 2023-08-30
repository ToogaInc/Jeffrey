import { JeffreyGotchaURLs } from "../JeffreyGacha";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { rng } from '../utils';
import { addUserWalletsUser, changeBalance, checkBalance, checkUserWalletsUser } from "../DBUtils";

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
            const user = await checkUserWalletsUser(userID);
            if (!user) {
                await addUserWalletsUser(userID);
            }
        } catch {
            console.log("could not findorcreate target");
        }

        try {
            currentBalance = await checkBalance(userID);
        } catch {
            console.log(`ERROR: Could not chekc balance for ${userID}`);
        }

        if (!currentBalance) {
            console.log(`${userID}'s currentBalance is NULL or undefined`);
            return;
        }

        if (currentBalance < 5) {
            await interaction.reply('not enough JeffreyCoins!');
            return;
        } else {
            await changeBalance(userID, -5);
            currentBalance -= 5;
        }

        const rndm = await rng(1, 3);
        let raritySelect: 'Common' | 'Uncommon' | 'Rare';

        if (rndm === 1) {
            raritySelect = 'Common';
        } else if (rndm === 2) {
            raritySelect = 'Uncommon';
        } else if (rndm === 3) {
            raritySelect = 'Rare';
        }
        else {
            console.log('error choosing random rarity for Roll command');
            return;
        }
        const rarity = JeffreyGotchaURLs[raritySelect];
        const chooseGacha = await rng(0, rarity.length - 1);
        const gacha = rarity[chooseGacha];
        const displayRarirty = raritySelect.toUpperCase();

        const embed = new EmbedBuilder()
            .setTitle(`You pulled a **${displayRarirty}** Jeffrey!`)
            .setAuthor({ name: `${interaction.user.displayName}` })
            .setImage(gacha);

        try {
            await interaction.reply({ embeds: [embed] });
        } catch {
            console.log(`ERROR: Could not send embed in ${interaction.channel?.id}`);
            return;
        }
    }
};